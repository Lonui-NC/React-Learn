import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { debug } from 'util';

function Square(props) {
  return (
    <button 
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    debugger;
    return <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      // highlight={this.props.highlightCells.indexOf(i) > -1}
      />;
  }

  // #3 add support for rendering by two loops
  renderRow(begin) {
    let row = [];
    for (let i = begin * 3; i < 3 + begin * 3; i++) {
      row.push(this.renderSquare(i));
    }
    return row;
  }

  renderBoard() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      board.push(
        <div className="board-row">
          {this.renderRow(i)}
        </div>
      );
    }
    return board;
  }

  render() {
    return (
      <div>
        {this.renderBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        currentRow: 0, 
        currentCol: 0
      }],
      xIsNext: true,
      stepNumber: 0, 
      orderAsc: true
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return; 
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat({
        squares: squares,
        currentRow: Math.ceil(i / 3),
        currentCol: (i % 3) + 1
      }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  // #4 add support for toggling 
  handleToggle() {
    const history = this.state.history.slice(1, this.state.history.length);
    this.setState({
      orderAsc: !this.state.orderAsc,
      history: this.state.history.slice(0, 1).concat(history.reverse())
    })
  }

  renderToggleButton() {
    let name = "Toggle order to: " + (this.orderAsc ? "Desc" : "Asc");
    return (
      <button onClick={() => this.handleToggle()}>{name}</button>
    )
  }

  render() {
    // #2 refresh the desc of steps when click jumpTo
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    debugger;
    let status;
    if (winner) {
      status = "Winner is: " + winner; 
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // #6 display a message that the result is a draw
    if (history.length === 10) {
      status = "It's a draw!"
    }

    const moves = history.map((step, move) => {
      // #1 enhancements of showing location by col, row
      const desc = move ?
        "Go to move #" + move + ": " + step.currentCol + " , " + step.currentRow : 
        "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            // highlightCells={cells}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{this.renderToggleButton()}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
