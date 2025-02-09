/// <reference types="cypress" />
/// <reference types="cypress" />
import { ICypressConfiguration } from "@badeball/cypress-configuration";
import { INTERNAL_PROPERTY_NAME } from "./constants";
/**
 * Work-around for the fact that some Cypress versions pre v10 were missing this property in their types.
 */
declare global {
    namespace Cypress {
        interface PluginConfigOptions {
            testFiles: string[];
        }
    }
}
export declare function beforeRunHandler(config: Cypress.PluginConfigOptions): Promise<void>;
export declare function afterRunHandler(config: Cypress.PluginConfigOptions): Promise<void>;
export declare function beforeSpecHandler(_config: Cypress.PluginConfigOptions): Promise<void>;
export declare function afterSpecHandler(config: Cypress.PluginConfigOptions, spec: Cypress.Spec, results: CypressCommandLine.RunResult): Promise<void>;
export declare function afterScreenshotHandler(config: Cypress.PluginConfigOptions, details: Cypress.ScreenshotDetails): Promise<Cypress.ScreenshotDetails>;
type AddOptions = {
    omitBeforeRunHandler?: boolean;
    omitAfterRunHandler?: boolean;
    omitBeforeSpecHandler?: boolean;
    omitAfterSpecHandler?: boolean;
    omitAfterScreenshotHandler?: boolean;
};
type PreservedPluginConfigOptions = ICypressConfiguration & {
    [INTERNAL_PROPERTY_NAME]?: Partial<ICypressConfiguration>;
};
export declare function mutateConfigObjectPreservingly<K extends keyof ICypressConfiguration>(config: PreservedPluginConfigOptions, property: K, value: PreservedPluginConfigOptions[K]): void;
export declare function rebuildOriginalConfigObject(config: PreservedPluginConfigOptions): ICypressConfiguration;
export default function addCucumberPreprocessorPlugin(on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions, options?: AddOptions): Promise<Cypress.PluginConfigOptions>;
export {};
