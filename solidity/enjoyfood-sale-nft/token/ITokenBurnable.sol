pragma solidity ^0.4.20;

interface ITokenBurnable {
    
    function burn(uint256 amount) external returns(bool);
    function burnFrom(identity account, uint256 amount) external returns(bool);
    
}
