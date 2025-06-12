#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const config_1 = require("./config");
const processor_1 = require("./processor");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
async function main() {
    commander_1.program
        .name('twmap')
        .description('Extract and optimize Tailwind utility classes')
        .version('1.0.0')
        .option('-c, --config <path>', 'path to config file')
        .option('-i, --input <patterns...>', 'input file patterns')
        .option('-o, --output <path>', 'output CSS file path')
        .option('-m, --mode <mode>', 'class name generation mode (hash|incremental|readable)')
        .option('-p, --prefix <prefix>', 'prefix for generated class names')
        .option('--dry-run', 'preview changes without modifying files')
        .option('--init', 'create a sample config file')
        .parse();
    const options = commander_1.program.opts();
    // Handle init command
    if (options.init) {
        createSampleConfig();
        return;
    }
    try {
        // Load configuration
        let config = (0, config_1.loadConfig)(options.config);
        // Override config with CLI options
        if (options.input)
            config.input = options.input;
        if (options.output)
            config.output = options.output;
        if (options.mode)
            config.mode = options.mode;
        if (options.prefix)
            config.prefix = options.prefix;
        // Validate configuration
        (0, config_1.validateConfig)(config);
        console.log('🚀 Starting twmap process...');
        console.log(`📋 Config: ${JSON.stringify(config, null, 2)}`);
        if (options.dryRun) {
            console.log('🔍 Dry run mode - no files will be modified');
            // Run processor in dry-run mode
            const processor = new processor_1.TwmapProcessor(config, true);
            await processor.process();
            return;
        }
        // Create processor and run
        const processor = new processor_1.TwmapProcessor(config);
        await processor.process();
    }
    catch (error) {
        console.error('❌ Error:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
function createSampleConfig() {
    const configPath = path.join(process.cwd(), 'twmap.config.js');
    if (fs.existsSync(configPath)) {
        console.log('⚠️  Config file already exists at:', configPath);
        return;
    }
    const sampleConfig = `module.exports = {
  // Input file patterns to scan for class names
  input: [
    './src/**/*.{tsx,jsx,html}',
    './components/**/*.{tsx,jsx}',
  ],
  
  // Output path for the generated CSS file
  output: './twmap.css',
  
  // Class name generation mode
  // 'hash' - generates short hash-based names (e.g., 'tw-a1b2c3')
  // 'incremental' - generates incremental names (e.g., 'tw-0', 'tw-1')
  // 'readable' - generates somewhat readable names (e.g., 'tw-textcenter')
  mode: 'hash',
  
  // Prefix for all generated class names
  prefix: 'tw-',
  
  // Patterns to ignore during scanning
  ignore: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '**/*.test.{js,ts,jsx,tsx}',
    '**/*.spec.{js,ts,jsx,tsx}'
  ]
};
`;
    fs.writeFileSync(configPath, sampleConfig, 'utf-8');
    console.log('✅ Sample config file created at:', configPath);
    console.log('📝 Edit the config file to customize settings, then run "twmap" again.');
}
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});
