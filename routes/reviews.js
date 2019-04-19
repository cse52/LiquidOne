const express = require("express");
const router  = express.Router({mergeParams: true});
const Product = require("../models/product");
const Review = require("../models/review");
const middleware = require("../middleware");
const { isLoggedIn, checkUserReview, isAdmin } = middleware;

//Reviews New
router.get("/new", isLoggedIn, function(req, res){
    // find product by id
    // console.log(req.params.id);
    Product.findById(req.params.id, function(err, product){
        if(err){
            console.log(err);
        } else {
             res.render("reviews/new", {product: product});
        }
    })
});

//Reviews Create
router.post("/", isLoggedIn, function(req, res){
   //lookup product using ID
   Product.findById(req.params.id, function(err, product){
       if(err){
           console.log(err);
           res.redirect("/products");
       } else {
        console.log("****" + product);
        Review.create(req.body.review, function(err, review){
           if(err){
               req.flash("error", "Something went wrong!");
               console.log(err);
           } else {
               //add username and id to review
               review.author.id = req.user._id;
               review.author.username = req.user.username;
               //save review
               review.save();
               product.reviews.push(review);
               product.save();
               console.log("//////////////////after product save////////////////");
               req.flash('success', 'Thank You for your Review!');
               res.redirect('/products/' + product._id);
           }
        });
       }
   });
});

router.get("/:reviewId/edit", isLoggedIn, checkUserReview, function(req, res){
  res.render("reviews/edit", {product_id: req.params.id, review: req.review});
});

router.put("/:reviewId", isAdmin, function(req, res){
   Review.findByIdAndUpdate(req.params.reviewId, req.body.review, function(err, review){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/products/" + req.params.id);
       }
   }); 
});

router.delete("/:reviewId", isLoggedIn, checkUserReview, function(req, res){
  // find product, remove review from reviews array, delete review in db
  Product.findByIdAndUpdate(req.params.id, {
    $pull: {
      reviews: req.review.id
    }
  }, function(err) {
    if(err){ 
        console.log(err)
        req.flash('error', err.message);
        res.redirect('/');
    } else {
        req.review.remove(function(err) {
          if(err) {
            req.flash('error', err.message);
            return res.redirect('/');
          }
          req.flash('error', 'Review deleted!');
          res.redirect("/products/" + req.params.id);
        });
    }
  });
});

module.exports = router;