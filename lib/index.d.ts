/// <reference types="cypress" />
import messages from "@cucumber/messages";
import DataTable from "./data_table";
import { IHookBody, IParameterTypeDefinition, IStepDefinitionBody } from "./types";
declare global {
    interface Window {
        testState: {
            gherkinDocument: messages.GherkinDocument;
            pickles: messages.Pickle[];
            pickle: messages.Pickle;
            pickleStep?: messages.PickleStep;
        };
    }
}
export { resolve as resolvePreprocessorConfiguration } from "./preprocessor-configuration";
export { getStepDefinitionPatterns, getStepDefinitionPaths, } from "./step-definitions";
export { default as addCucumberPreprocessorPlugin, beforeRunHandler, afterRunHandler, beforeSpecHandler, afterSpecHandler, afterScreenshotHandler, } from "./add-cucumber-preprocessor-plugin";
export { NOT_FEATURE_ERROR } from "./methods";
export declare function isFeature(): boolean;
export declare function doesFeatureMatch(expression: string): boolean;
export declare function defineStep<T extends unknown[], C extends Mocha.Context>(description: string | RegExp, implementation: IStepDefinitionBody<T, C>): void;
export { defineStep as Given, defineStep as When, defineStep as Then };
export declare function Step(world: Mocha.Context, text: string, argument?: DataTable | string): void;
export declare function defineParameterType<T, C extends Mocha.Context>(options: IParameterTypeDefinition<T, C>): void;
export declare function attach(data: string | ArrayBuffer, mediaType?: string): void;
export declare function Before(options: {
    tags?: string;
}, fn: IHookBody): void;
export declare function Before(fn: IHookBody): void;
export declare function After(options: {
    tags?: string;
}, fn: IHookBody): void;
export declare function After(fn: IHookBody): void;
export { default as DataTable } from "./data_table";
