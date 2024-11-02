## marked-alert [2.1.2](https://github.com/bent10/marked-extensions/compare/marked-alert@2.1.1...marked-alert@2.1.2) (2024-11-02)


### Bug Fixes

* handle hard line breaks correctly ([5ab5f81](https://github.com/bent10/marked-extensions/commit/5ab5f8189478df4add7b20a2b2f2be7da2bcd26e)), closes [#120](https://github.com/bent10/marked-extensions/issues/120)

## marked-alert [2.1.1](https://github.com/bent10/marked-extensions/compare/marked-alert@2.1.0...marked-alert@2.1.1) (2024-10-30)


### Bug Fixes

* correctly handle extra spaces on first line ([f68d1e0](https://github.com/bent10/marked-extensions/commit/f68d1e0675d60f08d5ba786f9ec505f736a52347)), closes [#120](https://github.com/bent10/marked-extensions/issues/120)

# marked-alert [2.1.0](https://github.com/bent10/marked-extensions/compare/marked-alert@2.0.2...marked-alert@2.1.0) (2024-09-26)


### Features

* improve alert token handling ([867b011](https://github.com/bent10/marked-extensions/commit/867b0111a8f2be8dede66bdcc8b7ea6309bc28c2)), closes [#120](https://github.com/bent10/marked-extensions/issues/120)

## marked-alert [2.0.2](https://github.com/bent10/marked-extensions/compare/marked-alert@2.0.1...marked-alert@2.0.2) (2024-08-29)


### Bug Fixes

* lint code ([c75dfc9](https://github.com/bent10/marked-extensions/commit/c75dfc94eb2fc61d258d2e36caf20d4a91e06a16))

## marked-alert [2.0.1](https://github.com/bent10/marked-extensions/compare/marked-alert@2.0.0...marked-alert@2.0.1) (2023-11-20)


### Bug Fixes

* tokenize first-line text ([d4a5f49](https://github.com/bent10/marked-extensions/commit/d4a5f4990abe3ea339148f4619067973f1edab9b)), closes [#18](https://github.com/bent10/marked-extensions/issues/18)

# marked-alert [2.0.0](https://github.com/bent10/marked-extensions/compare/marked-alert@1.2.1...marked-alert@2.0.0) (2023-11-20)


### Features

* add support for `[!TIP]` and `[!CAUTION]` ([452926c](https://github.com/bent10/marked-extensions/commit/452926c396cfea9369dff878d3296751f64d96c4)), closes [#18](https://github.com/bent10/marked-extensions/issues/18)
* drop support for old syntax ([a46101b](https://github.com/bent10/marked-extensions/commit/a46101b161558dad96a9d2df067f84455fe72062))


### BREAKING CHANGES

* The initial syntax using e.g. `**Note**` isn't supported any longer.

## marked-alert [1.2.1](https://github.com/bent10/marked-extensions/compare/marked-alert@1.2.0...marked-alert@1.2.1) (2023-11-15)


### Bug Fixes

* resolves first-line tokens ([05a74cd](https://github.com/bent10/marked-extensions/commit/05a74cde1b082599e64fe6cdcd7f666a95b38cc2))

# marked-alert [1.2.0](https://github.com/bent10/marked-extensions/compare/marked-alert@1.1.2...marked-alert@1.2.0) (2023-11-07)


### Features

* add `className` prop to `meta` object ([d4fac90](https://github.com/bent10/marked-extensions/commit/d4fac900681374e458d5efcf7fe3d127775447a1))

## marked-alert [1.1.2](https://github.com/bent10/marked-extensions/compare/marked-alert@1.1.1...marked-alert@1.1.2) (2023-10-26)


### Bug Fixes

* resolves `ERR_REQUIRE_ESM` in CommonJS mocules ([f876e00](https://github.com/bent10/marked-extensions/commit/f876e00dcd08969cf1489b7fc23c29a7e2e67d96))

## marked-alert [1.1.1](https://github.com/bent10/marked-extensions/compare/marked-alert@1.1.0...marked-alert@1.1.1) (2023-10-23)


### Bug Fixes

* ambiguous resolved `titleClassName` ([9f3d5c9](https://github.com/bent10/marked-extensions/commit/9f3d5c927a130eaa964d3edd73f9f47d4df00012))

# marked-alert [1.1.0](https://github.com/bent10/marked-extensions/compare/marked-alert@1.0.0...marked-alert@1.1.0) (2023-10-23)


### Bug Fixes

* resolves `titleClassName` ([bd15589](https://github.com/bent10/marked-extensions/commit/bd15589e6b134a7181db09ce41185c4297d11528))


### Features

* supports customizing alert `title` ([59ba2f9](https://github.com/bent10/marked-extensions/commit/59ba2f978a86504c2f5828266ea64a39b4936085))

# marked-alert 1.0.0 (2023-10-23)


### Features

* init `marked-alert` ([4a8c6fb](https://github.com/bent10/marked-extensions/commit/4a8c6fb4454360237546e240b6670c5bf54965ba))
