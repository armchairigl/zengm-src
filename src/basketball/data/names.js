// @flow

import { g } from "../worker/util";

type PlayerNames = {
    countries: [string, number][],
    first: {
        [key: string]: [string, number][],
    },
    last: {
        [key: string]: [string, number][],
    },
};

// The names were generated by tools/names.js, you probably don't want to edit them by hand.
// If the list of countries changes, update the fake age code in getPlayerFakeAge.js!
//
// This weird conditional require is so Karma doesn't crash when using the big names file.
let { first, last } =
    process.env.NODE_ENV === "test"
        ? require("./names-test.json") // eslint-disable-line
        : require("./names-default.json"); // eslint-disable-line

const genCumSums = (names: {
    [key: string]: [string, number][],
}): [string, number][] => {
    let cumsum = 0;
    return Object.keys(names)
        .sort()
        .map(country => {
            cumsum += names[country][names[country].length - 1][1];
            return [country, cumsum];
        });
};

const load = (): PlayerNames => {
    if (g.names && g.names.first) {
        if (Array.isArray(g.names.first)) {
            first = { USA: g.names.first };
        } else {
            first = g.names.first;
        }
    }
    if (g.names && g.names.last) {
        if (Array.isArray(g.names.last)) {
            last = { USA: g.names.last };
        } else {
            last = g.names.last;
        }
    }

    const countries = genCumSums(first);

    /*const max = countries[countries.length - 1][1];
    let prev = 0;
    for (const row of countries) {
        console.log(`${row[0]} ${(100 * (row[1] - prev) / max).toFixed(3)}%`);
        prev = row[1];
    }*/

    return { countries, first, last };
};

export {
    // eslint-disable-next-line import/prefer-default-export
    load,
};
