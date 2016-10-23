/* Global Variables */
// var searchTerm = '';

/* MVC */

/* Model */

var bestBuy = {};
var walmart = {};

bestBuy.Model = function() {};
walmart.Model = function() {};

walmart.Model.prototype.getWalmartResults = function(searchQuery) {
  $.ajax({
    method: 'GET',
    url: 'http://api.walmartlabs.com/v1/search',
    data: {
      apiKey: 'd76akfju4ezu6f97h7crev9b',
      numItems: 24,
      query: searchQuery
    },
    dataType: 'jsonp'
  }).done(this.ajaxDone.bind(this)).fail(this.ifResultsFail.bind(this));
};


bestBuy.Model.prototype.getBestBuyResults = function(searchQuery) {
  var url = 'https://api.bestbuy.com/v1/products((name=' + searchQuery + '*)&type!=BlackTie&customerTopRated=true)?sort=salesRankShortTerm.asc';
  $.ajax({
    method: 'GET',
    url: url,
    data: {
      format: 'json',
      apiKey: 't5reggzup769kevta2bdabkx',
      page: 1,
      pageSize: 24
    },
    cache: true, // necessary because our API rejects queries with unrecognized query parameters, such as the underscore injected when this isn't included
    preowned: false,
    active: true,
    dataType: 'jsonp'
  }).done(this.ajaxDone.bind(this)).fail(this.ifResultsFail.bind(this));
};

walmart.Model.prototype.ajaxDone = function(result) {
  console.log(result);
  var output = '';
  if (result.items.length === 0) {
    alert('No Results Found!');
  } else {
    // this.resultsIntoListItem(result);
    walmart.View.prototype.resultsIntoListItem(result);
  }
};

bestBuy.Model.prototype.ajaxDone = function(result) {
  console.log(result);
  var output = '';
  if (result.products.length === 0) {
    alert('No Results Found!');
  } else {
    // this.resultsIntoListItem(result);
    bestBuy.View.prototype.resultsIntoListItem(result);
  }
};

walmart.Model.prototype.ifResultsFail = function(jqXHR, error, errorThrown) {
  console.log(jqXHR);
  console.log(error);
  console.log(errorThrown);
};

bestBuy.Model.prototype.ifResultsFail = function(jqXHR, error, errorThrown) {
  console.log(jqXHR);
  console.log(error);
  console.log(errorThrown);
};


/* View */

walmart.View = function() {
  this.searchBox = $('#search-box');
  this.loadingAnimation = true;
  this.toggleAnimation();
  // $('#search-button').on('click', this.getUserQuery.bind(this));
  // $(document).on('keypress', function(key) {
  //   //keyCode === 13 is the ENTER key
  //   if (key.keyCode === 13) {
  //     this.getUserQuery();
  //   }
  // }.bind(this));
};

bestBuy.View = function() {
  this.searchBox = $('#search-box');
  this.loadingAnimation = true;
  this.toggleAnimation();
  // $('#search-button').on('click', this.getUserQuery.bind(this));
  // $(document).on('keypress', function(key) {
  //   //keyCode === 13 is the ENTER key
  //   if (key.keyCode === 13) {
  //     this.getUserQuery();
  //   }
  // }.bind(this));
};


// bestBuy.View.prototype.getUserQuery = function() {
//   if (this.getBestBuyResults) {
//     this.getBestBuyResults(this.searchBox.val());
//   }
//   this.searchBox.val('');
// }
//
// walmart.View.prototype.getUserQuery = function() {
//   if (this.getWalmartResults) {
//     this.getWalmartResults(this.searchBox.val());
//   }
//   this.searchBox.val('');
// }


walmart.View.prototype.resultsIntoListItem = function(result) {
  var output = '';
  if (!result.error && result.items) {
    output = result.items.reduce(this.reduceItemResult, '');
  } else {
    output = 'Unable to access products (see browser console for more information)';
  }
  $('.walmart-results ul').html(output);
  $('.clamp-this').each(function(index, element) {
    $clamp(element, {
      clamp: 3
    });
  });
};

bestBuy.View.prototype.resultsIntoListItem = function(result) {
  var output = '';
  if (!result.error && result.products) {
    output = result.products.reduce(this.reduceItemResult, '');
  } else {
    output = 'Unable to access products (see browser console for more information)';
  }
  $('.best-buy-results ul').html(output);
  $('.clamp-this').each(function(index, element) {
    $clamp(element, {
      clamp: 3
    });
  });
};

walmart.View.prototype.reduceItemResult = function(output, product) {
  var source = $("#walmart-product-list-item").html();
  var template = Handlebars.compile(source);
  product.isSale = (product.salePrice < product.regularPrice) && (product.salePrice);
  output += template(product);
  return output;
};


bestBuy.View.prototype.reduceItemResult = function(output, product) {
  var source = $("#best-buy-product-list-item").html();
  var template = Handlebars.compile(source);
  product.isSale = (product.salePrice < product.regularPrice) && (product.salePrice);
  output += template(product);
  return output;
};

walmart.View.prototype.toggleAnimation = function() {
  if (this.loadingAnimation) {
    $('.loader').fadeOut('slow');
  } else {
    $('.loader').fadeIn('slow');
  }
  this.loadingAnimation = !this.loadingAnimation;
};

bestBuy.View.prototype.toggleAnimation = function() {
  if (this.loadingAnimation) {
    $('.loader').fadeOut('slow');
  } else {
    $('.loader').fadeIn('slow');
  }
  this.loadingAnimation = !this.loadingAnimation;
};

/* Controller */

walmart.Controller = function(model, view) {
  view.getWalmartResults = model.getWalmartResults.bind(model);
  model.resultsIntoListItem = view.resultsIntoListItem.bind(view);
};

bestBuy.Controller = function(model, view) {
  view.getBestBuyResults = model.getBestBuyResults.bind(model);
  model.resultsIntoListItem = view.resultsIntoListItem.bind(view);
};

/* Instantiating MVC  */
document.addEventListener('DOMContentLoaded', function() {
  var bestBuyModel = new bestBuy.Model();
  var bestBuyView = new bestBuy.View();
  var bestBuycontroller = new bestBuy.Controller(bestBuyModel, bestBuyView);

  var walmartModel = new walmart.Model();
  var walmartView = new walmart.View();
  var walmartController = new walmart.Controller(walmartModel, walmartView);
});

$(document).ready(function() {
  $('#search-button').on('click', function() {
    searchTerm = $('#search-box').val();
    walmart.Model.prototype.getWalmartResults(searchTerm);
    bestBuy.Model.prototype.getBestBuyResults(searchTerm);
  });
});
$(document).on('keypress', function(key) {
  //keyCode === 13 is the ENTER key
  if (key.keyCode === 13) {
    searchTerm =  $('#search-box').val();
    walmart.Model.prototype.getWalmartResults(searchTerm);
    bestBuy.Model.prototype.getBestBuyResults(searchTerm);
  }
});
