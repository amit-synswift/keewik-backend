const Database = require("./Database");

const getTables = () => {
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

const validateToken = (token, guid) => {
  return new Promise((resolve) => {
    Database.query(
      "select (created_at + INTERVAL validity Day) as validTill from sessions where token=? and user_guid=?",
      [token, guid],
      function (err, result, fields) {
        if (err) throw new Error(err);
        if (result.length === 0) {
          return resolve(null);
        }
        resolve(result);
      }
    );
  });
};

const callSP = (sp, reqParams) => {
  return new Promise((resolve) => {
    Database.query(
      "call " + sp + "("+reqParams+")",
      [],
      function (err, result, fields) {
        if (err) throw new Error(err);
        if (result.length === 0) {
          return resolve(null);
        }
        resolve(result);
      }
    );
  });
};

const checkIfAlreadyMail = (email) => {
    return new Promise((resolve) => {
        Database.query(
            "select email from users where email = ? and is_deleted=0",
            [email],
            function (err, result, fields) {
                if (err) throw new Error(err);
                if (result.length === 0) {
                    return resolve(null);
                }
                resolve(result);
            }
        );
    });
};

const checkIfUserExists = (username) => {
    return new Promise((resolve) => {
        Database.query(
            "select count(*) as total from users where (email = ? or username = ?) and isactive=1 and is_deleted=0",
            [username, username],
            function (err, result, fields) {
                if (err) throw new Error(err);
                if (result.length === 0) {
                    return resolve(null);
                }
                resolve(result);
            }
        );
    });
};

module.exports = {
    getTables,
    callSP,
    validateToken,
    checkIfAlreadyMail,
    checkIfUserExists
};
