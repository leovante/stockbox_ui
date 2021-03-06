import React from 'react';
import './App.css';

function App() {
    return (
        <div>
            <Game/>
        </div>
    );
}

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
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
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
                stepNumber: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            selectedButton: null,
            order: 'Прямая сортировка',
        };
    }

    handleClick(i) {
        const historyArr = this.state.history.slice(0, this.state.stepNumber + 1);
        const currentMap = historyArr[historyArr.length - 1];
        const squaresArr = currentMap.squares.slice();
        const position = null;
        if (calculateWinner(squaresArr) || squaresArr[i]) {
            return;
        }
        squaresArr[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: historyArr.concat([{
                squares: squaresArr,
                stepNumber: historyArr.length,
                position: i + 1,
            }]),
            stepNumber: historyArr.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            selectedButton: step,
        });
    }

    switchOrder(i) {
        this.setState(
            i === 'Прямая сортировка' ? {order: 'Обратная сортировка'} : {order: 'Прямая сортировка'}
        )
    }

    render() {
        let history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const order = this.state.order;

        if (order === 'Обратная сортировка') {
            history = history.reverse();
        }

        const switchBtn = this.state.stepNumber ?
            <button className={"button"} onClick={() => this.switchOrder(order)}>{order}</button> :
            <div style={{height: 24, width: 220}}></div>;

        const moves = history.map((step, move) => {
            const desc = step.position ?
                'Перейти к ходу #' + step.stepNumber + ' (ячейка ' + step.position + ')' :
                'К началу игры';
            return (
                <li key={move}>
                    <button
                        className={["button", step.stepNumber === this.state.selectedButton ? 'selected' : ''].join(" ")}
                        onClick={() => this.jumpTo(step.stepNumber)}
                        type="button">{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Выиграл ' + winner;
        } else {
            status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
        }


        return (
            <div className="game" style={{margin: 50}}>
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{switchBtn}</ol>
                    <ol>{moves}</ol>
                </div>

                <div style={{padding: 10, margin: 10}}>
                    <h4 style={{margin: 0}}>GitHub:</h4>
                    <div>
                        <a href={"https://github.com/leovante/stockbox_ui"}>https://github.com/leovante/stockbox_ui</a>
                    </div>
                    <div>
                        <a href={"https://github.com/leovante/stockbox"}>https://github.com/leovante/stockbox</a>
                    </div>
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

export default App;