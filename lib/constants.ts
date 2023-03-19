export const TASK_APPEND_MESSAGES =
  "cypress-cucumber-preprocessor:append-messages";

export const TASK_TEST_CASE_STARTED =
  "cypress-cucumber-preprocessor:test-case-started";

export const TASK_TEST_STEP_STARTED =
  "cypress-cucumber-preprocessor:test-step-started";

export const TASK_CREATE_STRING_ATTACHMENT =
  "cypress-cucumber-preprocessor:create-string-attachment";

export const INTERNAL_PROPERTY_NAME =
  "__cypress_cucumber_preprocessor_dont_use_this";

export const INTERNAL_SPEC_PROPERTIES = INTERNAL_PROPERTY_NAME + "_spec";

export const INTERNAL_SUITE_PROPERTIES = INTERNAL_PROPERTY_NAME + "_suite";

export const HOOK_FAILURE_EXPR =
  /Because this error occurred during a `[^`]+` hook we are skipping all of the remaining tests\./;
