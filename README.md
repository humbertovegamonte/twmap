# Twmap - Tailwind Class Mapper

**Author:** Cojocaru David  
**Contact:** [contact@cojocarudavid.me](mailto:contact@cojocarudavid.me)  
**Website:** [https://www.cojocarudavid.me/](https://www.cojocarudavid.me/)

[![npm version](https://img.shields.io/npm/v/twmap.svg)](https://www.npmjs.com/package/twmap)
[![GitHub stars](https://img.shields.io/github/stars/cojocaru-david/twmap.svg?style=social)](https://github.com/cojocaru-david/twmap)

A CLI tool that scans HTML, JSX, and TSX files to extract Tailwind utility classes and generates optimized CSS mappings with short class names.

## Features

- 🔍 **Smart Parsing**: Analyzes HTML, JSX, and TSX files to find Tailwind class usage
- 🎯 **Consistent Mapping**: Same utility string always generates the same short class name
- 📦 **CSS Generation**: Creates a single CSS file with `@apply` rules
- 🛠️ **Configurable**: Flexible configuration options via config file or CLI
- ⚡ **Fast Processing**: Efficient file scanning and processing
- 🎨 **Multiple Modes**: Hash, incremental, or readable class name generation

## Installation

```bash
npm install -g twmap
```

Or run directly with npx:

```bash
npx twmap
```

## Quick Start

1. **Initialize configuration** (optional):
   ```bash
   twmap --init
   ```

2. **Run the tool**:
   ```bash
   twmap
   ```

This will:
- Scan files matching the default patterns (`./src/**/*.{tsx,jsx,html}`)
- Generate optimized class names
- Create a `twmap.css` file with mappings
- Update all source files with the new class names

## Configuration

### Config File (`twmap.config.js`)

```javascript
module.exports = {
  // Input file patterns to scan
  input: [
    './src/**/*.{tsx,jsx,html}',
    './components/**/*.{tsx,jsx}',
  ],
  
  // Output CSS file path
  output: './twmap.css',
  
  // Class name generation mode
  mode: 'hash', // 'hash' | 'incremental' | 'readable'
  
  // Prefix for generated class names
  prefix: 'tw-',
  
  // Patterns to ignore
  ignore: [
    'node_modules/**',
    'dist/**',
    'build/**',
    '**/*.test.{js,ts,jsx,tsx}'
  ]
};
```

### CLI Options

```bash
twmap [options]

Options:
  -c, --config <path>        Path to config file
  -i, --input <patterns...>  Input file patterns
  -o, --output <path>        Output CSS file path
  -m, --mode <mode>          Generation mode (hash|incremental|readable)
  -p, --prefix <prefix>      Prefix for generated class names
  --dry-run                  Preview changes without modifying files (shows what would change)
  --init                     Create a sample config file
  -h, --help                 Display help
```

## How It Works

### Before
```jsx
// Component.tsx
<div className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg shadow-md">
  <span className="text-lg font-semibold">Hello World</span>
</div>
```

### After
```jsx
// Component.tsx (updated)
<div className="tw-a1b2c3">
  <span className="tw-d4e5f6">Hello World</span>
</div>
```

```css
/* twmap.css (generated) */
.tw-a1b2c3 {
  @apply flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg shadow-md;
}

.tw-d4e5f6 {
  @apply text-lg font-semibold;
}
```

## Generation Modes

### Hash Mode (`mode: 'hash'`)
Generates short, hash-based class names:
- `tw-a1b2c3`
- `tw-d4e5f6`
- `tw-g7h8i9`

### Incremental Mode (`mode: 'incremental'`)
Generates sequential class names:
- `tw-0`
- `tw-1` 
- `tw-2`

### Readable Mode (`mode: 'readable'`)
Generates somewhat readable class names based on the original classes:
- `tw-flexcenter`
- `tw-textlg`
- `tw-bgblue`

## File Support

- **HTML**: Parses `class` attributes
- **JSX/TSX**: Parses `className` and `class` attributes
- **JavaScript/TypeScript**: Extracts classes from JSX elements

## Integration

### With Build Tools

Add the generated CSS file to your build process:

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  // ... other config
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css'
    })
  ]
};
```

### With Tailwind CSS

Include the generated file in your Tailwind config:

```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  // ... other config
};
```

Then import the generated CSS:

```css
/* In your main CSS file */
@import './twmap.css';
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development
npm run dev

# Test the CLI
npm run dev -- --help
```

## License

MIT License - see LICENSE file for details.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

To run tests (coming soon):
```bash
npm test
```

## Test Coverage & Future Improvements

- Automated tests for parsing and replacement logic are planned.
- More robust handling for dynamic and template literal class names is on the roadmap.
- Please open issues or PRs for bugs, edge cases, or feature requests!

## File Safety & Backup

- Before running twmap, consider backing up your source files or using version control (e.g., git).
- twmap will overwrite class/className attributes in your files. There is a --dry-run mode to preview changes.
- Dynamic or complex className expressions (e.g., computed values, ternaries, or variables) are skipped and will not be replaced. Review your code and the CLI output for any warnings about skipped replacements.

## Troubleshooting

- **Some classes were not replaced:**
  - Only static class strings and simple template literals are supported. Dynamic expressions are skipped for safety.
  - Check the CLI output for warnings about skipped dynamic classNames.
- **My files were changed unexpectedly:**
  - Use version control or make a backup before running twmap.
  - Use --dry-run to preview changes before applying them.
- **Globs not matching files:**
  - Ensure your input patterns are correct and use forward slashes (/) for cross-platform compatibility.

### Getting Help

- Check the examples in this README
- Run `twmap --help` for CLI options
- Create an issue on GitHub for bugs or feature requests
