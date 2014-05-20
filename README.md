Superstatic Prerender
=====================

A prerendering service to allow static AJAX apps to get that sweet sweet
search engine juice.

[![NPM Module](http://img.shields.io/npm/v/superstatic-prerender.svg?style=flat)](https://npmjs.org/package/superstatic-prerender)
[![Build Status](http://img.shields.io/travis/divshot/superstatic-prerender.svg?style=flat)](https://travis-ci.org/divshot/superstatic-prerender)

## Client Configuration

### Options

* **refetch:** Can either be an integer number of days to keep before refetching
  or an object describing URLs and their individual refetch length.
* **blacklist:** An array of routes that should be ignored by the prerender service.
  Anything that requires a login to access should be blacklisted, as an example.
* **whitelist:** If a `refetch` routeset is present and this is `true`, only the
  routes specified in `refetch` will be allowed for Prerender. Otherwise, you can
  set it to an array of routes.

### Examples

```json
{
  "prerender": {
    "refetch": 7,
    "blacklist": ["/account/**"]
  }
}
```

```json
{
  "prerender": {
    "refetch": {
      "/": 1,
      "/articles/**": 7
    },
    "whitelist": true
  }
}
```

## Server Configuration

```js
require('superstatic-prerender')({
  host: process.env.PRERENDER_SERVICE_URL, // optional prerender server hostname
  token: process.env.PRERENDER_TOKEN // if using prerender.io service
});
```
