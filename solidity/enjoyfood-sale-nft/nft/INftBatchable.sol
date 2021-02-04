pragma solidity ^0.4.20;

interface INftBatchable {
    
    /**
     * @dev batch move tokenIds from caller account to (to) account.
     * 
     * Emits a {BatchTransferFrom} event.
     */
    function batchTransferFrom(identity from, identity to, uint256[] tokenIds) external returns (bool);
    function batchTransferFromFromTxOrigin(identity to, uint256[] tokenIds) external returns (bool);

    /**
     * @dev emits when batch move tokenIds from caller account to (to) account.
     */
    event BatchTransferFrom(identity indexed from, identity indexed to, uint256[] tokenIds);
    event BatchTransferFromTxOrigin(identity indexed from, identity indexed to, uint256[] tokenIds);
}
