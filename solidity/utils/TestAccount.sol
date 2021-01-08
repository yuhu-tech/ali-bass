pragma solidity ^0.4.20;

contract TestAccount {

    function getBalance(identity iden) public view returns (uint256) {
        return iden.balance;
    }

}