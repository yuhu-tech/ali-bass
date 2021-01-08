pragma solidity ^0.4.20;

library Signature {

    // recover from bytes signature and bytes32 message to address sender
    function recoverSigner(bytes32 hash, bytes memory sig) internal pure returns (identity) {
        
        bytes32 message = prefixed(hash);
        
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(sig);
        
        return ecrecover(message, v, r, s);
    }
    
    // builds a prefixed hash to mimic the behavior of eth_sign.
    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
    

    // split signature 
    function splitSignature(bytes memory sig) internal pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 65);

        bytes32  r = bytesToBytes32(slice(sig, 0, 32));
        bytes32  s = bytesToBytes32(slice(sig, 32, 32));
        uint8  v = uint8(slice(sig, 64, 1)[0]) + 27;
    
        return (v, r, s);
    }
    
    // tool slice 
    function slice(bytes memory data, uint start, uint len) internal pure returns (bytes memory){
        bytes memory b = new bytes(len);
    
        for(uint i = 0; i < len; i++){
          b[i] = data[i + start];
        }
    
        return b;
      }

    // tool bytes to bytes32
    function bytesToBytes32(bytes memory source) internal pure returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }
    
}