import BitcoinAddressGenerator from "bitcoin-address-generator";

export default (): Promise<string> =>
  new Promise(resolve => {
    BitcoinAddressGenerator.createWalletAddress(response => {
      resolve(response.address);
    });
  });
