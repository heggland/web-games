type Player = 'X' | 'O' | null;

class TicTacToe {
    private board: Player[];
    private currentPlayer: Player;
    private gameOver: boolean = false;
    private xWins: number = 0;
    private oWins: number = 0;
    private draws: number = 0;

    private menuVisible: boolean = false;
    private foreground: HTMLDivElement | null = null;
    private menuElement: HTMLDivElement | null = null;
    private scoreboardElement: HTMLDivElement | null = null;
    private resetButtonElement: HTMLButtonElement | null = null;
    private boardElement: HTMLDivElement | null = null;
    private statusElement: HTMLDivElement | null = null;

    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.renderGame();

        if (this.menuVisible) {
            this.foreground?.setAttribute('data-visible', 'true');
        }

    }

    renderGame() {
        const container = document.createElement('div');
        container.classList.add('container');

        const header = document.createElement('div');
        header.classList.add('header');
        container.appendChild(header);

        const title = document.createElement('h1');
        title.textContent = 'Tic Tac Toe';
        container.appendChild(title);

        const foreground = document.createElement('div');
        foreground.id = 'foreground';
        container.appendChild(foreground);

        const menu = document.createElement('div');
        menu.id = 'menu';
        foreground.appendChild(menu);
        this.foreground = foreground;
        this.menuElement = menu;

        const scoreboardElement = document.createElement('div');
        scoreboardElement.id = 'scoreboard';
        this.scoreboardElement = scoreboardElement;
        menu.appendChild(scoreboardElement);

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';
        resetButton.classList.add('reset-button');

        resetButton.addEventListener('click', () => {
            this.hideMenu();
        });


        this.resetButtonElement = resetButton;
        menu.appendChild(resetButton);

        const boardElement = document.createElement('div');
        boardElement.classList.add('board');
        boardElement.id = 'board';
        this.boardElement = boardElement;
        container.appendChild(boardElement);

        const statusElement = document.createElement('div');
        statusElement.classList.add('status');
        statusElement.id = 'status';
        this.statusElement = statusElement;
        container.appendChild(statusElement);

        document.body.appendChild(container);

        this.renderBoard();
        this.updateStatus(`Player ${this.currentPlayer}'s turn`);
        this.renderScoreboard();
    }

    hideMenu() {
        this.foreground?.removeAttribute('data-visible');
        this.menuVisible = false;
    }

    showMenu() {
        if (this.menuVisible) return;
        if (!this.menuElement) return;
        this.foreground?.setAttribute('data-visible', 'true');
        this.menuVisible = true;
    }

    renderBoard() {
        const boardElement = this.boardElement;
        if (boardElement) {
            boardElement.innerHTML = '';
            this.board.forEach((cell, index) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.textContent = cell ? cell : '';
                cellElement.addEventListener('click', () => this.handleCellClick(index));
                boardElement.appendChild(cellElement);
            });
        }
    }

    resetGame(player: Player) {
        this.board = Array(9).fill(null);
        this.switchPlayer(player);
        this.gameOver = false;
        this.renderBoard();
        this.updateStatus(`Player ${player}'s turn`);
        this.renderScoreboard();

        this.foreground?.classList.add('hidden');
    }

    handleCellClick(index: number) {
        if (this.gameOver || this.board[index]) return;

        const nextPlayer = this.getNextPlayer();

        this.board[index] = this.currentPlayer;
        this.renderBoard();
        const winnerOrDraw = this.checkWinner();
        if (winnerOrDraw) {

            this.updateScore();
            if (this.resetButtonElement) {
                this.resetButtonElement.addEventListener('click', () => {
                    if (nextPlayer) {
                        this.resetGame(nextPlayer);
                    } else {
                        this.resetGame('X');
                    }
                });
                this.showMenu();
            }
            return;
        }
        this.updateStatus(`Player ${nextPlayer}'s turn`);
        this.switchPlayer(nextPlayer);
    }

    getNextPlayer() {
        return this.currentPlayer === 'X' ? 'O' : 'X';
    }

    switchPlayer(nextPlayer: Player) {
        this.currentPlayer = nextPlayer;
    }

    checkWinner() {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.gameOver = true;
                this.updateStatus(`${this.currentPlayer} wins!`);
                return true;
            }
        }

        if (!this.board.includes(null)) {
            this.gameOver = true;
            this.updateStatus('Draw!');
            return true;
        }
    }

    updateStatus(message: string) {
        const statusElement = this.statusElement;
        if (statusElement) {
            statusElement.textContent = message;
        }
    }

    updateScore() {
        switch (this.currentPlayer) {
            case 'X':
                this.xWins++;
                break;
            case 'O':
                this.oWins++;
                break;
            default:
                this.draws++;
                break;
        }

        this.renderScoreboard();
    }

    renderScoreboard() {
        const scoreboardElement = this.scoreboardElement;

        if (scoreboardElement) {
            scoreboardElement.innerHTML = '';
            const oWinsDiv = document.createElement('div');
            oWinsDiv.classList.add('o-wins');
            oWinsDiv.textContent = `O wins: ${this.oWins}`;
            const xWinsDiv = document.createElement('div');
            xWinsDiv.textContent = `X wins: ${this.xWins}`;
            const drawsDiv = document.createElement('div');
            drawsDiv.textContent = `Draws: ${this.draws}`;
            scoreboardElement.appendChild(oWinsDiv);
            scoreboardElement.appendChild(xWinsDiv);
            scoreboardElement.appendChild(drawsDiv);
        }
    }
}

new TicTacToe();
