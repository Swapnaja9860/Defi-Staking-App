const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(deployer, network, accounts){
    await deployer.deploy(Tether);
    const tether = await Tether.deployed();

    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();

    await deployer.deploy(DecentralBank, tether.address, rwd.address);
    const decentralbank = await DecentralBank.deployed();

    // transfer rwd tokens to DecentralBank
    await rwd.transfer(decentralbank.address, '1000000000000000000000000')

    // transfer ether to investor
    await tether.transfer(accounts[1], '1000000000000000000')
};