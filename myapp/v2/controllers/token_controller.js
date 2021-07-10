const jwt = require("jsonwebtoken");
const Token = require("../models/token_model");
require('dotenv').config()

// if id exists get refreshToken, else Create New Token and get refreshToken
exports.get_token = (id) => {
    return new Promise((resolve, reject) => {
        Token.findById(id)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
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
                    Token.create(token)
                        .then(result => {
                            resolve(result);
                        })
                        .catch(err => {
                            reject(err)
                        });
                } else {
                    reject(err);
                }
            });
    });
};

exports.regenerate_refresh_token = (req, res) => {
    let refresh_token = req.get("jwt-refresh-token");
    jwt.verify(refresh_token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if(err){
            // invalid signature
            res.status(401).send({
                message: "invalid refresh_token (signature)"
            })
        } else {
            // valid signature
            Token.findById(decoded.id)
                .then(result => {
                    // Todo : 여기 개선 예정
                    if(refresh_token !== result.refresh_token){
                        // invalid refresh_token
                        res.status(403).send({
                            message: "invalid refresh token (refresh_token)"
                        });
                    } else {
                        // valid refresh_token, update refresh_token
                        let token_body = {
                            id: decoded.id
                        };
                        let new_refresh_token = jwt.sign(token_body, process.env.JWT_SECRET_KEY, {
                            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE
                        });
                        // Save in database
                        Token.updateById(decoded.id, new_refresh_token)
                            .then(result => {
                                // update success
                                res.send(result);
                            })
                            .catch(err => {
                                // update error
                                res.status(500).send({
                                    message:err.message
                                });
                            });
                    }
                })
                .catch(err => {
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
                });            
        }
    });
};

exports.regenerate_access_token = (req, res) => {
    let refresh_token = req.get("jwt-refresh-token");
    jwt.verify(refresh_token, "jwtsecret", (err, decoded) => {
        if(err){
            // invalid signature
            res.status(401).send({
                message: "invalid refresh_token (signature)"
            })
        } else {
            // valid signature
            Token.findById(decoded.id)
             .then(result => {
                    // exists id in db
                    if(refresh_token !== result.refresh_token){
                        // invalid refresh_token
                        res.status(403).send({
                            message: "invalid refresh token (refresh_token)"
                        });
                    } else {
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
                    }
             })
             .catch(err => {
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
             });        
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
