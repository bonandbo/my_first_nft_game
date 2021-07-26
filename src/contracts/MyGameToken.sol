 pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract MyGameToken is ERC721Full {
    // Constructor inherited from ERC721Full, using their standard
    constructor() ERC721Full("My Game Token", "MGT") public {

    }

    /*
    address: address of person who give token to
    tokenURI: token has image associate with it
    => Overwrite function in .sol file
    */
    function mint(address _to, string memory _tokenURI) public returns(bool) {
        /*
        totalSupply => return the number of token are exists
        _setTokenId => name tell itself
        */
        // increment the id by 1 and give it to the tokenID @TODO
        uint _tokenId = totalSupply().add(1);
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        return true;
    }
}

// test token able to mint and distribute to other
// mint = create token



 