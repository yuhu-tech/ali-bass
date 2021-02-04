pragma solidity ^0.4.20;

import "./Token.sol";
import "./TokenMintable.sol";
import "./TokenBurnable.sol";
import "./TokenPausable.sol";

contract TokenFull is Token, TokenMintable, TokenBurnable, TokenPausable {
    constructor (string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public Token(name, symbol, decimals, totalSupply) {
        
    } 
    
    function transferTokenOwnership(identity newOwner) public onlyOwner returns (bool) {
        transferOwnership(newOwner);
        addMinter(newOwner);
        renounceMinter();
        addPauser(newOwner);
        renouncePauser();
        return true;
    }
}