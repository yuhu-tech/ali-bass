pragma solidity ^0.4.20;

contract Context {

    constructor () internal { }

    function _msgSender() internal view returns (identity) {
        return msg.sender;
    }

    function _msgData() internal view returns (bytes memory) {
        this; 
        return msg.data;
    }
}
