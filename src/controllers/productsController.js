const { log } = require('console');
const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const getJson = () => {
	const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
	const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
	return products
}
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");


const controller = {
	// Root - Show all products
	index: (req, res) => {
		const products = getJson();
		res.render("products", { products })
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const id = req.params.id;
		const products = getJson();
		const producto = products.find(producto => producto.id == id);
		res.render("detail", { title: producto.name, producto, toThousand });
	},

	// Create - Form to create
	create: (req, res) => {
		res.render("product-create-form")
	},

	// Create -  Method to store
	store: (req, res) => {
		const products = getJson();
		let file = req.file;
		const { name, price, discount, category, description } = req.body;
		const nuevaId = Date.now();
		let creacion = {
			id: +nuevaId,
			name: name.trim(),
			price: +price,
			discount: +discount,
			category,
			description: description.trim(),
			image: file ? file.filename : 'default.jpg'
		}
		products.push(creacion);
		const json = JSON.stringify(products);
		fs.writeFileSync(productsFilePath, json, 'utf-8');
		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		const id = req.params.id;
		const producto = products.find(producto => producto.id == id)
		res.render("product-edit-form", { producto });
	},
	
	// Update - Method to update
	update: (req, res) => {
		const id = req.params.id;
		const { name, price, discount, category, description, image } = req.body;
		const products = getJson()
		const nuevoArrary = products.map(producto => {
			if (producto.id == id) {
				return {
					id,
					name: name.trim(),
					price,
					discount,
					category,
					description: description.trim(),
					image: image ? image : producto.image
				}
			}
			return producto
		})
		const json = JSON.stringify(nuevoArrary);
		fs.writeFileSync(productsFilePath, json, "utf-8");
		res.redirect(`/products/detail/${id}`)
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		const { id } = req.params;
		const products = getJson();
		let product = products.find(product => product.id == id);
		let productClear = products.filter(product => product.id !== +req.params.id);
		const json = JSON.stringify(productClear);
		fs.unlink(path.join(__dirname, `../../public/images/products/${product.image}`), (err) => {
			if (err) throw err;
			console.log(`borre el archivo ${product.image}`);
		})
		fs.writeFileSync(productsFilePath, json, "utf-8");
		res.redirect('/products')
	}
};

module.exports = controller;