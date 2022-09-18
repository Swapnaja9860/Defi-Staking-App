pragma solidity ^0.5.0;

import "./RWD.sol";
import "./Tether.sol";

contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;
    RWD public rwd;

    constructor(Tether _tether, RWD _rwd) public {
        tether = _tether;
        rwd = _rwd;
        owner = msg.sender;
    }

    address[] public stakers;

    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaked;

    function depositTokens(uint256 _amount) public {
        require(_amount > 0, "amount can't be zero");

        tether.transferfrom(msg.sender, address(this), _amount);

        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaked[msg.sender] = true;
    }

    function unstakeTokens() public {
        uint256 balance = stakingBalance[msg.sender];

        // require the amount to be greater than zero
        require(balance > 0, "staking balance cannot be less than zero");

        tether.transfer(msg.sender, balance);

        stakingBalance[msg.sender] = 0;

        // Update Staking Status
        isStaked[msg.sender] = false;
    }

    function issueToken() public {
        require(msg.sender == owner);
        for (uint256 i = 0; i < stakers.length; i++) {
            address receiptent = stakers[i];
            uint256 tokens = stakingBalance[receiptent] / 9;
            if (tokens > 0) {
                rwd.transfer(receiptent, tokens);
            }
        }
    }
}
