const jwt = require("jsonwebtoken");
const Token = require("../models/token_model");
require('dotenv').config()

// if id exists get refreshToken, else Create New Token and get refreshToken
exports.get_token = async (id) => {
    return new Promise(async (resolve, reject) => {
        let token = await Token.findById(id)
            .catch(async err => {
                if(err.message === "not_found"){
                    // not exists id in db, create refresh_token
                    // create refresh_token
                    let token_body = {
                        id: id
                    };
                    let new_refresh_token = jwt.sign(token_body, process.env.JWT_SECRET_KEY, {
                        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE
                    });
                    const token = new Token({
                        id: id,
                        refresh_token: new_refresh_token
                    });

                    // Save in database
                    let result = await Token.create(token)
                        .catch(err => {
                            reject(err);
                        });
                    resolve(result);
                } else {
                    reject(err);
                }
            });
        resolve(token);
    });
};

exports.regenerate_refresh_token = async (req, res) => {
    let refresh_token = req.get("jwt-refresh-token");
    jwt.verify(refresh_token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if(err){
            // invalid signature
            res.status(401).send({
                message: "invalid refresh_token (signature)"
            })
            return;
        }
        try {
            // valid signature
            let result_body = await Token.findById(decoded.id);
            if(refresh_token !== result_body.refresh_token){
                // invalid refresh_token
                res.status(403).send({
                    message: "invalid refresh token (refresh_token)"
                });
                return;
            }
            // valid refresh_token, update refresh_token
            let token_body = {
                id: decoded.id
            };
            let new_refresh_token = jwt.sign(token_body, process.env.JWT_SECRET_KEY, {
                expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE
            });
            // Save in database
            let updated_token = await Token.updateById(decoded.id, new_refresh_token);
            res.send(updated_token);
        } catch (err) {
            if(err.message === "not_found"){
                // not exists id in db error
                res.status(403).send({
                    message: "invalid refresh_token (id)"
                });                 
            } else {
                // error
                res.status(500).send({
                    message: err.message
                });                        
            }
        }          
    });
};

exports.regenerate_access_token = async (req, res) => {
    let refresh_token = req.get("jwt-refresh-token");
    jwt.verify(refresh_token, "jwtsecret", async (err, decoded) => {
        if(err){
            // invalid signature
            res.status(401).send({
                message: "invalid refresh_token (signature)"
            });
            return ;
        }
        try {
            // valid signature
            let result = await Token.findById(decoded.id);
            if(refresh_token !== result.refresh_token){
                // invalid refresh_token
                res.status(403).send({
                    message: "invalid refresh token (refresh_token)"
                });
                return;
            }
            // valid refresh_token, update refresh_token
            let token_body = {
                id: decoded.id
            };
            let new_access_token = jwt.sign(token_body, "jwtsecret", {
                expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
            });
            res.setHeader("jwt-access-token", new_access_token);
            res.status(200).send({
                message: "success regenerate access token"
            });
        } catch (err) {
            if(err.message === "not_found"){
                // not exists id in db error
                res.status(403).send({
                    message: "invalid refresh_token (id)"
                });
            } else {
                // error
                res.status(500).send({
                    message: err.message
                });
            }
        }     
    });
};

exports.generate_access_token = (refresh_token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(refresh_token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if(err){
                // invalid signature
                reject({message: "invalid_signature"});
                return ;
            } else {
                // valid signature
                let token_body = {
                    id: decoded.id
                };
                let new_access_token = jwt.sign(token_body, process.env.JWT_SECRET_KEY, {
                    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE
                });
                resolve(new_access_token);
                return ;
            }
        });
    });
};

exports.test = (req, res) => {
    res.status(200).send({
        message: "empty test"
    });
};
