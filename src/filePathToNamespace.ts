import * as pkg from "empathic/package";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { generateNamespace } from "./generateNamespace.js";

export function filePathToNamespace(filePath: string): string {
	const resolved = filePath.startsWith("file:")
		? fileURLToPath(filePath)
		: filePath;

	const packageUp = pkg.up({
		cwd: path.dirname(resolved),
	});

	if (!packageUp) {
		return generateNamespace(resolved);
	}

	const filePathRelative = path.relative(path.dirname(packageUp), resolved);

	const packageContent = fs.readFileSync(packageUp, "utf-8");

	/* eslint-disable no-var */
	try {
		var packageJson: undefined | { name?: unknown } = JSON.parse(
			packageContent,
		) as unknown as undefined | { name?: unknown };
	} catch {
		var packageJson: undefined | { name?: unknown } = undefined;
	}
	/* eslint-enable no-var */
	if (
		packageJson !== undefined &&
		"name" in packageJson &&
		typeof packageJson.name == "string"
	) {
		return generateNamespace(filePathRelative, packageJson.name);
	} else {
		return generateNamespace(filePathRelative);
	}
}
