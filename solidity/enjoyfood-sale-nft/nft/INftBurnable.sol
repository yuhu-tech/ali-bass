pragma solidity ^0.4.20;

interface INftBurnable {
    
    function burn(uint256 tokenId) external returns (bool);

    function batchBurn(uint256[] tokenIds) external returns (bool);
}
