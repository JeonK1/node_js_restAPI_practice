const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Teacher = require("../models/teacher_model");
const Token = require("../controllers/token_controller");
require('dotenv').config();

// sign up
exports.signUp = (req, res) => {
    // validate request
    if (!req.body) {
        // body 가 비어있을 때
        res.status(400).send({
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
    bcrypt.hash(teacher.password, 8, function(err,hash) {
        // adapt hashed password to teacher object
        teacher.password = hash;

        // Save in database
        Teacher.create(teacher, (err, data) => {
            if(err){
                res.status(500).send({
                    message: err.message
                });
            } else {
                Token.get_token(data.id, (err, result) => {
                    if(err){
                        res.status(500).send({
                            message: "failed get token"
                        });
                    } else {
                        // send result
                        jwt.verify(result.refresh_token, process.env.JWT_SECRET_KEY, (err, payload) => {
                            if(err){
                                // invalid signature
                                res.status(500).send({
                                    message: "failed create access token"
                                });    
                            } else {
                                // valid signature
                                let decoded = jwt.decode(result.refresh_token);
                                let token_body = {
                                    id: decoded.id
                                };
                                let new_access_token = jwt.sign(token_body, process.env.JWT_SECRET_KEY, {
                                    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
                                });
                                console.log("access token is " + new_access_token);
                                res.setHeader("jwt-access-token", new_access_token); // set access token
                                res.send(data);
                            }
                        });
                    }
                });
            }
        });
    });
};

// sign in
exports.signIn = (req, res) => {
    // validate request
    if (!req.body) {
        // body 가 비어있을 때
        res.status(400).send({
            message: "content can not be empty"
        });
    }

    // check id exists and password validation
    Teacher.findById(req.body.id, async (err, results) => {
        if(err){
            if(err.kind === "not_found"){
                // id not exists
                res.status(404).send({
                    message: "id not exists"
                });
            } else {
                // error
                res.status(500).send({
                    message: err.message
                });    
            }
        } else {
            if(!(await bcrypt.compare(req.body.password, results.password))) {
                // password not matched
                res.status(404).send({
                    message: "password is incorrect"
                });
            } else {
                // success login
                Token.get_token(req.body.id, (err, result) => {
                    if(err){
                        res.status(404).send({
                            message: "failed get token"
                        });
                    } else {
                        // send result
                        jwt.verify(result.refresh_token, process.env.JWT_SECRET_KEY, (err, payload) => {
                            if(err){
                                // invalid signature
                                res.status(500).send({
                                    message: "failed create access token"
                                });    
                            } else {
                                // valid signature
                                let decoded = jwt.decode(result.refresh_token);
                                let token_body = {
                                    id: decoded.id
                                };
                                let new_access_token = jwt.sign(token_body, process.env.JWT_SECRET_KEY, {
                                    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
                                });
                                console.log("access token is " + new_access_token);
                                console.log("refresh token is " + result.refresh_token);
                                res.setHeader("jwt-access-token", new_access_token); // set access token
                                res.setHeader("jwt-refresh-token", result.refresh_token); // set refresh token
                                res.status(200).send({
                                    message: "login success"
                                });
                            }
                        });                 
                    }
                });
            }
        }
    });
}