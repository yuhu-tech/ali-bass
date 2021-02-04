pragma solidity ^0.4.20;

import "./Nft.sol";
import "./Pausable.sol";

/**
 * @title Nft Non-Fungible Pausable token
 * @dev Nft modified with pausable transfers.
 */
contract NftPausable is Nft, Pausable {
    function approve(identity to, uint256 tokenId) public whenNotPaused {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(identity to, bool approved) public whenNotPaused {
        super.setApprovalForAll(to, approved);
    }

    function _transferFrom(identity from, identity to, uint256 tokenId) internal whenNotPaused {
        super._transferFrom(from, to, tokenId);
    }
    
    function _mint(identity to, uint256 tokenId) internal whenNotPaused {
        super._mint(to, tokenId);
    }
}
