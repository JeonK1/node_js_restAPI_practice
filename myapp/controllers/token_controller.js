const jwt = require("jsonwebtoken");
const Token = require("../models/token_model");

// if id exists get refreshToken, else Create New Token and get refreshToken
exports.get_token = (id, res) => {
    Token.findById(id, (err, result) => {
        if(err){
            if(err.kind === "not_found"){
                // not exists id in db, create refresh_token
                // create refresh_token
                let token_body = {
                    id: id
                };
                let new_refresh_token = jwt.sign(token_body, "jwtsecret", {
                    expiresIn: '7d'
                });
                const token = new Token({
                    id: id,
                    refresh_token: new_refresh_token
                });

                // Save in database
                Token.create(token, (err, data) => {
                    if(err){
                        res(err, null);
                    } else {
                        res(null, data);
                    }
                });
            } else {
                // error
                res(err, null);
            }
        } else {
            // exists id in db, get refresh_token
            res(null, result);
        }
    });
};

exports.regenerate_refresh_token = (req, res) => {
    let refresh_token = req.get("jwt-refresh-token");
    jwt.verify(refresh_token, "jwtsecret", (err, payload) => {
        if(err){
            // invalid signature
            res.status(500).send({
                message: "invalid refresh_token (signature)"
            })
        } else {
            // valid signature
            let decoded = jwt.decode(refresh_token);
            Token.findById(decoded.id, (err, result) => {
                if(err){
                    if(err.kind === "not_found"){
                        // not exists id in db error
                        res.status(500).send({
                            message: "invalid refresh_token (id)"
                        });
                    } else {
                        // error
                        res.status(500).send({
                            message: err.message
                        });
                    }
                } else {
                    // exists id in db
                    if(refresh_token !== result.refresh_token){
                        // invalid refresh_token
                        res.status(500).send({
                            message: "invalid refresh token (refresh_token)"
                        });
                    } else {
                        // valid refresh_token, update refresh_token
                        let token_body = {
                            id: decoded.id
                        };
                        let new_refresh_token = jwt.sign(token_body, "jwtsecret", {
                            expiresIn: '7d'
                        });
                        // Save in database
                        Token.updateById(decoded.id, new_refresh_token, (err, data) => {
                            if(err){
                                // update error
                                res.status(500).send({
                                    message:err.message
                                });
                            } else {
                                // update success
                                res.send(data);
                            }
                        });
                    }
                }
            });            
        }
    });
};

exports.regenerate_access_token = (req, res) => {
    let refresh_token = req.get("jwt-refresh-token");
    jwt.verify(refresh_token, "jwtsecret", (err, payload) => {
        if(err){
            // invalid signature
            res.status(500).send({
                message: "invalid refresh_token (signature)"
            })
        } else {
            // valid signature
            let decoded = jwt.decode(refresh_token);
            Token.findById(decoded.id, (err, result) => {
                if(err){
                    if(err.kind === "not_found"){
                        // not exists id in db error
                        res.status(500).send({
                            message: "invalid refresh_token (id)"
                        });
                    } else {
                        // error
                        res.status(500).send({
                            message: err.message
                        });
                    }
                } else {
                    // exists id in db
                    if(refresh_token !== result.refresh_token){
                        // invalid refresh_token
                        res.status(500).send({
                            message: "invalid refresh token (refresh_token)"
                        });
                    } else {
                        // valid refresh_token, update refresh_token
                        let token_body = {
                            id: decoded.id
                        };
                        let new_access_token = jwt.sign(token_body, "jwtsecret", {
                            expiresIn: '3h'
                        });
                        res.setHeader("jwt-access-token", new_access_token);
                        res.status(200).send({
                            message: "success regenerate access token"
                        });
                    }
                }
            });            
        }
    });
};

exports.test = (req, res) => {
    res.status(200).send({
        message: "empty test"
    });
};
