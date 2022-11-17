import { ethers } from "hardhat";
import { MyERC20Token__factory } from "../typechain-types";

async function main() {
  const accounts = await ethers.getSigners();
  const erc20ContractFactory = new MyERC20Token__factory(accounts[0]);
  const erc20Contract = await erc20ContractFactory.deploy();
  await erc20Contract.deployed();
  console.log(`Contract deployed at address ${erc20Contract.address}`);

  const totalSupply = await erc20Contract.totalSupply();
  console.log(`Total supply of token at deployment is ${totalSupply}`);

  const account0Balance = await erc20Contract.balanceOf(accounts[0].address);
  console.log(
    `The token balance of Account 0 at deployment is ${account0Balance}`
  );

  const mintTx = await erc20Contract.mint(accounts[0].address, 10);
  await mintTx.wait();

  const transferTX = await erc20Contract.transfer(accounts[1].address, 1);
  await transferTX.wait();

  const totalSupplyAfter = await erc20Contract.totalSupply();
  console.log(`Total supply of token after minting is ${totalSupplyAfter}`);

  const account0BalanceAfter = await erc20Contract.balanceOf(
    accounts[0].address
  );
  
  console.log(
    `The token balance of Account 0 after transfer is ${account0BalanceAfter}`
  );

  const account1BalanceAfter = await erc20Contract.balanceOf(
    accounts[1].address
  );
  console.log(
    `The token balance of Account 1 after transfer is ${account1BalanceAfter}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
