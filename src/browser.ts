import { createDebug } from "obug";

import { generateNamespace } from "./generateNamespace.js";

export function debugForFile(filePath: string) {
	return createDebug(generateNamespace(filePath));
}
