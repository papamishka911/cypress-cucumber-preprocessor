"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.diagnose = exports.position = exports.compareStepDefinition = exports.comparePosition = exports.strictCompare = exports.expressionToString = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const cypress_configuration_1 = require("@badeball/cypress-configuration");
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const gherkin_1 = require("@cucumber/gherkin");
const messages_1 = require("@cucumber/messages");
const esbuild = __importStar(require("esbuild"));
const source_map_1 = __importDefault(require("source-map"));
const assertions_1 = require("../assertions");
const ast_helpers_1 = require("../ast-helpers");
const paths_1 = require("../helpers/paths");
const registry_1 = require("../registry");
const step_definitions_1 = require("../step-definitions");
const type_guards_1 = require("../type-guards");
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
async function diagnose(configuration) {
    var _a, _b, _c, _d;
    const result = {
        definitionsUsage: [],
        unmatchedSteps: [],
        ambiguousSteps: [],
    };
    const testFiles = (0, cypress_configuration_1.getTestFiles)(configuration.cypress);
    for (const testFile of testFiles) {
        if (!testFile.endsWith(".feature")) {
            continue;
        }
        const stepDefinitionPatterns = (0, step_definitions_1.getStepDefinitionPatterns)(configuration, testFile);
        const stepDefinitions = await (0, step_definitions_1.getStepDefinitionPaths)(stepDefinitionPatterns);
        const randomPart = Math.random().toString(16).slice(2, 8);
        const inputFileName = path_1.default.join(configuration.cypress.projectRoot, ".input-" + randomPart + ".js");
        const outputFileName = path_1.default.join(configuration.cypress.projectRoot, ".output-" + randomPart + ".js");
        let registry;
        try {
            await promises_1.default.writeFile(inputFileName, stepDefinitions
                .map((stepDefinition) => `require(${JSON.stringify(stepDefinition)});`)
                .join("\n"));
            const esbuildResult = await esbuild.build({
                entryPoints: [inputFileName],
                bundle: true,
                sourcemap: "external",
                outfile: outputFileName,
            });
            if (esbuildResult.errors.length > 0) {
                for (const error of esbuildResult.errors) {
                    console.error(JSON.stringify(error));
                }
                throw new Error(`Failed to compile steø definitions of ${testFile}, with errors shown above...`);
            }
            registry = (0, registry_1.withRegistry)(true, () => {
                globalThis.Cypress = {};
                try {
                    require(outputFileName);
                }
                catch (e) {
                    console.log(util_1.default.inspect(e));
                    throw new Error("Failed to evaluate step definitions, with errors shown above...");
                }
            });
            registry.finalize();
            const consumer = await new source_map_1.default.SourceMapConsumer((await promises_1.default.readFile(outputFileName + ".map")).toString());
            for (const stepDefinition of registry.stepDefinitions) {
                const originalPosition = position(stepDefinition);
                const newPosition = consumer.originalPositionFor(originalPosition);
                stepDefinition.position = {
                    line: (0, assertions_1.assertAndReturn)(newPosition.line, "Expected to find a line number"),
                    column: (0, assertions_1.assertAndReturn)(newPosition.column, "Expected to find a column number"),
                    source: (0, assertions_1.assertAndReturn)(newPosition.source, "Expected to find a source"),
                };
            }
            consumer.destroy();
        }
        finally {
            /**
             * Delete without regard for errors.
             */
            await promises_1.default.rm(inputFileName).catch(() => true);
            await promises_1.default.rm(outputFileName).catch(() => true);
            await promises_1.default.rm(outputFileName + ".map").catch(() => true);
        }
        const options = {
            includeSource: false,
            includeGherkinDocument: true,
            includePickles: true,
            newId: messages_1.IdGenerator.uuid(),
        };
        const relativeUri = (0, paths_1.ensureIsRelative)(configuration.cypress.projectRoot, testFile);
        const envelopes = (0, gherkin_1.generateMessages)((await promises_1.default.readFile(testFile)).toString(), relativeUri, messages_1.SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN, options);
        const gherkinDocument = (0, assertions_1.assertAndReturn)(envelopes
            .map((envelope) => envelope.gherkinDocument)
            .find((document) => document), "Expected to find a gherkin document");
        for (const stepDefinition of registry.stepDefinitions) {
            const usage = result.definitionsUsage.find((usage) => compareStepDefinition(usage.definition, stepDefinition));
            if (!usage) {
                result.definitionsUsage.push({
                    definition: stepDefinition,
                    steps: [],
                });
            }
        }
        const astIdMap = (0, ast_helpers_1.createAstIdMap)(gherkinDocument);
        const pickles = envelopes
            .map((envelope) => envelope.pickle)
            .filter(type_guards_1.notNull);
        for (const pickle of pickles) {
            if (pickle.steps) {
                for (const step of pickle.steps) {
                    const text = (0, assertions_1.assertAndReturn)(step.text, "Expected pickle step to have a text");
                    const matchingStepDefinitions = registry.getMatchingStepDefinitions(text);
                    const astNodeId = (0, assertions_1.assertAndReturn)((_a = step.astNodeIds) === null || _a === void 0 ? void 0 : _a[0], "Expected to find at least one astNodeId");
                    const astNode = (0, assertions_1.assertAndReturn)(astIdMap.get(astNodeId), `Expected to find scenario step associated with id = ${astNodeId}`);
                    (0, assertions_1.assert)("location" in astNode, "Expected ast node to have a location");
                    if (matchingStepDefinitions.length === 0) {
                        let argument = null;
                        if ((_b = step.argument) === null || _b === void 0 ? void 0 : _b.dataTable) {
                            argument = "dataTable";
                        }
                        else if ((_c = step.argument) === null || _c === void 0 ? void 0 : _c.docString) {
                            argument = "docString";
                        }
                        result.unmatchedSteps.push({
                            step: {
                                source: testFile,
                                line: astNode.location.line,
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                text: step.text,
                            },
                            argument,
                            parameterTypeRegistry: registry.parameterTypeRegistry,
                            stepDefinitionHints: {
                                stepDefinitions: [
                                    configuration.preprocessor.stepDefinitions,
                                ].flat(),
                                stepDefinitionPatterns,
                                stepDefinitionPaths: stepDefinitions,
                            },
                        });
                    }
                    else if (matchingStepDefinitions.length === 1) {
                        const usage = (0, assertions_1.assertAndReturn)(result.definitionsUsage.find((usage) => compareStepDefinition(usage.definition, matchingStepDefinitions[0])), "Expected to find usage");
                        usage.steps.push({
                            source: testFile,
                            line: (_d = astNode.location) === null || _d === void 0 ? void 0 : _d.line,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            text: step.text,
                        });
                    }
                    else {
                        for (const matchingStepDefinition of matchingStepDefinitions) {
                            const usage = (0, assertions_1.assertAndReturn)(result.definitionsUsage.find((usage) => compareStepDefinition(usage.definition, matchingStepDefinition)), "Expected to find usage");
                            usage.steps.push({
                                source: testFile,
                                line: astNode.location.line,
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                text: step.text,
                            });
                        }
                        result.ambiguousSteps.push({
                            step: {
                                source: testFile,
                                line: astNode.location.line,
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                text: step.text,
                            },
                            definitions: matchingStepDefinitions,
                        });
                    }
                }
            }
        }
    }
    return result;
}
exports.diagnose = diagnose;
