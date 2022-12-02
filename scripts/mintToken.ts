import { ethers } from "ethers";
import { Ballot, Ballot__factory, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const TEST_MINT_TOKENS = ethers.utils.parseEther("10");
// give voting tokens,

async function main() {
  const alchemy = process.env.ALCHEMY_API_KEY;
  const provider = ethers.getDefaultProvider("goerli", { alchemy });
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  const signer = wallet.connect(provider);

  const tokenContractFactory = new MyToken__factory(signer);
  const tokenContract = tokenContractFactory.attach(
    process.env.TOKEN_Address ?? ""
  );
  await tokenContract.deployed();
  console.log(
    `After minting, the voter has a total of ${await tokenContract.getVotes(
      signer.address
    )} voting tokens \n`
  );
  // // mint
  const mintTx = await tokenContract.mint(signer.address, TEST_MINT_TOKENS);
  await mintTx.wait();

  console.log(
    `After minting, the voter has a total of ${await tokenContract.balanceOf(
      signer.address
    )} minted tokens \n`
  );

  console.log(
    `After minting, the voter has a total of ${await tokenContract.getVotes(
      signer.address
    )} voting tokens \n`
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
