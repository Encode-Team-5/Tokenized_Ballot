import { ethers } from "hardhat";
import { Ballot__factory, MyToken__factory } from "../typechain-types";

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}
const TARGET_BLOCK_NUMBER = 2;
const PROPOSALS = ["vanilla", "lime", "strawberry"];
const TEST_MINT_TOKENS = ethers.utils.parseEther("10");

async function main() {
  const accounts = await ethers.getSigners();
  const [deployer, voter, other] = accounts;
  const erc20VotesTokenContractFactory = new MyToken__factory(deployer);
  const tokenizedBallotFactory = new Ballot__factory(deployer);

  let erc20VotesContract = await erc20VotesTokenContractFactory.deploy();
  await erc20VotesContract.deployed();

  console.log(erc20VotesContract.address);

  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
    convertStringArrayToBytes32(PROPOSALS),
    erc20VotesContract.address,
    TARGET_BLOCK_NUMBER
  );
  await tokenizedBallotContract.deployed();

  console.log(tokenizedBallotContract.address);

  const voteTokenContractAddress = await tokenizedBallotContract.voteToken();
  erc20VotesContract = erc20VotesTokenContractFactory.attach(
    voteTokenContractAddress
  );

  console.log(await erc20VotesContract.totalSupply(), "AFTER");
  const mintTx = await erc20VotesContract.mint(
    tokenizedBallotContract.address,
    TEST_MINT_TOKENS
  );
  await mintTx.wait();

  console.log(
    await erc20VotesContract.balanceOf(tokenizedBallotContract.address),
    "TOTAL_SUPPLY"
  );
  console.log(await tokenizedBallotContract.targetBlockNumber());

  //   let voterTokenBalance = await erc20VotesContract.balanceOf(voter.address);
  //   console.log(voterTokenBalance);

  //   let voterTokenBalance = await erc20VotesContract.balanceOf(voter.address);
  //   console.log(`Initially, voter has ${voterTokenBalance} decimal units \n`);

  let votePower = await tokenizedBallotContract.votePower(deployer.address);

  console.log(`Initially, deployer's vote power is ${votePower}\n`);

  let delegateTx = await erc20VotesContract
    .connect(deployer.address)
    .delegate(deployer.address);
  await delegateTx.wait();

  votePower = await tokenizedBallotContract.votePower(deployer.address);

  console.log(
    `After self delegate, voter's vote power of vote is  ${votePower}\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
