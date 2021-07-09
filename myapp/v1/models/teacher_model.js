const sql = require("./db");

// constructor
const Teacher = function(teacher) {
    this.id = teacher.id;
    this.password = teacher.password;
    this.name = teacher.name;
    this.phone = teacher.phone;
}

// Create
Teacher.create = (newTeacher, result) => {
    sql.query("INSERT INTO teacher SET ?", newTeacher, (err, res) => {
        if(err) {
            console.log("[model.js] teacher create error : ", err);
            result(err, null);
            return ;
        }

        console.log("create teacher: ", {...newTeacher});
        result(null, {...newTeacher});
    });
};

// Update
Teacher.updateById = (id, teacher, result) => {
    sql.query(`UPDATE teacher SET name = ?, phone = ? WHERE id = \"${id}\"`,
    [teacher.name, teacher.phone], (err, res) => {
        if(err){
            console.log("[model.js] teacher updateById error : ", err);
            result(err, null);
            return ;
        }
        if(res.affectedRows == 0) {
            // not found with id
            result({kind: "not_found"}, null);
            return ;
        }

        console.log("updated teacher: ", {...teacher});
        result(null, {...teacher});
    });
};

// Retrieve by Id
Teacher.findById = (id, result) => {
    sql.query(`SELECT * FROM teacher WHERE id=\"${id}\"`, (err, res) => {
        if(err) {
            console.log("[model.js] teacher findById error : ", err);
            result(err, null);
            return ;
        }
        if(res.length) {
            console.log("found teacher: ", res[0]);
            result(null, res[0]);
            return ;
        }
        result({kind: "not_found"}, null); // not found
    });
};

// Retrieve All
Teacher.getAll = result => {
    sql.query("SELECT * FROM teacher", (err, res) => {
        if(err){
            console.log("[model.js] teacher getAll error : ", err);
            result(err, null);
            return ;
        }

        console.log("teacher: ", res);
        result(null, res);
    });
};

// Delete
Teacher.remove = (id, result) => {
    sql.query("DELETE FROM teacher WHERE id = ?", id, (err, res) => {
        if(err){
            console.log("[model.js] teacher remove error : ", err);
            result(err, null);
            return ;            
        }

        if(res.affectedRows == 0){
            // not found with id
            result({kind: "not_found"}, null);
            return ;
        }

        console.log("delete teacher with id: ", id);
        result(null, res);
    });
};

module.exports = Teacher;