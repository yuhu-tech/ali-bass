pragma solidity ^0.4.20;

import "./EnumerableSet.sol";

contract TestEnumerableSet {

    using EnumerableSet for EnumerableSet.UintSet;

    EnumerableSet.UintSet private _tokenIds;

    constructor() public {
        
    }

    function add(uint256 tokenId) public {
        _tokenIds.add(tokenId);
    }

    function remove(uint256 tokenId) public {
        _tokenIds.remove(tokenId);
    }

    function length() public view returns(uint256) {
        return _tokenIds.length();
    }

    function all() public view returns(uint256[]) {
        return _tokenIds.all();
    }
}