var render = require('../index.js');
var expect = require('chai').expect;
var connect = require('connect');
var request = require('supertest');
var Mocksy = require('mocksy');
var server = new Mocksy({port: 8888});
var bot = 'Baiduspider+(+http://www.baidu.com/search/spider.htm)';

describe('prerender service', function () {
  var app;
  
  beforeEach(function (done) {
    app = connect()
      .use(function (req, res, next) {
        req.service = {
          name: 'prerender',
          config: {}
        };
        next();
      });
    server.start(done);
  });
  
  afterEach(function (done) {
    server.stop(done);
  });
  
  it('skips the middleware if request method is not GET', function (done) {
    render().matchesRequest({method: 'POST', headers: {}}, function (matches) {
      expect(matches).to.equal(false);
      done();
    });
  });
  
  it('makes a request to a custom prerender server with a host set', function (done) {
    app.use(render({
      host: 'http://localhost:8888'
    }));
    
    request(app)
      .get('/render')
      .set('user-agent', bot)
      .expect(function (data) {
        var res = data.res.body;
        expect(res.headers.host).to.equal('localhost:8888');
        expect(res.method).to.equal('GET');
      })
      .end(done);
  });
  
  it('sends the api token as a header', function (done) {
    app.use(render({
      host: 'http://localhost:8888',
      token: 'testing'
    }));
    
    request(app)
      .get('/render')
      .set('user-agent', bot)
      .expect(function (data) {
        expect(data.res.body.headers['x-prerender-token']).to.equal('testing');
      })
      .end(done);
  });
  
  it('returns rendered page from the default prerender service', function (done) {
    app.use(render({
      token: 'testing'
    }));
    
    request(app)
      .get('/render')
      .set('user-agent', bot)
      .expect(200)
      .expect('<html><head></head><body></body></html>')
      .end(done);
  });
  
  it('sets the whitelist values on prerender', function (done) {
    app
      .use(function (req, res, next) {
        req.service.config.whitelist = '/prerender';
        next();
      })
      .use(render({
        host: 'http://localhost:8888'
      }));
    
    request(app)
      .get('/')
      .set('user-agent', bot)
      .expect(function (data) {
        expect(data.res.body).to.equal(undefined);
      })
      .end(done);
  });
  
  it('sets the blacklist values on prerender');
  
  it('sets the refetch value from the config');
  
});