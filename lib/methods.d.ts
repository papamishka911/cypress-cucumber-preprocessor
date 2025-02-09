/// <reference types="cypress" />
import DataTable from "./data_table";
import { IHookBody, IParameterTypeDefinition, IStepDefinitionBody } from "./types";
declare function defineStep<T extends unknown[], C extends Mocha.Context>(description: string | RegExp, implementation: IStepDefinitionBody<T, C>): void;
declare function runStepDefininition(world: Mocha.Context, text: string, argument?: DataTable | string): void;
declare function defineParameterType<T, C extends Mocha.Context>(options: IParameterTypeDefinition<T, C>): void;
declare function defineBefore(options: {
    tags?: string;
}, fn: IHookBody): void;
declare function defineBefore(fn: IHookBody): void;
declare function defineAfter(options: {
    tags?: string;
}, fn: IHookBody): void;
declare function defineAfter(fn: IHookBody): void;
export declare function attach(data: string | ArrayBuffer, mediaType?: string): void;
declare function isFeature(): boolean;
export declare const NOT_FEATURE_ERROR = "Expected to find internal properties, but didn't. This is likely because you're calling doesFeatureMatch() in a non-feature spec. Use doesFeatureMatch() in combination with isFeature() if you have both feature and non-feature specs";
declare function doesFeatureMatch(expression: string): boolean;
export { isFeature, doesFeatureMatch, defineStep as Given, defineStep as When, defineStep as Then, defineStep, runStepDefininition as Step, defineParameterType, defineBefore as Before, defineAfter as After, };
