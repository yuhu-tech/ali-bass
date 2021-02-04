pragma solidity ^0.4.20;

/**
 * Utility library of inline functions on identityes
 */
library Identity {

  /**
   * Returns whether the target identity is a contract
   * @dev This function will return false if invoked during the constructor of a contract,
   * as the code is not actually created until after the constructor finishes.
   * @param account identity of the account to check
   * @return whether the target identity is a contract
   */
  function isContract(identity account) internal view returns (bool) {
    uint256 size;
    // XXX Currently there is no better way to check if there is a contract in an identity
    // than to check the size of the code at that identity.
    // See https://ethereum.stackexchange.com/a/14016/36603
    // for more details about how this works.
    // TODO Check this again before the Serenity release, because all identityes will be
    // contracts then.
    // solium-disable-next-line security/no-inline-assembly
    assembly { size := extcodesize(account) }
    return size > 0;
  }

}