// casting votes,
import * as dotenv from "dotenv";
dotenv.config();
import { ethers } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";

// give voting tokens,
const amount = ethers.utils.parseEther("0.001");
const TEST_MINT_TOKENS = ethers.utils.parseEther("5");

async function castVote() {
  let ballotContract: Ballot;

  const alchemy = process.env.ALCHEMY_API_KEY;
  const provider = ethers.getDefaultProvider("goerli", { alchemy });
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  const signer = wallet.connect(provider);

  const BallotContractFactory = new Ballot__factory(signer);
  ballotContract = BallotContractFactory.attach(
    process.env.BALLOT_ADDRESS ?? ""
  );

  const voteTokenContractAddress = await ballotContract.voteToken();
  console.log(`vote token contract is ${voteTokenContractAddress} unit`);

  // vote proposal and amount of votes
  // const indexOfProposal = ethers.utils.formatBytes32String(PROPOSALS[0]);

  let vote = await ballotContract.vote(0, amount, { gasLimit: 100000 });
  console.log(`vote hash is ${vote.hash}`);
}

castVote().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
