# marked-footnote [1.4.0](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.3.0...marked-footnote@1.4.0) (2025-07-09)


### Features

* Allow keeping original footnote references, fix links in back-references ([82a6c02](https://github.com/bent10/marked-extensions/commit/82a6c022d93e3f38ca1f364fb10eec4836d0cf8d))

# marked-footnote [1.3.0](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.2.4...marked-footnote@1.3.0) (2025-06-21)


### Features

* Enable custom CSS classes, footnote divider, localisation, source ([d56e749](https://github.com/bent10/marked-extensions/commit/d56e7494d1946b33e780635b20080ba30f887a42))

## marked-footnote [1.2.4](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.2.3...marked-footnote@1.2.4) (2024-09-02)


### Bug Fixes

* **footnote:** resolves footnote links for repeated, out-of-order references ([7e48c89](https://github.com/bent10/marked-extensions/commit/7e48c8911e4fb2c174778c2a46310454213e6736)), closes [#109](https://github.com/bent10/marked-extensions/issues/109)

## marked-footnote [1.2.3](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.2.2...marked-footnote@1.2.3) (2024-08-29)


### Bug Fixes

* lint code ([c75dfc9](https://github.com/bent10/marked-extensions/commit/c75dfc94eb2fc61d258d2e36caf20d4a91e06a16))

## marked-footnote [1.2.2](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.2.1...marked-footnote@1.2.2) (2023-12-16)


### Bug Fixes

* ensure the footnotes token is consistently reset during each parsing process ([6f4d6d9](https://github.com/bent10/marked-extensions/commit/6f4d6d9a4b86740d75c0a992abffebd64281085c)), closes [#34](https://github.com/bent10/marked-extensions/issues/34)

## marked-footnote [1.2.1](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.2.0...marked-footnote@1.2.1) (2023-12-13)


### Bug Fixes

* preserve the value of the first token by leaving a space to ensure that the subsequent item is properly accessed ([3e26ab5](https://github.com/bent10/marked-extensions/commit/3e26ab5d0fe7e0f23fb28d5550372ff1cbb43aa4)), closes [#27](https://github.com/bent10/marked-extensions/issues/27)
* reset refs number on each parsing ([d72b9da](https://github.com/bent10/marked-extensions/commit/d72b9da07e684ea091546fd6960c0e404d6eebcd)), closes [#28](https://github.com/bent10/marked-extensions/issues/28)

# marked-footnote [1.2.0](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.1.3...marked-footnote@1.2.0) (2023-12-11)


### Features

* use sequential number for footnote refs and resolve footnote order ([1d53da3](https://github.com/bent10/marked-extensions/commit/1d53da3d285107f353cd7c2237df3f22ee4343bc)), closes [#26](https://github.com/bent10/marked-extensions/issues/26)

## marked-footnote [1.1.3](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.1.2...marked-footnote@1.1.3) (2023-11-26)


### Bug Fixes

* allows link in footnote content ([a3e49ac](https://github.com/bent10/marked-extensions/commit/a3e49acc0344d33525181639bbe55aa5aa11024d)), closes [#23](https://github.com/bent10/marked-extensions/issues/23)

## marked-footnote [1.1.2](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.1.1...marked-footnote@1.1.2) (2023-11-03)


### Bug Fixes

* always begin with empty footnotes items ([94aa01a](https://github.com/bent10/marked-extensions/commit/94aa01a0a571d9f04900e06fb0fa2e2baf021337))

## marked-footnote [1.1.1](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.1.0...marked-footnote@1.1.1) (2023-10-26)


### Bug Fixes

* resolves `ERR_REQUIRE_ESM` in CommonJS mocules ([f876e00](https://github.com/bent10/marked-extensions/commit/f876e00dcd08969cf1489b7fc23c29a7e2e67d96))

# marked-footnote [1.1.0](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.0.1...marked-footnote@1.1.0) (2023-10-20)


### Bug Fixes

* resolves `umd` mime issue ([f98d31a](https://github.com/bent10/marked-extensions/commit/f98d31af547deb496098a54d836a55625e05040e))


### Features

* build for the `esm`, `cjs`, and `umd` formats ([30bc148](https://github.com/bent10/marked-extensions/commit/30bc148b037aaff23dee1ecca64d31c8b4ae827c))

## marked-footnote [1.0.1](https://github.com/bent10/marked-extensions/compare/marked-footnote@1.0.0...marked-footnote@1.0.1) (2023-10-18)


### Bug Fixes

* removes the "dir" attribute from the footnotes heading ([152f77e](https://github.com/bent10/marked-extensions/commit/152f77ee4bd16a39736fa68aaeccec9d5a49daef))

# marked-footnote 1.0.0 (2023-10-10)


### Features

* init `marked-footnote` ([dba2ad2](https://github.com/bent10/marked-extensions/commit/dba2ad2d265c62335198436965c9118d6da3381d))
