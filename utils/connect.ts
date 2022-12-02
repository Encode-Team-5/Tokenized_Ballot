import { ethers } from "ethers";
const alchemy = process.env.ALCHEMY_API_KEY;
const provider = ethers.getDefaultProvider("goerli", { alchemy });
const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
const signer = wallet.connect(provider);

export= { ethers, signer };
