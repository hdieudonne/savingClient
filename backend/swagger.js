const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Admin API Documentation",
      version: "1.0.0",
      description: "API documentation for Admin Backend",
    },
    servers: [
      {
        url: "http://localhost:3000", // update if using a different port
      },
    ],
  },
  apis: ["./routes/*.js"], // 👈 Path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = swaggerDocs;
