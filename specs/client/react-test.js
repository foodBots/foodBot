// Mocking window and document object:
require('./dom-mock')('<html><body></body></html>');

var jsdom = require('mocha-jsdom');
var assert = require('assert');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
import SignIn from '../../scripts/components/SignIn.js';

describe('Testing signin', function() {
  jsdom({ skipWindowCheck: true });

  it('It should have a signin', function() {
    //console.log('signin', SignIn);
    var component = TestUtils.renderIntoDocument(<SignIn />);
    var renderedDom = TestUtils.scryRenderedDOMComponentsWithTag(component, 'FORM');
    // console.log('dom', renderedDom);
    // var divText = 'Sign In';
    assert.equal(renderedDom.length, 1);
  });
});