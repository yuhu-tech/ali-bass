pragma solidity ^0.4.20;

contract TestPlatformInterface {

    constructor () public {
        
    }

    function getZeroIdentity() public pure returns (identity) {
        return identity(0);
    }

    function getBlockNumber() public view returns (uint) {
        return block.number;
    }

    function getBlockhash(uint blockNumber) public view returns (bytes32) {
        return blockhash(blockNumber);
    }

    function getMsgSender() public view returns (identity) {
        return msg.sender;
    }

}