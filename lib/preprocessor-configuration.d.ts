import { ICypressConfiguration } from "@badeball/cypress-configuration";
export declare function stringToMaybeBoolean(value: string): boolean | undefined;
export interface IPreprocessorConfiguration {
    readonly stepDefinitions: string | string[];
    readonly messages?: {
        enabled: boolean;
        output?: string;
    };
    readonly json?: {
        enabled: boolean;
        output?: string;
    };
    readonly html?: {
        enabled: boolean;
        output?: string;
    };
    readonly filterSpecs?: boolean;
    readonly omitFiltered?: boolean;
    readonly implicitIntegrationFolder: string;
}
export interface IEnvironmentOverrides {
    stepDefinitions?: string | string[];
    messagesEnabled?: boolean;
    messagesOutput?: string;
    jsonEnabled?: boolean;
    jsonOutput?: string;
    htmlEnabled?: boolean;
    htmlOutput?: string;
    filterSpecs?: boolean;
    omitFiltered?: boolean;
}
export declare const DEFAULT_STEP_DEFINITIONS: string[];
export declare class PreprocessorConfiguration implements IPreprocessorConfiguration {
    private explicitValues;
    private environmentOverrides;
    private cypressConfiguration;
    implicitIntegrationFolder: string;
    constructor(explicitValues: Partial<IPreprocessorConfiguration>, environmentOverrides: IEnvironmentOverrides, cypressConfiguration: ICypressConfiguration, implicitIntegrationFolder: string);
    get stepDefinitions(): string | string[];
    get messages(): {
        enabled: boolean;
        output: string;
    };
    get json(): {
        enabled: boolean;
        output: string;
    };
    get html(): {
        enabled: boolean;
        output: string;
    };
    get filterSpecs(): boolean;
    get omitFiltered(): boolean;
}
export type ConfigurationFileResolver = (projectRoot: string) => unknown | Promise<unknown>;
export declare function resolve(cypressConfig: ICypressConfiguration, environment: Record<string, unknown>, implicitIntegrationFolder: string, configurationFileResolver?: ConfigurationFileResolver): Promise<PreprocessorConfiguration>;
