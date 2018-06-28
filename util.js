import dataJSON from "./data.json";

const products = dataJSON.products;

function getProduct(id) {
	let product = false;
	products.forEach(item => {
		if (item.id == id) {
			product = item;
			return false;
		}	
	});
	return product;
}

module.exports = { getProduct }