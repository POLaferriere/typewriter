import $ from 'jquery';
import Backbone from 'backbone';

let recipes;

$.ajaxSetup({
  beforeSend(xhr, options) {
    if(options.url.match(/api.parse.com/)) {
      xhr.setRequestHeader('X-Parse-Application-Id', 'xR0Bhh88xR6hkxv6q8p1YUJaJYBXQM3dA01XusCc');
      xhr.setRequestHeader('X-Parse-REST-API-Key', 'f0OGjDzDvjj4V4XFlayTeGV406RRlIo0a6APSEBI');
    }
  }
})

const Recipe = Backbone.Model.extend({
  idAttribute: "objectId",
  defaults() {
    return {
      ingredients: []
    };
  }
});

const RecipesCollection = Backbone.Collection.extend({
  url: "https://api.parse.com/1/classes/Recipe",
  model: Recipe,
  parse(response) {
    return response.results;
  }
});

export default {
  getRecipeCollection(){
    return (recipes = recipes || new RecipesCollection())
  },

  getNewRecipe() {
    return new Recipe();
  }
};
