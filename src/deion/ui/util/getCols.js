// @flow

import { helpers } from ".";
import type { SortOrder, SortType } from "../../common/types";

type Col = {
    desc?: string,
    sortSequence?: SortOrder[],
    sortType?: SortType,
    title?: string, // Should actually be required, but is only added later
};

const sportSpecificCols: {
    [key: string]: Col,
} =
    process.env.SPORT === "basketball"
        ? {
              "rating:fg": {
                  desc: "Two-Point Shooting",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:tp": {
                  desc: "Three-Point Shooting",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:oiq": {
                  desc: "Offensive IQ",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:dnk": {
                  desc: "Dunks/Layups",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:drb": {
                  desc: "Dribbling",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:ins": {
                  desc: "Inside Scoring",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:jmp": {
                  desc: "Jumping",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:ft": {
                  desc: "Free Throw Shooting",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:pss": {
                  desc: "Passing",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:reb": {
                  desc: "Rebounding",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:diq": {
                  desc: "Defensive IQ",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pm": {
                  desc: "Plus/Minus",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:tpp": {
                  desc: "Three Point Percentage",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:tp": {
                  desc: "Three Pointers Made",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:tpa": {
                  desc: "Three Pointers Attempted",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:tpar": {
                  desc: "Three Point Attempt Rate (3PA / FGA)",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:astp": {
                  desc:
                      "Percentage of teammate field goals a player assisted while on the floor",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:ast": {
                  desc: "Assists Per Game",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:ba": {
                  desc: "Blocks Against",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:blk": {
                  desc: "Blocks",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:blkp": {
                  desc: "Percentage of opponent two-pointers blocked",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:drb": {
                  desc: "Defensive Rebounds",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:drbp": {
                  desc: "Percentage of available defensive rebounds grabbed",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:drtg": {
                  desc: "Defensive Rating (points allowed per 100 possessions)",
                  sortSequence: ["asc", "desc"],
                  sortType: "number",
              },
              "stat:dws": {
                  desc: "Defensive Win Shares",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:ewa": {
                  desc: "Estimated Wins Added",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fgp": {
                  desc: "Field Goal Percentage",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fg": {
                  desc: "Field Goals Made",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fga": {
                  desc: "Field Goals Attempted",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:ftp": {
                  desc: "Free Throw Percentage",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:ft": {
                  desc: "Free Throws Made",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fta": {
                  desc: "Free Throws Attempted",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:ftr": {
                  desc: "Free Throw Attempt Rate (FTA / FGA)",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:gmsc": {
                  desc: "Game Score",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:mov": {
                  desc: "Margin of Victory",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:nrtg": {
                  desc: "Net Rating (point differential per 100 possessions)",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:orb": {
                  desc: "Offensive Rebounds",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:orbp": {
                  desc: "Percentage of available offensive rebounds grabbed",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:ortg": {
                  desc:
                      "Offensive Rating (points produced/scored per 100 possessions)",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:ows": {
                  desc: "Offensive Win Shares",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pace": {
                  desc: "Possessions Per Game",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:per": {
                  desc: "Player Efficiency Rating",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pf": {
                  desc: "Personal Fouls",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pl": {
                  desc:
                      "Pythagorean Losses (expected losses based on points scored and allowed)",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pts": {
                  desc: "Points",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pw": {
                  desc:
                      "Pythagorean Wins (expected wins based on points scored and allowed)",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:stl": {
                  desc: "Steals",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:stlp": {
                  desc: "Percentage of opponent possessions ending in steals",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:tovp": {
                  desc: "Turnovers per 100 plays",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:trb": {
                  desc: "Total Rebounds",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:trbp": {
                  desc: "Percentage of available rebounds grabbed",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:tsp": {
                  desc: "True Shooting Percentage",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:tov": {
                  desc: "Turnovers",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:usgp": {
                  desc: "Percentage of team plays used",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:ws": {
                  desc: "Win Shares",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:ws48": {
                  desc: "Win Shares Per 48 Minutes",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
          }
        : {
              "rating:thv": {
                  desc: "Throwing Vision",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:thp": {
                  desc: "Throwing Power",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:tha": {
                  desc: "Throwing Accuracy",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:bls": {
                  desc: "Ball Security",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:elu": {
                  desc: "Elusiveness",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:rtr": {
                  desc: "Route Running",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:hnd": {
                  desc: "Hands",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:rbk": {
                  desc: "Run Blocking",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:pbk": {
                  desc: "Pass Blocking",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:snp": {
                  desc: "Snapping",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:pcv": {
                  desc: "Pass Coverage",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:prs": {
                  desc: "Pass Rushing",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:rns": {
                  desc: "Run Stopping",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:kpw": {
                  desc: "Kicking Power",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:kac": {
                  desc: "Kicking Accuracy",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:ppw": {
                  desc: "Punting Power",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "rating:pac": {
                  desc: "Punting Accuracy",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fmb": {
                  desc: "Fumbles",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fmbLost": {
                  desc: "Fumbles Lost",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pssCmp": {
                  desc: "Completions",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pss": {
                  desc: "Passing Attempts",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pssYds": {
                  desc: "Passing Yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pssTD": {
                  desc: "Passing Touchdowns",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pssInt": {
                  desc: "Interceptions",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pssLng": {
                  desc: "Longest Pass",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pssSk": {
                  desc: "Times Sacked",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pssSkYds": {
                  desc: "Yards lost due to sacks",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:rus": {
                  desc: "Rushing Attempts",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:rusYds": {
                  desc: "Rushing Yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:rusTD": {
                  desc: "Rushing Touchdowns",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:rusLng": {
                  desc: "Longest Run",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:tgt": {
                  desc: "Targets",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:rec": {
                  desc: "Receptions",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:recYds": {
                  desc: "Receiving Yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:recTD": {
                  desc: "Receiving Touchdowns",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:recLng": {
                  desc: "Longest Reception",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pr": {
                  desc: "Punt Returns",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:prYds": {
                  desc: "Punt Return Yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:prTD": {
                  desc: "Punts returned for touchdowns",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:prLng": {
                  desc: "Longest Punt Return",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:kr": {
                  desc: "Kickoff Returns",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:krYds": {
                  desc: "Kickoff Return Yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:krTD": {
                  desc: "Kickoffs returned for touchdowns",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:krLng": {
                  desc: "Longest Kickoff Return",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defInt": {
                  desc: "Interceptions",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defIntYds": {
                  desc: "Yards interceptions were returned for",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defIntTD": {
                  desc: "Interceptions returned for touchdowns",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defIntLng": {
                  desc: "Longest Interception Return",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defPssDef": {
                  desc: "Passes Defended",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defFmbFrc": {
                  desc: "Forced Fumbles",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defFmbRec": {
                  desc: "Fumbles Recovered",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defFmbYds": {
                  desc: "Yards fumbles were returned for",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defFmbTD": {
                  desc: "Fumbles returned for touchdowns",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defSk": {
                  desc: "Sacks",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defTckSolo": {
                  desc: "Solo Tackles",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defTckAst": {
                  desc: "Assists On Tackles",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defTckLoss": {
                  desc: "Tackes For Loss",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:defSft": {
                  desc: "Safeties Scored",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fg0": {
                  desc: "Field Goals Made, 19 yards and under",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fga0": {
                  desc: "Field Goals Attempted, 19 yards and under",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fg20": {
                  desc: "Field Goals Made, 20-29 yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fga20": {
                  desc: "Field Goals Attempted, 20-29 yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fg30": {
                  desc: "Field Goals Made, 30-39 yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fga30": {
                  desc: "Field Goals Attempted, 30-39 yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fg40": {
                  desc: "Field Goals Made, 40-49 yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fga40": {
                  desc: "Field Goals Attempted, 40-49 yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fg50": {
                  desc: "Field Goals Made, 50+ yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fga50": {
                  desc: "Field Goals Attempted, 50+ yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:fgLng": {
                  desc: "Longest Field Goal",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:xp": {
                  desc: "Extra Points Made",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:xpa": {
                  desc: "Extra Points Attempted",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pnt": {
                  desc: "Times Punted",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pntYds": {
                  desc: "Total Punt Yardage",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pntLng": {
                  desc: "Longest Punt",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pntBlk": {
                  desc: "Times Punts Blocked",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:pen": {
                  desc: "Penalties",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:penYds": {
                  desc: "Penalty Yards",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:cmpPct": {
                  desc: "Completion Percentage",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
              "stat:qbRat": {
                  desc: "Quarterback Rating",
                  sortSequence: ["desc", "asc"],
                  sortType: "number",
              },
          };

const cols: {
    [key: string]: Col,
} = {
    "": {
        sortSequence: ["desc", "asc"],
    },
    "#": {},
    "%": {
        desc: "Percentage",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    A: {
        desc: "Attempted",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    Age: {
        sortType: "number",
    },
    Amount: {
        sortSequence: ["desc", "asc"],
        sortType: "currency",
    },
    "Asking For": {
        sortSequence: ["desc", "asc"],
        sortType: "currency",
    },
    "Avg Attendance": {
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    Cash: {
        sortSequence: ["desc", "asc"],
        sortType: "currency",
    },
    Championships: {
        desc: "Championships Won",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    Conference: {},
    Contract: {
        sortSequence: ["desc", "asc"],
        sortType: "currency",
    },
    Count: {
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    Country: {},
    "Current Contract": {
        sortSequence: ["desc", "asc"],
        sortType: "currency",
    },
    "Desired Contract": {
        sortSequence: ["desc", "asc"],
        sortType: "currency",
    },
    Division: {},
    Draft: {
        sortSequence: [],
    },
    "Draft Picks": {
        sortSequence: [],
    },
    Drafted: {},
    Finals: {
        desc: "Finals Appearances",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    HOF: {
        sortSequence: ["desc", "asc"],
    },
    L: {
        desc: "Losses",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    L10: {
        desc: "Last Ten Games",
        sortSequence: ["desc", "asc"],
        sortType: "lastTen",
    },
    Last: {
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "Last Playoffs": {
        sortType: "number",
    },
    "Last Season": {
        desc: "Last Season with Team",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "Last Title": {
        sortType: "number",
    },
    "League Champion": {},
    M: {
        desc: "Made",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    Mood: {},
    Name: {
        sortType: "name",
    },
    Negotiate: {},
    O: {
        desc: "Overall",
        sortType: "number",
    },
    Opp: {
        desc: "Opponent",
    },
    Ovr: {
        desc: "Overall Rating",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    P: {
        desc: "Performance",
        sortType: "number",
    },
    Payroll: {
        sortSequence: ["desc", "asc"],
        sortType: "currency",
    },
    "Peak Ovr": {
        desc: "Peak Overall Rating",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    Pick: {
        desc: "Draft Pick",
        sortType: "draftPick",
    },
    Playoffs: {
        desc: "Playoff Appearances",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    Pos: {
        desc: "Position",
    },
    Pot: {
        desc: "Potential Rating",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "Profit (YTD)": {
        sortSequence: ["desc", "asc"],
        sortType: "currency",
    },
    Result: {},
    Retired: {
        sortSequence: ["desc", "asc"],
    },
    "Revenue (YTD)": {
        sortSequence: ["desc", "asc"],
        sortType: "currency",
    },
    "Runner Up": {},
    Season: {
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    Skills: {},
    T: {
        desc: "Talent",
        sortType: "number",
    },
    Team: {},
    W: {
        desc: "Wins",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    X: {
        desc: "Exclude from counter offers",
        sortSequence: [],
    },
    Year: {},
    "rating:endu": {
        desc: "Endurance",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "rating:hgt": {
        desc: "Height",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "rating:spd": {
        desc: "Speed",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "rating:stre": {
        desc: "Strength",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "stat:gp": {
        desc: "Games Played",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "stat:gs": {
        desc: "Games Started",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "stat:min": {
        desc: "Minutes Per Game",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "count:allDefense": {
        desc: "All Defensive Team",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "count:allLeague": {
        desc: "All League Team",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "count:allRookie": {
        desc: "All Rookie Team",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "count:bestRecord": {
        desc: "Best Record",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "count:bestRecordConf": {
        desc: "Best Conference Record",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "count:dpoy": {
        desc: "Defensive Player of the Year",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "count:mip": {
        desc: "Most Improved Player",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "count:mvp": {
        desc: "Most Valuable Player",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "count:roy": {
        desc: "Rookie of the Year",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "count:smoy": {
        desc: "Sixth Man of the Year",
        sortSequence: ["desc", "asc"],
        sortType: "number",
    },
    "award:dpoy": {
        desc: "Defensive Player of the Year",
        sortType: "name",
    },
    "award:finalsMvp": {
        desc: "Finals Most Valuable Player",
        sortType: "name",
    },
    "award:mip": {
        desc: "Most Improved Player",
        sortType: "name",
    },
    "award:mvp": {
        desc: "Most Valuable Player",
        sortType: "name",
    },
    "award:roy": {
        desc: "Rookie of the Year",
        sortType: "name",
    },
    "award:smoy": {
        desc: "Sixth Man of the Year",
        sortType: "name",
    },
    ...sportSpecificCols,
};

const sportSpecificTitleOverrides =
    process.env.SPORT === "basketball"
        ? {
              "rating:fg": "2Pt",
              "rating:tp": "3Pt",
              "rating:oiq": "oIQ",
              "rating:dnk": "Dnk",
              "rating:drb": "Drb",
              "rating:ins": "Ins",
              "rating:jmp": "Jmp",
              "rating:ft": "FT",
              "rating:pss": "Pss",
              "rating:reb": "Reb",
              "rating:diq": "dIQ",
              "stat:pm": "+/-",
              "stat:tpp": "3P%",
              "stat:tp": "3P",
              "stat:tpa": "3PA",
              "stat:tpar": "3PAr",
              "stat:astp": "AST%",
              "stat:ast": "AST",
              "stat:ba": "BA",
              "stat:blk": "Blk",
              "stat:blkp": "BLK%",
              "stat:drb": "DRB",
              "stat:drbp": "DRB%",
              "stat:drtg": "DRtg",
              "stat:dws": "DWS",
              "stat:ewa": "EWA",
              "stat:fgp": "FG%",
              "stat:fg": "FG",
              "stat:fga": "FGA",
              "stat:ftp": "FT%",
              "stat:ft": "FT",
              "stat:fta": "FTA",
              "stat:ftr": "FTr",
              "stat:gmsc": "GmSc",
              "stat:mov": "MOV",
              "stat:nrtg": "NRtg",
              "stat:orb": "ORB",
              "stat:orbp": "ORB%",
              "stat:ortg": "ORtg",
              "stat:ows": "OWS",
              "stat:pace": "Pace",
              "stat:per": "PER",
              "stat:pf": "PF",
              "stat:pl": "PL",
              "stat:pts": "PTS",
              "stat:pw": "PW",
              "stat:stl": "STL",
              "stat:stlp": "STL%",
              "stat:tovp": "TOV%",
              "stat:trb": "TRB",
              "stat:trbp": "TRB%",
              "stat:tsp": "TS%",
              "stat:tov": "TOV",
              "stat:usgp": "USG%",
              "stat:ws": "WS",
              "stat:ws48": "WS/48",
          }
        : {
              "rating:thv": "ThV",
              "rating:thp": "ThP",
              "rating:tha": "ThA",
              "rating:bls": "BlS",
              "rating:elu": "Elu",
              "rating:rtr": "RtR",
              "rating:hnd": "Hnd",
              "rating:rbk": "RBk",
              "rating:pbk": "PBk",
              "rating:snp": "Snp",
              "rating:pcv": "PCv",
              "rating:prs": "PRs",
              "rating:rns": "RnS",
              "rating:kpw": "KPw",
              "rating:kac": "KAc",
              "rating:ppw": "PPw",
              "rating:pac": "PAc",
              "stat:fmb": "Fmb",
              "stat:fmbLost": "FmbLost",
              "stat:pssCmp": "Cmp",
              "stat:pss": "PaAtt",
              "stat:pssYds": "PaYds",
              "stat:pssTD": "PaTD",
              "stat:pssInt": "Int",
              "stat:pssLng": "PaLng",
              "stat:pssSk": "Sk",
              "stat:pssSkYds": "SkYds",
              "stat:rus": "Rush",
              "stat:rusYds": "RuYds",
              "stat:rusTD": "RuTD",
              "stat:rusLng": "RuLng",
              "stat:tgt": "Tgt",
              "stat:rec": "Rec",
              "stat:recYds": "RcYds",
              "stat:recTD": "RcTD",
              "stat:recLng": "RcLng",
              "stat:pr": "PR",
              "stat:prYds": "PRYds",
              "stat:prTD": "PRTD",
              "stat:prLng": "PRLng",
              "stat:kr": "KR",
              "stat:krYds": "KRYds",
              "stat:krTD": "KRTD",
              "stat:krLng": "KRLng",
              "stat:defInt": "Int",
              "stat:defIntYds": "IntYds",
              "stat:defIntTD": "IntTD",
              "stat:defIntLng": "IntLng",
              "stat:defPssDef": "PaDef",
              "stat:defFmbFrc": "FF",
              "stat:defFmbRec": "FR",
              "stat:defFmbYds": "FYds",
              "stat:defFmbTD": "FTD",
              "stat:defSk": "Sk",
              "stat:defTckSolo": "Solo",
              "stat:defTckAst": "Ast",
              "stat:defTckLoss": "TFL",
              "stat:defSft": "Sfty",
              "stat:fg0": "FG10",
              "stat:fga0": "FGA10",
              "stat:fg20": "FG20",
              "stat:fga20": "FGA20",
              "stat:fg30": "FG30",
              "stat:fga30": "FGA30",
              "stat:fg40": "FG40",
              "stat:fga40": "FGA40",
              "stat:fg50": "FG50",
              "stat:fga50": "FGA50",
              "stat:fgLng": "FGLng",
              "stat:xp": "XP",
              "stat:xpa": "XPA",
              "stat:pnt": "Pnt",
              "stat:pntYds": "PntYds",
              "stat:pntLng": "PntLng",
              "stat:pntBlk": "PntBlk",
              "stat:pen": "Pen",
              "stat:penYds": "PenYds",
              "stat:cmpPct": "Pct",
              "stat:qbRat": "QBRat",
          };

const titleOverrides = {
    "rating:endu": "End",
    "rating:hgt": "Hgt",
    "rating:spd": "Spd",
    "rating:stre": "Str",
    "stat:gp": "G",
    "stat:gs": "GS",
    "stat:min": "MP",
    "count:allDefense": "ADT",
    "count:allLeague": "ALT",
    "count:allRookie": "ART",
    "count:bestRecord": "BR",
    "count:bestRecordConf": "BRC",
    "count:dpoy": "DPOY",
    "count:mip": "MIP",
    "count:mvp": "MVP",
    "count:roy": "ROY",
    "count:smoy": "SMOY",
    "award:dpoy": "DPOY",
    "award:finalsMvp": "Finals MVP",
    "award:mip": "MIP",
    "award:mvp": "MVP",
    "award:roy": "ROY",
    "award:smoy": "SMOY",
    ...sportSpecificTitleOverrides,
};

for (const key of Object.keys(cols)) {
    if (
        key.startsWith("rating:") ||
        key.startsWith("stat:") ||
        key.startsWith("count:") ||
        key.startsWith("award:")
    ) {
        cols[key].title = titleOverrides[key];
    } else {
        cols[key].title = key;
    }
}

export default (...titles: string[]): Col[] => {
    return titles.map(title => {
        if (!cols.hasOwnProperty(title)) {
            throw new Error(`Unknown column: "${title}"`);
        }

        // Deep copy so other properties can be set on col, like width
        return helpers.deepCopy(cols[title]);
    });
};
