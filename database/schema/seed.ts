import { prisma } from "../generated/client";
import { UserRoleType } from "./models/UserRoleType";

async function createCurrencies() {
  await prisma.createCurrency({
    name: "United States Dollar",
    symbol: "USD",
  });
  await prisma.createCurrency({
    name: "Guatemalan Quetzal",
    symbol: "GTQ",
  });
  await prisma.createCurrency({
    name: "Bitcoin",
    symbol: "BTC",
  });
}

async function createCountries() {
  await prisma.createCountry({
    name: "Guatemala",
    symbol: "GTQ",
    phoneNumberCode: "+502",
  });
}

async function createBanks() {
  await Promise.all(
    [
      "Banco Agromercantil de Guatemala, S.A.",
      "Banco Azteca de Guatemala, S.A.",
      "Banco G&T Continental, S.A.",
      "Banco INV, S.A.",
      "Banco Industrial, S.A.",
      "Banco Inmobiliario, S.A.",
      "Banco Internacional, S.A.",
      "Banco Promerica",
      "Banco de Antigua, S.A.",
      "Banco de Guatemala",
      "Banco de los trabajadores",
      "Citibank NA",
      "El Credito Hipotecario Nacional de Guatemala",
      "Fichosa Guatemala, S.A. / Banco Americano, S.A.",
      "Vivibanco",
    ].map(name => prisma.createBank({ name, country: { connect: { symbol: "GTQ" } } })),
  );
}

async function createUserRoles() {
  await prisma.createUserRole({
    type: UserRoleType.ADMIN,
  });
  await prisma.createUserRole({
    type: UserRoleType.USER,
  });
}

(async function() {
  try {
    await createCurrencies();
    await createUserRoles();
    await createCountries();
    await createBanks();
  } catch (error) {
    console.error(error);
  }
})();
