// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FundingPool {
    address public owner;

    string public ipId;
    uint public royaltyPercent;
    uint public priceEth;
    uint public goalAmountEth;
    string public metadataURI;

    uint public totalEthFunded;
    bool public settled;
    bool public failed;

    address[] public recipients;
    uint[] public ratios;

    event Funded(address indexed buyer, uint ethAmount);
    event FundingSuccess(uint totalEthFunded);
    event FundingFailed(uint totalEthFunded);

    constructor(
        string memory _ipId,
        uint _royaltyPercent,
        uint _priceEth,
        uint _goalAmountEth,
        string memory _metadataURI,
        address[] memory _recipients,
        uint[] memory _ratios
    ) {
        require(_recipients.length == _ratios.length, "Mismatched ratios");
        uint sum;
        for (uint i = 0; i < _ratios.length; i++) {
            sum += _ratios[i];
        }
        require(sum == 100, "Ratios must total 100");

        owner = msg.sender;
        ipId = _ipId;
        royaltyPercent = _royaltyPercent;
        priceEth = _priceEth;
        goalAmountEth = _goalAmountEth;
        metadataURI = _metadataURI;

        recipients = _recipients;
        ratios = _ratios;
    }

    receive() external payable {
        fund();
    }

    function fund() public payable {
        require(!settled && !failed, "Funding closed");
        require(msg.value >= priceEth, "Insufficient ETH");

        totalEthFunded += msg.value;
        emit Funded(msg.sender, msg.value);
    }

    function settle() public {
        require(!settled && !failed, "Already processed");

        if (totalEthFunded >= goalAmountEth) {
            uint balance = address(this).balance;
            for (uint i = 0; i < recipients.length; i++) {
                uint amount = (balance * ratios[i]) / 100;
                payable(recipients[i]).transfer(amount);
            }
            settled = true;
            emit FundingSuccess(totalEthFunded);
        } else {
            failed = true;
            emit FundingFailed(totalEthFunded);
        }
    }
}