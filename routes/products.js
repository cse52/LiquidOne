var express = require("express");
var router  = express.Router();
var Product = require("../models/product");
var Review = require("../models/review");
var middleware = require("../middleware");
var { isLoggedIn, isMerchant, checkUserProduct, checkUserReview, isAdmin } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all products
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all products from DB
      Product.find({name: regex}, function(err, allProducts){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allProducts);
         }
      });
  } else {
      // Get all products from DB
      Product.find({}, function(err, allProducts){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allProducts);
            } else {
              res.render("products/index",{products: allProducts, page: 'products'});
            }
         }
      });
  }
});

//CREATE - add new product to DB
router.post("/", isLoggedIn, isMerchant, function(req, res){
  var cur_author = {
      id: req.user._id,
      username: req.user.username
  }
  var newCampground = {name: req.body.name, brand: req.body.brand, catagory: req.body.catagory, cost: req.body.cost, description: req.body.description, image: req.body.image, author: cur_author};
  // Create a new product and save to DB
  Product.create(newCampground, function(err, newlyCreated){
      if(err){
          console.log(err);
      } else {
          //redirect back to products page
          console.log(newlyCreated);
          res.redirect("/products");
      }
  });
});

//NEW - show form to create new product
router.get("/new", isLoggedIn, isMerchant, function(req, res){
   res.render("products/new"); 
});

// SHOW - shows more info about one product
router.get("/:id", function(req, res){
    //find the product with provided ID
    Product.findById(req.params.id).populate("reviews").exec(function(err, foundProduct){
        if(err || !foundProduct){
            console.log(err);
            req.flash('error', 'Sorry, that product does not exist!');
            return res.redirect('/products');
        }
        // console.log("**** ")
        // console.log(foundProduct)
        //render show template with that product
        res.render("products/show", {product: foundProduct});
    });
});

// EDIT - shows edit form for a product
router.get("/:id/edit", isLoggedIn, checkUserProduct, function(req, res){
  //render edit template with that product
  res.render("products/edit", {product: req.product});
});

// PUT - updates product in the database
router.put("/:id", function(req, res){
    var newData = {name: req.body.name, brand: req.body.brand, catagory: req.body.catagory, cost: req.body.cost, description: req.body.description, image: req.body.image};
    Product.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, product){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/products/" + product._id);
        }
    });
});

// DELETE - removes product and its reviews from the database
router.delete("/:id", isLoggedIn, checkUserProduct, function(req, res) {
    Review.remove({
      _id: {
        $in: req.product.reviews
      }
    }, function(err) {
      if(err) {
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          req.product.remove(function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
            req.flash('error', 'Product deleted!');
            res.redirect('/products');
          });
      }
    })
});

module.exports = router;

