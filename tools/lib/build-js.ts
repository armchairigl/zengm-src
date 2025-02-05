import fs from "node:fs";
import fse from "fs-extra";
import { fileHash, genRev, replace, setTimestamps } from "./buildFuncs.ts";
import { Worker } from "node:worker_threads";

const rev = genRev();
console.log(rev);

const buildJS = async () => {
	const promises = [];
	for (const name of ["ui", "worker"]) {
		for (const legacy of [false, true]) {
			promises.push(
				new Promise<void>(resolve => {
					const worker = new Worker(
						new URL("./buildJSWorker.ts", import.meta.url),
						{
							workerData: {
								legacy,
								name,
								rev,
							},
						},
					);

					worker.on("message", () => {
						resolve();
					});
				}),
			);
		}
	}
	await Promise.all(promises);

	// Hack because otherwise I'm somehow left with no newline before the souce map URL, which confuses Bugsnag
	const replacePaths = fs
		.readdirSync("build/gen")
		.filter(filename => filename.endsWith(".js"))
		.map(filename => `build/gen/${filename}`);
	replace({
		paths: replacePaths,
		replaces: [
			{
				searchValue: ";//# sourceMappingURL",
				replaceValue: ";\n//# sourceMappingURL",
			},
		],
	});

	setTimestamps(rev);

	const jsonFiles = [
		"names",
		"names-female",
		"real-player-data",
		"real-player-stats",
	];
	for (const filename of jsonFiles) {
		const filePath = `build/gen/${filename}.json`;
		if (fs.existsSync(filePath)) {
			const string = fs.readFileSync(filePath, "utf8");
			const compressed = JSON.stringify(JSON.parse(string));
			fs.writeFileSync(filePath, compressed);

			const hash = fileHash(compressed);
			const newFilename = filePath.replace(".json", `-${hash}.json`);
			fse.moveSync(filePath, newFilename);

			replace({
				paths: [
					`build/gen/worker-legacy-${rev}.js`,
					`build/gen/worker-${rev}.js`,
				],
				replaces: [
					{
						searchValue: `/gen/${filename}.json`,
						replaceValue: `/gen/${filename}-${hash}.json`,
					},
				],
			});
		}
	}
};

export default buildJS;
