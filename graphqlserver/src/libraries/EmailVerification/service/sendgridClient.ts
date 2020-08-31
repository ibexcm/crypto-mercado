import sgMail from "@sendgrid/mail";
import { config } from "../../../config";

const { apiKey } = config.get("sendgrid");

sgMail.setApiKey(apiKey);

export default sgMail;
