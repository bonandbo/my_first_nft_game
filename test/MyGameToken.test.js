const { assert } = require('chai')

// Get the token from contract
const MyGameToken = artifacts.require('./MyGameToken.sol')

// chai is mock up testing framework for javascript 
// it's chaijs
require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('My Game Token', (accounts) => {
    let token

    before(async () => {
        token = await MyGameToken.deployed()
    })

    describe('deployment', async () => {
        it('deploys thanh cong', async () => {
            const address = token.address
            // the test
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('co ten roi', async () => {
            const name = await token.name()
            assert.equal(name, "My Game Token");
        })

        it('Co ca Symbol nha', async () => {
            const symbol = await token.symbol()
            assert.equal(symbol, "MGT")
        })
    })

    describe('Phan tan token', async () => {
        let result

        it('mint token', async () => {
            // mint the token and inspect the result
            // accounts injected by truffle
            await token.mint(accounts[0], 'https://www.google.com/nft')
            // it should increase the total supply
            result = await token.totalSupply()
            assert.equal(result.toString(), '1', "total supply is correct");
            // increments the balance of the owner
            result = await token.balanceOf(accounts[0])
            assert.equal(result.toString(), '1', "balance OK");
            // token should belong to the owner
            result = await token.ownerOf('1')
            assert.equal(result.toString(), accounts[0].toString(), "ownerOf is correct");
            result = await token.tokenOfOwnerByIndex(accounts[0], 0)
            // Owner can see all tokens
            let balanceOf = await token.balanceOf(accounts[0])
            let tokenIds = []
            for (let i = 0; i < balanceOf; i++) {
                let id = await token.tokenOfOwnerByIndex(accounts[0], i)
                tokenIds.push(id.toString())
            }
            let expectedResult = ['1']
            assert.equal(tokenIds.toString(), expectedResult.toString(), "tokenIds correct");
            let tokenURI = await token.tokenURI('1')
            assert.equal(tokenURI, "https://www.google.com/nft");

        })
    })
})