import React, { Component } from 'react';
import Navbar from './Navbar';
import Tether from '../truffle_abis/Tether.json';
import Rwd from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import Main from './Main'
import ParticleSettings from './ParticleSettings';

const Web3 = require('web3')

export default class App extends Component {

  async UNSAFE_componentWillMount(){
    await this.loadWeb3();
    await this.loadAccount();
  }

  async loadWeb3(){
    if(window.etherum){
      window.web3 = new Web3(window.etherum)
      await window.etherum.enable()
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else{
      window.alert("No etherum extension in browser detected! check out metamask");
    }
  }

  async loadAccount(){
    const web3 = window.web3
    //NOTE: we now need to request permission from the user to get their accounts.
    var account = await web3.eth.requestAccounts()
    // var account = await web3.eth.getAccounts()
    this.setState({account: account[0]})
    
    const networkID = await web3.eth.net.getId();

    // Load Tether Contract
    const tetherData = Tether.networks[networkID]
    if(tetherData){
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
      this.setState({tether: tether})

      let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
      this.setState({tetherBalance: tetherBalance.toString()})
    }else{
      window.alert("Error! Tether contract not deployed - no network detected")
    }
    
    // Load RWD contract
    const rwdData = Rwd.networks[networkID]
    if(rwdData){
      const rwd = new web3.eth.Contract(Rwd.abi, rwdData.address)
      this.setState({rwd : rwd})

      let rwdBalnce = await rwd.methods.balanceOf(this.state.account).call()
      this.setState({rwdBalnce : rwdBalnce.toString()})

      console.log("===========rwdBalnce================")
      console.log(this.state.rwdBalance)

    }else{
      window.alert("RWD conteact not deployed - no network detected")
    }

    // Load DecentralBank Contract
    const decentralBankData = DecentralBank.networks[networkID]
    if(decentralBankData){

      const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
      this.setState({decentralBank: decentralBank})

      let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
      this.setState({stakingBalance : stakingBalance})
    }else{
      window.alert("decentralBank contract not deployed - no network detected")
    }

    this.setState({loading : false})
  }

  //staking function
  stakeTokens = (amount) => {
    this.setState({loading:true})
    this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from : this.state.account}).on('transactionHash', (hash)=>{
    this.state.decentralBank.methods.depositTokens(amount).send({from:this.state.account}).on('transactionHash', (hash) =>{
      this.setState({loading:false})
    })
    })
  }

  //unstaking function
  unstakeTokens = () => {
    this.setState({loading:true})
    this.state.decentralBank.methods.unstakeTokens().send({from:this.state.account}).on('transactionHash', (hash) =>{
      this.setState({loading:false})
    })
  }
  

  constructor(props){
    super(props)
    this.state = {account : '0x0',
    tether: {},
    rwd: {},
    decentralBank: {},
    tetherBalance: '0',
    rwdBalance: '0',
    stakingBalance: '0',
    loading: true}
  }


  render() {
    let content
    {this.state.loading ? content = <p id='loader'>Loading Please...............</p> : 
    content = <Main 
    tetherBalance={this.state.tetherBalance}
    stakingBalance={this.state.stakingBalance} 
    rwdBalance={this.state.rwdBalance}
    stakeTokens={this.stakeTokens}
    unstakeTokens={this.unstakeTokens} 
    />}
    
    return (
      <div  className="App" style={{ position: 'relative'}}>
        <div style={{ position: 'absolute'}}>
        <ParticleSettings />
        </div>
      <Navbar account={this.state.account}/>
      <div className='container-fluid mt-5'>
        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth: '600px', minHeight: '100vm'}}>
          <div>
            {content}
          </div>
        </main>
      </div>
      </div>
    )
  }
}
