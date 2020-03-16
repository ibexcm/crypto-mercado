import { Bank, Country, Prisma } from "@ibexcm/database";
import { QueryGetBanksByCountryArgs } from "@ibexcm/libraries/api";

export class BankRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async getBanksByCountry({
    args: { countryID },
  }: QueryGetBanksByCountryArgs): Promise<Bank[]> {
    return await this.db.banks({
      where: {
        country: {
          id: countryID,
        },
      },
    });
  }

  async country(id: string): Promise<Country> {
    return await this.db.bank({ id }).country();
  }
}
