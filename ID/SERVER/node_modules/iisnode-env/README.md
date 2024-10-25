# iisnode-env
[![NPM version](https://img.shields.io/npm/v/iisnode-env.svg?style=flat-square)](https://www.npmjs.com/package/iisnode-env) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

`iisnode-env` is a zero-dependency module that loads environment variables from the `<appSettings>`-section of a `web.config` file into [`process.env`](https://nodejs.org/docs/latest/api/process.html#process_process_env). 
Storing configuration in the environment separate from code is based on [The Twelve-Factor App](http://12factor.net/config) methodology.



When hosting a node app on [`iisnode`](https://github.com/tjanczuk/iisnode) (for instance in an [Azure WebApp](https://blogs.msdn.microsoft.com/hanuk/2012/05/04/top-benefits-of-running-node-js-on-windows-azure/)), `iisnode` automatically provides `appSettings` from `web.config` via `process.env`.

As such `iisnode-env` does nothing if `process.env.IISNODE_VERSION` is defined and aims only to simplify the move between running an app inside and outside of `iisnode`.

## Install

```bash
npm i -S iisnode-env
```

## Usage
As early as possible in your application, require and configure iisnode-env

```js
require('iisnode-env').config();

// or use the alias
require('iisnode-env').load();
```

The module will do nothing if `process.env.IISNODE_VERSION` is defined.
In that case iisnode will have already loaded the variables.

### Config

*Alias*: load

`config` will read your `web.config` file, parse the contents, assign it to `process.env` and return the loaded content or an `error` key if it failed.

```js
const result = require('iisnode-env').config()

if(result.error) {
  throw result.error
}

console.log(result.parsed)
```

If `process.env.IISNODE_VERSION` is defined, `config` returns an empty object.

You can additionally, pass options to `config`

#### Options

##### Path

Default: `web.config`

```js
require('iisnode-env').config({ path: '/custom/path/to/web.config' })
```

##### Encoding

Default: `utf8`

```js
require('iisnode-env').config({ encoding: 'base64' })
```

## Limits

This is i very simple module and as such there is no support (at this time) for doing this:
```xml
<appSettings file="relative file name">
</appSettings>
```
We only get the values we find inside of the `<appSettings>`-section.

## Credits
Inspired by and based on
* https://github.com/motdotla/dotenv

## License

MIT: http://tolu.mit-license.org

