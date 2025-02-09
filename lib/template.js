"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = void 0;
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const gherkin_1 = require("@cucumber/gherkin");
const messages_1 = require("@cucumber/messages");
const cypress_configuration_1 = require("@badeball/cypress-configuration");
const common_ancestor_path_1 = __importDefault(require("common-ancestor-path"));
const assertions_1 = require("./assertions");
const preprocessor_configuration_1 = require("./preprocessor-configuration");
const step_definitions_1 = require("./step-definitions");
const type_guards_1 = require("./type-guards");
const paths_1 = require("./helpers/paths");
const add_cucumber_preprocessor_plugin_1 = require("./add-cucumber-preprocessor-plugin");
const debug_1 = __importDefault(require("./debug"));
const { stringify } = JSON;
async function compile(configuration, data, uri) {
    configuration = (0, add_cucumber_preprocessor_plugin_1.rebuildOriginalConfigObject)(configuration);
    const options = {
        includeSource: false,
        includeGherkinDocument: true,
        includePickles: true,
        newId: messages_1.IdGenerator.uuid(),
    };
    const relativeUri = path_1.default.relative(configuration.projectRoot, uri);
    const envelopes = (0, gherkin_1.generateMessages)(data, relativeUri, messages_1.SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN, options);
    if (envelopes[0].parseError) {
        throw new Error((0, assertions_1.assertAndReturn)(envelopes[0].parseError.message, "Expected parse error to have a description"));
    }
    const gherkinDocument = (0, assertions_1.assertAndReturn)(envelopes.map((envelope) => envelope.gherkinDocument).find(type_guards_1.notNull), "Expected to find a gherkin document amongst the envelopes.");
    const pickles = envelopes.map((envelope) => envelope.pickle).filter(type_guards_1.notNull);
    const implicitIntegrationFolder = (0, assertions_1.assertAndReturn)((0, common_ancestor_path_1.default)(...(0, cypress_configuration_1.getTestFiles)(configuration).map(path_1.default.dirname).map(path_1.default.normalize)), "Expected to find a common ancestor path");
    const preprocessor = await (0, preprocessor_configuration_1.resolve)(configuration, configuration.env, implicitIntegrationFolder);
    const { stepDefinitions } = preprocessor;
    (0, debug_1.default)(`resolving step definitions using template(s) ${(0, util_1.inspect)(stepDefinitions)}`);
    const stepDefinitionPatterns = (0, step_definitions_1.getStepDefinitionPatterns)({
        cypress: configuration,
        preprocessor,
    }, uri);
    (0, debug_1.default)(`for ${(0, util_1.inspect)((0, paths_1.ensureIsRelative)(configuration.projectRoot, uri))} yielded patterns ${(0, util_1.inspect)(stepDefinitionPatterns.map((pattern) => (0, paths_1.ensureIsRelative)(configuration.projectRoot, pattern)))}`);
    const stepDefinitionPaths = await (0, step_definitions_1.getStepDefinitionPaths)(stepDefinitionPatterns);
    if (stepDefinitionPaths.length === 0) {
        (0, debug_1.default)("found no step definitions");
    }
    else {
        (0, debug_1.default)(`found step definitions ${(0, util_1.inspect)(stepDefinitionPaths.map((path) => (0, paths_1.ensureIsRelative)(configuration.projectRoot, path)))}`);
    }
    const prepareLibPath = (...parts) => stringify(path_1.default.join(__dirname, ...parts));
    const createTestsPath = prepareLibPath("create-tests");
    const registryPath = prepareLibPath("registry");
    const ensureRelativeToProjectRoot = (path) => (0, paths_1.ensureIsRelative)(configuration.projectRoot, path);
    return `
    const { default: createTests } = require(${createTestsPath});
    const { withRegistry } = require(${registryPath});

    const registry = withRegistry(
      false,
      () => {
        ${stepDefinitionPaths
        .map((stepDefintion) => `require(${stringify(stepDefintion)});`)
        .join("\n    ")}
      }
    );

    registry.finalize();

    createTests(
      registry,
      ${stringify(data)},
      ${stringify(gherkinDocument)},
      ${stringify(pickles)},
      ${preprocessor.messages.enabled},
      ${preprocessor.omitFiltered},
      ${stringify({
        stepDefinitions,
        stepDefinitionPatterns: stepDefinitionPatterns.map(ensureRelativeToProjectRoot),
        stepDefinitionPaths: stepDefinitionPaths.map(ensureRelativeToProjectRoot),
    })}
    );
  `;
}
exports.compile = compile;
