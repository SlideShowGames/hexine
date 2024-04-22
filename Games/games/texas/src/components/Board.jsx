import React, { Component } from "react";
import Player from "./player";

class Board extends Component {
  state = {
    tableBet: 0,
    pot: 0,
    handStarted: 0,
    curBet: 0,
    curPlayer: 1,
    number_of_players: 3,
    cardList: [],
    flopList: [],
    players: [
      { id: 1, cash: 20, didBet: 0, didFold: 0, bet: 0, hand: [] },
      { id: 2, cash: 20, didBet: 0, didFold: 0, bet: 0, hand: [] },
      { id: 3, cash: 20, didBet: 0, didFold: 0, bet: 0, hand: [] },
    ],
  };
  render() {
    return (
      <React.Fragment>
        <div className="btn-toolbar justify-content-center">
          <button
            className="btn-primary btn-sm m-2"
            onClick={() => this.dealCards()}
          >
            Deal
          </button>
          <button
            className="btn-primary btn-sm m-2"
            onClick={() => this.dealFlop()}
          >
            Deal Flop
          </button>
          <button
            className="btn-primary btn-sm m-2"
            onClick={() => this.resetCards()}
          >
            Reset
          </button>
        </div>

        <div className="container-fluid">
          <div className="col">
            <div className="row justify-content-center">
              <h1>Table</h1>
            </div>
            <div className="row justify-content-center">
              {this.displayCard(this.state.flopList[0])}
              {this.displayCard(this.state.flopList[1])}
              {this.displayCard(this.state.flopList[2])}
              {this.displayCard(this.state.flopList[3])}
              {this.displayCard(this.state.flopList[4])}
            </div>
            <div className="row justify-content-center">
              <h2>Pot: ${this.state.pot}</h2>
            </div>
            <div className="align-bottom">
              <div className="row">
                {this.state.players.map((player) => (
                  <div key={player.id} className="col">
                    <Player
                      key={player.id}
                      id={player.id}
                      player={player}
                      curPlayer={this.state.curPlayer}
                      tableBet={this.state.tableBet}
                      onFold={this.handleFold}
                      onCheck={this.handleCheck}
                      onBet={this.handleBet}
                      onBetChange={this.handleBetChange}
                      onBetSubmit={this.handleBetSubmit}
                      onCall={this.handleCall}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  handleBetChange = (event) => {
    console.log("handeling bet change");
    let curBet = this.state.curBet;
    curBet = event.target.value;
    this.setState({ curBet });
  };

  handleBetSubmit = () => {
    console.log("handle bet submit clicked");
    const players = [...this.state.players];
    let pot = this.state.pot;
    let curPlayer = this.state.curPlayer;
    let curBet = this.state.curBet;
    let tableBet = this.state.tableBet;
    curBet = parseInt(curBet);
    if (curBet <= players[curPlayer - 1].cash) {
      players[curPlayer - 1].cash -= curBet;
      players[curPlayer - 1].didBet = 2;
      pot += curBet;
      tableBet = curBet;
      curBet = 0;

      curPlayer += 1;
      if (curPlayer > this.state.number_of_players) {
        curPlayer = 1;
      }
    }
    this.setState({ pot, curPlayer, curBet, players, tableBet });
  };

  handleCall = () => {
    console.log("Call Clicked", this.state.tableBet);
    const players = [...this.state.players];
    let pot = this.state.pot;
    let curPlayer = this.state.curPlayer;
    let curBet = this.state.curBet;
    let tableBet = this.state.tableBet;

    if (tableBet <= players[curPlayer - 1].cash) {
      players[curPlayer - 1].cash -= tableBet;
      players[curPlayer - 1].didBet = 2;
      pot += tableBet;

      curPlayer += 1;
      if (curPlayer > this.state.number_of_players) {
        curPlayer = 1;
      }
    }
    this.setState({ pot, curPlayer, players, tableBet });
  };

  handleBet = () => {
    console.log("Bet clicked");
    const players = [...this.state.players];
    players[this.state.curPlayer - 1].didBet = 1;
    this.setState({ players });
  };

  handleCheck = (playerID) => {
    let curPlayer = this.state.curPlayer;
    curPlayer += 1;
    if (curPlayer > this.state.number_of_players) {
      curPlayer = 1;
    }

    this.setState({ curPlayer });
  };

  handleFold = (playerID) => {
    const players = [...this.state.players];
    players[playerID - 1].hand = [];
    this.setState({ players });
  };

  resetCards = () => {
    const players = this.state.players.map((p) => {
      p.hand = [];
      p.didBet = 0;
      p.bet = 0;
      p.cash = 20;
      p.didFold = 0;
      return p;
    });
    let curPlayer = 1;
    let tableBet = 0;
    let pot = 0;

    this.setState({
      cardList: [],
      flopList: [],
      players,
      curPlayer,
      tableBet,
      pot,
    });
  };

  dealCards = () => {
    let dealtCards = [];
    let temp = Math.round(Math.random() * 51) + 1;
    dealtCards.push(temp);
    while (dealtCards.length < this.state.number_of_players * 2) {
      temp = Math.round(Math.random() * 51) + 1;
      if (!dealtCards.includes(temp)) {
        dealtCards.push(temp);
      }
    }
    let players = [...this.state.players];

    players[0].hand[0] = dealtCards[0];
    players[0].hand[1] = dealtCards[1];

    players[1].hand[0] = dealtCards[2];
    players[1].hand[1] = dealtCards[3];

    players[2].hand[0] = dealtCards[4];
    players[2].hand[1] = dealtCards[5];

    this.setState({ cardList: dealtCards, players, handStarted: 1 });
  };

  dealFlop = () => {
    let dealtCards = this.state.cardList;
    let dealtFlop = this.state.flopList;

    if (dealtFlop.length === 5) {
      return;
    }

    let temp = Math.round(Math.random() * 51) + 1;
    if (dealtFlop.length === 0) {
      while (dealtFlop.length < 3) {
        temp = Math.round(Math.random() * 51) + 1;
        if (!dealtCards.includes(temp) && !dealtFlop.includes(temp)) {
          dealtFlop.push(temp);
        }
      }
    } else {
      while (dealtCards.includes(temp) || dealtFlop.includes(temp)) {
        temp = Math.round(Math.random() * 51) + 1;
      }
      dealtFlop.push(temp);
    }
    this.setState({ flopList: dealtFlop });
  };

  displayCard = (card) => {
    let cardNumber = null;
    switch (card) {
      case 1:
        cardNumber = "2C";
        break;
      case 2:
        cardNumber = "2D";
        break;
      case 3:
        cardNumber = "2H";
        break;
      case 4:
        cardNumber = "2S";
        break;
      case 5:
        cardNumber = "3C";
        break;
      case 6:
        cardNumber = "3D";
        break;
      case 7:
        cardNumber = "3H";
        break;
      case 8:
        cardNumber = "3S";
        break;
      case 9:
        cardNumber = "4C";
        break;
      case 10:
        cardNumber = "4D";
        break;
      case 11:
        cardNumber = "4H";
        break;
      case 12:
        cardNumber = "4S";
        break;
      case 13:
        cardNumber = "5C";
        break;
      case 14:
        cardNumber = "5D";
        break;
      case 15:
        cardNumber = "5H";
        break;
      case 16:
        cardNumber = "5S";
        break;
      case 17:
        cardNumber = "6C";
        break;
      case 18:
        cardNumber = "6D";
        break;
      case 19:
        cardNumber = "6H";
        break;
      case 20:
        cardNumber = "6S";
        break;
      case 21:
        cardNumber = "7C";
        break;
      case 22:
        cardNumber = "7D";
        break;
      case 23:
        cardNumber = "7H";
        break;
      case 24:
        cardNumber = "7S";
        break;
      case 25:
        cardNumber = "8C";
        break;
      case 26:
        cardNumber = "8D";
        break;
      case 27:
        cardNumber = "8H";
        break;
      case 28:
        cardNumber = "8S";
        break;
      case 29:
        cardNumber = "9C";
        break;
      case 30:
        cardNumber = "9D";
        break;
      case 31:
        cardNumber = "9H";
        break;
      case 32:
        cardNumber = "9S";
        break;
      case 33:
        cardNumber = "10C";
        break;
      case 34:
        cardNumber = "10D";
        break;
      case 35:
        cardNumber = "10H";
        break;
      case 36:
        cardNumber = "10S";
        break;
      case 37:
        cardNumber = "JC";
        break;
      case 38:
        cardNumber = "JD";
        break;
      case 39:
        cardNumber = "JH";
        break;
      case 40:
        cardNumber = "JS";
        break;
      case 41:
        cardNumber = "QC";
        break;
      case 42:
        cardNumber = "QD";
        break;
      case 43:
        cardNumber = "QH";
        break;
      case 44:
        cardNumber = "QS";
        break;
      case 45:
        cardNumber = "KC";
        break;
      case 46:
        cardNumber = "KD";
        break;
      case 47:
        cardNumber = "KH";
        break;
      case 48:
        cardNumber = "KS";
        break;
      case 49:
        cardNumber = "AC";
        break;
      case 50:
        cardNumber = "AD";
        break;
      case 51:
        cardNumber = "AH";
        break;
      case 52:
        cardNumber = "AS";
        break;

      default:
        cardNumber = null;
        break;
    }

    if (cardNumber != null) {
      return (
        <img
          src={require("./PNG/" + cardNumber + ".png")}
          alt="Cards"
          style={{ height: 200, width: 120 }}
        ></img>
      );
    } else {
      return null;
    }
  };
}

export default Board;
