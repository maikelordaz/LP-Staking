//SPDX-License-Identifier: MIT
/**
* @title VerifySig
* @notice a contract that verifies a signature.
*/
pragma solidity ^0.8.4;

contract VerifySig {

// FUNCTIONS // 
    
    function verify(address _signer, string memory _message, bytes memory signature)
    public
    pure
    returns (bool) {
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        return recover(ethSignedMessageHash, signature) == _signer;
    }

    function getMessageHash(string memory _message)
    public
    pure
    returns (bytes32) {
        return keccak256(abi.encodePacked(_message));
    }

    function getEthSignedMessageHash(bytes32 _messageHash)
    public
    pure
    returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    function recover(bytes32 _ethSignedMessageHash, bytes memory _signature)
    public
    pure
    returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = _split(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function _split(bytes memory sig) 
    internal
    pure
    returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
