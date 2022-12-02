import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  let ballotContract: Ballot;

  const alchemy = process.env.ALCHEMY_API_KEY;
  const provider = ethers.getDefaultProvider("goerli", { alchemy });
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  const signer = wallet.connect(provider);

  const BallotContractFactory = new Ballot__factory(signer);
  ballotContract = BallotContractFactory.attach(
    process.env.BALLOT_ADDRESS ?? ""
  );

  //get winning proposal
  const winningProposal = await ballotContract.winningProposal();

  //get number of votes for winning proposal
  const winningProposalVotes = await ballotContract.proposals(winningProposal);
  console.log(winningProposalVotes);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
