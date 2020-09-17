import zxcvbn from "zxcvbn";

export class ValidationRepository {
  private emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  private phones = {
    "es-GT": /^(\+502)?[2-8]\d{7}$/,
  };

  constructor() {}

  isValidPhone(
    str: string,
    locale?: Array<string> | string,
    options?: { strictMode: boolean },
  ): boolean {
    if (options && options.strictMode && !str.startsWith("+")) {
      return false;
    }

    if (Array.isArray(locale)) {
      return locale.some((key) => {
        if (this.phones.hasOwnProperty(key)) {
          const phone = this.phones[key];
          if (phone.test(str)) {
            return true;
          }
        }
        return false;
      });
    } else if (locale in this.phones) {
      return this.phones[locale].test(str);
    } else if (!locale) {
      for (const key in this.phones) {
        if (this.phones.hasOwnProperty(key)) {
          const phone = this.phones[key];

          if (phone.test(str)) {
            return true;
          }
        }
      }

      return false;
    }
  }

  isValidEmail(str: string): boolean {
    return this.emailPattern.test(str);
  }

  isPasswordSecure(password: string) {
    const { score } = zxcvbn(password);
    let message = "Contraseña Insegura";
    let isSecure = false;
    let color = "#d10a00";

    if (score === 3) {
      message = "Contraseña Aceptable";
      color = "#d16c00";
    }

    if (score === 4) {
      message = "Contraseña Segura";
      color = "green";
    }

    return {
      message,
      isSecure,
      color,
    };
  }
}
