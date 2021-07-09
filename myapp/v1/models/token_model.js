const sql = require("./db");

// constructor
const Token = function(student) {
    this.id = student.id;
    this.refresh_token = student.refresh_token;
}

// Create
Token.create = (newToken, result) => {
    sql.query("INSERT INTO token SET ?", newToken, (err, res) => {
        if(err) {
            console.log("[model.js] token create error : ", err);
            result(err, null);
            return ;
        }

        console.log("create token: ", {...newToken});
        result(null, {...newToken});
    });
};

// Update
Token.updateById = (id, new_refresh_token, result) => {
    sql.query("UPDATE token SET refresh_token = ? WHERE id = ?",
    [new_refresh_token, id], (err, res) => {
        if(err){
            console.log("[model.js] token updateById error : ", err);
            result(err, null);
            return ;
        }
        if(res.affectedRows == 0) {
            // not found with id
            result({kind: "not_found"}, null);
            return ;
        }

        console.log("updated token: ", {id:id, refresh_token:new_refresh_token});
        result(null, {id: id, refresh_token:new_refresh_token});
    });
};

// Retrieve by Id
Token.findById = (id, result) => {
    sql.query(`SELECT * FROM token WHERE id=\"${id}\"`, (err, res) => {
        if(err) {
            console.log("[model.js] token findById error : ", err);
            result(err, null);
            return ;
        }
        if(res.length) {
            console.log("found token: ", res[0]);
            result(null, res[0]);
            return ;
        }
        result({kind: "not_found"}, null); // not found
    });
};

// Delete
Token.remove = (id, result) => {
    sql.query("DELETE FROM token WHERE id = ?", id, (err, res) => {
        if(err){
            console.log("[model.js] token remove error : ", err);
            result(err, null);
            return ;            
        }

        if(res.affectedRows == 0){
            // not found with id
            result({kind: "not_found"}, null);
            return ;
        }

        console.log("delete token with id: ", id);
        result(null, res);
    });
};

module.exports = Token;