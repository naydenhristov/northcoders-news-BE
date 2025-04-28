const db = require("../db/connection");

exports.selectTopics = () => {
    return db.query("SELECT * FROM topics").then((result) =>{
        console.log(result.rows, "<--- result.rows, model");
        
        if(!result.rows.length) {
            return Promise.reject({ status: 404, msg: "Not Found"})
        } 
   
      return result.rows;
    })
}