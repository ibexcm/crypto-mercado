import { Account, Prisma } from "@ziina/database";
import { Session } from "@ziina/libraries/api";
import { compare, genSalt, hash } from "bcryptjs";
import { FileUpload } from "graphql-upload";
import { Logger } from "winston";
import { config } from "../../../config";
import { ENVType } from "../../../config/models/ENVType";
import { IFileManagementRepository } from "../../FileManagement";
import { ISessionRepository } from "../../Session/interfaces/ISessionRepository";
import { ISMSVerificationRepository } from "../../SMSVerification";
import { UserError } from "../errors/UserError";

export class UserRepository {
  private db: Prisma;
  private logger: Logger;
  private sessionRepository: ISessionRepository;
  private smsVerificationRepository: ISMSVerificationRepository;
  private fileManagementRepository: IFileManagementRepository;
  private verifiedPhoneNumbers: string[];

  constructor(
    db: Prisma,
    logger: Logger,
    sessionRepository: ISessionRepository,
    smsVerificationRepository: ISMSVerificationRepository,
    fileManagementRepository: IFileManagementRepository,
  ) {
    this.db = db;
    this.logger = logger;
    this.sessionRepository = sessionRepository;
    this.smsVerificationRepository = smsVerificationRepository;
    this.fileManagementRepository = fileManagementRepository;
    this.verifiedPhoneNumbers =
      config.get("env") !== ENVType.production
        ? config.get("flags").verifiedPhoneNumbers
        : [];
  }

  async createUser(username: string, password: string, account: Account): Promise<Session> {
    const usernameExists = await this.db.account({ username });
    if (Boolean(usernameExists)) {
      throw UserError.usernameTakenError;
    }

    await this.db.updateAccount({
      where: { id: account.id },
      data: {
        username,
        password: await hash(password, await genSalt()),
        signupCompletedAt: new Date(),
      },
    });

    const user = await this.db.createUser({
      account: {
        connect: {
          id: account.id,
        },
      },
    });

    const authentication = await this.sessionRepository.createAuthentication(user);

    return authentication;
  }

  async authenticate(username: string, password: string): Promise<Session> {
    const account = await this.db.account({ username });
    if (!Boolean(account)) {
      throw UserError.invalidUsernameError;
    }

    const isPasswordCorrect = await compare(password, account.password);
    if (!isPasswordCorrect) {
      throw UserError.invalidCredentialError;
    }

    const user = await this.db.account({ username }).user();
    const authentication = await this.sessionRepository.createAuthentication(user);

    return authentication;
  }

  async sendVerificationCode(number: string): Promise<boolean> {
    if (this.verifiedPhoneNumbers.includes(number)) {
      return true;
    }

    return await this.smsVerificationRepository.sendVerificationCode(number);
  }

  async verifyPhoneNumber(number: string, code: string): Promise<Session> {
    const isVerified = this.verifiedPhoneNumbers.includes(number)
      ? true
      : await this.smsVerificationRepository.verifyCode(number, code);

    if (!isVerified) throw UserError.verificationCodeError;

    await this.db.deleteManyContacts({
      phoneNumber: { number },
    });

    const contact = await this.db.createContact({
      phoneNumber: {
        create: {
          number,
          verifiedAt: new Date(),
        },
      },
    });

    const account = await this.db.createAccount({
      contact: {
        connect: {
          id: contact.id,
        },
      },
    });

    const session = await this.sessionRepository.createSignupSession(account);

    return session;
  }

  async setFullName(fullName: string, account: Account): Promise<boolean> {
    await this.db.updateAccount({
      where: { id: account.id },
      data: { fullName },
    });

    return true;
  }

  async setProfilePicture(image: FileUpload, userID: string): Promise<string> {
    const { profilePictureBucket } = config.get("aws");

    const account = await this.db.user({ id: userID }).account();
    if (!Boolean(account)) {
      throw UserError.invalidCredentialError;
    }

    const { createReadStream, filename } = await image;
    const s3FileName = `${account.id}_profile_picture.${filename.split(".").pop()}`;

    try {
      const location = await this.fileManagementRepository.upload(
        profilePictureBucket,
        s3FileName,
        createReadStream(),
      );

      const oldProfilePictures = await this.db.profilePictures({
        where: { account: account },
      });
      if (oldProfilePictures.length > 0) {
        oldProfilePictures.forEach(async oldProfilePicture => {
          try {
            await this.fileManagementRepository.remove(
              profilePictureBucket,
              oldProfilePicture.filename,
            );
          } catch (err) {
            this.logger.error(err);
          }
        });

        await this.db.updateAccount({
          where: { id: account.id },
          data: {
            profilePicture: {
              delete: true,
            },
          },
        });
      }

      await this.db.updateAccount({
        where: { id: account.id },
        data: {
          profilePicture: {
            create: {
              url: location,
              filename: s3FileName,
            },
          },
        },
      });

      return location;
    } catch (error) {
      throw UserError.unableToSetProfilePicture(error);
    }
  }
}
