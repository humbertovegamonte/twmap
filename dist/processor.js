"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwmapProcessor = void 0;
const glob_1 = require("glob");
const parser_1 = require("./parser");
const generator_1 = require("./generator");
const css_generator_1 = require("./css-generator");
class TwmapProcessor {
    // dryRun: if true, do not write files, just print what would change
    constructor(config, dryRun = false) {
        this.mappings = new Map();
        this.config = config;
        this.fileParser = dryRun ? new parser_1.FileParser(true) : new parser_1.FileParser();
        this.classGenerator = new generator_1.ClassNameGenerator(config);
        this.cssGenerator = new css_generator_1.CSSGenerator();
        this.dryRun = dryRun;
    }
    async process() {
        console.log('🔍 Scanning files...');
        const files = await this.findFiles();
        console.log(`📁 Found ${files.length} files to process`);
        console.log('🎨 Parsing class names...');
        const parseResults = await this.parseFiles(files);
        const successfulParses = parseResults.filter(r => r.success);
        const failedParses = parseResults.filter(r => !r.success);
        if (failedParses.length > 0) {
            console.warn(`⚠️  Failed to parse ${failedParses.length} files:`);
            failedParses.forEach(result => {
                console.warn(`   ${result.filePath}: ${result.error}`);
            });
        }
        console.log('🔄 Generating class mappings...');
        this.generateMappings(successfulParses);
        console.log('📝 Updating source files...');
        await this.updateSourceFiles(successfulParses);
        console.log('📦 Generating CSS file...');
        this.generateCSSFile();
        const stats = this.cssGenerator.generateStats(Array.from(this.mappings.entries()).map(([original, generated]) => ({ original, generated })));
        console.log(stats);
        console.log(`✅ Process completed! CSS file generated at: ${this.config.output}`);
    }
    async findFiles() {
        const allFiles = new Set();
        for (const pattern of this.config.input) {
            try {
                const matches = await (0, glob_1.glob)(pattern, {
                    ignore: this.config.ignore,
                    absolute: true
                });
                matches.forEach(file => allFiles.add(file));
            }
            catch (error) {
                console.warn(`Warning: Could not process glob pattern "${pattern}":`, error);
            }
        }
        return Array.from(allFiles);
    }
    async parseFiles(files) {
        const results = [];
        for (const file of files) {
            const result = await this.fileParser.parseFile(file);
            results.push(result);
            if (result.success) {
                process.stdout.write('.');
            }
            else {
                process.stdout.write('✗');
            }
        }
        console.log(); // New line after progress dots
        return results;
    }
    generateMappings(parseResults) {
        const allClassNames = new Set();
        // Collect all unique class name combinations
        parseResults.forEach(result => {
            result.classNames.forEach(className => {
                allClassNames.add(className);
            });
        });
        // Generate mappings for each unique class combination
        allClassNames.forEach(className => {
            if (!this.mappings.has(className)) {
                const generatedName = this.classGenerator.generateClassName(className);
                this.mappings.set(className, generatedName);
            }
        });
        console.log(`🎯 Generated ${this.mappings.size} unique class mappings`);
    }
    // If dryRun is true, print 'd' for each file that would be changed instead of writing.
    async updateSourceFiles(parseResults) {
        for (const result of parseResults) {
            if (result.classNames.length > 0) {
                try {
                    this.fileParser.replaceClassNamesInFile(result.filePath, this.mappings, this.dryRun);
                    process.stdout.write(this.dryRun ? 'd' : '.');
                }
                catch (error) {
                    console.warn(`Failed to update file ${result.filePath}:`, error);
                    process.stdout.write('✗');
                }
            }
        }
        console.log(); // New line after progress dots
    }
    generateCSSFile() {
        if (this.dryRun) {
            console.log('Dry run: CSS file would be generated at', this.config.output);
            return;
        }
        const classMappings = Array.from(this.mappings.entries()).map(([original, generated]) => ({
            original,
            generated
        }));
        this.cssGenerator.generateCSS(classMappings, this.config.output);
    }
    getMappings() {
        return new Map(this.mappings);
    }
    reset() {
        this.mappings.clear();
        this.classGenerator.reset();
    }
}
exports.TwmapProcessor = TwmapProcessor;
