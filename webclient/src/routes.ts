export const routes = {
  root: "/",
  home: {},
  authentication: {
    signIn: "/inicia-sesion",
  },
  recovery: {
    sendPasswordRecoveryLink: "/recuperar-cuenta",
    resetPassword: "/restablecer-contrasena",
  },
  onboarding: {
    sendPhoneNumberVerificationCode: "/kyc/ingresa-tu-telefono",
    verifyPhoneNumber: "/kyc/verifica-tu-telefono",
    sendEmailVerificationCode: "/kyc/ingresa-tu-correo",
    verifyEmail: "/kyc/verifica-tu-correo",
    setPassword: "/kyc/elige-una-contrasena",
    uploadGovernmentID: "/kyc/verifica-tu-identificacion",
    setBankAccount: "/kyc/verifica-tu-cuenta-bancaria",
    done: "/kyc/fin",
  },
  dashboard: {
    sell: {
      checkout: "/dashboard/btc/venta",
      confirm: "/dashboard/btc/venta/confirmar/tx/:id",
    },
    buy: {
      checkout: "/dashboard/btc/compra",
      confirm: "/dashboard/btc/compra/confirmar/tx/:id",
    },
    transactions: {
      index: "/dashboard/tx",
      details: "/dashboard/tx/:id",
    },
  },
};

export default routes;
