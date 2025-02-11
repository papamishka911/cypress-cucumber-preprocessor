"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegistry = exports.freeRegistry = exports.assignRegistry = exports.withRegistry = exports.Registry = exports.MultipleDefinitionsError = exports.MissingDefinitionError = void 0;
const cucumber_expressions_1 = require("@cucumber/cucumber-expressions");
const tag_expressions_1 = __importDefault(require("@cucumber/tag-expressions"));
const uuid_1 = require("uuid");
const assertions_1 = require("./assertions");
const error_1 = require("./error");
const source_map_1 = require("./source-map");
class MissingDefinitionError extends error_1.CypressCucumberError {
}
exports.MissingDefinitionError = MissingDefinitionError;
class MultipleDefinitionsError extends error_1.CypressCucumberError {
}
exports.MultipleDefinitionsError = MultipleDefinitionsError;
const noopNode = { evaluate: () => true };
function parseHookArguments(options, fn, keyword, position) {
    return {
        id: (0, uuid_1.v4)(),
        node: options.tags ? (0, tag_expressions_1.default)(options.tags) : noopNode,
        implementation: fn,
        keyword,
        position,
    };
}
class Registry {
    constructor(experimentalSourceMap) {
        this.experimentalSourceMap = experimentalSourceMap;
        this.preliminaryStepDefinitions = [];
        this.stepDefinitions = [];
        this.beforeHooks = [];
        this.afterHooks = [];
        this.defineStep = this.defineStep.bind(this);
        this.runStepDefininition = this.runStepDefininition.bind(this);
        this.defineParameterType = this.defineParameterType.bind(this);
        this.defineBefore = this.defineBefore.bind(this);
        this.defineAfter = this.defineAfter.bind(this);
        this.parameterTypeRegistry = new cucumber_expressions_1.ParameterTypeRegistry();
    }
    finalize() {
        for (const { description, implementation, position } of this
            .preliminaryStepDefinitions) {
            if (typeof description === "string") {
                this.stepDefinitions.push({
                    expression: new cucumber_expressions_1.CucumberExpression(description, this.parameterTypeRegistry),
                    implementation,
                    position,
                });
            }
            else {
                this.stepDefinitions.push({
                    expression: new cucumber_expressions_1.RegularExpression(description, this.parameterTypeRegistry),
                    implementation,
                    position,
                });
            }
        }
    }
    defineStep(description, implementation) {
        if (typeof description !== "string" && !(description instanceof RegExp)) {
            throw new Error("Unexpected argument for step definition");
        }
        this.preliminaryStepDefinitions.push({
            description,
            implementation,
            position: (0, source_map_1.maybeRetrievePositionFromSourceMap)(this.experimentalSourceMap),
        });
    }
    defineParameterType({ name, regexp, transformer, }) {
        this.parameterTypeRegistry.defineParameterType(new cucumber_expressions_1.ParameterType(name, regexp, null, transformer, true, false));
    }
    defineBefore(options, fn) {
        this.beforeHooks.push(parseHookArguments(options, fn, "Before", (0, source_map_1.maybeRetrievePositionFromSourceMap)(this.experimentalSourceMap)));
    }
    defineAfter(options, fn) {
        this.afterHooks.push(parseHookArguments(options, fn, "After", (0, source_map_1.maybeRetrievePositionFromSourceMap)(this.experimentalSourceMap)));
    }
    getMatchingStepDefinitions(text) {
        return this.stepDefinitions.filter((stepDefinition) => stepDefinition.expression.match(text));
    }
    resolveStepDefintion(text) {
        const matchingStepDefinitions = this.getMatchingStepDefinitions(text);
        if (matchingStepDefinitions.length === 0) {
            throw new MissingDefinitionError(`Step implementation missing for: ${text}`);
        }
        else if (matchingStepDefinitions.length > 1) {
            throw new MultipleDefinitionsError(`Multiple matching step definitions for: ${text}\n` +
                matchingStepDefinitions
                    .map((stepDefinition) => {
                    const { expression } = stepDefinition;
                    const stringExpression = expression instanceof cucumber_expressions_1.RegularExpression
                        ? String(expression.regexp)
                        : expression.source;
                    if (stepDefinition.position) {
                        return ` ${stringExpression} - ${stepDefinition.position.source}:${stepDefinition.position.line}`;
                    }
                    else {
                        return ` ${stringExpression}`;
                    }
                })
                    .join("\n"));
        }
        else {
            return matchingStepDefinitions[0];
        }
    }
    runStepDefininition(world, text, argument) {
        const stepDefinition = this.resolveStepDefintion(text);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const args = stepDefinition.expression
            .match(text)
            .map((match) => match.getValue(world));
        if (argument) {
            args.push(argument);
        }
        return stepDefinition.implementation.apply(world, args);
    }
    resolveBeforeHooks(tags) {
        return this.beforeHooks.filter((beforeHook) => beforeHook.node.evaluate(tags));
    }
    resolveAfterHooks(tags) {
        return this.afterHooks.filter((beforeHook) => beforeHook.node.evaluate(tags));
    }
    runHook(world, hook) {
        hook.implementation.call(world);
    }
}
exports.Registry = Registry;
const globalPropertyName = "__cypress_cucumber_preprocessor_registry_dont_use_this";
function withRegistry(experimentalSourceMap, fn) {
    const registry = new Registry(experimentalSourceMap);
    assignRegistry(registry);
    fn();
    freeRegistry();
    return registry;
}
exports.withRegistry = withRegistry;
function assignRegistry(registry) {
    globalThis[globalPropertyName] = registry;
}
exports.assignRegistry = assignRegistry;
function freeRegistry() {
    delete globalThis[globalPropertyName];
}
exports.freeRegistry = freeRegistry;
function getRegistry() {
    return (0, assertions_1.assertAndReturn)(globalThis[globalPropertyName], "Expected to find a global registry (this usually means you are trying to define steps or hooks in support/e2e.js, which is not supported)");
}
exports.getRegistry = getRegistry;
