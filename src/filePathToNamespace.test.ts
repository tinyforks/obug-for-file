import { describe, expect, it, vi } from "vitest";

import { filePathToNamespace } from "./filePathToNamespace.js";

const mockUp = vi.fn();
const mockReadFileSync = vi.fn();

vi.mock("empathic/package", () => ({
	get up() {
		return mockUp;
	},
}));

vi.mock("node:fs", () => ({
	get readFileSync() {
		return mockReadFileSync;
	},
}));

describe("filePathToNamespace", () => {
	it("generates a namespace with just the filePath when readPackageUpSync doesn't resolve a package.json", () => {
		mockUp.mockReturnValueOnce(undefined);

		const actual = filePathToNamespace("abc/def");

		expect(actual).toBe("abc:def");
	});

	it("generates a namespace including the package name when readPackageUpSync resolves a package.json", () => {
		mockUp.mockReturnValueOnce("abc/package.json");
		mockReadFileSync.mockReturnValue(`{"name": "xyz"}`);

		const actual = filePathToNamespace("abc/def");

		expect(actual).toBe("xyz:def");
	});

	it("handles invalid JSON", () => {
		mockUp.mockReturnValueOnce("abc/package.json");
		mockReadFileSync.mockReturnValue(`{"name}`);

		const actual = filePathToNamespace("abc/def");

		expect(actual).toBe("def");
	});

	it("handles invalid package manifest format", () => {
		mockUp.mockReturnValueOnce("abc/package.json");
		mockReadFileSync.mockReturnValue(`{}`);

		const actual = filePathToNamespace("abc/def");

		expect(actual).toBe("def");
	});
});
