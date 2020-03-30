export const routes = {
  root: "/",
  home: {},
  authentication: {
    signIn: "/inicia-sesion",
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
    transactions: {
      index: "/dashboard/tx",
    },
  },
};

export default routes;
