import {
	memo,
	Fragment,
	type MouseEvent,
	type ReactNode,
	useState,
	type CSSProperties,
} from "react";
import ResponsiveTableWrapper from "./ResponsiveTableWrapper";
import { getCols, processPlayerStats } from "../util";
import { filterPlayerStats, getPeriodName, helpers } from "../../common";
import { PLAYER_GAME_STATS } from "../../common/constants.football";
import type { Col, SortBy } from "./DataTable";
import updateSortBys from "./DataTable/updateSortBys";
import { getSortClassName } from "./DataTable/Header";
import range from "lodash-es/range";
import classNames from "classnames";

type Quarter = `Q${number}` | "OT";

type ScoringSummaryEvent = {
	hide: boolean;
	quarter: Quarter;
	t: 0 | 1;
	text: string;
	time: number;
	type: string;
};

type Team = {
	abbrev: string;
	colors: [string, string, string];
	name: string;
	region: string;
	players: any[];
	season?: number;
};

type BoxScore = {
	gid: number;
	scoringSummary: ScoringSummaryEvent[];
	teams: [Team, Team];
	numPeriods?: number;
	exhibition?: boolean;
};

export const StatsHeader = ({
	cols,
	onClick,
	sortBys,
	sortable,
}: {
	cols: Col[];
	onClick: (b: MouseEvent, a: number) => void;
	sortBys: SortBy[];
	sortable: boolean;
}) => {
	return (
		<>
			{cols.map((col, i) => {
				const { desc, title } = col;

				let className: string | undefined;

				if (sortable) {
					className = getSortClassName(sortBys, i);
				}

				return (
					<th
						className={className}
						key={i}
						onClick={event => {
							onClick(event, i);
						}}
						title={desc}
					>
						{title}
					</th>
				);
			})}
		</>
	);
};

export const sortByStats = (
	stats: string[],
	seasonStats: string[] | undefined,
	sortBys: SortBy[],
	getValue?: (p: any, stat: string) => number,
) => {
	return (a: any, b: any) => {
		for (const [index, order] of sortBys) {
			let stat = stats[index];
			let statsObject = "processed";
			if (stat === undefined && seasonStats) {
				stat = seasonStats[index - stats.length];
				statsObject = "seasonStats";
			}

			const aValue = getValue?.(a, stat) ?? a[statsObject][stat];
			const bValue = getValue?.(b, stat) ?? b[statsObject][stat];

			if (bValue !== aValue) {
				const diff = bValue - aValue;
				if (order === "asc") {
					return -diff;
				}
				return diff;
			}
		}
		return 0;
	};
};

const StatsTableIndividual = ({
	Row,
	exhibition,
	t,
	type,
}: {
	Row: any;
	exhibition?: boolean;
	t: BoxScore["teams"][number];
	type: keyof typeof PLAYER_GAME_STATS;
}) => {
	const stats = PLAYER_GAME_STATS[type].stats;
	const cols = getCols(stats.map(stat => `stat:${stat}`));

	const [sortBys, setSortBys] = useState(() => {
		return PLAYER_GAME_STATS[type].sortBy.map(
			stat => [stats.indexOf(stat), "desc"] as SortBy,
		);
	});

	const onClick = (event: MouseEvent, i: number) => {
		setSortBys(
			prevSortBys =>
				updateSortBys({
					cols,
					event,
					i,
					prevSortBys,
				}) ?? [],
		);
	};

	const players = t.players
		.map(p => {
			return {
				...p,
				processed: processPlayerStats(p, stats),
			};
		})
		.filter(p => filterPlayerStats(p, stats, type))
		.sort(sortByStats(stats, undefined, sortBys));

	const sortable = players.length > 1;
	const highlightCols = sortable ? sortBys.map(sortBy => sortBy[0]) : undefined;

	return (
		<div className="mb-3">
			<ResponsiveTableWrapper>
				<table className="table table-striped table-borderless table-sm table-hover">
					<thead>
						<tr>
							<th colSpan={2}>
								{t.season !== undefined ? `${t.season} ` : null}
								{t.region} {t.name}
							</th>
							<StatsHeader
								cols={cols}
								onClick={onClick}
								sortBys={sortBys}
								sortable={sortable}
							/>
						</tr>
					</thead>
					<tbody>
						{players.map((p, i) => (
							<Row
								key={p.pid}
								exhibition={exhibition}
								i={i}
								p={p}
								stats={stats}
								highlightCols={highlightCols}
							/>
						))}
					</tbody>
				</table>
			</ResponsiveTableWrapper>
		</div>
	);
};

