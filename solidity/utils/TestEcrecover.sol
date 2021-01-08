pragma solidity ^0.4.20;

contract TestEcrecover {
    function test(bytes32 msgHash, bytes memory signature) public pure returns(identity){
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
        identity signer = ecrecover(msgHash, v, r, s);
        return signer;
    }

    function splitSignature(bytes memory sig) internal pure returns (uint8, bytes32, bytes32) {
        require(sig.length == 65);

        bytes32  r = bytesToBytes32(slice(sig, 0, 32));
        bytes32  s = bytesToBytes32(slice(sig, 32, 32));
        uint8  v = uint8(slice(sig, 64, 1)[0]) + 27;
    
        return (v, r, s);
    }

    function bytesToBytes32(bytes memory source) internal pure returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }
    

    function slice(bytes memory data, uint start, uint len) internal pure returns (bytes memory){
        bytes memory b = new bytes(len);
    
        for(uint i = 0; i < len; i++){
          b[i] = data[i + start];
        }
    
        return b;
      }
}