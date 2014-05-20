
var _ = require('lodash');
var prerender = require('prerender-node');
var send = require('response-send');
var url = require('url');

var exports = module.exports = function (options) {
  options = options || {};
  
  prerender.set('prerenderServiceUrl', options.host);
  prerender.set('prerenderToken', options.token);
  
  return function (req, res, next) {
    if (req.method !== 'GET') return next();
      
    decorateRequestObject(req);
    decorateResponseObject(req, res);
    
    // prerender.whitelisted()
    // prerender.blacklisted()
    
    prerender(req, res, next);
  };
  
};

function decorateRequestObject (req) {
  req.protocol = (req.connection.encrypted) ? 'https' : 'http';
  
  req.get = function (name) {
    return _(req.headers)
      .map(function (value, header) {
        return [header.toLowerCase(), value];
      })
      .zipObject()
      .find(function (value, header) {
        return header === name.toLowerCase();
      });
  };
}

function decorateResponseObject (req, res) {
  res.req = req;
  res.send = send;
  
  res.set = function (headers) {
    _(headers).each(function (value, name) {
      res.setHeader(name, value);
    });
  };
}
