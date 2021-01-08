pragma solidity ^0.4.20;

import "./Signature.sol";

contract TestSignature {
    // pub "0xabc"
    function getSigner(uint256 signedAmount, bytes pub, bytes memory signature) public pure returns(identity, bytes32){
        bytes32 hash = keccak256(abi.encodePacked(signedAmount));
        identity signer = Signature.recoverSigner(hash, signature);
        bytes32 realSigner = sha256(pub);
        return (signer, realSigner);
    }
}