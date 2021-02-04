pragma solidity ^0.4.20;

import "./Context.sol";
import "./Roles.sol";

contract PauserRole is Context {
    using Roles for Roles.Role;

    event PauserAdded(identity indexed account);
    event PauserRemoved(identity indexed account);

    Roles.Role private _pausers;

    constructor () internal {
        _addPauser(_msgSender());
    }

    modifier onlyPauser() {
        require(isPauser(_msgSender()), "PauserRole: caller does not have the Pauser role");
        _;
    }

    function isPauser(identity account) public view returns (bool) {
        return _pausers.has(account);
    }

    function addPauser(identity account) public onlyPauser {
        _addPauser(account);
    }

    function renouncePauser() public {
        _removePauser(_msgSender());
    }

    function _addPauser(identity account) internal {
        _pausers.add(account);
        emit PauserAdded(account);
    }

    function _removePauser(identity account) internal {
        _pausers.remove(account);
        emit PauserRemoved(account);
    }
}
