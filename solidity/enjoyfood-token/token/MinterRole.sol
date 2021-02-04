pragma solidity ^0.4.20;

import "./Context.sol";
import "./Roles.sol";

contract MinterRole is Context {
    using Roles for Roles.Role;

    event MinterAdded(identity indexed account);
    event MinterRemoved(identity indexed account);

    Roles.Role private _minters;

    constructor () internal {
        _addMinter(_msgSender());
    }

    modifier onlyMinter() {
        require(isMinter(_msgSender()), "MinterRole: caller does not have the Minter role");
        _;
    }

    function isMinter(identity account) public view returns (bool) {
        return _minters.has(account);
    }

    function addMinter(identity account) public onlyMinter {
        _addMinter(account);
    }

    function renounceMinter() public {
        _removeMinter(_msgSender());
    }

    function _addMinter(identity account) internal {
        _minters.add(account);
        emit MinterAdded(account);
    }

    function _removeMinter(identity account) internal {
        _minters.remove(account);
        emit MinterRemoved(account);
    }
}
