import {
  Account,
  Bank,
  BankAccount,
  Contact,
  Country,
  Currency,
  Email,
  GuatemalaBankAccount,
  GuatemalaDocument,
  GuatemalaDPI,
  PhoneNumber,
  Prisma,
  Profile,
  ProfileDocument,
  User,
  UserRole,
} from "@ibexcm/database";
import { QueryAdminGetUserArgs } from "@ibexcm/libraries/api";
import { config } from "../../../config";

const { adminAccountEmailAddress } = config.get("flags");

export class UserRepository {
  private db: Prisma;

  constructor(db: Prisma) {
    this.db = db;
  }

  async getDefaultAdminUser(): Promise<User> {
    const [defaultAdminUser] = await this.db.users({
      where: {
        role: {
          type: "ADMIN",
        },
        contact: {
          email_every: {
            address: adminAccountEmailAddress,
          },
        },
      },
      first: 1,
    });

    return defaultAdminUser;
  }

  async adminGetUser({ args: { id } }: QueryAdminGetUserArgs): Promise<User> {
    return await this.db.user({ id });
  }

  async role(id: string): Promise<UserRole> {
    return await this.db.user({ id }).role();
  }

  async account(id: string): Promise<Account> {
    return await this.db.user({ id }).account();
  }

  async transactions(id: string, args): Promise<Account> {
    return await this.db.user({ id }).transactions(args);
  }

  async contact(
    id: string,
  ): Promise<Contact & { phoneNumber: PhoneNumber[]; email: Email[] }> {
    const [contact, phoneNumber, email] = await Promise.all<
      Contact,
      PhoneNumber[],
      Email[]
    >([
      this.db.user({ id }).contact(),
      this.db
        .user({ id })
        .contact()
        .phoneNumber(),
      this.db
        .user({ id })
        .contact()
        .email(),
    ]);

    return {
      ...contact,
      phoneNumber,
      email,
    };
  }

  async profile(
    id: string,
  ): Promise<
    Profile & {
      country: Country;
      documents: ProfileDocument & {
        guatemala: GuatemalaDocument & { dpi: GuatemalaDPI[] };
      };
    }
  > {
    const profile = await this.db.user({ id }).profile();
    const country = await this.db
      .user({ id })
      .profile()
      .country();
    const documents = await this.db
      .user({ id })
      .profile()
      .documents();
    const guatemala = await this.db
      .user({ id })
      .profile()
      .documents()
      .guatemala();
    const dpi = await this.db
      .user({ id })
      .profile()
      .documents()
      .guatemala()
      .dpi();

    return {
      ...profile,
      country: {
        ...country,
      },
      documents: {
        ...documents,
        guatemala: {
          ...guatemala,
          dpi,
        },
      },
    };
  }

  async documents(id: string): Promise<ProfileDocument[]> {
    return await this.db.profile({ id }).documents();
  }

  async guatemala(id: string): Promise<GuatemalaDocument> {
    return await this.db.profileDocument({ id }).guatemala();
  }

  async dpi(id: string): Promise<GuatemalaDPI[]> {
    return await this.db.guatemalaDocument({ id }).dpi();
  }

  async bankAccounts(
    id: string,
  ): Promise<
    Array<
      BankAccount & {
        currency: Currency;
        guatemala: GuatemalaBankAccount & { bank: Bank };
      }
    >
  > {
    const bankAccounts = await this.db.user({ id }).bankAccounts();

    return await Promise.all(
      bankAccounts.map(async bankAccount => {
        const currency = await this.db.bankAccount({ id: bankAccount.id }).currency();
        const guatemala = await this.db.bankAccount({ id: bankAccount.id }).guatemala();
        const bank = await this.db
          .bankAccount({ id: bankAccount.id })
          .guatemala()
          .bank();

        return {
          ...bankAccount,
          currency,
          guatemala: {
            ...guatemala,
            bank,
          },
        };
      }),
    );
  }
}
