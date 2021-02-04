pragma solidity ^0.4.20;


interface INftMintable {
    function mint(identity to, uint256 tokenId, string tokenURI) external returns (bool);
    function batchMint(identity to, uint256[] tokenIds, string tokenURI) external returns (bool);
    function managerMinterByTxOrigin(identity user, uint256 operationType) external returns (bool);
}

