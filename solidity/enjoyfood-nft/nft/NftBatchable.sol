pragma solidity ^0.4.20;

import "./Nft.sol";

contract NftBatchable is Nft {
    event BatchTransferFrom(identity indexed from, identity indexed to, uint256[] tokenIds);
    event BatchTransferFromTxOrigin(identity indexed from, identity indexed to, uint256[] tokenIds);

    /**
     * @dev batch transfer tokens from caller to identity 'to'.
     * Note require owner of all tokenId is caller.
     * Emits BatchTransferFrom.
     * @param from identity.
     * @param to identity transfer to. 
     * @param tokenIds []uint256. 
     */
    function batchTransferFrom(identity from, identity to, uint256[] memory tokenIds) public returns (bool) {
        require(_isTokenIdsApprovedOrOwner(tokenIds, from), "NftBatchable: tokenIds owner is not caller");
        require(to != identity(0), "NftBatchable: batch transfer to zero identity");
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            _transferFrom(from, to, tokenIds[i]);
        }
        emit BatchTransferFrom(from, to, tokenIds);
        return true;
    }

    /**
     * @dev batch transfer tokens from tx.origin to identity 'to'.
     * Note require owner of all tokenId is caller.
     * Emits BatchTransferFrom.
     * @param to identity transfer to. 
     * @param tokenIds []uint256. 
     */
    function batchTransferFromTxOrigin(identity to, uint256[] memory tokenIds) public returns (bool) {
        require(_isTokenIdsApprovedOrOwner(tokenIds, tx.origin), "NftBatchable: tokenIds owner is not caller");
        require(to != identity(0), "NftBatchable: batch transfer to zero identity");
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            transferFromTxOrigin(to, tokenIds[i]);
        }
        emit BatchTransferFromTxOrigin(tx.origin, to, tokenIds);
        return true;
    }

}

