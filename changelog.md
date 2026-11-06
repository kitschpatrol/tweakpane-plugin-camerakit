# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Maintenance

- Update the pinned pnpm version to 12.16.1.
- Update the GitHub release changelog action to 2.0.10 and release action to 3.0.3.
- Switch npm release authentication from a stored token to a one-time password retrieved from 1Password.

## [0.3.1-fork.1] - 2026-10-15

### Documentation

- Document the `-fork.N` release-versioning scheme.
- Add license attribution for upstream and fork modifications and refresh documentation links.

### Maintenance

- Refresh development dependencies, migrate to ESLint 10 flat configuration and TypeScript 6, and adopt pnpm 12 with Node.js `^24.16.0 || >=26.3.0` for development.
- Normalize pnpm build and cleanup scripts, adopt modern Sass compilation, and rebuild stylesheet changes through Rollup watch mode.
- Use mdat to generate and validate README metadata.
- Move pnpm dependency-build permissions into workspace configuration and add a development audit exception.
- Add scheduled documentation and homepage link checks and a Fork Tender workflow.
- Run checks and builds before publishing, use `fork` prerelease identifiers and token authentication, and update GitHub release and metadata automation.

## [0.3.1-beta.3] - 2025-03-04

### Documentation

- Simplify versioning guidance and clarify that fork betas track the next upstream patch release.

### Maintenance

- Update the runtime `@tweakpane/core` requirement to `^2.0.5`.
- Refresh development dependencies, adopt pnpm 10.5.2, remove the pnpm engine constraint, and allow the `@parcel/watcher` installation build.
- Correct repository metadata and explicitly publish npm releases with the `latest` tag.

## [0.3.1-beta.2] - 2024-09-15

### Changed

- Broaden the Tweakpane peer requirement from `^4.0.4` to `^4.0.0`.

### Maintenance

- Correct npm package keywords.
- Correct release tag matching for unprefixed versions and explicitly import `URL` in the asset-versioning script.

## [0.3.1-beta.1] - 2024-09-15

### Changed

- **Breaking:** Rename the fork's npm package to `@kitschpatrol/tweakpane-plugin-camerakit`.
- **Breaking:** Externalize `@tweakpane/core` as a runtime dependency so bundlers can share it across plugins; direct browser imports now require an import map.

### Documentation

- Replace upstream setup guidance with fork-specific documentation covering dependency externalization, import maps, package naming, and prerelease versioning.

### Maintenance

- Update declared requirements to `tweakpane: ^4.0.4` and `@tweakpane/core: ^2.0.4`.
- Adopt pnpm 9, declare Node.js 18+ and pnpm 9+ engines, and refresh build and lint tooling, including Rollup 4, TypeScript 5.6, and Prettier 3.
- Update package description, keywords, repository, homepage, and public publishing metadata.
- Add a bumpp-based npm release command and GitHub workflows for releases and repository metadata synchronization.

## [0.3.0] - 2023-08-11

No notable changes.

## [0.3.0-beta.1] - 2023-08-06

### Changed

- Update controls for Tweakpane 4 beta.2 and `@tweakpane/core` 2 beta.2.

## [0.3.0-beta.0] - 2023-06-21

### Added

- Export `id: 'camerakit'` and bundle-level `css` metadata alongside `plugins`.

### Changed

- Update compatibility to Tweakpane 4 beta.1 and `@tweakpane/core` 2 beta.1, adapting plugin registration and core bundle resolution.

## [0.3.0-alpha.0] - 2023-04-30

### Added

- Support standard Tweakpane number-text formatting and interaction parameters in ring and wheel bindings.

### Changed

- **Breaking:** Migrate controls to Tweakpane 4 alpha and its updated binding, plugin, and theme APIs.
- **Breaking:** Switch package and browser builds from UMD to ES modules.

### Documentation

- Update browser setup to module imports and replace `addInput` examples with `addBinding`.

### Maintenance

- Refresh TypeScript and ESLint tooling, convert supporting scripts to ES modules, and start a local HTTP server alongside development watchers.

## [0.2.3] - 2023-01-30

### Maintenance

- Update `@tweakpane/core` to `^1.1.4` and the Tweakpane peer requirement to `^3.1.4`.

## [0.2.2] - 2022-03-27

### Added

- Publish generated TypeScript declarations and expose them through the package's `types` entry.

### Maintenance

- Replace `node-sass` with Dart Sass and use `rimraf` for portable build cleanup.

