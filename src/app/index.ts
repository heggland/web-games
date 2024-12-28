import ticTacToe from "./tic-tac-toe/tic-tac-toe";

export default function app() {
  if (typeof document !== 'undefined') {
    new ticTacToe();
  }
}