pragma solidity ^0.4.20;

import "./Context.sol";

contract Ownable is Context {
    identity private _owner;

    event OwnershipTransferred(identity indexed previousOwner, identity indexed newOwner);

    constructor () internal {
        identity msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(identity(0), msgSender);
    }

    function owner() public view returns (identity) {
        return _owner;
    }

    modifier onlyOwner() {
        require(isOwner(), "Ownable: caller is not the owner");
        _;
    }

    function isOwner() public view returns (bool) {
        return _msgSender() == _owner;
    }

    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, identity(0));
        _owner = identity(0);
    }

    function transferOwnership(identity newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    function _transferOwnership(identity newOwner) internal {
        require(newOwner != identity(0), "Ownable: new owner is the zero identity");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}
