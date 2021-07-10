const bcrypt = require("bcryptjs");
const Teacher = require("../models/teacher_model");
const Token = require("../controllers/token_controller");
require('dotenv').config();

// sign up
exports.signUp = async (req, res) => {
    // validate request
    if (Object.keys(req.body).length === 0) {
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
    try {
        let hash = await bcrypt.hash(teacher.password, 8);
        teacher.password = hash; // adapt hashed password to teacher object
        await Teacher.create(teacher);
        let refresh_token_body = await Token.get_token(teacher.id);
        let refresh_token = refresh_token_body.refresh_token;
        let new_access_token = await Token.generate_access_token(refresh_token);
        console.log("access token is " + new_access_token);
        res.setHeader("jwt-access-token", new_access_token); // set access token
        res.send(teacher);
    } catch (err) {
        if(err.message === "invalid_signature") {
            res.status(401).send({
                message: "invalid refresh_token (signature)"
            });                                                
        } else {
            res.status(500).send({
                message: err.message
            });
        }
    }
};

// sign in
exports.signIn = async (req, res) => {
    // validate request
    if (Object.keys(req.body).length === 0) {
        // body 가 비어있을 때
        res.status(404).send({
            message: "content can not be empty"
        });
    }

    // check id exists and password validation
    try {
        let teacher = await Teacher.findById(req.body.id);
        let is_matched = await bcrypt.compare(req.body.password, teacher.password);
        if(!is_matched){
            // password not matched
            throw new Error("password_not_match");
        }
        let refresh_token_body = await Token.get_token(req.body.id);
        let cur_refresh_token = refresh_token_body.refresh_token;
        let new_access_token = await Token.generate_access_token(cur_refresh_token);
        console.log("access token is " + new_access_token);
        console.log("refresh token is " + cur_refresh_token);
        res.setHeader("jwt-access-token", new_access_token); // set access token
        res.setHeader("jwt-refresh-token", cur_refresh_token); // set refresh token
        res.status(200).send({
            message: "login success"
        });
    } catch (err) {
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
    }
}