import { glob } from 'glob';
import { Config, ClassMapping, ParseResult } from './types';
import { FileParser } from './parser';
import { ClassNameGenerator } from './generator';
import { CSSGenerator } from './css-generator';
import * as path from 'path';

export class TwmapProcessor {
  private config: Config;
  private fileParser: FileParser;
  private classGenerator: ClassNameGenerator;
  private cssGenerator: CSSGenerator;
  private mappings = new Map<string, string>();
  private dryRun: boolean;

  // dryRun: if true, do not write files, just print what would change
  constructor(config: Config, dryRun = false) {
    this.config = config;
    this.fileParser = dryRun ? new FileParser(true) : new FileParser();
    this.classGenerator = new ClassNameGenerator(config);
    this.cssGenerator = new CSSGenerator();
    this.dryRun = dryRun;
  }

  async process(): Promise<void> {
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

  private async findFiles(): Promise<string[]> {
    const allFiles = new Set<string>();

    for (const pattern of this.config.input) {
      try {
        const matches = await glob(pattern, {
          ignore: this.config.ignore,
          absolute: true
        });
        
        matches.forEach(file => allFiles.add(file));
      } catch (error) {
        console.warn(`Warning: Could not process glob pattern "${pattern}":`, error);
      }
    }

    return Array.from(allFiles);
  }

  private async parseFiles(files: string[]): Promise<ParseResult[]> {
    const results: ParseResult[] = [];

    for (const file of files) {
      const result = await this.fileParser.parseFile(file);
      results.push(result);
      
      if (result.success) {
        process.stdout.write('.');
      } else {
        process.stdout.write('✗');
      }
    }
    
    console.log(); // New line after progress dots
    return results;
  }

  private generateMappings(parseResults: ParseResult[]): void {
    const allClassNames = new Set<string>();

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
  private async updateSourceFiles(parseResults: ParseResult[]): Promise<void> {
    for (const result of parseResults) {
      if (result.classNames.length > 0) {
        try {
          this.fileParser.replaceClassNamesInFile(result.filePath, this.mappings, this.dryRun);
          process.stdout.write(this.dryRun ? 'd' : '.');
        } catch (error) {
          console.warn(`Failed to update file ${result.filePath}:`, error);
          process.stdout.write('✗');
        }
      }
    }
    console.log(); // New line after progress dots
  }

  private generateCSSFile(): void {
    if (this.dryRun) {
      console.log('Dry run: CSS file would be generated at', this.config.output);
      return;
    }
    const classMappings: ClassMapping[] = Array.from(this.mappings.entries()).map(([original, generated]) => ({
      original,
      generated
    }));
    this.cssGenerator.generateCSS(classMappings, this.config.output);
  }

  getMappings(): Map<string, string> {
    return new Map(this.mappings);
  }

  reset(): void {
    this.mappings.clear();
    this.classGenerator.reset();
  }
}
