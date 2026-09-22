import * as fs from "node:fs";
import { findPackageJSON } from "node:module";
import * as path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { generateNamespace } from "./generateNamespace.js";

export function filePathToNamespace(filePath: string): string {
	const resolved = filePath.startsWith("file://")
		? fileURLToPath(filePath)
		: filePath;

	const packageJsonPath = findPackageJSON(".", pathToFileURL(resolved));

	if (
		packageJsonPath === undefined ||
		path.basename(packageJsonPath) !== "package.json"
	) {
		return generateNamespace(resolved);
	}

	const filePathRelative = path.relative(
		path.dirname(packageJsonPath),
		resolved,
	);

	const packageName = readPackageName(packageJsonPath);

	return packageName === undefined
		? generateNamespace(filePathRelative)
		: generateNamespace(filePathRelative, packageName);
}

function readPackageName(packageJsonPath: string) {
	let contents: unknown;

	try {
		contents = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
	} catch {
		return undefined;
	}

	return typeof contents === "object" &&
		contents !== null &&
		"name" in contents &&
		typeof contents.name === "string"
		? contents.name
		: undefined;
}
