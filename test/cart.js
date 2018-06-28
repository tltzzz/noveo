var chai = require('chai');
var expect = chai.expect; 
var Cart = require('./../cart');

describe('Cart', function() {
  it('getCart() should return { user: String, total_sum: Number, products_count: Number, products: Array }', function() {
    var cart = new Cart();
    expect(cart.getCart('uuid'))
    	.to.include.keys('total_sum', 'products_count', 'products');
  });
});