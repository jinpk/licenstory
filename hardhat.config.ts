/** @type import('hardhat/config').HardhatUserConfig */
import * as dotenv from "dotenv";
import "@nomicfoundation/hardhat-ignition";

dotenv.config()

export default {
    solidity: "0.8.28",
    networks: {
        storyAeneid: {
            url: "https://aeneid.storyrpc.io",
            accounts: [process.env.PRIVATE_KEY],
        },
    },
}
//  npx hardhat ignition deploy ./ignition/modules/FundingRegistry.ts --network storyAeneid