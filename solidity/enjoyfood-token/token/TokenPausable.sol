pragma solidity ^0.4.20;

import "./Token.sol";
import "./Pausable.sol";

contract TokenPausable is Token, Pausable {
    function _transfer(identity sender, identity recipient, uint256 amount) internal whenNotPaused {
        super._transfer(sender, recipient, amount);
    }

    function approve(identity spender, uint256 value) public whenNotPaused returns (bool) {
        return super.approve(spender, value);
    }

    function increaseAllowance(identity spender, uint256 addedValue) public whenNotPaused returns (bool) {
        return super.increaseAllowance(spender, addedValue);
    }

    function decreaseAllowance(identity spender, uint256 subtractedValue) public whenNotPaused returns (bool) {
        return super.decreaseAllowance(spender, subtractedValue);
    }
}
