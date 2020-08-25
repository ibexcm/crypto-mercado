import convict from "convict";
import { accessSync } from "fs";
import { dirname, join, resolve } from "path";

const configuration = convict({
  env: {
    doc: "The application environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV",
  },

  prisma: {
    endpoint: {
      doc: "The endpoint to send requests to.",
      format: "url",
      default: "http://localhost:4467",
      env: "PRISMA_ENDPOINT",
      arg: "prisma-endpoint",
    },
    secret: {
      doc: "The secret to use for endpoint queries.",
      format: String,
      default: "",
      env: "PRISMA_SECRET",
      arg: "prisma-secret",
    },
  },

  database: {
    host: {
      doc: "The database host",
      format: String,
      default: "127.0.0.1",
      env: "DB_HOST",
      arg: "db-host",
    },
    user: {
      doc: "The database user",
      format: String,
      default: "root",
      env: "DB_USER",
      arg: "db-user",
    },
    password: {
      doc: "The database password",
      format: String,
      default: "prisma",
      env: "DB_PASSWORD",
      arg: "db-password",
    },
    name: {
      doc: "The name of the database to connect.",
      format: String,
      default: "default@default",
      env: "DB_NAME",
      arg: "db-name",
    },
    dialect: {
      doc: "The SQL dialect of the database in use.",
      format: ["mysql", "postgres", "sqlite", "mariadb", "mssql", "mariadb"],
      default: "mysql",
      env: "DB_DIALECT",
      arg: "db-dialiect",
    },
  },

  jwt: {
    algorithm: {
      doc: "The algorithm to use for signing tokens",
      format: ["HS256", "HS384", "HS512"],
      default: "HS256",
      env: "JWT_ALGORITHM",
      arg: "jwt-algorithm",
    },

    secret: {
      doc: "Base64 encoded secret used for verifying the token",
      format: "String",
      default: "no-secret",
      env: "JWT_SECRET",
      arg: "jwt-secret",
    },

    audience: {
      doc:
        "Service identity (see: https://self-issued.info/docs/draft-ietf-oauth-json-web-token.html#rfc.section.4.1.3)",
      format: "String",
      default: "none",
      env: "JWT_AUDIENCE",
      arg: "jwt-audience",
    },
  },
});

// Load environment dependent configuration
const environment = configuration.get("env");
const configuration_file = process.env["DATABASE_CONFIG_FILE"]
  ? resolve(__dirname, process.env["DATABASE_CONFIG_FILE"])
  : resolve(__dirname.replace("database/lib", "database"), `${environment}.json`);

try {
  accessSync(configuration_file);

  try {
    configuration.loadFile(configuration_file);
  } catch (e) {
    console.error(`Configuration file for ${environment} failed to load: ${e}`);
  }
} catch (_) {
  // ignore missing files
}

const config_dir = resolve(dirname(configuration_file));

// Perform validation
configuration.validate({ allowed: "strict" });

export const config = configuration;
export const configFile = (file: string): string => {
  return join(config_dir, file);
};

export default configuration;
