const sql = require("./db");

// constructor
const Teacher = function(teacher) {
    this.id = teacher.id;
    this.password = teacher.password;
    this.name = teacher.name;
    this.phone = teacher.phone;
}

// Create
Teacher.create = (newTeacher) => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO teacher SET ?", newTeacher, (err, res) => {
            if(err) {
                console.log("[model.js] teacher create error : ", err);
                reject(err);
                return ;
            }
            console.log("create teacher: ", {...newTeacher});
            resolve({...newTeacher});
        });
    });
};

// Update
Teacher.updateById = (id, teacher) => {
    return new Promise((resolve, reject) => {
        sql.query(`UPDATE teacher SET name = ?, phone = ? WHERE id = \"${id}\"`,
        [teacher.name, teacher.phone], (err, res) => {
            if(err){
                console.log("[model.js] teacher updateById error : ", err);
                reject(err);
                return ;
            }
            if(res.affectedRows == 0) {
                // not found with id
                reject({message: "not_found"});
                return ;
            }    
            console.log("updated teacher: ", {...teacher});
            resolve({...teacher});
        });
    });
};

// Retrieve by Id
Teacher.findById = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM teacher WHERE id=\"${id}\"`, (err, res) => {
            if(err) {
                console.log("[model.js] teacher findById error : ", err);
                reject(err);
                return ;
            }
            if(!res.length) {
                reject({message: "not_found"}); // not found
                return ;
            }
            console.log("found teacher: ", res[0]);
            resolve(res[0]);
        });    
    });
};

// Retrieve All
Teacher.getAll = () => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM teacher", (err, res) => {
            if(err){
                console.log("[model.js] teacher getAll error : ", err);
                reject(err);
                return ;
            }
            console.log("teacher: ", res);
            resolve(res);
        });
    });
};

// Delete
Teacher.remove = (id) => {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM teacher WHERE id = ?", id, (err, res) => {
            if(err){
                console.log("[model.js] teacher remove error : ", err);
                reject(err);
                return ;
            }
    
            if(res.affectedRows == 0){
                // not found with id
                reject({message: "not_found"});
                return ;
            }
    
            console.log("delete teacher with id: ", id);
            resolve(res);
        });
    });
};

module.exports = Teacher;