import ticTacToe from "./tic-tac-toe/tic-tac-toe.ts";

(function app() {

    if (typeof document === "undefined") {
        console.error("This script should only run in the browser.");
        return;
    }

    new ticTacToe();
})();

