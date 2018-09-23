// Libs
import React, { Component } from "react";
import styles from "./index.module.css";

export default class Application extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pot: 10,
      spin: "",
      turn: 0,
      isDisabled: true,
      isButtonDisabled: true,
      players: [
        { name: "Adam", score: 5, isDisabled: true, id: 1 },
        { name: "Jenn", score: 5, isDisabled: true, id: 2 }
      ]
    };
    this.onStartChange = this.onStartChange.bind(this);
    this.onResetChange = this.onResetChange.bind(this);
    this.onScoreChange = this.onScoreChange.bind(this);
    this.onAdd = this.onAdd.bind(this);
  }
  onStartChange(index) {
    const newPlayers = [...this.state.players];
    newPlayers[0].isDisabled = false;
    this.setState(prevState => ({
      newPlayers,
      isDisabled: !prevState.isDisabled
    }));
  }

  onResetChange(index) {
    const newPlayers = [...this.state.players];
    newPlayers[0].isDisabled = true;
    newPlayers[0].score = 5;
    newPlayers[1].isDisabled = true;
    newPlayers[1].score = 5;
    this.setState(prevState => ({
      newPlayers,
      isDisabled: !prevState.isDisabled,
      pot: 10,
      spin: "",
      turn: 0
    }));
  }
  onAdd(index) {
    const newPlayers = [...this.state.players];
    if (
      this.state.newPlayers[0].score === 0 ||
      this.state.newPlayers[1].score === 0
    ) {
      newPlayers[0].isDisabled = true;
      newPlayers[1].isDisabled = true;
      this.setState(prevState => ({
        newPlayers,
        pot: "Game Over, play again"
      }));
    } else {
      if (
        this.state.newPlayers[0].isDisabled === true &&
        this.state.turn >= 1
      ) {
        newPlayers[0].score -= 1;
        newPlayers[1].score -= 1;
        newPlayers[0].isDisabled = false;
        this.setState(prevState => ({ pot: this.state.pot + 2 }));
      }
    }
    this.setState(prevState => ({ isButtonDisabled: true }));
  }
  onScoreChange(index) {
    let dreidel = Math.floor(Math.random() * 4);
    const hebrew = ["נ", "שׁ", "ה", "ג"];
    let currentSpin = hebrew[dreidel];
    const newPlayers = [...this.state.players];
    if (this.state.newPlayers[0].isDisabled === true && this.state.turn >= 1) {
      this.setState(prevState => ({ isButtonDisabled: false }));
    }
    if (
      (this.state.newPlayers[0].score <= 0 ||
        this.state.newPlayers[1].score <= 0) &&
      (dreidel === 1 || dreidel === 3)
    ) {
      newPlayers[0].isDisabled = true;
      newPlayers[1].isDisabled = true;
      this.setState(prevState => ({
        newPlayers,
        pot: "Game Over, play again"
      }));
    } else {
      if (dreidel === 0) {
        /* Spin a Nun - Nothing */
        if (this.state.newPlayers[0].isDisabled === false) {
          newPlayers[0].isDisabled = true;
          newPlayers[1].isDisabled = false;
        } else {
          newPlayers[1].isDisabled = true;
        }
      } else if (dreidel === 1) {
        /* Spin a Shin - Put one in the Pot */
        if (this.state.newPlayers[0].isDisabled === false) {
          newPlayers[0].isDisabled = true;
          newPlayers[0].score -= 1;
          newPlayers[1].isDisabled = false;
        } else {
          newPlayers[1].score -= 1;
          newPlayers[1].isDisabled = true;
        }
        this.setState(prevState => ({ pot: this.state.pot + 1 }));
      } else if (dreidel === 2) {
        /* Spin a Hay - Win half of your coins in the Pot */
        if (this.state.newPlayers[0].isDisabled === false) {
          newPlayers[0].isDisabled = true;
          newPlayers[0].score =
            this.state.newPlayers[0].score + Math.round(this.state.pot / 2);
          newPlayers[1].isDisabled = false;
        } else {
          newPlayers[1].score =
            this.state.newPlayers[1].score + Math.round(this.state.pot / 2);
          newPlayers[1].isDisabled = true;
        }
        this.setState(prevState => ({ pot: Math.floor(this.state.pot / 2) }));
      } else {
        /* Spin a Gimel - Win everything  */
        if (this.state.newPlayers[0].isDisabled === false) {
          newPlayers[0].isDisabled = true;
          newPlayers[0].score = this.state.newPlayers[0].score + this.state.pot;
          newPlayers[1].isDisabled = false;
        } else {
          newPlayers[1].score = this.state.newPlayers[1].score + this.state.pot;
          newPlayers[1].isDisabled = true;
        }
        newPlayers[1].score -= 1;
        newPlayers[0].score -= 1;
        this.setState(prevState => ({ pot: 2 }));
      }
      this.setState(prevState => ({
        newPlayers,
        spin: currentSpin,
        turn: this.state.turn + 1
      }));
    }
  }

  render() {
    return (
      <div className={styles.scoreboard}>
       <div className={styles.container}>
        <div className={styles.players}>
          <div className={styles.player}>
            <div>
              <h2>{this.state.players[0].name}</h2>
              <div className={styles.counter}>
                <button
                  className={styles.counterAction}
                  disabled={this.state.players[0].isDisabled}
                  onClick={this.onScoreChange}
                >
                  SPIN
                </button>
                <div className={styles.counterScore}>
                  {this.state.players[0].score}
                </div>
              </div>
            </div>
          </div>
          <h2 id="spin">{this.state.spin}</h2>
          <div className={styles.player}>
            <div>
              <h2>{this.state.players[1].name}</h2>
              <div className={styles.counter}>
                <button
                  className={styles.counterAction}
                  disabled={this.state.players[1].isDisabled}
                  onClick={this.onScoreChange}
                >
                  SPIN
                </button>
                <div className={styles.counterScore}>
                  {this.state.players[1].score}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button
            className={styles.addAction}
            onClick={this.onAdd}
            disabled={this.state.isButtonDisabled}
          >
            Add Coin
          </button>
          <h3>Coins in the Pot:</h3>
          <h2>{this.state.pot}</h2>
        </div>
        <div className={styles.buttons}>
          <button
            className={styles.resetAction}
            onClick={this.onResetChange}
            disabled={this.state.isDisabled}
          >
            Reset
          </button>
          <button
            className={styles.startAction}
            onClick={this.onStartChange}
            disabled={!this.state.isDisabled}
          >
            Start
          </button>
        </div>
        </div>
      </div>
    );
  }
}
