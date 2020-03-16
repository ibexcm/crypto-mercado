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
      default: new Array(9).fill("+502495087").map((n, i) => `${n}0${i}`),
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
      default: "Ziina",
      env: "JWT_ISSUER",
      arg: "jwt-issuer",
    },

    audience: {
      doc: "Token audience",
      format: "String",
      default: "https://ziina.com",
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

  aws: {
    accessKeyId: {
      doc: "AWS Access Key ID",
      format: "*",
      default: null,
      env: "AWS_ACCESS_KEY_ID",
      arg: "aws-access-key-id",
    },

    secretAccessKey: {
      doc: "AWS Access Key Secret",
      format: "*",
      default: null,
      env: "AWS_ACCESS_KEY_SECRET",
      arg: "aws-access-key-secret",
    },

    region: {
      doc: "AWS Region",
      format: "*",
      default: null,
      env: "AWS_REGION",
      arg: "aws-region",
    },

    profilePictureBucket: {
      doc: "Bucket for storing profile pictures",
      format: "*",
      default: "ziina-profile-pictures-public",
      env: "PROFILE_PICTURES_BUCKET",
      arg: "profile-pictures-bucket",
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
