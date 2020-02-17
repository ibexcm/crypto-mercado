import { prisma } from "../generated/client";

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

(async function() {
  try {
    await createCurrencies();
  } catch (error) {
    console.error(error);
  }
})();
