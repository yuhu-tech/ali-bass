pragma solidity ^0.4.20;

import "./Context.sol";
import "./Nft.sol";

/**
 * @title ERC721 Burnable Token
 * @dev ERC721 Token that can be irreversibly burned (destroyed).
 */
contract NftBurnable is Context, Nft {
    /**
     * @dev Burns a specific Nft token.
     * @param tokenId uint256 id of the Nft token to be burned.
     */
    function burn(uint256 tokenId) public returns (bool) {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "NftBurnable: caller is not owner nor approved");
        _burn(tokenId);
        return true;
    }
    
    /**
     * @dev batch burn Nft token IDS.
     * @param tokenIds uint256[] IDs of the token to be burned.
     * @return A bool whether the given token IDs burned.
    */
    function batchBurn(uint256[] memory tokenIds) public returns (bool) {
        require(_isTokenIdsApprovedOrOwner(tokenIds, _msgSender()), "NftBurnable: tokenIds owner is not caller");
        for (uint256 i = 0;i < tokenIds.length; ++i) {
            _burn(tokenIds[i]);
        }
        return true;
    }
}
