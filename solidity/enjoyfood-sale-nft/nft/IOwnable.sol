pragma solidity ^0.4.20;

interface IOwnable {
    
    function owner() external view returns (identity);

    function isOwner() external view returns (bool);
    
    function renounceOwnership() external;
 
    function transferOwnership(identity newOwner) external;
}
