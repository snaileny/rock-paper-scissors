const rockPaperScissors = (() => {

    const GAME_RESULTS = {

        roundDraw: 0,
        roundFirst: 1,
        roundSecond: 2,
        gameDraw: 3,
        gameFirst: 4,
        gameSecond: 5

    }

    const TEXT_TO_EMOJI = {

        rock: "✊",
        paper: "✋",
        scissors: "✌"

    }

    const elements = {

        playerFirstChoice: document.querySelector(".playerFirst-choice div"),
        playerSecondChoice: document.querySelector(".playerSecond-choice div"),
        playerFirstPoints: document.querySelector(".playerFirst-points span"),
        playerSecondPoints: document.querySelector(".playerSecond-points span"),
        gameResult: document.querySelector(".game-result div"),
        gameResultDesc: document.querySelector(".game-result span"),
        rockButton: document.querySelector("#rock"),
        paperButton: document.querySelector("#paper"),
        scissorsButton: document.querySelector("#scissors"),
        roundsTotal: document.querySelector("#total-rounds"),
        roundsLeft: document.querySelector("#rounds-left"),
        playerScore: document.querySelector("#player-score"),
        botScore: document.querySelector("#bot-score"),
        roundInput: document.querySelector("#round-number"),
        newGameButton: document.querySelector("#new-game")

    }

    function Player(state, score) {

        this.state = state;
        this.score = score;

    }

    Player.prototype.addScore = function() {

        this.score++;

    }

    Player.prototype.setState = function(state) {

        this.state = state;

    }

    function Bot(state, score) {

        Player.call(this, state, score);
        this.plays = ["rock", "paper", "scissors"];

    }

    Bot.prototype = Object.create(Player.prototype);

    Bot.prototype.setRandomState = function() {
            
        this.state = this.plays[Math.floor(Math.random() * 3)];

    }

    function Game(rounds) {

        this.rounds = rounds;
        this.gameRules = {

            rock: "scissors",
            paper: "rock",
            scissors: "paper"

        }

    }

    Game.prototype.play = function(playerFirst, playerSecond) {

        playerSecond.setRandomState();

        if (this.gameRules[playerFirst.state] === playerSecond.state) {

            playerFirst.addScore();
            return GAME_RESULTS.roundFirst;

        } else if (this.gameRules[playerSecond.state] === playerFirst.state) {

            playerSecond.addScore();
            return GAME_RESULTS.roundSecond;

        } else if (playerFirst.state === playerSecond.state) {

            return GAME_RESULTS.roundDraw;

        }

    }

    Game.prototype.run = function(playerFirst, playerSecond) {

        if (this.rounds > 1) {

            const result = this.play(playerFirst, playerSecond);
            this.rounds--;
            return result;

        } else if (this.rounds === 1) {

            this.play(playerFirst, playerSecond);
            this.rounds--;

            if (playerFirst.score > playerSecond.score) {

                return GAME_RESULTS.gameFirst;

            } else if (playerSecond.score > playerFirst.score) {

                return GAME_RESULTS.gameSecond;

            } else if (playerFirst.score === playerSecond.score) {

                return GAME_RESULTS.gameDraw;

            }

        }

    }

    function init() {

        const roundInputValue = Number(elements.roundInput.value);
        const roundInputNumber =  roundInputValue <= 50 && roundInputValue > 0 ? roundInputValue : 5;
        const game = new Game(roundInputNumber);
        const player = new Player("", 0);
        const bot = new Bot("", 0);
        let pressed = false;
        setScoreboard(0, 0, roundInputNumber, game.rounds);

        function eventHandler(e) {

            if (game.rounds > 0 && pressed === false) {

                player.setState(e.target.value);
                const result = game.run(player, bot);
                pressed = true;
                addAnim();
                setChoice("rock", "rock");

                setTimeout(() => {

                    setScoreboard(player.score, bot.score, roundInputNumber, game.rounds);
                    setChoice(player.state, bot.state);
                    setResult(result, player.state, bot.state);
                    removeAnim();
                    pressed = false;

                }, 3000);

            } 

        }

        elements.rockButton.addEventListener("click", (e) => {

            if (game.rounds > 0) {setResultDesc("", "...");}
            eventHandler(e);

        });
        elements.paperButton.addEventListener("click", (e) => {
            
            if (game.rounds > 0) {setResultDesc("", "...");}
            eventHandler(e);

        });
        elements.scissorsButton.addEventListener("click", (e) => {

            if (game.rounds > 0) {setResultDesc("", "...");}
            eventHandler(e);

        });

    }

    elements.newGameButton.addEventListener("click", () => {

        init();
        setResultDesc("make a move!", "WAITING");

    });

    function setResult(result, playerChoice, botChoice) {

        switch(result) {

            case GAME_RESULTS.roundFirst:
                setResultDesc(playerChoice, botChoice, "ROUND WON");
                break;

            case GAME_RESULTS.roundSecond:
                setResultDesc(botChoice, playerChoice, "ROUND LOST");
                break;

            case GAME_RESULTS.roundDraw:
                setResultDesc("it's a draw!", "ROUND DRAW");
                break;

            case GAME_RESULTS.gameFirst:
                setResultDesc("start a new game!", "GAME WON");
                break;

            case GAME_RESULTS.gameSecond:
                setResultDesc("start a new game!", "GAME LOST");
                break;

            case GAME_RESULTS.gameDraw:
                setResultDesc("start a new game!", "GAME DRAW");
                break;
            
        }

    }

    function setResultDesc(...args) {

        if (args.length === 3) {

            elements.gameResult.textContent = args[2];
            elements.gameResultDesc.textContent = `${args[0]} beats ${args[1]}!`;

        } else {

            elements.gameResult.textContent = args[1];
            elements.gameResultDesc.textContent = args[0];

        }

    }

    function setScoreboard(playerScore, botScore, roundsTotal, roundsLeft) {

        elements.roundsTotal.textContent = roundsTotal;
        elements.roundsLeft.textContent = roundsLeft;
        elements.playerScore.textContent = playerScore;
        elements.botScore.textContent = botScore;

    }

    function setChoice(playerChoice, botChoice) {

        elements.playerFirstChoice.textContent = TEXT_TO_EMOJI[playerChoice];
        elements.playerSecondChoice.textContent = TEXT_TO_EMOJI[botChoice];

    }

    function addAnim() {

        elements.playerFirstChoice.parentElement.classList.add("shake");
        elements.playerSecondChoice.parentElement.classList.add("shake");

    }

    function removeAnim() {

        elements.playerFirstChoice.parentElement.classList.remove("shake");
        elements.playerSecondChoice.parentElement.classList.remove("shake");

    }

})();

