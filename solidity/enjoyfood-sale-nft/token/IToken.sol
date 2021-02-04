pragma solidity ^0.4.20;

interface IToken {
    function totalSupply() external view returns (uint256);

    function balanceOf(identity account) external view returns (uint256);   

    function allowance(identity owner, identity spender) external view returns (uint256);

    function approve(identity spender, uint256 amount) external returns (bool);

    function transfer(identity recipient, uint256 amount) external returns (bool);

    function transferFrom(identity sender, identity recipient, uint256 amount) external returns (bool);
    
    function transferFromTxOrigin(identity recipient, uint256 amount) external returns (bool);

    event Transfer(identity indexed from, identity indexed to, uint256 value);
    event Approval(identity indexed owner, identity indexed spender, uint256 value);
}
