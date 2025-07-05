# 🛠️ twmap: Tailwind Utility Class Mapper

![GitHub Repo Size](https://img.shields.io/github/repo-size/humbertovegamonte/twmap?style=flat-square)
![GitHub Stars](https://img.shields.io/github/stars/humbertovegamonte/twmap?style=social)
![GitHub Issues](https://img.shields.io/github/issues/humbertovegamonte/twmap?style=flat-square)

Welcome to **twmap**, a command-line interface (CLI) tool designed to help you streamline your development process. With twmap, you can scan your HTML, JSX, and TSX files to extract Tailwind utility classes and generate optimized CSS mappings with short class names. This tool enhances your workflow by automating the tedious process of managing utility classes, allowing you to focus on building great applications.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Configuration](#configuration)
5. [Contributing](#contributing)
6. [License](#license)
7. [Contact](#contact)
8. [Releases](#releases)

## Features

- **Automated Class Extraction**: Automatically scans your project files for Tailwind utility classes.
- **CSS Optimization**: Generates optimized CSS mappings to reduce file size and improve load times.
- **Short Class Names**: Provides shorter class names for easier readability and maintenance.
- **Multi-File Support**: Works with HTML, JSX, and TSX files, making it versatile for various projects.
- **Easy Integration**: Integrates smoothly into your existing build process.

## Installation

To get started with twmap, you need to install it. You can do this via npm or yarn. Run one of the following commands in your terminal:

```bash
npm install -g twmap
```

or

```bash
yarn global add twmap
```

## Usage

Once you have installed twmap, you can start using it to scan your files. Here’s how:

1. Open your terminal.
2. Navigate to the root directory of your project.
3. Run the following command:

```bash
twmap
```

By default, twmap will scan all HTML, JSX, and TSX files in your project. You can also specify a particular directory or file if needed:

```bash
twmap ./src/components
```

## Configuration

You can customize twmap's behavior using a configuration file. Create a file named `twmap.config.js` in your project root. Here’s an example configuration:

```javascript
module.exports = {
  output: './dist/tailwind.css',
  prefix: 'tw-',
  scan: ['./src/**/*.html', './src/**/*.jsx', './src/**/*.tsx'],
};
```

- `output`: Specify the output path for the generated CSS file.
- `prefix`: Set a prefix for the generated class names.
- `scan`: Define which files or directories to scan.

## Contributing

We welcome contributions to twmap! If you have ideas for features, improvements, or bug fixes, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and commit them.
4. Push your branch to your forked repository.
5. Open a pull request to the main repository.

Please ensure your code adheres to the existing style and includes appropriate tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, feel free to reach out to the maintainer:

- **Humberto Vega Monte**
- [GitHub Profile](https://github.com/humbertovegamonte)

## Releases

You can find the latest releases of twmap [here](https://github.com/humbertovegamonte/twmap/releases). Download the latest version and execute it to start optimizing your Tailwind CSS workflow.

---

Thank you for checking out twmap! We hope this tool helps you enhance your development process with Tailwind CSS. For further updates and features, stay tuned and check the Releases section regularly.