const StatsTable = ({
	Row,
	boxScore,
	type,
}: {
	Row: any;
	boxScore: BoxScore;
	type: keyof typeof PLAYER_GAME_STATS;
}) => {
	return (
		<>
			{boxScore.teams.map((t, i) => (
				<StatsTableIndividual
					key={i}
					Row={Row}
					exhibition={boxScore.exhibition}
					t={t}
					type={type}
				/>
			))}
		</>
	);
};

// Condenses TD + XP/2P into one event rather than two
const processEvents = (events: ScoringSummaryEvent[]) => {
	const processedEvents: {
		quarter: Quarter;
		score: [number, number];
		scoreType: string | null;
		t: 0 | 1;
		text: string;
		time: number;
	}[] = [];
	const score = [0, 0] as [number, number];

	for (const event of events) {
		if (event.hide) {
			continue;
		}

		const otherT = event.t === 0 ? 1 : 0;

		let scoreType: string | null = null;
		if (event.text.includes("extra point")) {
			scoreType = "XP";
			if (event.text.includes("made")) {
				score[event.t] += 1;
			}
		} else if (event.text.includes("field goal")) {
			scoreType = "FG";
			if (event.text.includes("made")) {
				score[event.t] += 3;
			}
		} else if (event.text.includes("touchdown")) {
			scoreType = "TD";
			score[event.t] += 6;
		} else if (event.text.toLowerCase().includes("two point")) {
			scoreType = "2P";
			if (!event.text.includes("failed")) {
				score[event.t] += 2;
			}
		} else if (event.text.includes("safety")) {
			scoreType = "SF";

			// Safety is recorded as part of a play by the team with the ball, so for scoring purposes we need to swap the teams here and below
			score[otherT] += 2;
		}

		const prevEvent: any = processedEvents.at(-1);

		if (prevEvent && scoreType === "XP") {
			prevEvent.score = score.slice();
			prevEvent.text += ` (${event.text})`;
		} else if (prevEvent && scoreType === "2P" && event.t === prevEvent.t) {
			prevEvent.score = score.slice();
			prevEvent.text += ` (${event.text})`;
		} else {
			processedEvents.push({
				t: scoreType === "SF" ? otherT : event.t, // See comment above about safety teams
				quarter: event.quarter,
				time: event.time,
				text: event.text,
				score: helpers.deepCopy(score),
				scoreType,
			});
		}
	}

	return processedEvents;
};

const getCount = (events: ScoringSummaryEvent[]) => {
	let count = 0;
	for (const event of events) {
		if (!event.hide) {
			count += 1;
		}
	}
	return count;
};

const ScoringSummary = memo(
	({
		events,
		numPeriods,
		teams,
	}: {
		count: number;
		events: ScoringSummaryEvent[];
		numPeriods: number;
		teams: [Team, Team];
	}) => {
		let prevQuarter: Quarter;

		const processedEvents = processEvents(events);

		if (processedEvents.length === 0) {
			return <p>None</p>;
		}

		return (
			<table className="table table-sm border-bottom">
				<tbody>
					{processedEvents.map((event, i) => {
						let quarterText = "???";
						if (event.quarter.startsWith("OT")) {
							const overtimes = parseInt(event.quarter.replace("OT", ""));
							if (overtimes > 1) {
								quarterText = `${helpers.ordinal(overtimes)} overtime`;
							} else {
								quarterText = "Overtime";
							}
						} else {
							const quarter = parseInt(event.quarter.replace("Q", ""));
							if (!Number.isNaN(quarter)) {
								quarterText = `${helpers.ordinal(quarter)} ${getPeriodName(
									numPeriods,
								)}`;
							}
						}

						let quarterHeader: ReactNode = null;
						if (event.quarter !== prevQuarter) {
							prevQuarter = event.quarter;
							quarterHeader = (
								<tr>
									<td className="text-body-secondary" colSpan={5}>
										{quarterText}
									</td>
								</tr>
							);
						}

						return (
							<Fragment key={i}>
								{quarterHeader}
								<tr>
									<td>{teams[event.t].abbrev}</td>
									<td>{event.scoreType}</td>
									<td>
										{event.t === 0 ? (
											<>
												<b>{event.score[0]}</b>-
												<span className="text-body-secondary">
													{event.score[1]}
												</span>
											</>
										) : (
											<>
												<span className="text-body-secondary">
													{event.score[0]}
												</span>
												-<b>{event.score[1]}</b>
											</>
										)}
									</td>
									<td>{event.time}</td>
									<td style={{ whiteSpace: "normal" }}>{event.text}</td>
								</tr>
							</Fragment>
						);
					})}
				</tbody>
			</table>
		);
	},
	(prevProps, nextProps) => {
		return prevProps.count === nextProps.count;
	},
);

