#!/usr/bin/env node
/// <reference types="cypress" />
/// <reference types="node" />
import { Expression } from "@cucumber/cucumber-expressions";
import { Position } from "../source-map";
import { IStepDefinition } from "../registry";
import { AmbiguousStep, DiagnosticResult, UnmatchedStep } from "./diagnose";
export declare function log(...lines: string[]): void;
export declare function red(message: string): string;
export declare function yellow(message: string): string;
export declare function expressionToString(expression: Expression): string;
export declare function strictCompare<T>(a: T, b: T): boolean;
export declare function comparePosition(a: Position, b: Position): boolean;
export declare function compareStepDefinition(a: IStepDefinition<unknown[], Mocha.Context>, b: IStepDefinition<unknown[], Mocha.Context>): boolean;
export declare function position(definition: IStepDefinition<unknown[], Mocha.Context>): Position;
export declare function groupToMap<T, K>(collection: T[], getKeyFn: (el: T) => K, compareKeyFn: (a: K, b: K) => boolean): Map<K, T[]>;
export declare function mapValues<K, A, B>(map: Map<K, A>, fn: (el: A) => B): Map<K, B>;
export declare function createLineBuffer(fn: (append: (string: string) => void) => void): string[];
export declare function createDefinitionsUsage(projectRoot: string, result: DiagnosticResult): string;
export declare function createAmbiguousStep(projectRoot: string, ambiguousStep: AmbiguousStep): string[];
export declare function createUnmatchedStep(projectRoot: string, unmatch: UnmatchedStep): string[];
export declare function execute(options: {
    argv: string[];
    env: NodeJS.ProcessEnv;
    cwd: string;
}): Promise<void>;
