pragma solidity ^0.4.20;

import "./Context.sol";
import "./Token.sol";

contract TokenBurnable is Context, Token {
    function burn(uint256 amount) public returns(bool){
        _burn(_msgSender(), amount);
        return true;
    }

    function burnFrom(identity account, uint256 amount) public {
        _burnFrom(account, amount);
    }
}
