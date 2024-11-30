import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import type { Express } from "express";

const swaggerDocument = YAML.load(path.join(__dirname, "../../swagger.yaml"));

export const setupSwagger = (app: Express) => {
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
