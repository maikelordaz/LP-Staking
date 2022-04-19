//SPDX-License-Identifier: MIT
/**
* @title VerifySig
* @notice a contract that verifies a signature and message.
* @dev process to verify a signature in solidity
* 1. Message to sign.
* 2. hash(message).
* 3. sign(hash(message)) with a private key. This is offchain.
* 4. Lastly you check the signer to a message using the solidity function ecrecover which return a 
* signer, so we require that ecrecover(hash(message), signature) == signer.
*/
pragma solidity ^0.8.4;

contract VerifySig {
/// FUNCTIONS
    
    /**
    * @notice a function to verify. Main function of this contract
    * @dev this takes a signer, a signature and a message and verify that one correspond to each other
    * @param _signer the address we expect ecrecover to return
    * @param _message the message that was given
    * @param _signature the signature asign to the message and signer
    * @return bool if the _signature is valid and the signer return by the ecrecover is equal to 
    * _signer it return true. 
    */
    function verify(
        address _signer,
        string memory _message,
        bytes memory _signature
    )
        external
        pure
        returns (bool)
    {
        bytes32 messageHash = getMessageHash(_message);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        // The verification
        return recover(ethSignedMessageHash, _signature) == _signer;
    }
    
    /**
    * @notice Hashing the message
    * @param _message the message to sign
    * @return bytes32 of the hash of the message
    */
    function getMessageHash(string memory _message)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_message));
    }

    /**
    * @notice the actual message that is signed when a message is signed off chain
    * @param _messageHash the hash of the off chain signed message . It is prefix ed by the
    * Ethereum Signed Message followed by the lenght of the message n32 
    * @return bytes32 return the keccak256 of the whole string.
    */
    function getEthSignedMessageHash(bytes32 _messageHash)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    /**
    * @notice recover the signer
    * @param _ethSignedMessageHash the result of the previous function
    * @param _signature the signature followed by the signer
    * @return address the corresponding signer to the previous inputs.
    */
    function recover(bytes32 _ethSignedMessageHash, bytes memory _signature)
        public
        pure
        returns (address)
    {
        // we split the signature in three parts
        (bytes32 r, bytes32 s, uint8 v) = _split(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    /**
    * @notice to split the signature in the necesary parameters
    * @dev "r", "s" and "v", together with the corresponding hash it recover the signer with the
    * solidity function ecrecover, which return the address of the signer
    * @param _sig the signature
    * @return r cryptograph parameter used to digital signatures
    * @return s cryptograph parameter used to digital signatures
    * @return v required by ethereum
    */
    function _split(bytes memory _sig) 
        internal
        pure
        returns (
            bytes32 r,
            bytes32 s,
            uint8 v
        )
    {
        // the length 65 corresponds to 32 bytes from "r" plus 32 bytes from "s" and 01 byte from
        // v (uint8 equals 01 byte) 
        require(_sig.length == 65, "invalid signature");
        // as dynamic data type, sig, stores it´s length on the first 32 bytes of the data. _sig is 
        // not the actual signature, instead it is a pointer to where the signature is stored in memory
        assembly {
        //skip the first 32 bytes because it holds the length of the sig, and asign the next 32 to r
            r := mload(add(_sig, 32))
        //skip the first 64 bytes (first 32 is the length, next 32 is r) and asign the next 32 bytes to s 
            s := mload(add(_sig, 64))
        //skip the first 96 ( first 32 is the length, next 32 is r, next 32 is s), and take the next byte
            v := byte(0, mload(add(_sig, 96)))
        }
    }
}
