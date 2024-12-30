import ticTacToe from "./tic-tac-toe";

(function app() {
    if (typeof window === "undefined" || typeof document === "undefined") {
        console.error("This script should only run in the browser.");
        return;
    }

    new ticTacToe();
})();
