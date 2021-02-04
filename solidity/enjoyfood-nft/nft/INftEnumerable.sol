pragma solidity ^0.4.20;

/**
 * @title GRC-721 Non-Fungible Token Standard, optional enumeration extension
 * @dev See https://eips.ethereum.org/EIPS/eip-721
 */
interface INftEnumerable {
    function totalSupply() external view returns (uint256);
    function tokenOfOwnerByIndex(identity owner, uint256 index) external view returns (uint256 tokenId);
    function tokenByIndex(uint256 index) external view returns (uint256);
    function tokensOfOwner(identity owner) external view returns (uint256[] memory);
}