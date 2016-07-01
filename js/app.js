$('#search-button').on('click', getUserQuery);
$(document).on('keypress', function(key) {
  //keyCode == 13 is the ENTER key
  if (key.keyCode == 13) {
    getUserQuery();
  }
});

function getUserQuery() {
  $('.loader').fadeIn('slow');
  getResults($('#search-box').val());
  $('#search-box').val('');
}

function getResults(query) {
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
  }).done(ajaxDone).fail(ifResultsFail);
}

function resultsIntoListItem(output, product) {
  var source   = $("#product-list-item").html();
  var template = Handlebars.compile(source);
  product.isSale = (product.salePrice < product.regularPrice) && (product.salePrice);
  output += template(product);
  return output;
}

function clampItemTitle(index, element) {
  $clamp(element, {
    clamp: 3
  });
}

function ifResultsFail(jqXHR, error, errorThrown) {
  console.log(jqXHR);
  console.log(error);
  console.log(errorThrown);
}

function ajaxDone(result) {
  var output = '';
  if (result.products.length == 0) {
    alert('No Results Found!');
  } else {
    if (!result.error && result.products) {
      console.log(result.products);
      output = result.products.reduce(resultsIntoListItem, '');
    } else {
      output = 'Unable to access products (see browser console for more information)';
    }
    $('.results ul').html(output);
    $('.clamp-this').each(clampItemTitle);
  }
  $('.loader').fadeOut('slow');
}
