pragma solidity ^0.4.20;

import "./IToken.sol";
import "./ITokenMintable.sol";
import "./ITokenBurnable.sol";

contract ITokenFull is IToken, ITokenMintable, ITokenBurnable { 
    function transferTokenOwnership(identity newOwner) public;
}
