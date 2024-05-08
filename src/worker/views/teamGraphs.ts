import { isSport, TEAM_STATS_TABLES } from "../../common";
import { idb } from "../db";
import { g, random } from "../util";
import type {
	TeamFiltered,
	TeamSeasonAttr,
	UpdateEvents,
	ViewInput,
} from "../../common/types";
import type { TeamStatAttr } from "../../common/types.baseball";
import { season, team } from "../core";

export const statTypes = [
	"standings",
	"powerRankings",
	"finances",
	...Object.keys(TEAM_STATS_TABLES),
];

const getStatsTableByType = (statTypePlus: string) => {
	// Will be undefined for standings/powerRankings/finances
	return TEAM_STATS_TABLES[statTypePlus];
};

export const getStats = (statTypePlus: string, seasons: [number, number]) => {
	if (statTypePlus === "standings") {
		const stats = [
			"won",
			"lost",
			"tied",
			"otl",
			"winp",
			"pts",
			"ptsPct",
			"wonHome",
			"lostHome",
			"tiedHome",
			"otlHome",
			"wonAway",
			"lostAway",
			"tiedAway",
			"otlAway",
			"wonDiv",
			"lostDiv",
			"tiedDiv",
			"otlDiv",
			"wonConf",
			"lostConf",
			"tiedConf",
			"otlConf",
		];

		// Show ties/otl if they are enabled in one of the seasons in question
		const useTies = seasons.some(x => season.hasTies(x));
		const useOtl = seasons.some(x => g.get("otl", x));

		// Check pts/winp together since they are based on the same thing
		let usePts = false;
		let useWinp = false;
		for (const season of seasons) {
			const pointsFormula = g.get("pointsFormula", season);
			if (pointsFormula !== "") {
				usePts = true;
			} else {
				useWinp = true;
			}
		}

		const toRemove: string[] = [];
		if (!useTies) {
			toRemove.push("tied");
		}
		if (!useOtl) {
			toRemove.push("otl");
		}
		if (!useWinp) {
			toRemove.push("winp");
		}
		if (!usePts) {
			toRemove.push("ptsPct", "pts");
		}

		return stats.filter(stat => {
			for (const part of toRemove) {
				if (stat.startsWith(part)) {
					return false;
				}
			}

			return true;
		});
	} else if (statTypePlus === "powerRankings") {
		return ["avgAge"];
	} else if (statTypePlus === "finances") {
		return [
			"pop",
			"att",
			"revenue",
			"profit",
			"cash",
			"payrollOrSalaryPaid",
			"scoutingLevel",
			"coachingLevel",
			"healthLevel",
			"facilitiesLevel",
		];
	} else {
		const statsTable = getStatsTableByType(statTypePlus);
		if (!statsTable) {
			throw new Error(`Invalid statType: "${statTypePlus}"`);
		}

		// Remove pos for fielding stats
		if (isSport("baseball")) {
			return statsTable.stats.filter(stat => stat !== "pos");
		}

		return [...statsTable.stats];
	}
};

