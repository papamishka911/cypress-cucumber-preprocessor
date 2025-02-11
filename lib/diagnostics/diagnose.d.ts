/// <reference types="cypress" />
import { ICypressConfiguration } from "@badeball/cypress-configuration";
import { Expression, ParameterTypeRegistry } from "@cucumber/cucumber-expressions";
import { IPreprocessorConfiguration } from "../preprocessor-configuration";
import { IStepDefinition } from "../registry";
import { Position } from "../source-map";
export interface DiagnosticStep {
    source: string;
    line: number;
    text: string;
}
export interface UnmatchedStep {
    step: DiagnosticStep;
    argument: "docString" | "dataTable" | null;
    parameterTypeRegistry: ParameterTypeRegistry;
    stepDefinitionHints: {
        stepDefinitions: string[];
        stepDefinitionPatterns: string[];
        stepDefinitionPaths: string[];
    };
}
export interface AmbiguousStep {
    step: DiagnosticStep;
    definitions: IStepDefinition<unknown[], Mocha.Context>[];
}
export interface DiagnosticResult {
    definitionsUsage: {
        definition: IStepDefinition<unknown[], Mocha.Context>;
        steps: DiagnosticStep[];
    }[];
    unmatchedSteps: UnmatchedStep[];
    ambiguousSteps: AmbiguousStep[];
}
export declare function expressionToString(expression: Expression): string;
export declare function strictCompare<T>(a: T, b: T): boolean;
export declare function comparePosition(a: Position, b: Position): boolean;
export declare function compareStepDefinition(a: IStepDefinition<unknown[], Mocha.Context>, b: IStepDefinition<unknown[], Mocha.Context>): boolean;
export declare function position(definition: IStepDefinition<unknown[], Mocha.Context>): Position;
export declare function diagnose(configuration: {
    cypress: ICypressConfiguration;
    preprocessor: IPreprocessorConfiguration;
}): Promise<DiagnosticResult>;
