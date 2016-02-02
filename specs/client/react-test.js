// Mocking window and document object:
require('./dom-mock')('<html><body></body></html>');

var jsdom = require('mocha-jsdom');
var assert = require('assert');
var React = require('react');
var TestUtils = require('react-addons-test-utils');
import SignIn from '../../src/scripts/components/SignIn.js';
import SignUp from '../../src/scripts/components/SignUp.js';
import App from '../../src/scripts/components/App.js';
import NotFound from '../../src/scripts/components/NotFound.js';
import ProfileMake from '../../src/scripts/components/ProfileMake.js';
import RecipeChoose from '../../src/scripts/components/RecipeChoose.js';

describe('Testing SignIn Component', function() {
  jsdom({ skipWindowCheck: true });

  it('It should have a signin component', function() {
    //console.log('signin', SignIn);
    var component = TestUtils.renderIntoDocument(<SignIn />);
    var renderedDom = TestUtils.scryRenderedDOMComponentsWithTag(component, 'FORM');
    assert.equal(renderedDom.length, 1);
  });
});

describe('Testing SignUp Component', function() {
  jsdom({ skipWindowCheck: true });

  it('It should have a signup component', function() {
    //console.log('signin', SignIn);
    var component = TestUtils.renderIntoDocument(<SignUp />);
    var renderedDom = TestUtils.scryRenderedDOMComponentsWithTag(component, 'FORM');
    assert.equal(renderedDom.length, 1);
  });
});

describe('Testing NotFound Component', function() {
  jsdom({ skipWindowCheck: true });

  it('It should have a NotFound component', function() {
    //console.log('signin', SignIn);
    var component = TestUtils.renderIntoDocument(<NotFound />);
    var renderedDom = TestUtils.scryRenderedDOMComponentsWithTag(component, 'H1');
    assert.equal(renderedDom.length, 1);
  });
});

xdescribe('Testing App Component', function() {
  jsdom({ skipWindowCheck: true });

  it('It should have an app component', function() {
    //console.log('signin', SignIn);
    var component = TestUtils.renderIntoDocument(<App />);
    var renderedDom = TestUtils.scryRenderedDOMComponentsWithTag(component, 'DIV');
    assert.equal(renderedDom.length, 1);
  });
});

xdescribe('Testing ProfileMake Component', function() {
  jsdom({ skipWindowCheck: true });

  it('It should have a ProfileMake component', function() {
    //console.log('signin', SignIn);
    var choices = {
      prep: [],
      diet: [],
      type: [],
      allergies: []
    };
    var func = function(){};
    var component = TestUtils.renderIntoDocument(<ProfileMake
          id = {'1'}
          redirect={func}
          choices={choices}
          prep={choices}
          diet={choices}
          setDiet={func}
          setPrep={func}
          getRecipes={func}
          profSubmit={func}/>);
    var renderedDom = TestUtils.scryRenderedDOMComponentsWithTag(component, 'DIV');
    assert.equal(renderedDom.length, 64);
  });
});

describe('Testing RecipeChoose Component', function() {
  jsdom({ skipWindowCheck: true });

  it('It should have a RecipeChoose component', function() {
    //console.log('signin', SignIn);
    var func = function(){};
    var component = TestUtils.renderIntoDocument(<RecipeChoose
              id={'1'}
              setChosenRecipes={func}
              getRecipes={func}
              recipes={[]}
              userMatch={''}/>);
    var renderedDom = TestUtils.scryRenderedDOMComponentsWithTag(component, 'DIV');
    assert.equal(renderedDom.length, 4);
  });
});