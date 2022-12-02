import { ethers } from "ethers";
import { Ballot, Ballot__factory, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const TEST_MINT_TOKENS = ethers.utils.parseEther("10");
// give voting tokens,
// sample data
const vote1 = "0çxd2b55b5b7fe9c2c0c20630a264ecbecb628739cf";

const vote2 = "0x860afaa4466f32d6ff8335da3f2b6b75b7686627";

async function main() {
  const args = process.argv.slice(2);

  if (args.length != 2) {
    throw new Error(
      "Usage: yarn run ts-node --files scripts/transferToken.ts <address> <amount>"
    );
  }

  const address = args[0];
  if (!ethers.utils.isAddress(address)) {
    throw new Error(
      `First argument ${address} is not a valid Ethereum address`
    );
  }
  //transfer Token
  const alchemy = process.env.ALCHEMY_API_KEY;
  const provider = ethers.getDefaultProvider("goerli", { alchemy });
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  const signer = wallet.connect(provider);

  const tokenContractFactory = new MyToken__factory(signer);
  const tokenContract = tokenContractFactory.attach(
    process.env.TOKEN_Address ?? ""
  );
  await tokenContract.deployed();

  const transferTX = await tokenContract.transfer(
    address,
    TEST_MINT_TOKENS.div(2)
  );
  await transferTX.wait();
  console.log(
    `After a transfer was made to vote 2 has balance of ${await tokenContract.balanceOf(
      vote2
    )} voting token units \n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
