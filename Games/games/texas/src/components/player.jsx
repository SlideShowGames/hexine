import React, { Component } from "react";

class Player extends Component {
  render() {
    return (
      <div>
        <div className="row">{this.renderButtons()}</div>
        <div className="row">
          <p>
            Player {this.props.id} Cash: ${this.props.player.cash}
          </p>
        </div>
        <div className="row">
          {this.displayCard(this.props.player.hand[0])}
          {this.displayCard(this.props.player.hand[1])}
        </div>
      </div>
    );
  }

  renderButtons() {
    if (this.props.player.didBet === 0) {
      console.log(this.props.player.didBet);
      //No bet has been placed
      if (this.props.player.id === this.props.curPlayer) {
        console.log("Current player given option to bet");
        if (this.props.tableBet === 0) {
          //Curent player is given the option to bet
          return (
            <div>
              <button
                onClick={() => this.props.onBet()}
                className="btn-primary btn-sm m-2"
              >
                Bet
              </button>
              <button
                onClick={() => this.props.onCheck(this.props.player.id)}
                className="btn-primary btn-sm m-2"
              >
                Check
              </button>
              <button
                onClick={() => this.props.onFold(this.props.player.id)}
                className="btn-primary btn-sm m-2"
              >
                Fold
              </button>
            </div>
          );
        } else {
          //A bet has been placed, player given option to call, raise, or fold
          return (
            <div>
              <button
                onClick={() => this.props.onCall()}
                className="btn-primary btn-sm m-2"
              >
                Call
              </button>
              <button className="btn-primary btn-sm m-2">Raise</button>
              <button
                onClick={() => this.props.onFold(this.props.player.id)}
                className="btn-primary btn-sm m-2"
              >
                Fold
              </button>
            </div>
          );
        }
      } else {
        //other players given option to fold
        return (
          <div>
            <button
              onClick={() => this.props.onFold(this.props.player.id)}
              className="btn-primary btn-sm m-2"
            >
              Fold
            </button>
          </div>
        );
      }
    } else if (this.props.player.didBet === 1) {
      //Player clicked bet and in now given option to enter a bet
      return (
        <div>
          <input
            type="text"
            onChange={this.props.onBetChange.bind(this)}
          ></input>
          <button
            onClick={this.props.onBetSubmit.bind(this)}
            className="btn-primary btn-sm m-2"
          >
            Submit
          </button>
        </div>
      );
    } else if (this.props.player.didBet === 2) {
      return (
        <div>
          <p>Bet of ${this.props.tableBet} placed.</p>
        </div>
      );
    }
  }

  displayCard = (card) => {
    let cardNumber = "2H";
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

export default Player;
