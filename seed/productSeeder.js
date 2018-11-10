var Product = require('../models/product');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shoppingcart');

var products = [
    new Product({
        imagePath: 'http://demo.ajax-cart.com/var/photo/product/2000x4000/4/176/4.jpg',
        title: 'Product 1',
        price: 20,
        description: 'Awesome Product'
    }),
    new Product({
        imagePath: 'http://demo.ajax-cart.com/var/photo/product/2000x4000/65/237/5.jpg',
        title: 'Product 2',
        price: 30,
        description: 'Awesome Product'
    }),
    new Product({
        imagePath: 'http://demo.ajax-cart.com/var/photo/product/2000x4000/62/234/2.jpg',
        title: 'Product 3',
        price: 40,
        description: 'Awesome Product'
    }),
    new Product({
        imagePath: 'http://demo.ajax-cart.com/var/photo/product/2000x4000/81/253/6.jpg',
        title: 'Product 4',
        price: 50,
        description: 'Awesome Product'
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err,result) {
        done++;
        if(done === products.length)
            exit();
    });
}

function exit() {
    mongoose.disconnect();
}