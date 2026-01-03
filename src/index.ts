import { createDebug } from "obug";

import { filePathToNamespace } from "./filePathToNamespace.js";

export function debugForFile(filePath: string) {
	return createDebug(filePathToNamespace(filePath));
}
