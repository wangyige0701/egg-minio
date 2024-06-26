# egg-minio

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-minio.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-minio
[travis-image]: https://img.shields.io/travis/eggjs/egg-minio.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-minio
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-minio.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-minio?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-minio.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-minio
[snyk-image]: https://snyk.io/test/npm/egg-minio/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-minio
[download-image]: https://img.shields.io/npm/dm/egg-minio.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-minio

<!--
Description here.
-->

## Install

```bash
$ npm i @wang-yige/egg-minio --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.minio = {
  enable: true,
  package: '@wang-yige/egg-minio',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.minio = {
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
