import { ethers } from "ethers";
import { Ballot, Ballot__factory, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const TEST_MINT_TOKENS = ethers.utils.parseEther("10");
//    delegating voting power
async function main() {
  let ballotContract: Ballot;
  const alchemy = process.env.ALCHEMY_API_KEY;
  const provider = ethers.getDefaultProvider("goerli", { alchemy });
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  const signer = wallet.connect(provider);

  const tokenContractFactory = new MyToken__factory(signer);
  const tokenContract = await tokenContractFactory.attach(
    process.env.TOKEN_Address ?? ""
  );
  await tokenContract.deployed();

  let delegate = await tokenContract.delegate(signer.address);
  let delegateTx = await delegate.wait();
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
