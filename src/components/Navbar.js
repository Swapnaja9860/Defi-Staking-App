import React, { Component } from 'react';
import bank from '../bank.png'

export default class Navbar extends Component {

  render() {
    return (
      <nav className='navbar navbar-dark fixed-top shadow p-0' style={{backgroundColor : 'black', height: '50px'}}>
        <a className='navbar-brand col-sm-3 col-md-2 mr-0' style={{color : 'white'}}>
        <img src={bank} width='40' height='30' className='d-inline-block align-top' alt='bank' />
        Dapp Yeild Farming</a>
        <ul>
          <li>
            <small style={{color : 'white'}}>Account Number: {this.props.account}</small> 
          </li>
        </ul>
      </nav>
    )
  }
}
