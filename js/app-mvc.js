/* MVC */

/* Model */

var bestBuy = {};

bestBuy.Model = function() {

}

bestBuy.Model.prototype.getResults = function(query) {
  var url = 'https://api.bestbuy.com/v1/products((name=' + query + '*)&type!=BlackTie&customerTopRated=true)?sort=salesRankShortTerm.asc';
  $.ajax({
    method: 'GET',
    url: url,
    data: {
      format: 'json',
      apiKey: 't5reggzup769kevta2bdabkx',
      page: 1,
      pageSize: 36
    },
    cache: true, // necessary because our API rejects queries with unrecognized query parameters, such as the underscore injected when this isn't included
    preowned: false,
    active: true,
    dataType: 'jsonp'
  }).done(this.ajaxDone.bind(this)).fail(this.ifResultsFail.bind(this));
}

bestBuy.Model.prototype.ajaxDone = function(result) {
  var output = '';
  if (result.products.length == 0) {
    alert('No Results Found!');
  } else {
    this.resultsIntoListItem(result);
  }
}

bestBuy.Model.prototype.ifResultsFail = function(jqXHR, error, errorThrown) {
  console.log(jqXHR);
  console.log(error);
  console.log(errorThrown);
}

/* View */
bestBuy.View = function() {
  this.searchBox = $('#search-box');
  this.loadingAnimation = true;
  this.toggleAnimation();
  $('#search-button').on('click', this.getUserQuery.bind(this));
  $(document).on('keypress', function(key) {
    //keyCode == 13 is the ENTER key
    if (key.keyCode == 13) {
      this.getUserQuery();
    }
  }.bind(this));
};

bestBuy.View.prototype.getUserQuery = function() {
  if (this.getResults) {
    this.getResults(this.searchBox.val());
  }
  this.searchBox.val('');
}

bestBuy.View.prototype.resultsIntoListItem = function(result) {
  var output = '';
  if (!result.error && result.products) {
    //console.log(result.products);
    output = result.products.reduce(this.reduceItemResult, '');
  } else {
    output = 'Unable to access products (see browser console for more information)';
  }
  $('.results ul').html(output);
  $('.clamp-this').each(function(index, element) {
    $clamp(element, {
      clamp: 3
    });
  });
}


bestBuy.View.prototype.reduceItemResult = function(output, product) {
  var source = $("#product-list-item").html();
  var template = Handlebars.compile(source);
  product.isSale = (product.salePrice < product.regularPrice) && (product.salePrice);
  output += template(product);
  console.log(output);
  return output;
}


bestBuy.View.prototype.toggleAnimation = function() {
  if (this.loadingAnimation) {
    $('.loader').fadeOut('slow');
  } else {
    $('.loader').fadeIn('slow');
  }
  this.loadingAnimation = !this.loadingAnimation;
}

/* Controller */
bestBuy.Controller = function(model, view) {
  view.getResults = model.getResults.bind(model);
  model.resultsIntoListItem = view.resultsIntoListItem.bind(view);
};

/* Instantiating MVC  */
document.addEventListener('DOMContentLoaded', function() {
  var model = new bestBuy.Model();
  var view = new bestBuy.View();
  var controller = new bestBuy.Controller(model, view);
});
