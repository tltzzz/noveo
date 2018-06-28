import Koa from "koa";
import Router from "koa-router";
import Cookie from "koa-cookie";
import dataJSON from "./data.json";
import { getAuth } from "./auth";
import { getProduct } from "./util";
import bodyParser from "koa-bodyparser";
import Cart from "./cart";

const app = new Koa();
const router = new Router();
var carts = new Cart();

app.use(Cookie());
app.use(bodyParser());

app.use(async (ctx, next) => {
	ctx.user = getAuth(ctx);	 
	await next();
});

router
	.get("/api/products", async (ctx) => {	
		let result = {
			data: dataJSON.products
		};		
		ctx.body = result;
	})

	.delete("/api/cart/:id", async (ctx) => {
		const productId = ctx.params.id;
		const product = getProduct(productId);

		if (product === false) {
			ctx.status = 400;
			ctx.body = {
				"status": "error",
				"message": "Product not found"
			};
			return false;		
		}

		carts.removeProduct(ctx.user, product);
		let result = {
			status: "ok"
		};	
		ctx.body = result;
	})

	.get("/api/cart", async (ctx) => {
		const cart = carts.getCart(ctx.user);
		let result = {
			status: "ok",
			data: cart
		};	

		ctx.body = result;
	})
	.post("/api/cart", async (ctx) => {
		const req = ctx.request.body;

		let error = {
			params: [],
			type: "invalid_param_error",
			message: "Invalid data parameters"
		};

		if (typeof req.product_id === "undefined") {
			error.params.push({
				"code":"required",
				"message":"Product cannot be blank.", 
				"name":"product_id"
			});
		}

		if (typeof req.quantity === "undefined") {
			error.params.push({
				"code":"required",
				"message":"Quantity cannot be blank.", 
				"name":"quantity"
			});
		}

		if (error.params.length > 0) {
			ctx.status = 400;
			ctx.body = { error };
			return false;		
		}

		const product = getProduct(req.product_id);
		const quantity = Number(req.quantity);

		if (product === false) {

			ctx.status = 400;
			ctx.body = {
				"status": "error",
				"message": "Product not found"
			};
			return false;	

		} if (isNaN(quantity) || quantity < 1 || quantity > 10) {
			ctx.status = 400;
			ctx.body = {
				"status": "error",
				"message": "Quantity parametr invalid"
			};
			return false;	
		} else {

			carts.addProduct(ctx.user, product, quantity);

			let result = {
				status: "ok"
			};	

			ctx.body = result;
		}
	});

app
	.use(router.routes())
	.use(router.allowedMethods());

app.listen(3000);