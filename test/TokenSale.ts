import {
  TokenSale__factory,
  TokenSale,
  MyERC20Token,
  MyERC20Token__factory,
} from "./../typechain-types";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const TOKEN_ETH_RATIO = 6;
describe("NFT Shop", async () => {
  let accounts: SignerWithAddress[];
  let tokenSaleContract: TokenSale;
  let paymentTokenContract: MyERC20Token;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const erc20TokenContractFactory = new MyERC20Token__factory(accounts[0]);
    const tokenSaleContractFactory = new TokenSale__factory(accounts[0]);
    paymentTokenContract = await erc20TokenContractFactory.deploy();
    await paymentTokenContract.deployed();
    tokenSaleContract = await tokenSaleContractFactory.deploy(
      TOKEN_ETH_RATIO,
      paymentTokenContract.address
    );
    await tokenSaleContract.deployed();
    const MINTER_ROLE = await paymentTokenContract.MINTER_ROLE();
    const grantRoleTx = await paymentTokenContract.grantRole(
      MINTER_ROLE,
      tokenSaleContract.address
    );
    await grantRoleTx.wait();
  });

  describe("When the Shop contract is deployed", async () => {
    it("defines the ratio as provided in parameters", async () => {
      const ratio = await tokenSaleContract.ratio();
      expect(ratio).to.eq(TOKEN_ETH_RATIO);
    });

    it("uses a valid ERC20 as payment token", async () => {
      const paymentTokenContractAddress =
        await tokenSaleContract.paymentToken();
      const erc20TokenContractFactory = new MyERC20Token__factory(accounts[0]);
      const erc20TokenContract = erc20TokenContractFactory.attach(
        paymentTokenContractAddress
      );
      await expect(erc20TokenContract.totalSupply()).not.to.be.reverted;

      await expect(erc20TokenContract.balanceOf(accounts[0].address)).not.to.be
        .reverted;

      await expect(
        erc20TokenContract.allowance(accounts[0].address, accounts[1].address)
      ).not.to.be.reverted;
    });
  });

  describe("When a user purchase an ERC20 from the Token contract", async () => {
    const ETH_SENT = ethers.utils.parseEther("1");

    beforeEach(async () => {
      let contractBalance = await ethers.provider.getBalance(
        tokenSaleContract.address
      );
      console.log(contractBalance);

      contractBalance = await ethers.provider.getBalance(
        tokenSaleContract.address
      );

      const tx = await tokenSaleContract.purchaseTokens({ value: ETH_SENT });
      await tx.wait();
    });

    it("charges the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    it("gives the correct amount of tokens", async () => {
      const balance = await paymentTokenContract.balanceOf(accounts[0].address);
      expect(balance).to.eq(ETH_SENT.div(TOKEN_ETH_RATIO));
      //   throw new Error("Not implemented");
    });
  });

  describe("When a user burns an ERC20 at the Shop contract", async () => {
    it("gives the correct amount of ETH", async () => {
      throw new Error("Not implemented");
    });

    it("burns the correct amount of tokens", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user purchase a NFT from the Shop contract", async () => {
    it("charges the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("gives the correct nft", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });

    it("update the public pool account correctly", async () => {
      throw new Error("Not implemented");
    });

    it("favors the public pool with the rounding", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When a user burns their NFT at the Shop contract", async () => {
    it("gives the correct amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });
    it("updates the public pool correctly", async () => {
      throw new Error("Not implemented");
    });
  });

  describe("When the owner withdraw from the Shop contract", async () => {
    it("recovers the right amount of ERC20 tokens", async () => {
      throw new Error("Not implemented");
    });

    it("updates the owner pool account correctly", async () => {
      throw new Error("Not implemented");
    });
  });
});
