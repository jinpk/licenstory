// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import {buildModule} from "@nomicfoundation/hardhat-ignition/modules";

const LockModule = buildModule("FundingRegistry", (m) => {
    const fundingRegistry = m.contract("FundingRegistry");

    return {fundingRegistry};
});

export default LockModule;
