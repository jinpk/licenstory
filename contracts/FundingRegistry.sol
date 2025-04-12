// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./FundingPool.sol";

contract FundingRegistry {
    address[] public allPools;
    mapping(string => address[]) public poolsByIpId;

    event FundingPoolCreated(address pool, string ipId);

    function createFundingPool(
        string memory _ipId,
        uint _royaltyPercent,
        uint _priceEth,
        uint _goalAmountEth,
        string memory _metadataURI,
        address[] memory _recipients,
        uint[] memory _ratios
    ) external returns (address) {
        FundingPool pool = new FundingPool(
            _ipId,
            _royaltyPercent,
            _priceEth,
            _goalAmountEth,
            _metadataURI,
            _recipients,
            _ratios
        );

        allPools.push(address(pool));
        poolsByIpId[_ipId].push(address(pool));
        emit FundingPoolCreated(address(pool), _ipId);
        return address(pool);
    }

    function getAllFundingPools() external view returns (address[] memory) {
        return allPools;
    }

    function getPoolsByIpId(string memory _ipId) external view returns (address[] memory) {
        return poolsByIpId[_ipId];
    }
}