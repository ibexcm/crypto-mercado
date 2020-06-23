import { BitcoinAPIRepository } from "../../libraries/Crypto/repositories/BitcoinAPIRepository";

jest.mock("../../libraries/Crypto/repositories/BitcoinAPIRepository");

const mocked = BitcoinAPIRepository as jest.Mocked<typeof BitcoinAPIRepository>;
export default mocked;
