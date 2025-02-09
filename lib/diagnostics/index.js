#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.createUnmatchedStep = exports.createAmbiguousStep = exports.createDefinitionsUsage = exports.createLineBuffer = exports.mapValues = exports.groupToMap = exports.position = exports.compareStepDefinition = exports.comparePosition = exports.strictCompare = exports.expressionToString = exports.yellow = exports.red = exports.log = void 0;
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const cypress_configuration_1 = require("@badeball/cypress-configuration");
const module_alias_1 = require("module-alias");
const cli_table_1 = __importDefault(require("cli-table"));
const common_ancestor_path_1 = __importDefault(require("common-ancestor-path"));
const preprocessor_configuration_1 = require("../preprocessor-configuration");
const paths_1 = require("../helpers/paths");
const strings_1 = require("../helpers/strings");
const diagnose_1 = require("./diagnose");
const assertions_1 = require("../assertions");
const snippets_1 = require("../snippets");
function log(...lines) {
    console.log(lines.join("\n"));
}
exports.log = log;
function red(message) {
    return `\x1b[31m${message}\x1b[0m`;
}
exports.red = red;
function yellow(message) {
    return `\x1b[33m${message}\x1b[0m`;
}
exports.yellow = yellow;
function expressionToString(expression) {
    return expression instanceof cucumber_expressions_1.RegularExpression
        ? String(expression.regexp)
        : expression.source;
}
exports.expressionToString = expressionToString;
function strictCompare(a, b) {
    return a === b;
}
exports.strictCompare = strictCompare;
function comparePosition(a, b) {
    return a.source === b.source && a.column === b.column && a.line === b.line;
}
exports.comparePosition = comparePosition;
function compareStepDefinition(a, b) {
    return (expressionToString(a.expression) === expressionToString(b.expression) &&
        comparePosition(position(a), position(b)));
}
exports.compareStepDefinition = compareStepDefinition;
function position(definition) {
    return (0, assertions_1.assertAndReturn)(definition.position, "Expected to find a position");
}
exports.position = position;
function groupToMap(collection, getKeyFn, compareKeyFn) {
    const map = new Map();
    el: for (const el of collection) {
        const key = getKeyFn(el);
        for (const existingKey of map.keys()) {
            if (compareKeyFn(key, existingKey)) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                map.get(existingKey).push(el);
                continue el;
            }
        }
        map.set(key, [el]);
    }
    return map;
}
exports.groupToMap = groupToMap;
function mapValues(map, fn) {
    const mapped = new Map();
    for (const [key, value] of map.entries()) {
        mapped.set(key, fn(value));
    }
    return mapped;
}
exports.mapValues = mapValues;
function createLineBuffer(fn) {
    const buffer = [];
    const append = (line) => buffer.push(line);
    fn(append);
    return buffer;
}
exports.createLineBuffer = createLineBuffer;
function createDefinitionsUsage(projectRoot, result) {
    const groups = mapValues(groupToMap(result.definitionsUsage, 
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (definitionsUsage) => definitionsUsage.definition.position.source, strictCompare), (definitionsUsages) => mapValues(groupToMap(definitionsUsages, (definitionsUsage) => definitionsUsage.definition, compareStepDefinition), (definitionsUsages) => definitionsUsages.flatMap((definitionsUsage) => definitionsUsage.steps)));
    const entries = Array.from(groups.entries())
        .sort((a, b) => a[0].localeCompare(b[0]))
        .flatMap(([, matches]) => {
        return Array.from(matches.entries())
            .sort((a, b) => position(a[0]).line - position(b[0]).line)
            .map(([stepDefinition, steps]) => {
            const { expression } = stepDefinition;
            const right = [
                (0, util_1.inspect)(expression instanceof cucumber_expressions_1.RegularExpression
                    ? expression.regexp
                    : expression.source) + (steps.length === 0 ? ` (${yellow("unused")})` : ""),
                ...steps.map((step) => {
                    return "  " + step.text;
                }),
            ].join("\n");
            const left = [
                (0, paths_1.ensureIsRelative)(projectRoot, position(stepDefinition).source) +
                    ":" +
                    position(stepDefinition).line,
                ...steps.map((step) => {
                    return ((0, paths_1.ensureIsRelative)(projectRoot, step.source) + ":" + step.line);
                }),
            ].join("\n");
            return [right, left];
        });
    });
    const table = new cli_table_1.default({
        head: ["Pattern / Text", "Location"],
        style: {
            head: [],
            border: [], // Disable colors for the border.
        },
    });
    table.push(...entries);
    return table.toString();
}
exports.createDefinitionsUsage = createDefinitionsUsage;
function createAmbiguousStep(projectRoot, ambiguousStep) {
    const relativeToProjectRoot = (path) => (0, paths_1.ensureIsRelative)(projectRoot, path);
    return createLineBuffer((append) => {
        append(`${red("Error")}: Multiple matching step definitions at ${relativeToProjectRoot(ambiguousStep.step.source)}:${ambiguousStep.step.line} for`);
        append("");
        append("  " + ambiguousStep.step.text);
        append("");
        append("Step matched the following definitions:");
        append("");
        ambiguousStep.definitions
            .map((definition) => `  - ${(0, util_1.inspect)(definition.expression instanceof cucumber_expressions_1.RegularExpression
            ? definition.expression.regexp
            : definition.expression.source)} (${relativeToProjectRoot(position(definition).source)}:${position(definition).line})`)
            .forEach(append);
    });
}
exports.createAmbiguousStep = createAmbiguousStep;
function createUnmatchedStep(projectRoot, unmatch) {
    const relativeToProjectRoot = (path) => (0, paths_1.ensureIsRelative)(projectRoot, path);
    return createLineBuffer((append) => {
        append(`${red("Error")}: Step implementation missing at ${relativeToProjectRoot(unmatch.step.source)}:${unmatch.step.line}`);
        append("");
        append("  " + unmatch.step.text);
        append("");
        append("We tried searching for files containing step definitions using the following search pattern template(s):");
        append("");
        unmatch.stepDefinitionHints.stepDefinitions
            .map((stepDefinition) => "  - " + stepDefinition)
            .forEach(append);
        append("");
        append("These templates resolved to the following search pattern(s):");
        append("");
        unmatch.stepDefinitionHints.stepDefinitionPatterns
            .map((stepDefinitionPattern) => "  - " + relativeToProjectRoot(stepDefinitionPattern))
            .forEach(append);
        append("");
        if (unmatch.stepDefinitionHints.stepDefinitionPaths.length === 0) {
            append("These patterns matched *no files* containing step definitions. This almost certainly means that you have misconfigured `stepDefinitions`. Alternatively, you can implement it using the suggestion(s) below.");
        }
        else {
            append("These patterns matched the following file(s):");
            append("");
            unmatch.stepDefinitionHints.stepDefinitionPaths
                .map((stepDefinitionPath) => "  - " + relativeToProjectRoot(stepDefinitionPath))
                .forEach(append);
            append("");
            append("However, none of these files contained a matching step definition. You can implement it using the suggestion(s) below.");
        }
        const cucumberExpressionGenerator = new cucumber_expressions_1.CucumberExpressionGenerator(() => unmatch.parameterTypeRegistry.parameterTypes);
        const generatedExpressions = cucumberExpressionGenerator.generateExpressions(unmatch.step.text);
        for (const generatedExpression of generatedExpressions) {
            append("");
            append((0, strings_1.indent)((0, snippets_1.generateSnippet)(generatedExpression, unmatch.argument), {
                count: 2,
            }));
        }
    });
}
exports.createUnmatchedStep = createUnmatchedStep;
async function execute(options) {
    (0, module_alias_1.addAlias)("@badeball/cypress-cucumber-preprocessor", "@badeball/cypress-cucumber-preprocessor/methods");
    const cypress = (0, cypress_configuration_1.getConfiguration)(options);
    const implicitIntegrationFolder = (0, assertions_1.assertAndReturn)((0, common_ancestor_path_1.default)(...(0, cypress_configuration_1.getTestFiles)(cypress).map(path_1.default.dirname).map(path_1.default.normalize)), "Expected to find a common ancestor path");
    const preprocessor = await (0, preprocessor_configuration_1.resolve)(cypress, options.env, implicitIntegrationFolder);
    const result = await (0, diagnose_1.diagnose)({
        cypress,
        preprocessor,
    });
    log(...createLineBuffer((append) => {
        append(createDefinitionsUsage(cypress.projectRoot, result));
        append("");
        const problems = [
            ...result.ambiguousSteps.map((ambiguousStep) => {
                return { ambiguousStep };
            }),
            ...result.unmatchedSteps.map((unmatchedStep) => {
                return { unmatchedStep };
            }),
        ];
        if (problems.length > 0) {
            append(`Found ${problems.length} problem(s):`);
            append("");
            for (let i = 0; i < problems.length; i++) {
                const problem = problems[i];
                const lines = "ambiguousStep" in problem
                    ? createAmbiguousStep(cypress.projectRoot, problem.ambiguousStep)
                    : createUnmatchedStep(cypress.projectRoot, problem.unmatchedStep);
                const title = `${i + 1}) `;
                const [first, ...rest] = lines;
                append(title + first);
                rest
                    .map((line) => line === "" ? "" : (0, strings_1.indent)(line, { count: title.length }))
                    .forEach(append);
                if (i !== problems.length - 1) {
                    append("");
                }
            }
            process.exitCode = 1;
        }
        else {
            append("No problems found.");
        }
    }));
}
exports.execute = execute;
if (require.main === module) {
    execute({ argv: process.argv, env: process.env, cwd: process.cwd() });
}