## [0.2.1] - 2021-08-08

### Added

- Emit `last: false` during ring and wheel dragging and a final `last: true` change event on release.

### Fixed

- Correct control layout when initialized inside an inactive tab by waiting until the control becomes visible.

### Documentation

- Correct the browser installation script tag and refresh the cover image.

### Maintenance

- Update `@tweakpane/core` to `^1.0.6` and declare `tweakpane: ^3.0.5` as a peer dependency.
- Normalize release archive names for scoped packages and make source watchers build immediately and restart cleanly.

## [0.2.0] - 2021-05-17

### Documentation

- Document explicit plugin registration for browser and package consumers and correct the scoped package import.

### Maintenance

- Update bundled `@tweakpane/core` to `^1.0.0` and the development Tweakpane requirement to `^3.0.0`.
- Remove unused Rollup external/global configuration and add package repository metadata.

## [0.2.0-beta.0] - 2021-05-12

### Changed

- **Breaking:** Rename the npm package from `tweakpane-plugin-camerakit` to `@tweakpane/plugin-camerakit`.
- **Breaking:** Migrate to Tweakpane 3 beta and replace automatic registration with an exported `plugins` bundle registered through `pane.registerPlugin(...)`.
- **Breaking:** Replace `plugin: 'camerakit'` with `view: 'ring'` or `'wheel'` by the view names `cameraring` and `camerawheel`.
- **Breaking:** Target ES2015 instead of ES5 in distributed builds.

### Documentation

- Update usage examples for the renamed views and pane-level plugin registration.

### Maintenance

- Refresh TypeScript, Sass, and Rollup tooling, build against `@tweakpane/core`, and remove unused jsdom dependencies.

## [0.1.4] - 2021-04-17

### Changed

- Use the input foreground color for wheel ticks and reduce their opacity.

### Maintenance

- Update the declared Tweakpane peer requirement to `2.4.0`.

## [0.1.3] - 2021-04-09

### Changed

- Update controls and the peer requirement for Tweakpane 2.3.0.
- Dim ring and wheel controls when disabled.

### Fixed

- Correct ring-series validation to accept only the supported values `0`, `1`, and `2`.

## [0.1.2] - 2021-03-27

### Changed

- Update controls and the peer requirement for Tweakpane 2.2.0, propagating view state and using updated theme variables.

## [0.1.1] - 2021-03-19

### Documentation

- Correct the README description and replace the package's template description with CameraKit-specific text.

## [0.1.0] - 2021-03-19

### Added

- Provide draggable numeric ring controls with three appearances, configurable scale units, text editing, and `min`, `max`, and `step` constraints.
- Provide wheel controls with configurable value-per-pixel sensitivity, numeric text editing, and range and step constraints.
- Support `wide` controls that hide the text field and show the current value in a tooltip while dragging.
- Provide browser and package builds that automatically register CameraKit controls with Tweakpane 2.1.1.

### Documentation

- Add browser and package setup instructions, illustrated usage guidance, and camera-setting examples for ring and wheel controls.

### Maintenance

- Set up development and minified builds, linting, formatting, watch mode, and versioned release archives.

[Unreleased]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.3.1-fork.1...HEAD
[0.1.0]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/releases/tag/0.1.0
[0.1.1]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.1.0...0.1.1
[0.1.2]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.1.1...0.1.2
[0.1.3]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.1.2...0.1.3
[0.1.4]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.1.3...0.1.4
[0.2.0-beta.0]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.1.4...0.2.0-beta.0
[0.2.0]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.2.0-beta.0...0.2.0
[0.2.1]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.2.0...0.2.1
[0.2.2]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.2.1...0.2.2
[0.2.3]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.2.2...0.2.3
[0.3.0-alpha.0]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.2.3...0.3.0-alpha.0
[0.3.0-beta.0]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.3.0-alpha.0...0.3.0-beta.0
[0.3.0-beta.1]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.3.0-beta.0...0.3.0-beta.1
[0.3.0]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.3.0-beta.1...0.3.0
[0.3.1-beta.1]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.3.0...0.3.1-beta.1
[0.3.1-beta.2]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.3.1-beta.1...0.3.1-beta.2
[0.3.1-beta.3]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.3.1-beta.2...0.3.1-beta.3
[0.3.1-fork.1]: https://github.com/kitschpatrol/tweakpane-plugin-camerakit/compare/0.3.1-beta.3...0.3.1-fork.1
