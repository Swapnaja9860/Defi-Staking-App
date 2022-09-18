pragma solidity ^0.5.0;

contract Migrations {
    address public owner;
    uint256 public last_migration_completed;

    constructor() public {
        owner = msg.sender;
    }

    modifier restricted() {
        if (owner == msg.sender) _;
    }

    function setComplete(uint256 completed) public restricted {
        last_migration_completed = completed;
    }

    function update(address new_address) public restricted {
        Migrations updated = Migrations(new_address);
        updated.setComplete(last_migration_completed);
    }
}
