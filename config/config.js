const allENV = {
  development: {
    database: {
      host: "localhost",
      user: "root",
      password: "",
      database: "keewik",
    },
    secret: "keewik ke sath jude rho development server"
  },
  production: {
    database: {
      host: "",
      user: "",
      password: "",
      database: "",
    },
    secret: "keewik ke sath jude rho production server"
  }
};
module.exports = allENV["development"];
