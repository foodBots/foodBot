var request = require('request');
var expect = require('../../node_modules/chai/chai').expect;

describe('server', function() {
  it('should respond to GET requests for /signin with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/signin', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should respond to GET requests for /signup with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/signup', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should accept POST requests to /foodbot/auth/signup', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/foodbot/auth/signup',
      json: {
        email: 'test',
        password: 'test'}
    };
    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should accept POST requests to /foodbot/auth/signin', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/foodbot/auth/signin',
      json: {
        email: 'test',
        password: 'test'}
    };
    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  xit('should send back parsable stringified JSON for recipes', function(done) {
    request('http://127.0.0.1:3000/foodbot/recipes/1', function(error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  xit('should send a recipes object containing a recipes array', function(done) {
    request('http://127.0.0.1:3000/foodbot/recipes/1', function(error, response, body) {
      parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      expect(parsedBody.recipes).to.be.an('array');
      done();
    });
  });

  xit('should respond with messages that were previously posted', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/foodbot/meals/1',
      json: {
        username: 'Jono',
        message: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/foodbot/meals1', function(error, response, body) {
          var messages = JSON.parse(body).results;
          expect(messages[0].username).to.equal('Jono');
          expect(messages[0].message).to.equal('Do my bidding!');
          done();
        });
    });
  });

  it('Should server index.html when asked for a nonexistent file', function(done) {
    request('http://127.0.0.1:3000/arglebargle', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

});