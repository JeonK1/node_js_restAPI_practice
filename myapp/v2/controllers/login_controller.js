const bcrypt = require("bcryptjs");
const Teacher = require("../models/teacher_model");
const Token = require("../controllers/token_controller");
require('dotenv').config();

// sign up
exports.signUp = (req, res) => {
    // validate request
    if (!req.body) {
        // body 가 비어있을 때
        res.status(404).send({
            message: "content can not be empty"
        });
    }

    // Create Teacher
    const teacher = new Teacher({
        id: req.body.id,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone
    });

    // password hashing
    let cur_data;
    bcrypt.hash(teacher.password, 8)
        .then(hash => {
            // adapt hashed password to teacher object
            teacher.password = hash;
            return Teacher.create(teacher);
        })
        .then(data => {
            cur_data = data;
            return Token.get_token(data.id);
        })
        .then(result => {
            return Token.generate_access_token(result.refresh_token);
        })
        .then(new_access_token => {
            // generate token success
            console.log("access token is " + new_access_token);
            res.setHeader("jwt-access-token", new_access_token); // set access token
            res.send(cur_data);
        })
        .catch(err => {
            if(err.message === "invalid_signature") {
                res.status(401).send({
                    message: "invalid refresh_token (signature)"
                });                                                
            } else {
                res.status(500).send({
                    message: err.message
                });
            }
        })
};

// sign in
exports.signIn = (req, res) => {
    // validate request
    if (!req.body) {
        // body 가 비어있을 때
        res.status(404).send({
            message: "content can not be empty"
        });
    }

    // check id exists and password validation
    let cur_refresh_token = "";
    Teacher.findById(req.body.id)
        .then(results => {
            return bcrypt.compare(req.body.password, results.password);
        })
        .then(is_matched => {
            if(!is_matched){
                // password not matched
                return new Promise((resolve, reject) => {
                    reject({message: "password_not_match"});
                });
            } else {
                // success login
                return Token.get_token(req.body.id);        
            }
        })
        .then(result => {
            // send result
            cur_refresh_token = result.refresh_token;
            return Token.generate_access_token(result.refresh_token);
        })
        .then(new_access_token => {
            // generate token success
            console.log("access token is " + new_access_token);
            console.log("refresh token is " + cur_refresh_token);
            res.setHeader("jwt-access-token", new_access_token); // set access token
            res.setHeader("jwt-refresh-token", cur_refresh_token); // set refresh token
            res.status(200).send({
                message: "login success"
            });
        })
        .catch(err => {
            if(err.message === "not_found"){
                // id not exists
                res.status(401).send({
                    message: "id not exists"
                });
            } else if(err.message === "invalid_signature") {
                // invalid refresh_token
                res.status(401).send({
                    message: "invalid refresh_token (signature)"
                });                                                
            } else if(err.message === "password_not_match") {
                // password not matched
                res.status(401).send({
                    message: "password is incorrect"
                });
            } else {
                // error
                res.status(500).send({
                    message: err.message
                });    
            }
        });
}