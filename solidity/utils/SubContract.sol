pragma solidity ^0.4.20;

contract SubContract {

    mapping(identity => uint256) _token;

    constructor () public {

    }

    function increase() public returns (bool) {
        _token[tx.origin] = _token[tx.origin] + 1;
        return true;
    }

    function balance() public view returns (uint256) {
        return _token[msg.sender];
    }

}