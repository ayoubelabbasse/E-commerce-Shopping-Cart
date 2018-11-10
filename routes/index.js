var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Order = require('../models/order');
var csurf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');

var csurfProtection = csurf();
//router.use(csurfProtection);
/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err,docs) {
        var success = req.flash('success')[0];
        var productsChunk = [];
        var chunk = 3;
        for (var i = 0; i < docs.length; i+=chunk) {
            productsChunk.push(docs.slice(i,i+chunk))
        }
        res.render('shop/index', { title: 'Express', products: productsChunk, successMessage: success, noError: !success });
    });
});

router.get('/add-to-cart/:id', function(req, res, next) {
    var productID = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productID, function(err,product){
        if(err)
            res.redirect('/');
        cart.add(product,product.id);
        req.session.cart = cart;
        res.redirect("/");
    });
});

router.get('/reduce/:id', function(req, res, next) {
    var productID = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduce(productID);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
    var productID = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.remove(productID);
    req.session.cart = cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
    if(!req.session.cart){
        res.render('shop/shoppingCart',{products : null});
    }
    else{
        var cart = new Cart(req.session.cart);
        res.render('shop/shoppingCart',{products : cart.generateArray(), totalPrice: cart.totalPrice});
}
    });

router.get('/checkout', isLoggedIn, function(req, res, next) {
    if(!req.session.cart){
        res.redirect('/shoppingCart');
    }
    else{
        var cart = new Cart(req.session.cart);
        var errors = req.flash('error')[0];
        res.render('shop/checkout',{totalPrice: cart.totalPrice, /*csrfToken: req.csrfToken(),*/ errors: errors, noError: !errors});
}
    });

router.post('/checkout', isLoggedIn, function(req, res, next) {
    if(!req.session.cart){
        res.redirect('/shoppingCart');
    }
    else{
        var stripe = require("stripe")(
      "sk_test_2nwZNq5HqnWIzh6m1fhnADmA"
    );
        var cart = new Cart(req.session.cart);
        stripe.charges.create({
          amount: cart.totalPrice * 100,
          currency: "usd",
          source: req.body.stripeToken, // obtained with Stripe.js
          description: "Charge"
        }, function(err, charge) {
          if(err){
            req.flash('error',err.message);
            res.redirect('/checkout');
            }
            else{
                var order = new Order({
                    user: req.user,
                    cart: cart,
                    addresse: req.body.address,
                    name: req.body.name,
                    paymentId: charge.id
                });
                order.save(function(err,result){
                    req.flash('success','successfly bought products');
                    req.session.cart = null;
                    res.redirect('/');
                });
            }

        });
        }
    });

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated())
        return next();
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

module.exports = router;
