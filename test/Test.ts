import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { MyERC20Token__factory, MyERC20Token } from "../typechain-types";

describe("ERC20 basic function", async () => {
  let accounts: SignerWithAddress[];
  let erc20Contract: MyERC20Token;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const erc20ContractFactory = new MyERC20Token__factory(accounts[0]);
    erc20Contract = await erc20ContractFactory.deploy();
    await erc20Contract.deployed();
    console.log(`Contract deployed at address ${erc20Contract.address}`);
  });

  it("should have zero initial supply after deployment", async () => {
    const totalSupply = await erc20Contract.totalSupply();
    expect(totalSupply).to.eq(0);
  });

  it("trigger the transfer event when a transfer is made", async () => {
    const mintTx = await erc20Contract.mint(accounts[0].address, 10);
    await mintTx.wait();

    await expect(erc20Contract.transfer(accounts[1].address, 1))
      .to.emit(erc20Contract, "Transfer")
      .withArgs(accounts[0].address, accounts[1].address, 1);
  });
});
