var express = require('express');
var router = express.Router();
var csurf = require('csurf');
var passport = require('passport');
var Order =require('../models/order');
var Cart =require('../models/cart');
var csurfProtection = csurf();
router.use(csurfProtection);
/* GET home page. */

router.get('/profile',isLoggedIn,function(req,res,next){
    Order.find({user: req.user},function(err,orders){
        if(err)
            return res.write('Error');
        else{
            var cart;
            orders.forEach(function(order){
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
                res.render('user/profile',{orders: orders})
        }
    })
})

router.get('/logout',isLoggedIn ,function(req,res,next){
    req.logout();
    res.redirect('/')
})

router.use('/',notLoggedIn,function(req,res,next){
    next();
})

router.get('/signup',function(req,res,next) {
    var messages = req.flash('error')
    res.render('user/signup', {title: 'Sign Up', csrfToken: req.csrfToken(), messages: messages})
})

router.post('/signup', passport.authenticate('local.signup',{
    failureRedirect: '/user/signup',
    failureFlash: true
}),function(req,res,next) {
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }
    else{
        res.redirect('/user/profile');
    }
})

router.get('/signin',function(req,res,next) {
    var messages = req.flash('error')
    res.render('user/signin', {title: 'Sign In', csrfToken: req.csrfToken(), messages: messages})
})

router.post('/signin', passport.authenticate('local.signin',{
    failureRedirect: '/user/signin',
    failureFlash: true
}),function(req,res,next) {
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }
    else{
        res.redirect('/user/profile');
    }
})


function isLoggedIn(req,res,next) {
    if(req.isAuthenticated())
        return next();
    res.redirect('/');
}

function notLoggedIn(req,res,next) {
    if(!req.isAuthenticated())
        return next();
    res.redirect('/');
}
module.exports = router;
