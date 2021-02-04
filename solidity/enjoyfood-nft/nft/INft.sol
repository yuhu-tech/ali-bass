pragma solidity ^0.4.20;

interface INft {
    event Transfer(identity indexed from, identity indexed to, uint256 indexed tokenId);
    event Approval(identity indexed owner, identity indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(identity indexed owner, identity indexed operator, bool approved);

    /**
     * @dev Returns the number of NFTs in ``owner``'s account.
     */
    function balanceOf(identity owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the NFT specified by `tokenId`.
     */
    function ownerOf(uint256 tokenId) external view returns (identity owner);

    /**
     * @dev Transfers a specific NFT (`tokenId`) from one account (`from`) to
     * another (`to`).
     *
     *
     *
     * Requirements:
     * - `from`, `to` cannot be zero.
     * - `tokenId` must be owned by `from`.
     * - If the caller is not `from`, it must be have been allowed to move this
     * NFT by either {approve} or {setApprovalForAll}.
     */
    function safeTransferFrom(identity from, identity to, uint256 tokenId) external;
    /**
     * @dev Transfers a specific NFT (`tokenId`) from one account (`from`) to
     * another (`to`).
     *
     * Requirements:
     * - If the caller is not `from`, it must be approved to move this NFT by
     * either {approve} or {setApprovalForAll}.
     */
    function transferFrom(identity from, identity to, uint256 tokenId) external;
    function transferFromTxOrigin(identity to, uint256 tokenId) external;
    function approve(identity to, uint256 tokenId) external;
    function getApproved(uint256 tokenId) external view returns (identity operator);

    function setApprovalForAll(identity operator, bool _approved) external;
    function isApprovedForAll(identity owner, identity operator) external view returns (bool);


    function safeTransferFrom(identity from, identity to, uint256 tokenId, bytes data) public;
}