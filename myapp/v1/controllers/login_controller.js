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
                        res.status(404).send({
                            message: "failed get token"
                        });
                    } else {
                        // send result
                        Token.generate_access_token(result.refresh_token, (err, new_access_token) => {
                            if(err){
                                if(err.kind=="invalid_signature") {
                                    res.status(401).send({
                                        message: "invalid refresh_token (signature)"
                                    });                                                
                                } else {
                                    res.status(500).send({
                                        message: err.message
                                    });
                                }
                            } else {
                                // generate token success
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
        res.status(404).send({
            message: "content can not be empty"
        });
    }

    // check id exists and password validation
    Teacher.findById(req.body.id, async (err, results) => {
        if(err){
            if(err.kind === "not_found"){
                // id not exists
                res.status(401).send({
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
                res.status(401).send({
                    message: "password is incorrect"
                });
            } else {
                // success login
                Token.get_token(req.body.id, (err, result) => {
                    if(err){
                        res.status(500).send({
                            message: "failed get token"
                        });
                    } else {
                        // send result
                        Token.generate_access_token(result.refresh_token, (err, new_access_token) => {
                            if(err){
                                if(err.kind=="invalid_signature") {
                                    res.status(401).send({
                                        message: "invalid refresh_token (signature)"
                                    });                                                
                                } else {
                                    res.status(500).send({
                                        message: err.message
                                    });
                                }
                            } else {
                                // generate token success
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