pragma solidity ^0.4.20;

/**
 * @title Nft token receiver interface
 * @dev Interface for any contract that wants to support safeTransfers
 * from Nft asset contracts.
 */
contract INftReceiver {
    /**
     * @notice Handle the receipt of an NFT
     * @dev The Nft smart contract calls this function on the recipient
     * after a {INft-safeTransferFrom}. This function MUST return the function selector,
     * otherwise the caller will revert the transaction. The selector to be
     * returned can be obtained as `this.onNftReceived.selector`. This
     * function MAY throw to revert and reject the transfer.
     * Note: the Nft contract identity is always the message sender.
     * @param operator The identity which called `safeTransferFrom` function
     * @param from The identity which previously owned the token
     * @param tokenId The NFT identifier which is being transferred
     * @param data Additional data with no specified format
     * @return bytes4 `bytes4(keccak256("onNftReceived(identity,identity,uint256,bytes)"))`
     */
    function onNftReceived(identity operator, identity from, uint256 tokenId, bytes memory data)
    public returns (bytes4);
}