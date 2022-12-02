import { ethers } from "hardhat";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const TEST_MINT_TOKENS = ethers.utils.parseEther("10");

async function main() {
  const alchemy = process.env.ALCHEMY_API_KEY;
  const provider = ethers.getDefaultProvider("goerli", { alchemy });
  const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
  const signer = wallet.connect(provider);

  // const accounts = await ethers.getSigners();
  // const [deployer, signer, other] = accounts;
  const contractFactory = new MyToken__factory(signer);
  const contract = await contractFactory.deploy();
  await contract.deployed();
  
  console.log(
    `The tokenized votes contract was deployed at ${contract.address}\n`
  );

  let voterTokenBalance = await contract.balanceOf(signer.address);
  
  console.log(
    `At deployment, the signer has a total of ${voterTokenBalance} vote_token decimal units\n`
  );

  const mintTx = await contract.mint(signer.address, TEST_MINT_TOKENS);
  await mintTx.wait();

  voterTokenBalance = await contract.balanceOf(signer.address);
  
  console.log(
    `After minting, the signer has a total of ${voterTokenBalance} decimal units\n`
  );

  let voterPower = await contract.getVotes(signer.address);
  
  console.log(
    `After minting, the signer has a total of ${voterPower} voting power units \n`
  );

  let delegatesTx = await contract.connect(signer).delegate(signer.address);
  await delegatesTx.wait();

  voterPower = await contract.getVotes(signer.address);
  
  console.log(
    `After self delegate, the signer has a total of ${voterPower} voting power units \n`
  );

  const transferTX = await contract
    .connect(signer)
    .transfer(signer.address, TEST_MINT_TOKENS.div(2));
  await transferTX.wait();

  voterPower = await contract.getVotes(signer.address);
  
  console.log(
    `After transfer, the signer has a total of ${voterPower} voting power units \n`
  );
  voterPower = await contract.getVotes(signer.address);
  
  console.log(
    `After transfer, the other account has a total of ${voterPower} voting power units \n`
  );

  delegatesTx = await contract.connect(signer).delegate(signer.address);
  await delegatesTx.wait();

  voterPower = await contract.getVotes(signer.address);
  
  console.log(
    `After self delegation, the other account has a total of ${voterPower} voting power units \n`
  );

  const currentBlock = await ethers.provider.getBlock("latest");
  for (
    let blockNumber = currentBlock.number - 1;
    blockNumber >= 0;
    blockNumber--
  ) {
    voterPower = await contract.getPastVotes(signer.address, blockNumber);
   
    console.log(
      `At block number ${blockNumber},the signer had a total of ${voterPower} voting power units \n`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
