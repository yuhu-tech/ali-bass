pragma solidity ^0.4.20;

library Roles {
    struct Role {
        mapping (identity => bool) bearer;
    }

    function add(Role storage role, identity account) internal {
        require(!has(role, account), "Roles: account already has role");
        role.bearer[account] = true;
    }

    function remove(Role storage role, identity account) internal {
        require(has(role, account), "Roles: account does not have role");
        role.bearer[account] = false;
    }

    function has(Role storage role, identity account) internal view returns (bool) {
        require(account != identity(0), "Roles: account is the zero identity");
        return role.bearer[account];
    }
}
