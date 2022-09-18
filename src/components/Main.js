import React, { Component } from 'react'
import tether from '../tether.png'

export default class Main extends Component {

  constructor(props){

    super(props)
    // this.state = {amount : 0}
    this.amount = React.createRef()
  }
  
  render() {   
    return (
      <div id='content' className='mt-3'>
        <table className='table text-muted text-center'>
            <thead>
                <tr style={{color: 'white'}}>
                <th scope='col'>staking balance</th>
                <th scope='col'>RWD balance</th>
                </tr>
            </thead>
            <tbody>
                <tr style={{color : 'white'}}>
                <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} USDT</td>
                <td>{window.web3.utils.fromWei(this.props.rwdBalance, 'Ether')} RWD</td>
                </tr>
            </tbody>
        </table>
        <div className='card mb-2'>
            <form onSubmit={(event) => {
            event.preventDefault()
            let amount ;
            amount = this.amount.current.value.toString();
            amount = window.web3.utils.toWei(amount , 'Ether')
            this.props.stakeTokens(amount)
        }}>
                <label className='float-left' style={{marginLeft: '15 px'}}><b>Stake Tokens</b></label>
                <span className='float-right' style={{marginRight: '8px'}}>
                    Balance: {window.web3.utils.fromWei(this.props.tetherBalance, 'Ether')}
                </span>
                <div className='input-group mb-4'>
                    <input type='text' placeholder='0' required ref={this.amount}/>
                    <div className='input-group-open'>
                        <div className='input-group-text'>
                            <img src={tether} alt="tether" height='32'/>
                            &nbsp;&nbsp;&nbsp; USDT
                        </div>
                    </div>
                    <button type='submit' className='btn btn-primary btn-lg btn-block'> DEPOSIT </button>
                </div>
            </form>
            <button onClick={(event) =>{
                event.preventDefault()
                this.props.unstakeTokens()
            }} 
            className='btn btn-primary btn-lg btn-block'> WITHDRAW </button>
            <div className='card-body text-center' style={{color : 'blue'}}>
                AIRDROP
            </div>
        </div>
      </div>
    )
  }
}