const getTeamStats = async (
	statTypeInput: string | undefined,
	season: number,
	playoffs: "playoffs" | "regularSeason",
	seasons: [number, number],
) => {
	// This is the value form the form/URL (or a random one), which confusingly is not the same as statType passed to playersPlus
	const statTypePlus =
		statTypeInput !== undefined && statTypes.includes(statTypeInput)
			? statTypeInput
			: random.choice(statTypes);

	const statsTable = getStatsTableByType(statTypePlus);

	const statKeys = statsTable?.stats ?? ["gp"];

	const seasonAttrs: TeamSeasonAttr[] = [
		"season",
		"abbrev",
		"region",
		"name",
		"imgURL",
		"imgURLSmall",
	];

	const stats = getStats(statTypePlus, seasons);

	if (statTypePlus === "standings" || statTypePlus === "powerRankings") {
		seasonAttrs.push(...(stats as any[]));
	} else if (statTypePlus === "finances") {
		seasonAttrs.push(
			...(stats as any[]).filter(stat => !stat.endsWith("Level")),
			"expenseLevels",
		);
	}

	const teams = await idb.getCopies.teamsPlus(
		{
			attrs: ["tid", "abbrev"],
			seasonAttrs,
			stats: statKeys as TeamStatAttr[],
			season,
			playoffs: playoffs === "playoffs",
			regularSeason: playoffs === "regularSeason",
		},
		"noCopyCache",
	);
	if (
		seasonAttrs.includes("avgAge") &&
		teams.some(t => t.seasonAttrs.avgAge === undefined)
	) {
		for (const t of teams) {
			const playersRaw = await idb.cache.players.indexGetAll(
				"playersByTid",
				t.tid,
			);
			const players = await idb.getCopies.playersPlus(playersRaw, {
				attrs: ["tid", "injury", "value", "age", "pid"],
				stats: ["season", "tid", "gp", "min"],
				season,
				showNoStats: g.get("season") === season,
				showRookies: g.get("season") === season,
				fuzz: true,
				tid: t.tid,
			});
			t.seasonAttrs.avgAge = team.avgAge(players);
		}
	}

	return { teams, stats, statType: statTypePlus };
};

const updateTeams = async (
	axis: "X" | "Y",
	inputs: ViewInput<"teamGraphs">,
	updateEvents: UpdateEvents,
	state: any,
) => {
	const season = `season${axis}` as const;
	const statType = `statType${axis}` as const;
	const playoffs = `playoffs${axis}` as const;
	if (
		updateEvents.includes("firstRun") ||
		(inputs[season] === g.get("season") &&
			(updateEvents.includes("gameSim") ||
				updateEvents.includes("playerMovement"))) ||
		// Purposely skip checking statX, statY - those are only used client side, they in the URL for usability
		inputs[season] !== state[season] ||
		inputs[statType] !== state[statType] ||
		inputs[playoffs] !== state[playoffs]
	) {
		const statForAxis = await getTeamStats(
			inputs[statType],
			inputs[season],
			inputs[playoffs],
			[inputs.seasonX, inputs.seasonY],
		);

		const statKey = `stat${axis}` as const;
		const inputStat = inputs[statKey];

		const stat =
			inputStat !== undefined && statForAxis.stats.includes(inputStat)
				? inputStat
				: random.choice(statForAxis.stats);

		return {
			[season]: inputs[season],
			[statType]: statForAxis.statType,
			[playoffs]: inputs[playoffs],
			[`teams${axis}`]: statForAxis.teams,
			[`stats${axis}`]: statForAxis.stats,
			[statKey]: stat,
		};
	}
};

type Team = TeamFiltered<
	["tid", "abbrev"],
	["season", "abbrev", "region", "name", "imgURL", "imgURLSmall"],
	["gp"],
	number
>;

const updateClientSide = (
	inputs: ViewInput<"teamGraphs">,
	state: any,
	x: Awaited<ReturnType<typeof updateTeams>>,
	y: Awaited<ReturnType<typeof updateTeams>>,
) => {
	if (inputs.statX !== state.statX || inputs.statY !== state.statY) {
		// Check x and y for statX and statY in case they were already specified there, such as randomly selecting from statForAxis
		return {
			statX: x?.statX ?? inputs.statX,
			statY: y?.statY ?? inputs.statY,
		} as {
			// We can assert this because we know the above block runs on first render, so this is just updating an existing state, so we don't want TypeScript to get confused
			seasonX: number;
			seasonY: number;
			statTypeX: string;
			statTypeY: string;
			playoffsX: "playoffs" | "regularSeason";
			playoffsY: "playoffs" | "regularSeason";
			teamsX: Team[];
			teamsY: Team[];
			statsX: string[];
			statsY: string[];
			statX: string;
			statY: string;
		};
	}
};

export default async (
	inputs: ViewInput<"teamGraphs">,
	updateEvents: UpdateEvents,
	state: any,
) => {
	const x = await updateTeams("X", inputs, updateEvents, state);
	const y = await updateTeams("Y", inputs, updateEvents, state);

	return Object.assign({}, x, y, updateClientSide(inputs, state, x, y));
};