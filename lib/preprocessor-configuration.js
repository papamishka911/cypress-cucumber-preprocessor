"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolve = exports.PreprocessorConfiguration = exports.DEFAULT_STEP_DEFINITIONS = exports.stringToMaybeBoolean = void 0;
const cosmiconfig_1 = require("cosmiconfig");
const util_1 = __importDefault(require("util"));
const debug_1 = __importDefault(require("./debug"));
const paths_1 = require("./helpers/paths");
const type_guards_1 = require("./type-guards");
function hasOwnProperty(value, property) {
    return Object.prototype.hasOwnProperty.call(value, property);
}
function validateConfigurationEntry(key, value) {
    switch (key) {
        case "stepDefinitions":
            if (!(0, type_guards_1.isStringOrStringArray)(value)) {
                throw new Error(`Expected a string or array of strings (stepDefinitions), but got ${util_1.default.inspect(value)}`);
            }
            return { [key]: value };
        case "messages": {
            if (typeof value !== "object" || value == null) {
                throw new Error(`Expected an object (messages), but got ${util_1.default.inspect(value)}`);
            }
            if (!hasOwnProperty(value, "enabled") ||
                typeof value.enabled !== "boolean") {
                throw new Error(`Expected a boolean (messages.enabled), but got ${util_1.default.inspect(value)}`);
            }
            let output;
            if (hasOwnProperty(value, "output")) {
                if ((0, type_guards_1.isString)(value.output)) {
                    output = value.output;
                }
                else {
                    throw new Error(`Expected a string (messages.output), but got ${util_1.default.inspect(value)}`);
                }
            }
            const messagesConfig = {
                enabled: value.enabled,
                output,
            };
            return { [key]: messagesConfig };
        }
        case "json": {
            if (typeof value !== "object" || value == null) {
                throw new Error(`Expected an object (json), but got ${util_1.default.inspect(value)}`);
            }
            if (!hasOwnProperty(value, "enabled") ||
                typeof value.enabled !== "boolean") {
                throw new Error(`Expected a boolean (json.enabled), but got ${util_1.default.inspect(value)}`);
            }
            let output;
            if (hasOwnProperty(value, "output")) {
                if ((0, type_guards_1.isString)(value.output)) {
                    output = value.output;
                }
                else {
                    throw new Error(`Expected a string (json.output), but got ${util_1.default.inspect(value)}`);
                }
            }
            const messagesConfig = {
                enabled: value.enabled,
                output,
            };
            return { [key]: messagesConfig };
        }
        case "html": {
            if (typeof value !== "object" || value == null) {
                throw new Error(`Expected an object (json), but got ${util_1.default.inspect(value)}`);
            }
            if (!hasOwnProperty(value, "enabled") ||
                typeof value.enabled !== "boolean") {
                throw new Error(`Expected a boolean (html.enabled), but got ${util_1.default.inspect(value)}`);
            }
            let output;
            if (hasOwnProperty(value, "output")) {
                if ((0, type_guards_1.isString)(value.output)) {
                    output = value.output;
                }
                else {
                    throw new Error(`Expected a string (html.output), but got ${util_1.default.inspect(value)}`);
                }
            }
            const messagesConfig = {
                enabled: value.enabled,
                output,
            };
            return { [key]: messagesConfig };
        }
        case "filterSpecs": {
            if (!(0, type_guards_1.isBoolean)(value)) {
                throw new Error(`Expected a boolean (filterSpecs), but got ${util_1.default.inspect(value)}`);
            }
            return { [key]: value };
        }
        case "omitFiltered": {
            if (!(0, type_guards_1.isBoolean)(value)) {
                throw new Error(`Expected a boolean (omitFiltered), but got ${util_1.default.inspect(value)}`);
            }
            return { [key]: value };
        }
        default:
            return {};
    }
}
function validateEnvironmentOverrides(environment) {
    const overrides = {};
    if (hasOwnProperty(environment, "stepDefinitions")) {
        const { stepDefinitions } = environment;
        if ((0, type_guards_1.isStringOrStringArray)(stepDefinitions)) {
            overrides.stepDefinitions = stepDefinitions;
        }
        else {
            throw new Error(`Expected a string or array of strings (stepDefinitions), but got ${util_1.default.inspect(stepDefinitions)}`);
        }
    }
    if (hasOwnProperty(environment, "messagesEnabled")) {
        const { messagesEnabled } = environment;
        if ((0, type_guards_1.isBoolean)(messagesEnabled)) {
            overrides.messagesEnabled = messagesEnabled;
        }
        else if ((0, type_guards_1.isString)(messagesEnabled)) {
            overrides.messagesEnabled = stringToMaybeBoolean(messagesEnabled);
        }
        else {
            throw new Error(`Expected a boolean (messagesEnabled), but got ${util_1.default.inspect(messagesEnabled)}`);
        }
    }
    if (hasOwnProperty(environment, "messagesOutput")) {
        const { messagesOutput } = environment;
        if ((0, type_guards_1.isString)(messagesOutput)) {
            overrides.messagesOutput = messagesOutput;
        }
        else {
            throw new Error(`Expected a string (messagesOutput), but got ${util_1.default.inspect(messagesOutput)}`);
        }
    }
    if (hasOwnProperty(environment, "jsonEnabled")) {
        const { jsonEnabled } = environment;
        if ((0, type_guards_1.isBoolean)(jsonEnabled)) {
            overrides.jsonEnabled = jsonEnabled;
        }
        else if ((0, type_guards_1.isString)(jsonEnabled)) {
            overrides.jsonEnabled = stringToMaybeBoolean(jsonEnabled);
        }
        else {
            throw new Error(`Expected a boolean (jsonEnabled), but got ${util_1.default.inspect(jsonEnabled)}`);
        }
    }
    if (hasOwnProperty(environment, "jsonOutput")) {
        const { jsonOutput } = environment;
        if ((0, type_guards_1.isString)(jsonOutput)) {
            overrides.jsonOutput = jsonOutput;
        }
        else {
            throw new Error(`Expected a string (jsonOutput), but got ${util_1.default.inspect(jsonOutput)}`);
        }
    }
    if (hasOwnProperty(environment, "htmlEnabled")) {
        const { htmlEnabled } = environment;
        if ((0, type_guards_1.isBoolean)(htmlEnabled)) {
            overrides.htmlEnabled = htmlEnabled;
        }
        else if ((0, type_guards_1.isString)(htmlEnabled)) {
            overrides.htmlEnabled = stringToMaybeBoolean(htmlEnabled);
        }
        else {
            throw new Error(`Expected a boolean (htmlEnabled), but got ${util_1.default.inspect(htmlEnabled)}`);
        }
    }
    if (hasOwnProperty(environment, "htmlOutput")) {
        const { htmlOutput } = environment;
        if ((0, type_guards_1.isString)(htmlOutput)) {
            overrides.htmlOutput = htmlOutput;
        }
        else {
            throw new Error(`Expected a string (htmlOutput), but got ${util_1.default.inspect(htmlOutput)}`);
        }
    }
    if (hasOwnProperty(environment, "filterSpecs")) {
        const { filterSpecs } = environment;
        if ((0, type_guards_1.isBoolean)(filterSpecs)) {
            overrides.filterSpecs = filterSpecs;
        }
        else if ((0, type_guards_1.isString)(filterSpecs)) {
            overrides.filterSpecs = stringToMaybeBoolean(filterSpecs);
        }
        else {
            throw new Error(`Expected a boolean (filterSpecs), but got ${util_1.default.inspect(filterSpecs)}`);
        }
    }
    if (hasOwnProperty(environment, "omitFiltered")) {
        const { omitFiltered } = environment;
        if ((0, type_guards_1.isBoolean)(omitFiltered)) {
            overrides.omitFiltered = omitFiltered;
        }
        else if ((0, type_guards_1.isString)(omitFiltered)) {
            overrides.omitFiltered = stringToMaybeBoolean(omitFiltered);
        }
        else {
            throw new Error(`Expected a boolean (omitFiltered), but got ${util_1.default.inspect(omitFiltered)}`);
        }
    }
    return overrides;
}
function stringToMaybeBoolean(value) {
    if (value === "") {
        return;
    }
    const falsyValues = ["0", "false"];
    if (falsyValues.includes(value)) {
        return false;
    }
    else {
        return true;
    }
}
exports.stringToMaybeBoolean = stringToMaybeBoolean;
exports.DEFAULT_STEP_DEFINITIONS = [
    "[integration-directory]/[filepath]/**/*.{js,mjs,ts,tsx}",
    "[integration-directory]/[filepath].{js,mjs,ts,tsx}",
    "cypress/support/step_definitions/**/*.{js,mjs,ts,tsx}",
];
class PreprocessorConfiguration {
    constructor(explicitValues, environmentOverrides, cypressConfiguration, implicitIntegrationFolder) {
        this.explicitValues = explicitValues;
        this.environmentOverrides = environmentOverrides;
        this.cypressConfiguration = cypressConfiguration;
        this.implicitIntegrationFolder = implicitIntegrationFolder;
    }
    get stepDefinitions() {
        var _a;
        const explicit = (_a = this.environmentOverrides.stepDefinitions) !== null && _a !== void 0 ? _a : this.explicitValues.stepDefinitions;
        if (explicit) {
            return explicit;
        }
        const config = this.cypressConfiguration;
        return exports.DEFAULT_STEP_DEFINITIONS.map((pattern) => pattern.replace("[integration-directory]", (0, paths_1.ensureIsRelative)(config.projectRoot, "integrationFolder" in config
            ? config.integrationFolder
            : this.implicitIntegrationFolder)));
    }
    get messages() {
        var _a, _b, _c, _d, _e, _f;
        return {
            enabled: this.json.enabled ||
                this.html.enabled ||
                ((_c = (_a = this.environmentOverrides.messagesEnabled) !== null && _a !== void 0 ? _a : (_b = this.explicitValues.messages) === null || _b === void 0 ? void 0 : _b.enabled) !== null && _c !== void 0 ? _c : false),
            output: (_f = (_d = this.environmentOverrides.messagesOutput) !== null && _d !== void 0 ? _d : (_e = this.explicitValues.messages) === null || _e === void 0 ? void 0 : _e.output) !== null && _f !== void 0 ? _f : "cucumber-messages.ndjson",
        };
    }
    get json() {
        var _a, _b, _c, _d, _e;
        return {
            enabled: (_c = (_a = this.environmentOverrides.jsonEnabled) !== null && _a !== void 0 ? _a : (_b = this.explicitValues.json) === null || _b === void 0 ? void 0 : _b.enabled) !== null && _c !== void 0 ? _c : false,
            output: (_d = this.environmentOverrides.jsonOutput) !== null && _d !== void 0 ? _d : (((_e = this.explicitValues.json) === null || _e === void 0 ? void 0 : _e.output) || "cucumber-report.json"),
        };
    }
    get html() {
        var _a, _b, _c, _d, _e, _f;
        return {
            enabled: (_c = (_a = this.environmentOverrides.htmlEnabled) !== null && _a !== void 0 ? _a : (_b = this.explicitValues.html) === null || _b === void 0 ? void 0 : _b.enabled) !== null && _c !== void 0 ? _c : false,
            output: (_f = (_d = this.environmentOverrides.htmlOutput) !== null && _d !== void 0 ? _d : (_e = this.explicitValues.html) === null || _e === void 0 ? void 0 : _e.output) !== null && _f !== void 0 ? _f : "cucumber-report.html",
        };
    }
    get filterSpecs() {
        var _a, _b;
        return ((_b = (_a = this.environmentOverrides.filterSpecs) !== null && _a !== void 0 ? _a : this.explicitValues.filterSpecs) !== null && _b !== void 0 ? _b : false);
    }
    get omitFiltered() {
        var _a, _b;
        return ((_b = (_a = this.environmentOverrides.omitFiltered) !== null && _a !== void 0 ? _a : this.explicitValues.omitFiltered) !== null && _b !== void 0 ? _b : false);
    }
}
exports.PreprocessorConfiguration = PreprocessorConfiguration;
async function cosmiconfigResolver(projectRoot) {
    const result = await (0, cosmiconfig_1.cosmiconfig)("cypress-cucumber-preprocessor").search(projectRoot);
    return result === null || result === void 0 ? void 0 : result.config;
}
async function resolve(cypressConfig, environment, implicitIntegrationFolder, configurationFileResolver = cosmiconfigResolver) {
    const result = await configurationFileResolver(cypressConfig.projectRoot);
    const environmentOverrides = validateEnvironmentOverrides(environment);
    if (result) {
        if (typeof result !== "object" || result == null) {
            throw new Error(`Malformed configuration, expected an object, but got ${util_1.default.inspect(result)}`);
        }
        const config = Object.assign({}, ...Object.entries(result).map((entry) => validateConfigurationEntry(...entry)));
        (0, debug_1.default)(`resolved configuration ${util_1.default.inspect(config)}`);
        return new PreprocessorConfiguration(config, environmentOverrides, cypressConfig, implicitIntegrationFolder);
    }
    else {
        (0, debug_1.default)("resolved no configuration");
        return new PreprocessorConfiguration({}, environmentOverrides, cypressConfig, implicitIntegrationFolder);
    }
}
exports.resolve = resolve;
