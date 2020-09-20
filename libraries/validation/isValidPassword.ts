import zxcvbn from "zxcvbn";

export default function isValidPassword(password: string): boolean {
  const { score } = zxcvbn(password);

  return score >= 3;
}
