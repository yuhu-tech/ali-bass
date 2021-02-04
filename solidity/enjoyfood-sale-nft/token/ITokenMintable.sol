pragma solidity ^0.4.20;

interface ITokenMintable {
    
    function mint(identity account, uint256 amount) external;
    
}
