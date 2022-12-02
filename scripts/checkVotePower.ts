// checking vote power

import { ethers } from "ethers";
import { Ballot } from "../typechain-types/contracts/TokenizedBallot.sol/Ballot";
import { Ballot__factory } from "../typechain-types/factories/contracts/TokenizedBallot.sol/Ballot__factory";
import * as dotenv from "dotenv";
dotenv.config();

//check vote power
async function main() {
  let ballotContract: Ballot;

  const alchemy = process.env.ALCHEMY_API_KEY;
  const provider = ethers.getDefaultProvider("goerli", { alchemy });
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  const signer = wallet.connect(provider);

  const BallotContractFactory = new Ballot__factory(signer);
  ballotContract = BallotContractFactory.attach(
    process.env.BALLOTADDRESS ?? ""
  );

  let votePower = await ballotContract.votePower(signer.address);
  await votePower.wait();

  console.log(
    `After self delegate, the voter has a total of ${votePower} voting power unit. \n`
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