const FieldAndDrive = ({ boxScore }: { boxScore: BoxScore }) => {
	const t = 0;
	const t2 = 1;

	// 12 is for 2 endzones and 10 10-yard areas in between
	const NUM_SECTIONS = 12;

	const DEFAULT_HEIGHT = 200;
	console.log(boxScore);
	return (
		<div className="mb-3">
			<div className="d-flex">
				LOGO 1st & 10, own 20
				<div className="ms-auto">Drive: 5 plays, 62 yards</div>
			</div>
			<div
				className="d-flex align-items-stretch"
				style={{
					minHeight: DEFAULT_HEIGHT,
				}}
			>
				{range(NUM_SECTIONS).map(i => {
					const style: CSSProperties = {
						width: `${(1 / 12) * 100}%`,
					};
					const ENDZONE_OFFENSE = i === 0;
					const ENDZONE_DEFENSE = i === NUM_SECTIONS - 1;

					const endzoneTeam = ENDZONE_OFFENSE
						? boxScore.teams[t]
						: ENDZONE_DEFENSE
						? boxScore.teams[t2]
						: undefined;
					if (endzoneTeam) {
						style.backgroundColor = endzoneTeam.colors[0];
						style.color = endzoneTeam.colors[1];
						style.writingMode = "vertical-lr";
					}
					if (ENDZONE_OFFENSE) {
						style.transform = "rotate(180deg)";
					}

					let yardLine: number | undefined;
					if (i > 1 && i <= 6) {
						yardLine = (i - 1) * 10;
					} else if (i > 6 && i <= 10) {
						yardLine = 100 - (i - 1) * 10;
					}

					return (
						<div
							key={i}
							className={classNames("d-flex", {
								"border-start": i > 0,
								"bg-success": !endzoneTeam,
								"align-items-center": endzoneTeam,
								"flex-column justify-content-between": yardLine !== undefined,
							})}
							style={style}
						>
							{endzoneTeam ? (
								<div
									className="fs-2 text-center overflow-hidden"
									style={{ height: DEFAULT_HEIGHT, whiteSpace: "nowrap" }}
								>
									{endzoneTeam.name}
								</div>
							) : null}
							{yardLine !== undefined ? (
								<>
									{range(2).map(i => (
										<div key={i} style={{ marginLeft: "-.5rem" }}>
											{yardLine}
										</div>
									))}
								</>
							) : null}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const BoxScore = ({ boxScore, Row }: { boxScore: BoxScore; Row: any }) => {
	const liveGameSim = (boxScore as any).won?.name === undefined;

	return (
		<div className="mb-3">
			{liveGameSim ? <FieldAndDrive boxScore={boxScore} /> : undefined}

			<h2>Scoring Summary</h2>
			<ScoringSummary
				key={boxScore.gid}
				count={getCount(boxScore.scoringSummary)}
				events={boxScore.scoringSummary}
				numPeriods={boxScore.numPeriods ?? 4}
				teams={boxScore.teams}
			/>
			{[
				"Passing",
				"Rushing",
				"Receiving",
				"Kicking",
				"Punting",
				"Returns",
				"Defense",
			].map(title => (
				<Fragment key={title}>
					<h2>{title}</h2>
					<StatsTable
						Row={Row}
						boxScore={boxScore}
						type={title.toLowerCase() as any}
					/>
				</Fragment>
			))}
		</div>
	);
};

export default BoxScore;
