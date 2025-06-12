import { Config } from './types';
export declare class TwmapProcessor {
    private config;
    private fileParser;
    private classGenerator;
    private cssGenerator;
    private mappings;
    private dryRun;
    constructor(config: Config, dryRun?: boolean);
    process(): Promise<void>;
    private findFiles;
    private parseFiles;
    private generateMappings;
    private updateSourceFiles;
    private generateCSSFile;
    getMappings(): Map<string, string>;
    reset(): void;
}
