pragma solidity ^0.4.20;

import "./SubContract.sol";

contract TestTxOrigin {

    constructor () public {
        
    }

    function getSubTxOrigin(identity subAddr) public returns (bool) {
        return subAddr.call(bytes4(keccak256("increase()")));
    }

}