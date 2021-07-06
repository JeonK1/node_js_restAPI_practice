const Teacher = require("../models/teacher_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
                // send result
                res.send(data);
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
                // make token
                req.body.password=null; // against password leak
                let token = jwt.sign(req.body, "jwtsecret", {
                    expiresIn: '1h'
                });
                
                //send result
                console.log("token is "+token);
                res.setHeader("jwt-token", token); // set token
                res.status(200).send({
                    message: "login success"
                });
            }   
        } 
    });
}