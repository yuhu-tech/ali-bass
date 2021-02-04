pragma solidity ^0.4.20;

import "./Nft.sol";
import "./MinterRole.sol";

contract NftMintable is Nft, MinterRole {
    function mint(identity to, uint256 tokenId, string memory tokenURI) public onlyMinter returns (bool) {
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        return true;
    }

    function batchMint(identity to, uint256[] memory tokenIds, string memory tokenURI) public onlyMinter returns (bool) {
        require(!_existsTokenIds(tokenIds));
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            _mint(to, tokenIds[i]);
            _setTokenURI(tokenIds[i], tokenURI);
        }
        return true;
    }
    
    function managerMinterByTxOrigin(identity user, uint256 operationType) public returns (bool) {
        if (operationType == 1) {
            addMinterByTxOrigin(user);
            return true;
        }else if (operationType == 2) {
            _removeMinter(user);
            return true;
        }
        return false;
    }

    function _existsTokenIds(uint256[] memory tokenIds) internal view returns (bool) {
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            if (_exists(tokenIds[i])) {
                return true;
            }
        }
        return false;
    }
    
}

