import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";

const TEST_MINT_TOKENS = ethers.utils.parseEther("10");

async function main() {
  const accounts = await ethers.getSigners();
  const [deployer, voter, other] = accounts;
  const contractFactory = new MyToken__factory(deployer);
  const contract = await contractFactory.deploy();
  await contract.deployed();

  console.log(
    `The tokenized vote contract has deployed at ${contract.address}\n`
  );

  let voterTokenBalance = await contract.balanceOf(voter.address);
  console.log(`voter has ${voterTokenBalance} decimal units \n`);
  const mintTx = await contract.mint(voter.address, TEST_MINT_TOKENS);
  await mintTx.wait();
  voterTokenBalance = await contract.balanceOf(voter.address);
  console.log(`After minting, voter has ${voterTokenBalance} decimal units \n`);

  //TODO
  let votePower = await contract.getVotes(voter.address);
  console.log(`after minting, voter has ${votePower} units`);

  let delegateTx = await contract.connect(voter).delegate(voter.address);
  await delegateTx.wait();

  votePower = await contract.getVotes(voter.address);
  console.log(`after self delegate, voter has ${votePower} units`);

  const transferTx = await contract
    .connect(voter)
    .transfer(other.address, TEST_MINT_TOKENS.div(2));
  await transferTx.wait();
  votePower = await contract.getVotes(voter.address);
  console.log(`after transfer, voter has ${votePower} units of vote power`);
  delegateTx = await contract.connect(other).delegate(other.address);
  await delegateTx.wait();
  votePower = await contract.getVotes(other.address);
  console.log(
    `after self delegation by other, other has ${votePower} units of vote power`
  );

  const currentBlock = await ethers.provider.getBlock("latest");
  for (
    let blockNumber = currentBlock.number - 1;
    blockNumber >= 0;
    blockNumber--
  ) {
    votePower = await contract.getPastVotes(voter.address, blockNumber);
    console.log(
      `At block number ${blockNumber}, the voter had a total of ${votePower} voting power units\n`
    );
  }
}

main()
  .catch()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
