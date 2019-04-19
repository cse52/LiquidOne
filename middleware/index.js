var Review = require('../models/review');
var Product = require('../models/product');
module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'You must be signed in to do that!');
      res.redirect('/login');
  },
  isMerchant: function(req, res, next){
      if(req.user.isMerchant === true){
        return next();
      }
      req.flash('error', 'You don\'t have a seller license.');
      res.redirect('/products');
  },
  checkUserProduct: function(req, res, next){
    Product.findById(req.params.id, function(err, foundProduct){
      if(err || !foundProduct){
          console.log(err);
          req.flash('error', 'Sorry, that product does not exist!');
          res.redirect('/products');
      } else if(foundProduct.author.id.equals(req.user._id) || req.user.isAdmin){
          req.product = foundProduct;
          return next();
      } else {
          req.flash('error', 'You don\'t have permission to do that!');
          res.redirect('/products/' + req.params.id);
      }
    });
  },
  checkUserReview: function(req, res, next){
    Review.findById(req.params.reviewId, function(err, foundReview){
       if(err || !foundReview){
           console.log(err);
           req.flash('error', 'Sorry, review does not exist!');
           res.redirect('/products');
       } else if(foundReview.author.id.equals(req.user._id) || req.user.isAdmin){
            req.review = foundReview;
            return next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/products/' + req.params.id);
       }
    });
  },
  isAdmin: function(req, res, next) {
    if(req.user.isAdmin) {
      return next();
    } else {
      req.flash('error', 'You Are Not Admin');
      res.redirect('back');
    }
  }
}