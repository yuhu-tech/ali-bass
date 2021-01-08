pragma solidity ^0.4.0;

contract TestVerifySig {

    constructor () public {

    }

    function verifySig(bytes pub, bytes sig) public pure returns (bool) {
        return verify_sig_rsa("hello", pub, sig);
    }

}