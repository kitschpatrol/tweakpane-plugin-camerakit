# @kitschpatrol/tweakpane-plugin-camerakit

[![NPM Package @kitschpatrol/tweakpane-plugin-camerakit](https://img.shields.io/npm/v/@kitschpatrol/tweakpane-plugin-camerakit.svg)](https://npmjs.com/package/@kitschpatrol/tweakpane-plugin-camerakit)

## Overview

**This is a fork of [Hiroki Kokubun](https://cocopon.me/)'s [@tweakpane/plugin-camerakit
](https://github.com/tweakpane/plugin-camerakit) with externalized dependencies.**

This allows for smaller bundled file sizes in projects using multiple Tweakpane plugins.

It is published to NPM primarily for the [_Svelte Tweakpane UI_](https://kitschpatrol.com/svelte-tweakpane-ui) project, and will be kept in sync with the upstream version of the plugin, with minimal changes other than dependency externalization.

For most use cases, you probably don't want this fork!

## Background

The [Rollup](https://rollupjs.org) configuration provided in the [Tweakpane plugin template](https://github.com/tweakpane/plugin-template) does not externalize [`@tweakpane/core`](https://github.com/cocopon/tweakpane/tree/main/packages/core) as a production dependency.

Instead, it gets built into the single-file plugin artifact, which is what's published to NPM and imported by plugin consumers. This makes it easy to import as an ES module from a URL, but means that larger projects importing multiple Tweakpane plugins end up with duplicate copies of the `@tweakpane/core` code, adding about ~100 Kb to the final minified build for each plugin after the first.

Externalizing this dependency allows build tools like [vite](https://vitejs.dev) to share a single instance of the `@tweakpane/core` code across multiple plugins.

If you're not using a bundler, direct ESM imports from URLs can still work if needed by defining the `@tweakpane/core` dependency in an [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap).

## Implementation notes

Note the package name change from `@tweakpane/plugin-camerakit` to `@kitschpatrol/tweakpane-plugin-camerakit`.

PNPM is used as the package manager.

## Versioning

In addition to the dependency externalization change, this plugin fork also includes assorted dependency updates. In an effort to stay in sync with future upstream versions, intra-minor-version releases of the fork are tagged as "beta" of the next upstream version is released, at which point a version-matching release may be made.

Example sequence:

1. 2023-08-10 Upstream release: `0.3.0`
1. 2023-05-15 Fork release matching upstream: `0.3.0`
1. 2024-09-15 Fork release with dependency updates: `0.3.1-beta.1`
1. _Hypothetical 2024-11-22_ Fork release with dependency updates: `0.3.1-beta.2`
1. _Hypothetical 2024-12-24_ Upstream release: `0.3.1`
1. _Hypothetical 2024-12-24_ Fork release matching upstream: `0.3.1`
1. _Hypothetical 2025-01-24_ Fork release with dependency updates: `0.3.2-beta.1`
