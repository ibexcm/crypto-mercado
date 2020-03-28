import convict from "convict";
import { accessSync } from "fs";
import { dirname, join, resolve } from "path";

const configuration = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "test",
    env: "NODE_ENV",
  },

  flags: {
    verifiedPhoneNumbers: {
      doc: "Phone numbers that will authenticate without verification.",
      format: Array,
      default: new Array(9).fill("+000000000").map((n, i) => `${n}0${i}`),
      env: "VERIFIED_PHONE_NUMBERS",
      arg: "verified-phone-numbers",
    },
    verifiedEmails: {
      doc: "Email addresses that will authenticate without verification.",
      format: Array,
      default: new Array(9).fill("u").map((n, i) => `${n}${i}@ibexcm.com`),
      env: "VERIFIED_EMAILS",
      arg: "verified-emails",
    },
  },

  express: {
    address: {
      doc: "The IP address to bind.",
      format: "ipaddress",
      default: "0.0.0.0",
      env: "IP_ADDRESS",
      arg: "address",
    },

    endpoint: {
      doc: "The endpoint address to bind.",
      format: "url",
      default: null,
      env: "GRAPHQL_ENDPOINT",
      arg: "graphql-endpoint",
    },

    port: {
      doc: "The port to bind HTTP.",
      format: "port",
      default: 4000,
      env: "GRAPHQL_PORT",
      arg: "port",
    },

    protocol: {
      doc: "URL Protocol",
      format: "*",
      default: null,
      env: "URL_PROTOCOL",
      arg: "protocol",
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

    issuer: {
      doc: "Token issuer",
      format: "String",
      default: "IBEXCM",
      env: "JWT_ISSUER",
      arg: "jwt-issuer",
    },

    audience: {
      doc: "Token audience",
      format: "String",
      default: "https://apitest.ibexcm.com",
      env: "JWT_AUDIENCE",
      arg: "jwt-audience",
    },

    privateKey: {
      doc: "Base64 encoded secret used for verifying the token",
      format: "String",
      default: null,
      env: "JWT_PRIVATE_KEY",
      arg: "jwt-private-key",
    },

    publicKey: {
      doc: "Base64 encoded public key used for verifying the token",
      format: "String",
      default: null,
      env: "JWT_PUBLIC_KEY",
      arg: "jwt-public-key",
    },
  },

  email: {
    host: {
      doc: "Sendgrid email template host",
      format: "url",
      default: "http://localhost:3000",
      env: "SENDGRID_TEMPLATE_HOST",
      arg: "sendgrid-template-host",
    },
    from: {
      doc: "Email from",
      format: "email",
      default: null,
      env: "EMAIL_FROM",
      arg: "email-from",
    },
  },

  sendgrid: {
    apiKey: {
      doc: "Sendgrid API Key",
      format: "*",
      default: null,
      env: "SENDGRID_API_KEY",
      arg: "sendgrid-api-key",
    },
    apiUrl: {
      doc: "Sendgrid API URL",
      format: "url",
      default: null,
      env: "SENDGRID_API_URL",
      arg: "sendgrid-api-url",
    },
  },

  twilio: {
    sid: {
      doc: "Twilio Account SID",
      format: "*",
      default: "VC123",
      env: "TWILIO_SID",
      arg: "twilio-sid",
    },

    aid: {
      doc: "Twilio Account AID",
      format: "*",
      default: "AC123",
      env: "TWILIO_AID",
      arg: "twilio-aid",
    },

    token: {
      doc: "Twilio Account Token",
      format: "*",
      default: "token",
      env: "TWILIO_TOKEN",
      arg: "twilio-token",
    },
  },
});

// Load environment dependent configuration
const environment = configuration.get("env");
const configuration_file =
  process.env["CONFIG_FILE"] || resolve(`${__dirname}/${environment}.json`);

try {
  accessSync(configuration_file);

  try {
    configuration.loadFile(configuration_file);
  } catch (e) {
    console.error(`Configuration file for ${environment} failed to load: ${e}`);
  }
} catch (_) {
  // ignore missing files
  console.debug(`No ${environment} environment configuration file found`);
}

const config_dir = resolve(dirname(configuration_file));

// Perform validation
configuration.validate({ allowed: "strict" });

export const config = configuration;
export const configFile = (file: string): string => {
  return join(config_dir, file);
};

export default configuration;
