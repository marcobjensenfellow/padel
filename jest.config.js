module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src/__tests__"],
    testMatch: ["**/*.spec.ts"],
    moduleNameMapper: {
        // Resolve the @ alias used throughout the source
        "^@/(.*)$": "<rootDir>/src/$1",
    },
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.test.json",
        },
    },
    // Collect coverage from service files only (the pure business logic)
    collectCoverageFrom: [
        "src/services/**/*.ts",
        "!src/services/storageService.ts",
        "!src/services/htmlHelperService.ts",
    ],
};
