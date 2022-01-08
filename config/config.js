const allENV = {
  development: {
    database: {
      host: "localhost",
      user: "root",
      password: "",
      database: "keewik",
    }
  },
  production: {
    database: {
      host: "",
      user: "",
      password: "",
      database: "",
    }
  }
};
module.exports = allENV["development"];
