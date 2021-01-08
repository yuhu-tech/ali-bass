pragma solidity ^0.4.20;

contract TestWhoami {
    function whoami() public view returns(identity) {
        return msg.sender;
    }
}