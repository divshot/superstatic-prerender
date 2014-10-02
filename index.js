
var _ = require('lodash');
var prerender = require('prerender-node');
var send = require('response-send');
var url = require('url');

module.exports = function (options) {
  options = options || {};
  
  prerender.set('prerenderServiceUrl', options.host);
  prerender.set('prerenderToken', options.token);
  
  var render = function (req, res, next) {
    decorateRequestObject(req);
    decorateResponseObject(req, res);
    
    prerender.whitelisted(req.service.config.whitelist);
    prerender.blacklisted(req.service.config.blacklist);
    
    prerender(req, res, next);
  };
  
  render.matchesRequest = function (req, done) {
    done(prerender.shouldShowPrerenderedPage(req));
  };
  
  return render;
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
  
  res.status = function (code) {
    res.statusCode = code;
    return res;
  };
  
  res.set = function (headers) {
    _(headers).each(function (value, name) {
      res.setHeader(name, value);
    });
  };
}
