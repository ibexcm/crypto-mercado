import axios from "axios";
import config from "../../../config";
import { IEmailNotificationsRepository } from "../interfaces/IEmailNotificationsRepository";

const { host, from } = config.get("email");
const { apiUrl } = config.get("sendgrid");

const sendAdminKYCApproveUserNotification = async (address: string) => {
  await axios.request({
    method: "POST",
    url: apiUrl,
    data: {
      from,
      template_id: "",
      personalizations: [
        {
          to: [
            {
              email: address,
            },
          ],
          dynamic_template_data: {
            sign_in_url: `${host}/iniciar-sesion`,
          },
        },
      ],
    },
  });
};

export const EmailNotificationsRepository: IEmailNotificationsRepository = {
  sendAdminKYCApproveUserNotification,
};
