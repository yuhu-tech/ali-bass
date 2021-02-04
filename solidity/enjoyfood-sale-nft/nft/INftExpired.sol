pragma solidity ^0.4.20;

interface INftExpired {
    
    function isExpired() external view returns (bool);
    
    function expiredDate() external view returns (uint256, uint256);
    
}