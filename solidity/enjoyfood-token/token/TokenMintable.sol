pragma solidity ^0.4.20;

import "./Token.sol";
import "./MinterRole.sol";

contract TokenMintable is Token, MinterRole {
    function mint(identity account, uint256 amount) public onlyMinter returns (bool) {
        _mint(account, amount);
        return true;
    }
}
