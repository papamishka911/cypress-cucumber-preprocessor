"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOOK_FAILURE_EXPR = exports.INTERNAL_SUITE_PROPERTIES = exports.INTERNAL_SPEC_PROPERTIES = exports.INTERNAL_PROPERTY_NAME = exports.TASK_CREATE_STRING_ATTACHMENT = exports.TASK_TEST_STEP_STARTED = exports.TASK_TEST_CASE_STARTED = exports.TASK_APPEND_MESSAGES = void 0;
exports.TASK_APPEND_MESSAGES = "cypress-cucumber-preprocessor:append-messages";
exports.TASK_TEST_CASE_STARTED = "cypress-cucumber-preprocessor:test-case-started";
exports.TASK_TEST_STEP_STARTED = "cypress-cucumber-preprocessor:test-step-started";
exports.TASK_CREATE_STRING_ATTACHMENT = "cypress-cucumber-preprocessor:create-string-attachment";
exports.INTERNAL_PROPERTY_NAME = "__cypress_cucumber_preprocessor_dont_use_this";
exports.INTERNAL_SPEC_PROPERTIES = exports.INTERNAL_PROPERTY_NAME + "_spec";
exports.INTERNAL_SUITE_PROPERTIES = exports.INTERNAL_PROPERTY_NAME + "_suite";
exports.HOOK_FAILURE_EXPR = /Because this error occurred during a `[^`]+` hook we are skipping all of the remaining tests\./;
