# translations

Translations and localization resources for the WowFinder apps

## Repository / development status

-   **Read / fetch**: unstable ⚠️
-   **Write / push**: possible (manual) ⚠️
-   **Development**: possible (manual) ⚠️

## Usage

### Package mode:

Node-based WowFinder apps can use the localization assets in this repository by defining a dependency to the `@wowfinder/translations` package in their `package.json` file.

⚠️ The dependency should be set up in the `dependencies` section, not in the `devDependencies` section, as the localization assets will required at runtime in almost every reasonable scenario.

⛔ At the moment of publishing this document, there isn't any publicly available package for this repository.

🚧 Further instructions will be added here. The package will expose some kind of initialization method, language selection mechanism, and a very thin wrapper over `react-i18next`.

### Git submodule mode:

In some scenarios (such as during early development stages, or when the `react-i18next` module isn't a suitable fit) it may be preferable to access the localization assets by setting up a git submodule. This should make all the assets available as they exist in the repository, but the project using them may need to set up its own management mechanisms.

⚠️ Note that this repository uses branch protection for its main branch. While it may be convenient to use the submodule approach when working on the actual localization contents, a separate pull request will be strictly necessary before any changes can be incorporated to the main branch.

## Folder and key structure

The keys initialy implemented in the repository are inherited from the original WowFinder app. These are likely to change in the future, and full details on the structure stragegy will be added here.

- `translations` is the home for all the localization assets. Should contain a subfolder for each language or locale to be supported; whether it is a generic language code (such as `es` for generic Spanish) or a specific locale (such as `en-US` for US English with US locale-specific conventions). At the moment, only generic Spanish (`es`) and generic English (`en`) are available.
- `src` exposes a minimalistic API, wrapping around `react-i18next`, that helps initializing the setup with the assets included in the repo.