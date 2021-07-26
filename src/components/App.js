import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MyGameToken from '../abis/MyGameToken.json'
import brain from '../brain.png'

const CARD_ARRAY = [
    {
        name: 'fries',
        img: '/images/fries.png'
    },
    {
        name: 'cheeseburger',
        img: '/images/cheeseburger.png'
    },
    {
        name: 'hotdog',
        img: '/images/hotdog.png'
    },
    {
        name: 'ice-cream',
        img: '/images/ice-cream.png'
    },
    {
        name: 'pizza',
        img: '/images/pizza.png'
    },
    {
        name: 'milkshake',
        img: '/images/milkshake.png'
    },
    {
        name: 'fries',
        img: '/images/fries.png'
    },
    {
        name: 'cheeseburger',
        img: 'images/cheeseburger.png'
    },
    {
        name: 'hotdog',
        img: '/images/hotdog.png'
    },
    {
        name: 'ice-cream',
        img: '/images/ice-cream.png'
    },
    {
        name: 'pizza',
        img: '/images/pizza.png'
    },
    {
        name: 'milkshake',
        img: '/images/milkshake.png'
    },
]

class App extends Component {

  //load web3
  async loadWeb3() {
      console.log("load web3")
      if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)
          await window.ethereum.enable()
      }
      else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
          window.alert("Non-Ethereum browser detected. Install Metamask pls")
      }
  }

  async loadBlockchainData() {
      const web3 = window.web3
      // fetch account
      const accounts = await web3.eth.getAccounts()
      this.setState({account: accounts[0]}) // set state = write database defined in constructor
      console.log("account: ", accounts[0])

      // load smart contract
      const networkId = await web3.eth.net.getId()
      console.log("network id = ", networkId)

      const networkData = MyGameToken.networks[networkId]
      if(networkData) {
          const abi = MyGameToken.abi
          const address = networkData.address // contract address
          const tokenContract = new web3.eth.Contract(abi, address)
          this.setState({ tokenContract })

          const totalSupply = await tokenContract.methods.totalSupply().call() // call functions in smart contract
          this.setState({ totalSupply })

          // load tokens
          let balanceOf = await tokenContract.methods.balanceOf(accounts[0]).call()
          for (let i = 0; i < balanceOf; i++) {
              let id = await tokenContract.methods.tokenOfOwnerByIndex(accounts[0], i).call()
              let tokenURI = await tokenContract.methods.tokenURI(id).call()
              this.setState({
                  tokenURIs: [...this.state.tokenURIs, tokenURI]
              })
          }
      } else {
          window.alert("Smart contract chuwa deploy, khong tim thay contract")
      }
  }

  chooseImage = (cardId) => {
      cardId = cardId.toString()
    //   return window.location.origin + '/images/blank.png'
      if(this.state.cardsWon.includes(cardId)) {
        //   return CARD_ARRAY[cardId].img
        return window.location.origin + '/images/white.png'
      } else if (this.state.cardsChosenId.includes(cardId)) {
          return CARD_ARRAY[cardId].img
      }
      else {
          return window.location.origin + '/images/blank.png'
      }
  }

  flipCard = async (cardId) => {
    let alreadyChosen = this.state.cardsChosen.length
    this.setState({
        cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
        cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if (alreadyChosen === 1) {
        setTimeout(this.checkForMatch, 100)
    }
  }

  checkForMatch = async () => {
    const optionOneId = this.state.cardsChosenId[0]
    const optionTwoId = this.state.cardsChosenId[1]

    if(optionOneId === optionTwoId) {
        console.log("Click trung roi")
    } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
        console.log("Match found")

        // create token everytime match found
        this.state.tokenContract.methods.mint(
            this.state.account,
            window.location.origin + CARD_ARRAY[optionOneId].img.toString()
        )
        .send({ from: this.state.account })
        .on('transactionHash', (hash) => {
            this.setState({
                cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId],
                tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img]
            })
        })
    } else {
        console.log("Try again")

    }
    this.setState({
        cardsChosen: [],
        cardsChosenId: []
    })
    if (this.state.cardsWon.length === CARD_ARRAY.length) {
        alert("YOU WIN")
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      tokenContract: null,
      totalSupply: 0,
      tokenURIs: [],
      cardArray: [],
      cardsChosen: [],
      cardsChosenId: [],
      cardsWon: [],
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://bonandbo"
            target="_blank"
            rel="noopener noreferrer"
          >
          <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Memory Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1 className="d-4">Play & Earn</h1>

                <div className="grid mb-4" >

                  { this.state.cardArray.map((card, key) => {
                      return(
                          <img
                            key={key}
                            src={this.chooseImage(key)}
                            data-id={key}
                            onClick={(event) => {
                                let cardId = event.target.getAttribute('data-id')
                                if(!this.state.cardsWon.includes(cardId.toString())) {
                                    this.flipCard(cardId)
                                }
                            }}
                          ></img>
                      )
                  })}

                </div>

                <div>

                  <h5>Tokens Collected: <span id="result">&nbsp; {this.state.tokenURIs.length}</span></h5>

                  <div className="grid mb-4" >
                    {/* show token claimed */}
                    { this.state.tokenURIs.map((tokenURI, key) => {
                        return(
                            <img
                                key={key}
                                src={tokenURI}
                            ></img>
                        )
                    })}

                  </div>

                </div>

              </div>

            </main>
          </div>
        </div>
      </div>
    );
  }

  async componentDidMount() {
      await this.loadWeb3()
      await this.loadBlockchainData()
      this.setState({
          cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random())
      })
  }
}

export default App;