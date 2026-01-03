import * as path from "node:path";
import * as fs from "node:fs";
import * as pkg from "empathic/package";

import { generateNamespace } from "./generateNamespace.js";

export function filePathToNamespace(filePath: string): string {
	const packageUp = pkg.up({
		cwd: path.dirname(filePath),
	});

	if (!packageUp) {
		return generateNamespace(filePath);
	}

	const filePathRelative = path.relative(path.dirname(packageUp), filePath);

	const packageContent = fs.readFileSync(packageUp, "utf-8");

	try {
		var packageJson: { name?: unknown } | undefined =
			JSON.parse(packageContent);
	} catch {
		var packageJson: { name?: unknown } | undefined = undefined;
	}
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
