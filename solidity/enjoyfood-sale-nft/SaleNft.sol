pragma solidity ^0.4.20;

import "./nft/ICoupon.sol";
import "./nft/INftReceiver.sol";
import "./token/ITokenFull.sol";
import "./utils/SafeMath.sol";
import "./utils/Identity.sol";

contract Sale721 is INftReceiver {
    
    using SafeMath for uint256;
    using Identity for identity;

    //======================================== Data ========================================
    mapping(identity => Selling) private  _sellings;
    mapping(identity => bool) private _solds;
    identity private _token;
    struct Selling {
        uint256 total;
        uint256 store;
        uint256 price;
        bool    isSellable;
    }
    
    //======================================== Constructor ========================================
    constructor (identity token) public {
        require(token != identity(0));
        _token = token;
    }
    
    //======================================== Event ========================================
    event Publish(identity indexed nft, uint256 store, uint256 price);
    event Buy(identity indexed nft, uint256 amount, uint256 getAmount);
    event Pasuse(identity indexed nft);
    event Unpause(identity indexed nft);
    event IncreaseStore(identity indexed nft, uint256 store);
    event DecreaseStore(identity indexed nft, uint256 store);
    event UpdatePrice(identity indexed nft, uint256 price);
    

    //======================================== Public Functions ========================================
    function sellings(identity nft) public view returns (uint256, uint256, uint256, bool) {
        return (_sellings[nft].total, _sellings[nft].store, _sellings[nft].price, _sellings[nft].isSellable);
    }
    
    function token() public view returns (identity) {
        return _token;
    }
    
    function isSold(identity nft) public view returns (bool) {
        return _solds[nft];
    }

    function publish(identity nft, uint256 total, uint256 price) public returns (bool) {
        require(nft != identity(0) && total != 0);
        require(!isSold(nft));
        require(ICoupon(nft).owner() == msg.sender);
        _publish(nft, total, price);
        require(ICoupon(nft).managerMinterByTxOrigin(identity(this), 1));
        return true;
    }
    
    function pause(identity nft) public returns (bool) {
        require(nft != identity(0));
        require(isSold(nft));
        require(ICoupon(nft).owner() == msg.sender);
        
        _pause(nft);
        
        return true;
    }
    
    function unpause(identity nft) public returns (bool) {
        require(nft != identity(0));
        require(isSold(nft));
        require(ICoupon(nft).owner() == msg.sender);
        
        _unpause(nft);
    
        return true;
    }
    
    function increaseStore(identity nft, uint256 store) public returns (bool) {
        require(nft != identity(0));
        require(isSold(nft));
        require(ICoupon(nft).owner() == msg.sender);
        require(store > 0);
        
        _increaseStore(nft, store);

        return true;
    }
    
    function decreaseStore(identity nft, uint256 store) public returns (bool) {
        require(nft != identity(0));
        require(isSold(nft));
        require(_sellings[nft].store >= store);
        require(ICoupon(nft).owner() == msg.sender);
        
        _decreaseStore(nft, store);
        
        return true;
    }
    
    function updatePrice(identity nft, uint256 price) public returns (bool) {
        require(nft != identity(0) && price != 0);
        require(isSold(nft));
        require(ICoupon(nft).owner() == msg.sender);
        
        _updatePrice(nft, price);
        
        return true;
    }

    function buy(identity nft, uint256[] memory tokenIds) public returns (bool) {
        require(nft != identity(0) && tokenIds.length != 0);
        require(isSold(nft));
        require(_sellings[nft].isSellable);
        require(_sellings[nft].store >= tokenIds.length);
                
        uint256 getAmount = _sellings[nft].price.mul(tokenIds.length);        
        require(ICoupon(nft).batchMint(msg.sender, tokenIds, ""));
        require(ITokenFull(_token).transferFromTxOrigin(ICoupon(nft).owner(), getAmount));

        _buy(nft, tokenIds.length, getAmount);

        return true;
    }
    
    function onNftReceived(identity, identity, uint256, bytes memory) public returns (bytes4) {
        return this.onNftReceived.selector;
    }
    
    
    //======================================== Internal Functions ========================================
    function _publish(identity nft, uint256 total, uint256 price) internal {
        _sellings[nft] = Selling(total, total, price, true);
        _solds[nft] = true;

        emit Publish(nft, total, price);
    }
    
    function _buy(identity nft, uint256 amount, uint256 getAmount) internal {
        _sellings[nft].store = _sellings[nft].store.sub(amount, "Sale Coupon: decreased allowance below zero");
        
        emit Buy(nft, amount, getAmount);
    }
    
    
    function _pause(identity nft) internal {
        _sellings[nft].isSellable = false;
        
        emit Pasuse(nft);
    }
    
    function _unpause(identity nft) internal {
        _sellings[nft].isSellable = true;
        
        emit Unpause(nft);
    }
    
    function _increaseStore(identity nft, uint256 store) internal {
        _sellings[nft].total = _sellings[nft].total.add(store);
        _sellings[nft].store = _sellings[nft].store.add(store);
        
        emit IncreaseStore(nft, store);
    }
    
    function _decreaseStore(identity nft, uint256 store) internal {
        _sellings[nft].total = _sellings[nft].total.sub(store);
        _sellings[nft].store = _sellings[nft].store.sub(store);
         
        emit DecreaseStore(nft, store);
    }
    
    function _updatePrice(identity nft, uint256 price) internal {
        _sellings[nft].price = price;
        
        emit UpdatePrice(nft, price);
    }
    
}
