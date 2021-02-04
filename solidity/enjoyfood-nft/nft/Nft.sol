pragma solidity ^0.4.20;

import "./Context.sol";
import "./Ownable.sol";
import "./ERC165.sol";
import "./INft.sol";
import "./INftReceiver.sol";
import "./INftMetadata.sol";
import "./INftEnumerable.sol";
import "../utils/SafeMath.sol";
import "../utils/Identity.sol";
import "../utils/EnumerableSet.sol";
import "../utils/EnumerableMap.sol";

contract Nft is Context, Ownable, ERC165, INft, INftMetadata, INftEnumerable {
    using SafeMath for uint256;
    using Identity for identity;
    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableMap for EnumerableMap.UintToidentityMap;

    // Equals to `bytes4(keccak256("onNftReceived(identity,identity,uint256,bytes)"))`
    // which can be also obtained as `INftReceiver(0).onNftReceived.selector`
    bytes4 private constant _Nft_RECEIVED = 0xeb2cba6a;

    // Mapping from holder identity to their (enumerable) set of owned tokens
    mapping (identity => EnumerableSet.UintSet) private _holderTokens;

    // Enumerable mapping from token ids to their owners
    EnumerableMap.UintToidentityMap private _tokenOwners;

    // Mapping from token ID to approved identity
    mapping (uint256 => identity) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping (identity => mapping (identity => bool)) private _operatorApprovals;

    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    /*
     *     bytes4(keccak256('balanceOf(identity)')) == 0x6d51ab48
     *     bytes4(keccak256('ownerOf(uint256)')) == 0x6352211e
     *     bytes4(keccak256('approve(identity,uint256)')) == 0x24e8cb25
     *     bytes4(keccak256('getApproved(uint256)')) == 0x081812fc
     *     bytes4(keccak256('setApprovalForAll(identity,bool)')) == 0x23667be7
     *     bytes4(keccak256('isApprovedForAll(identity,identity)')) == 0x22353470
     *     bytes4(keccak256('transferFrom(identity,identity,uint256)')) == 0xfbecfd21
     *     bytes4(keccak256('transferFromTxOrigin(identity,uint256)')) == 0xbbf75fce
     *     bytes4(keccak256('safeTransferFrom(identity,identity,uint256)')) == 0x87e14851
     *     bytes4(keccak256('safeTransferFrom(identity,identity,uint256,bytes)')) == 0x757d27f0
     *
     *     => 0x6d51ab48 ^ 0x6352211e ^ 0x24e8cb25 ^ 0x081812fc ^
     *        0x23667be7 ^ 0x22353470 ^ 0xfbecfd21 ^ 0xbbf75fce ^ 0x87e14851 ^ 0x757d27f0 == 0x9127d156
     */
    bytes4 private constant _INTERFACE_ID_Nft = 0x9127d156;

    /*
     *     bytes4(keccak256('name()')) == 0x06fdde03
     *     bytes4(keccak256('symbol()')) == 0x95d89b41
     *     bytes4(keccak256('tokenURI(uint256)')) == 0xc87b56dd
     *     => 0x06fdde03 ^ 0x95d89b41 ^ 0xc87b56dd == 0x5b5e139f
     */
    bytes4 private constant _INTERFACE_ID_Nft_METADATA = 0x5b5e139f;

    /*
     *     bytes4(keccak256('totalSupply()')) == 0x18160ddd
     *     bytes4(keccak256('tokenOfOwnerByIndex(identity,uint256)')) == 0x0424ec2b
     *     bytes4(keccak256('tokenByIndex(uint256)')) == 0x4f6ccce7
     *     bytes4(keccak256('tokensOfOwner(identity)')) == 0x4fcb5889
     *
     *     => 0x18160ddd ^ 0x0424ec2b ^ 0x4f6ccce7 ^ 0x4fcb5889 == 0x1c957598
     */
    bytes4 private constant _INTERFACE_ID_Nft_ENUMERABLE = 0x1c957598;

    constructor (string memory name, string memory symbol) public {
        _name = name;
        _symbol = symbol;

        // register the supported interfaces to conform to Nft via ERC165
        _registerInterface(_INTERFACE_ID_Nft);
        _registerInterface(_INTERFACE_ID_Nft_METADATA);
        _registerInterface(_INTERFACE_ID_Nft_ENUMERABLE);
    }

    /**
     * @dev Gets the balance of the specified identity.
     * @param owner identity to query the balance of
     * @return uint256 representing the amount owned by the passed identity
     */
    function balanceOf(identity owner) public view returns (uint256) {
        require(owner != identity(0), "Nft: balance query for the zero identity");

        return _holderTokens[owner].length();
    }

    /**
     * @dev Gets the owner of the specified token ID.
     * @param tokenId uint256 ID of the token to query the owner of
     * @return identity currently marked as the owner of the given token ID
     */
    function ownerOf(uint256 tokenId) public view returns (identity) {
        return _tokenOwners.get(tokenId, "Nft: owner query for nonexistent token");
    }

    /**
     * @dev Gets the token name.
     * @return string representing the token name
     */
    function name() public view returns (string memory) {
        return _name;
    }

    /**
     * @dev Gets the token symbol.
     * @return string representing the token symbol
     */
    function symbol() public view returns (string memory) {
        return _symbol;
    }
 
    /**
     * @dev Returns the URI for a given token ID. May return an empty string.
     *
     * If the token's URI is non-empty and a base URI was set (via
     * {_setBaseURI}), it will be added to the token ID's URI as a prefix.
     *
     * Reverts if the token ID does not exist.
     */
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "NftMetadata: URI query for nonexistent token");

        return _tokenURIs[tokenId];
    }

    /**
     * @dev Gets the token ID at a given index of the tokens list of the requested owner.
     * @param owner identity owning the tokens list to be accessed
     * @param index uint256 representing the index to be accessed of the requested tokens list
     * @return uint256 token ID at the given index of the tokens list owned by the requested identity
     */
    function tokenOfOwnerByIndex(identity owner, uint256 index) public view returns (uint256) {
        return _holderTokens[owner].at(index);
    }

    /**
     * @dev Gets the total amount of tokens stored by the contract.
     * @return uint256 representing the total amount of tokens
     */
    function totalSupply() public view returns (uint256) {
        // _tokenOwners are indexed by tokenIds, so .length() returns the number of tokenIds
        return _tokenOwners.length();
    }

    /**
     * @dev Gets the token ID at a given index of all the tokens in this contract
     * Reverts if the index is greater or equal to the total number of tokens.
     * @param index uint256 representing the index to be accessed of the tokens list
     * @return uint256 token ID at the given index of the tokens list
     */
    function tokenByIndex(uint256 index) public view returns (uint256) {
        (uint256 tokenId, ) = _tokenOwners.at(index);
        return tokenId;
    }
    
    /**
     * @dev Gets the token IDs at a given identity of all the tokens in this contract.
     * @param owner identity account identity. 
     * @return uint256[] token IDs at the given account identity.
     */
    function tokensOfOwner(identity owner) public view returns (uint256[] memory) {
        return _holderTokens[owner].all();
    }

    /**
     * @dev Approves another identity to transfer the given token ID
     * The zero identity indicates there is no approved identity.
     * There can only be one approved identity per token at a given time.
     * Can only be called by the token owner or an approved operator.
     * @param to identity to be approved for the given token ID
     * @param tokenId uint256 ID of the token to be approved
     */
    function approve(identity to, uint256 tokenId) public {
        identity owner = ownerOf(tokenId);
        require(to != owner, "Nft: approval to current owner");

        require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()),
            "Nft: approve caller is not owner nor approved for all"
        );

        _approve(to, tokenId);
    }

    /**
     * @dev Gets the approved identity for a token ID, or zero if no identity set
     * Reverts if the token ID does not exist.
     * @param tokenId uint256 ID of the token to query the approval of
     * @return identity currently approved for the given token ID
     */
    function getApproved(uint256 tokenId) public view returns (identity) {
        require(_exists(tokenId), "Nft: approved query for nonexistent token");

        return _tokenApprovals[tokenId];
    }

    /**
     * @dev Sets or unsets the approval of a given operator
     * An operator is allowed to transfer all tokens of the sender on their behalf.
     * @param operator operator identity to set the approval
     * @param approved representing the status of the approval to be set
     */
    function setApprovalForAll(identity operator, bool approved) public {
        require(operator != _msgSender(), "Nft: approve to caller");

        _operatorApprovals[_msgSender()][operator] = approved;
        emit ApprovalForAll(_msgSender(), operator, approved);
    }

    /**
     * @dev Tells whether an operator is approved by a given owner.
     * @param owner owner identity which you want to query the approval of
     * @param operator operator identity which you want to query the approval of
     * @return bool whether the given operator is approved by the given owner
     */
    function isApprovedForAll(identity owner, identity operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    /**
     * @dev Transfers the ownership of a given token ID to another identity.
     * Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     * Requires the msg.sender to be the owner, approved, or operator.
     * @param from current owner of the token
     * @param to identity to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function transferFrom(identity from, identity to, uint256 tokenId) public {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Nft: transfer caller is not owner nor approved");

        _transferFrom(from, to, tokenId);
    }

    /**
     * @dev Transfers the ownership of a given token ID to another identity.
     * Usage of this method is discouraged, use {safeTransferFrom} whenever possible.
     * Requires the tx.origin to be the owner, approved, or operator.
     * @param to identity to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function transferFromTxOrigin(identity to, uint256 tokenId) public {
        require(_isApprovedOrOwner(tx.origin, tokenId), "Nft: transfer caller is not owner nor approved");
        _transferFrom(tx.origin, to, tokenId);
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another identity
     * If the target identity is a contract, it must implement {INftReceiver-onNftReceived},
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onNftReceived(identity,identity,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the msg.sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to identity to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function safeTransferFrom(identity from, identity to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another identity
     * If the target identity is a contract, it must implement {INftReceiver-onNftReceived},
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onNftReceived(identity,identity,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the _msgSender() to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to identity to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function safeTransferFrom(identity from, identity to, uint256 tokenId, bytes memory _data) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "Nft: transfer caller is not owner nor approved");
        _safeTransfer(from, to, tokenId, _data);
    }

    /**
     * @dev Safely transfers the ownership of a given token ID to another identity
     * If the target identity is a contract, it must implement `onNftReceived`,
     * which is called upon a safe transfer, and return the magic value
     * `bytes4(keccak256("onNftReceived(identity,identity,uint256,bytes)"))`; otherwise,
     * the transfer is reverted.
     * Requires the msg.sender to be the owner, approved, or operator
     * @param from current owner of the token
     * @param to identity to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     * @param _data bytes data to send along with a safe transfer check
     */
    function _safeTransfer(identity from, identity to, uint256 tokenId, bytes memory _data) internal {
        _transferFrom(from, to, tokenId);
        require(_checkOnNftReceived(from, to, tokenId, _data), "Nft: transfer to non NftReceiver implementer");
    }

    /**
     * @dev Returns whether the specified token exists.
     * @param tokenId uint256 ID of the token to query the existence of
     * @return bool whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _tokenOwners.contains(tokenId);
    }

    /**
     * @dev Returns whether the given spender can transfer a given token ID.
     * @param spender identity of the spender to query
     * @param tokenId uint256 ID of the token to be transferred
     * @return bool whether the msg.sender is approved for the given token ID,
     * is an operator of the owner, or is the owner of the token
     */
    function _isApprovedOrOwner(identity spender, uint256 tokenId) internal view returns (bool) {
        require(_exists(tokenId), "Nft: operator query for nonexistent token");
        identity owner = ownerOf(tokenId);
        return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
    }
    
    /**
     * @dev check the token is belong to caller.
     */
    function _isTokenIdsApprovedOrOwner(uint256[] memory tokenIds, identity owner) public view returns (bool) {
        for (uint256 i = 0; i < tokenIds.length; ++i) {
            if (!_isApprovedOrOwner(owner, tokenIds[i])) {
                return false;
            }
        }
        return true;
    }

    /**
     * @dev Internal function to mint a new token.
     * Reverts if the given token ID already exists.
     * @param to The identity that will own the minted token
     * @param tokenId uint256 ID of the token to be minted
     */
    function _mint(identity to, uint256 tokenId) internal {
        require(to != identity(0), "Nft: mint to the zero identity");
        require(!_exists(tokenId), "Nft: token already minted");

        _holderTokens[to].add(tokenId);

        _tokenOwners.set(tokenId, to);

        emit Transfer(identity(0), to, tokenId);
    }

    /**
     * @dev Internal function to burn a specific token.
     * Reverts if the token does not exist.
     * @param tokenId uint256 ID of the token being burned
     */
    function _burn(uint256 tokenId) internal {
        identity owner = ownerOf(tokenId);

        // Clear approvals
        _approve(identity(0), tokenId);

        // Clear metadata (if any)
        if (bytes(_tokenURIs[tokenId]).length != 0) {
            delete _tokenURIs[tokenId];
        }

        _holderTokens[owner].remove(tokenId);

        _tokenOwners.remove(tokenId);

        emit Transfer(owner, identity(0), tokenId);
    }

    /**
     * @dev Internal function to transfer ownership of a given token ID to another identity.
     * As opposed to {transferFrom}, this imposes no restrictions on msg.sender.
     * @param from current owner of the token
     * @param to identity to receive the ownership of the given token ID
     * @param tokenId uint256 ID of the token to be transferred
     */
    function _transferFrom(identity from, identity to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "Nft: transfer of token that is not own");
        require(to != identity(0), "Nft: transfer to the zero identity");
    
        // Clear approvals from the previous owner
        _approve(identity(0), tokenId);

        _holderTokens[from].remove(tokenId);
        _holderTokens[to].add(tokenId);

        _tokenOwners.set(tokenId, to);

        emit Transfer(from, to, tokenId);
    }

    /**
     * @dev Internal function to set the token URI for a given token.
     *
     * Reverts if the token ID does not exist.
     *
     * TIP: If all token IDs share a prefix (for example, if your URIs look like
     * `https://api.myproject.com/token/<id>`), use {_setBaseURI} to store
     * it and save gas.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal {
        require(_exists(tokenId), "NftMetadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

      /**
   * @dev Internal function to invoke `onNftReceived` on a target identity
   * The call is not executed if the target identity is not a contract
   * @param from identity representing the previous owner of the given token ID
   * @param to target identity that will receive the tokens
   * @param tokenId uint256 ID of the token to be transferred
   * @param _data bytes optional data to send along with the call
   * @return whether the call correctly returned the expected magic value
   */
    function _checkOnNftReceived(identity from, identity to, uint256 tokenId, bytes _data) internal returns (bool) {
        if (!to.isContract()) {
            return true;
        }
        bytes4 retval = INftReceiver(to).onNftReceived(msg.sender, from, tokenId, _data);
        return (retval == _Nft_RECEIVED);
    }

    function _approve(identity to, uint256 tokenId) private {
        _tokenApprovals[tokenId] = to;
        emit Approval(ownerOf(tokenId), to, tokenId);
    }

}