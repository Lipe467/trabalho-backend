const express = require("express");
const logger = require("./middleware/logger");

const recipesRoutes = require("./routes/recipes");
const usersRoutes = require("./routes/users");
const healthRoutes = require("./routes/health");

const server = express();
server.use(express.json());
server.use(logger);

server.use(healthRoutes);
server.use(recipesRoutes);
server.use(usersRoutes);

module.exports = server ;