const log = require('../logger');
const sql = require("./db");

// constructor
const Token = function(student) {
    this.id = student.id;
    this.refresh_token = student.refresh_token;
}

// Create
Token.create = (newToken) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO token SET ?", newToken, (err, res) => {
            if(err) {
                log.error("[model.js] token create error : ", err.message);
                reject(err);
                return ;
            }
            log.info("create token: ", {...newToken});
            resolve({...newToken});
        });
    });
};

// Update
Token.updateById = (id, new_refresh_token) => {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE token SET refresh_token = ? WHERE id = ?",
        [new_refresh_token, id], (err, res) => {
            if(err){
                log.error("[model.js] token updateById error : ", err.message);
                reject(err);
                return ;
            }
            if(res.affectedRows == 0) {
                // not found with id
                reject({message: "not_found"});
                return ;
            }
            log.info("updated token: ", {id:id, refresh_token:new_refresh_token});
            resolve({id: id, refresh_token:new_refresh_token});
        });        
    });
};

// Retrieve by Id
Token.findById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM token WHERE id=\"${id}\"`, (err, res) => {
            if(err) {
                log.error("[model.js] token findById error : ", err.message);
                reject(err);
                return ;
            }
            if(!res.length) {
                reject({message: "not_found"}); // not found
                return ;
            }
            log.info("found token: ", res[0]);
            resolve(res[0]);
        });
    });
};

// Delete
Token.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM token WHERE id = ?", id, (err, res) => {
            if(err){
                log.error("[model.js] token remove error : ", err.message);
                reject(err);
                return ;            
            }
    
            if(res.affectedRows == 0){
                // not found with id
                reject({message: "not_found"});
                return ;
            }
            log.info("delete token with id: ", id);
            resolve(res);
        });
    });
};

module.exports = Token;