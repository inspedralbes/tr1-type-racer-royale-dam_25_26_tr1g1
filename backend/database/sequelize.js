import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

if (!process.env.DB_HOST) {
  dotenv.config({ path: path.resolve(process.cwd(), envFile) });
}

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "tr1-mysql",
    dialect: "mysql",
  }
);

export default sequelize;
