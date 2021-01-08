pragma solidity ^0.4.20;

import "./IToken.sol";
import "./Context.sol";
import "./Ownable.sol";
import "../utils/SafeMath.sol";

contract Token is Context, IToken, Ownable {
    using SafeMath for uint256;

    // ================================ Data ================================
    mapping (identity => mapping (identity => uint256)) private _allowances;
    
    mapping(identity => uint256) private _balance;

    uint256 private _totalSupply;
    
    string private _name;
    
    string private _symbol;
    
    uint8 private _decimals;
    
    
    // ================================ Constructor ================================
    constructor (string memory name, string memory symbol, uint8 decimals, uint256 totalSupply) public {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
        _mint(_msgSender(), totalSupply);
    }
    


    // ================================ External Func ================================
    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(identity account) public view returns (uint256) {
        return _balance[account];
    }

    function transfer(identity recipient, uint256 amount) public returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function transferFromTxOrigin(identity recipient, uint256 amount) public returns (bool) {
        _transfer(tx.origin, recipient, amount);
        return true;
    }

    function allowance(identity owner, identity spender) public view returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(identity spender, uint256 amount) public returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(identity sender, identity recipient, uint256 amount) public returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "Token: transfer amount exceeds allowance"));
        return true;
    }
    
    function increaseAllowance(identity spender, uint256 addedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(identity spender, uint256 subtractedValue) public returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "Token: decreased allowance below zero"));
        return true;
    }
    
    // ================================ Internal Func ================================
    function _transfer(identity sender, identity recipient, uint256 amount) internal {
        require(sender != identity(0), "Token: transfer from the zero identity");
        require(recipient != identity(0), "Token: transfer to the zero identity");

        _balance[sender] = _balance[sender].sub(amount, "Token: transfer amount exceeds balance");
        _balance[recipient] = _balance[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    function _mint(identity account, uint256 amount) internal {
        require(account != identity(0), "Token: mint to the zero identity");

        _totalSupply = _totalSupply.add(amount);
        _balance[account] = _balance[account].add(amount);
        emit Transfer(identity(0), account, amount);
    }

    function _burn(identity account, uint256 amount) internal {
        require(account != identity(0), "Token: burn from the zero identity");

        _balance[account] = _balance[account].sub(amount, "Token: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, identity(0), amount);
    }

    function _approve(identity owner, identity spender, uint256 amount) internal {
        require(owner != identity(0), "Token: approve from the zero identity");
        require(spender != identity(0), "Token: approve to the zero identity");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _burnFrom(identity account, uint256 amount) internal {
        _burn(account, amount);
        _approve(account, _msgSender(), _allowances[account][_msgSender()].sub(amount, "Token: burn amount exceeds allowance"));
    }
    
}


