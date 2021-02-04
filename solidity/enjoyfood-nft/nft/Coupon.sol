pragma solidity ^0.4.20;

import "./Nft.sol";
import "./NftMintable.sol";
import "./NftBurnable.sol";
import "./NftPausable.sol";
import "./NftBatchable.sol";
import "./NftExpired.sol";

contract Coupon is Nft, NftMintable, NftBurnable, NftPausable, NftBatchable, NftExpired {
    
    constructor(string memory name, string memory symbol, uint256 startDate, uint256 endDate) public Nft(name, symbol) NftExpired(startDate, endDate) {
        
    }
    
} 
