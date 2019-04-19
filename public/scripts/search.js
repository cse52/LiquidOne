$('#product-search').on('input', function() {
  var search = $(this).serialize();
  if(search === "search=") {
    search = "all"
  }
  $('#before-hide').css("display", "none");
  $('#after-hide').css("display", "initial");

  $.get('/products?' + search, function(data) {
    $('#after-hide').html('');
    $('#after-hide').append(`
        <div class="container-liq">
          <div class="cont-liq-title">
            <span class="font-weight-bold" style="color: grey">Search Results</span>
          </div>
        </div>
    `);

    data.forEach(function(product) {
      $('#after-hide').append(`
          <div class="col-md-2 col-sm-3 col-xs-6">
            <a href="/products/${ product._id }" class="card">
              <div class="thumbnail">
                <img src="${ product.image }">
                <div class="caption" style="text-align: center;">
                  <span class="small-green-text">₹ ${ product.cost } </span>
                  <h6 class="small-grey-text">${ product.name }</h6>
                </div>
              </div>
            </a>
          </div>      
      `);
      $('#after-hide').addClass("container-liq");
    });
  });
});

$('#product-search').submit(function(event) {
  event.preventDefault();
});