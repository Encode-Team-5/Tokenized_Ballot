import { ethers } from "hardhat";
import { Ballot } from "../typechain-types/contracts/TokenizedBallot.sol/Ballot";
import { Ballot__factory } from "../typechain-types/factories/contracts/TokenizedBallot.sol/Ballot__factory";
import * as dotenv from "dotenv";
dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}
// let TARGET_BLOCK_NUMBER;
const PROPOSALS = ["vanilla", "lime", "strawberry"];

async function main() {
  let ballotContract: Ballot;

  const alchemy = process.env.ALCHEMY_API_KEY;
  const provider = ethers.getDefaultProvider("goerli", { alchemy });
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  const signer = wallet.connect(provider);

  const blockNumber = await provider.getBlock("latest");
  console.log(`latest block number is this ${blockNumber.number}`);

  const BallotContractFactory = new Ballot__factory(signer);
  ballotContract = await BallotContractFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS),
    process.env.TOKEN_Address ?? "",
    blockNumber.number
  );

  await ballotContract.deployed();

  console.log(`BALLOT CONTRACT IS ${ballotContract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
