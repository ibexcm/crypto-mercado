import config from "../../../config";
import { IEmailNotificationsRepository } from "../interfaces/IEmailNotificationsRepository";
import sendgridClient from "../service/sendgridClient";

const { host, from } = config.get("email");

const sendAdminKYCApproveUserNotification: IEmailNotificationsRepository["sendAdminKYCApproveUserNotification"] = async (
  address: string,
) => {
  try {
    await sendgridClient.send({
      subject: "Bienvenido a IBEX Mercado",
      to: [{ email: address }],
      from,
      templateId: "d-0c197c7b17f2424992e9a8e0fe1a16c6",
      dynamicTemplateData: {
        sign_in_url: `${host}/inicia-sesion`,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const sendTransactionSuccessNotification: IEmailNotificationsRepository["sendTransactionSuccessNotification"] = async (
  address,
  { transaction, fromCurrencySymbol, toCurrencySymbol },
) => {
  try {
    await sendgridClient.send({
      subject: "Nueva Transacción",
      to: [{ email: address }],
      from,
      templateId: "d-99467cfe63e84df3affde781e1049544",
      dynamicTemplateData: {
        tx_dashboard_url: `${host}/dashboard/tx/${transaction.id}`,
        amount: transaction.amount,
        fromCurrencySymbol,
        toCurrencySymbol,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const EmailNotificationsRepository: IEmailNotificationsRepository = {
  sendAdminKYCApproveUserNotification,
  sendTransactionSuccessNotification,
};
