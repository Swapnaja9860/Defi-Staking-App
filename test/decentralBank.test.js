const { assert } = require('chai');

const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, customer]) =>{
    // all code goes here for testing

    let tether, rwd;
    
    function tokens(amount){
        return web3.utils.toWei(amount, 'ether')
    }
    // this block get executed before describe that is before testcase
    // to avoid repetation of code
    before(async()=>{
        tether = await Tether.new();
        rwd = await RWD.new()

        decentralBank = await DecentralBank.new(tether.address, rwd.address)

        await rwd.transfer(decentralBank.address, tokens('1000000'))
        await tether.transfer(customer, tokens('100'), {from : owner})
    })

    describe("Mock Tether deployment", async() =>{
        it("tether name matches successfully", async()=>{
            const name = await tether.name();
            assert.equal(name, "Tether")
        })
    })

    describe("Mock BankTransfer deployment", async() =>{
        it("transferd money to bank successfully", async()=>{
            const balance = await rwd.balanceOf(decentralBank.address);
            const expectedBalance = await tokens('1000000')
            assert.equal(balance, expectedBalance)
        })
    })

    describe("Yeild farming", async() =>{
        it("check the balance", async() =>{
            const balance = await tether.balanceOf(customer);
            const expectedBalance = await tokens('100');
            assert.equal(balance, expectedBalance)
        })

        it("test deposit", async() =>{
            await tether.approve(decentralBank.address, tokens('10'), {from : customer});
            decentralBank.deposit(tokens('10'), {from : customer})

            // const balance = await decentralBank.stakingBalance(customer);
            const balance = await tether.balanceOf(customer);
            const expectedBalance = await tokens('90');
            assert.equal(balance, expectedBalance)

            // Ensure only owner can issue the tokens
            await decentralBank.issueToken({from : customer}).should.be.rejected;
        })
    })



})