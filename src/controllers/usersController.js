const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
const { validationResult } = require("express-validator")

const userJson = () => {
    const usersFilePath = path.join(__dirname, '../data/usersDataBase.json');
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    return users;
}

const users = {
	register: (req, res) => {
		res.render('register')
	},
	userCreate: (req, res, next ) => {
		
        const error = validationResult(req);
		if( !error.isEmpty()){
			res.render("register", {error : error.mapped(), old:req.body})
		}
		const users = userJson();
		const {name,lastname,email,password} = req.body;
		const nuevaId = Date.now();
		let newUser = {
			id:+nuevaId,
			name:name.trim(),
			lastname: lastname.trim(),
			email: email.trim(),
			password
		}
		users.push(newUser);
		const json = JSON.stringify(users);
		fs.writeFileSync(usersFilePath, json, 'utf-8');
		res.redirect('/')
	}


}

module.exports = users;