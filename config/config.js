require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.MARIADB_USER || "root",
    "password": process.env.MARIADB_PASSWORD || "pictsmanager_password",
    "database": process.env.MARIADB_DATABASE || "pictsmanager_database",
    "host": process.env.MARIADB_ROOT_HOST,
    "dialect": process.env.DIALECT,

    "SESSION_SECRET" : process.env.SESSION_SECRET,
    "SITE_URL": process.env.SITE_URL,
    "NODE_ENV": process.env.NODE_ENV,

    // MAILLING
    "AUTH_EMAIL" : process.env.AUTH_EMAIL,
    "AUTH_PASS" : process.env.AUTH_PASS,
    "EMAIL_SERVICE" : process.env.EMAIL_SERVICE,
  },
  "test": {
    "username": process.env.MARIADB_USER || "root",
    "password": process.env.MARIADB_PASSWORD || "pictsmanager_password",
    "database": process.env.MARIADB_DATABASE || "pictsmanager_database",
    "host": process.env.MARIADB_ROOT_HOST,
    "dialect": 'sqlite',

    "SESSION_SECRET" : process.env.SESSION_SECRET,
    "SITE_URL": process.env.SITE_URL,
    "NODE_ENV": process.env.NODE_ENV,

    // MAILLING
    "AUTH_EMAIL" : process.env.AUTH_EMAIL,
    "AUTH_PASS" : process.env.AUTH_PASS,
    "EMAIL_SERVICE" : process.env.EMAIL_SERVICE,
  },
  "production": {
    "username": process.env.MARIADB_USER || "root",
    "password": null,
    "database": process.env.MARIADB_DATABASE || "pictsmanager_database",
    "host": process.env.MARIADB_ROOT_HOST,
    "dialect": process.env.DIALECT,

    "SESSION_SECRET" : process.env.SESSION_SECRET,
    "SITE_URL": process.env.SITE_URL,

    // MAILLING
    "AUTH_EMAIL" : process.env.AUTH_EMAIL,
    "AUTH_PASS" : process.env.AUTH_PASS,
    "EMAIL_SERVICE" : process.env.EMAIL_SERVICE,
  }
}
