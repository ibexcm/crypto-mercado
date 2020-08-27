import config from "../../../config";
import { IEmailNotificationsRepository } from "../interfaces/IEmailNotificationsRepository";
import sendgridClient from "../service/sendgridClient";

const { host, from } = config.get("email");
const { adminAccountEmailAddress } = config.get("flags");

const sendAdminKYCApproveUserNotification: IEmailNotificationsRepository["sendAdminKYCApproveUserNotification"] = async (
  address: string,
) => {
  try {
    await sendgridClient.send({
      subject: "Bienvenido a IBEX Mercado",
      to: [{ email: address }],
      from: {
        email: from,
        name: "IBEX Mercado",
      },
      templateId: "d-0c197c7b17f2424992e9a8e0fe1a16c6",
      dynamicTemplateData: {
        sign_in_url: `${host}/inicia-sesion`,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const sendTransactionRequestNotification: IEmailNotificationsRepository["sendTransactionRequestNotification"] = async (
  address,
  {
    transaction,
    fromCurrencySymbol,
    toCurrencySymbol,
    clientID,
    isFiatToCryptoTransaction,
  },
) => {
  try {
    await sendgridClient.send({
      subject: `Nueva Transacción ${fromCurrencySymbol}:${toCurrencySymbol}`,
      to: [{ email: address }],
      from: {
        email: from,
        name: "IBEX Mercado",
      },
      templateId: "d-99467cfe63e84df3affde781e1049544",
      dynamicTemplateData: {
        tx_dashboard_url: `${host}/dashboard/tx/${transaction.id}`,
        amount: transaction.amount,
        fromCurrencySymbol,
        toCurrencySymbol,
        clientID,
        isFiatToCryptoTransaction,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const sendTransactionSuccessNotification: IEmailNotificationsRepository["sendTransactionSuccessNotification"] = async (
  address,
  {
    transaction,
    fromCurrencySymbol,
    toCurrencySymbol,
    clientID,
    isFiatToCryptoTransaction,
  },
) => {
  try {
    await sendgridClient.send({
      subject: `Transacción Exitosa ${fromCurrencySymbol}:${toCurrencySymbol}`,
      to: [{ email: address }],
      from: {
        email: from,
        name: "IBEX Mercado",
      },
      templateId: "d-8570d73cf42449b7b366b955be3a22e8",
      dynamicTemplateData: {
        tx_dashboard_url: `${host}/dashboard/tx/${transaction.id}`,
        amount: transaction.amount,
        fromCurrencySymbol,
        toCurrencySymbol,
        clientID,
        isFiatToCryptoTransaction,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

const sendAdminTransactionEvidenceSubmittedNotification: IEmailNotificationsRepository["sendAdminTransactionEvidenceSubmittedNotification"] = async ({
  transaction,
  clientID,
}) => {
  try {
    await sendgridClient.send({
      to: [{ email: adminAccountEmailAddress }],
      from: {
        email: from,
        name: "IBEX Mercado",
      },
      templateId: "d-c4a752e4b64a4be2bc6b217d324592fb",
      dynamicTemplateData: {
        tx_url: `admin.${host}/tx/${transaction.id}`,
        clientID,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const EmailNotificationsRepository: IEmailNotificationsRepository = {
  sendAdminKYCApproveUserNotification,
  sendTransactionRequestNotification,
  sendTransactionSuccessNotification,
  sendAdminTransactionEvidenceSubmittedNotification,
};
