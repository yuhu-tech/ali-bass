pragma solidity ^0.4.20;

import "./INft.sol";
import "./INftBatchable.sol";
import "./INftBurnable.sol";
import "./INftMintable.sol";
import "./INftEnumerable.sol";
import "./INftMetadata.sol";
import "./INftExpired.sol";
import "./IOwnable.sol";

contract ICoupon is INft, INftBatchable, INftBurnable, INftMintable, INftEnumerable, INftMetadata, INftExpired, IOwnable {
    
}
