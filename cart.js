module.exports = class Cart {
	constructor() {
		this.carts = {};
	}	

	removeProduct(user, product) {
		let exist = false;
		this.carts[user].products.forEach((item, index) => {
			let quantity = this.carts[user].products[index].quantity;
			if (item.id === product.id) {
				if (quantity === 1) {	
					this.carts[user].products.splice(index, 1);
				} else {					
					this.carts[user].products[index].quantity -= 1;
					this.carts[user].products[index].sum = this.carts[user].products[index].quantity * product.price;
				}
				exist = true;
				return false;
			}
		});

		this.refreshCart(user);	
	}

	addProduct(user, product, quantity) {
		quantity = parseInt(quantity);
		this.getCart(user);	
		let products = this.carts[user].products;
		let exist = false;
		products.forEach((item, index) => {
			if (item.id === product.id) {
				this.carts[user].products[index].quantity += quantity;
				this.carts[user].products[index].sum = this.carts[user].products[index].quantity * product.price;
				exist = true;
				return false;
			}
		});

		if (exist === false) {
			let put = { 
				id: product.id, 
				quantity: quantity,
				sum: quantity * product.price  
			};
			this.carts[user].products.push(put);
		}

		this.refreshCart(user);
	}

	refreshCart(user) {
		let total_sum = 0;
		let count = 0;
		this.carts[user].products.forEach(item => {
			total_sum += parseInt(item.sum);
			count += parseInt(item.quantity)
		});

		this.carts[user].total_sum = total_sum;
		this.carts[user].products_count = count;
	}

	getCart(user) {
		let cart = false;

		Object.keys(this.carts).forEach( key => {
		  let obj = this.carts[key];
		  if (key === user) {
		 		cart = obj;
		 		return false;
			}		  
		});

		if (cart === false) {
			this.carts[user] = {
				user: user,
				total_sum: 0,
				products_count: 0,
				products: []
			};
		}

		cart = this.carts[user];

		return cart;
	}
}