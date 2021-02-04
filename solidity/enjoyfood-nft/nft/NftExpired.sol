pragma solidity ^0.4.20;

import "./Nft.sol";
import "../utils/SafeMath.sol";


contract NftExpired is Nft {
    using SafeMath for uint256;
    
    uint256 private _startDate;
    uint256 private _endDate;
    
    modifier onlyInDate() {
        require(_startDate < now && now < _endDate);
        _;
    }
    
    constructor (uint256 startDate, uint256 endDate) public {
        _startDate = startDate.mul(1000);
        _endDate = endDate.mul(1000);
    }
    
    function isExpired() public view returns (bool) {
        return !(_startDate <= now && now <= _endDate);
    }
    
    function expiredDate() public view returns (uint256, uint256) {
        return (_startDate.div(1000), _endDate.div(1000));
    }
    
    function approve(identity to, uint256 tokenId) public onlyInDate {
        super.approve(to, tokenId);
    }

    function setApprovalForAll(identity to, bool approved) public onlyInDate {
        super.setApprovalForAll(to, approved);
    }

    function _transferFrom(identity from, identity to, uint256 tokenId) internal onlyInDate {
        super._transferFrom(from, to, tokenId);
    }
    
    function _mint(identity to, uint256 tokenId) internal onlyInDate {
        super._mint(to, tokenId);
    }
}

