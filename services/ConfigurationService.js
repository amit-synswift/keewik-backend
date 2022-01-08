const Database = require("./Database");

const getTables = (workstation) => {
  return new Promise((resolve) => {
    Database.query(
      "show tables",
      [],
      function (err, result, fields) {
        if (err) throw new Error(err);
        if (result.length === 0) {
          return resolve({data:null});
        }
        resolve({data:result});
      }
    );
  });
};

module.exports = {
    getTables
};
