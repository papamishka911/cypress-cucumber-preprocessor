# https://github.com/badeball/cypress-cucumber-preprocessor/issues/908

Feature: hide internals from cypress environment
  Scenario:
    And a file named "cypress/e2e/a.feature" with:
      """
      Feature: a feature
        Scenario: hide internal state by default
          Then the visible internal state should be a mere reference
      """
    And a file named "cypress/support/step_definitions/steps.js" with:
      """
      const { Then } = require("@badeball/cypress-cucumber-preprocessor");
      const { INTERNAL_SPEC_PROPERTIES } = require("@badeball/cypress-cucumber-preprocessor/lib/constants");
      // From https://github.com/rfrench/chai-uuid/blob/master/index.js.
      const UUID_V4_EXPR = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
      Then("the visible internal state should be a mere reference", () => {
        const properties = Cypress.env(INTERNAL_SPEC_PROPERTIES);
        expect(properties).to.be.a("string");
        expect(properties).to.match(UUID_V4_EXPR);
      });
      """
    When I run cypress
    Then it passes
