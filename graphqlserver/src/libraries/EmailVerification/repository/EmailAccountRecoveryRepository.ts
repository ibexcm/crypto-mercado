import config from "../../../config";
import sendgridClient from "../service/sendgridClient";
import { IEmailAccountRecoveryRepository } from "../interfaces";

const { host, from } = config.get("email");

const sendRecoveryLink: IEmailAccountRecoveryRepository["sendRecoveryLink"] = async (
  address: string,
  { token },
) => {
  try {
    await sendgridClient.send({
      subject: "Restablecimiento de Contraseña",
      to: [{ email: address }],
      from: {
        email: from,
        name: "IBEX Mercado",
      },
      templateId: "",
      dynamicTemplateData: {
        reset_password_url: `${host}/restablecer-contraseña?t=${token}`,
      },
    });
  } catch (error) {}
};

export const EmailAccountRecoveryRepository: IEmailAccountRecoveryRepository = {
  sendRecoveryLink,
};
