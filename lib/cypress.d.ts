/// <reference types="cypress" />
/// <reference types="cypress" />
export declare function runStepWithLogGroup(options: {
    fn: () => unknown;
    keyword: string;
    text?: string;
}): Cypress.Chainable<unknown>;
