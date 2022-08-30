import { GetWords } from '../types/types';
import { SprintController } from './sprint-controller';

export class SprintView {
    modal: HTMLElement | null;
    loadingScreen: HTMLElement | null;
    gameContainer: HTMLElement | null;
    lvls: HTMLElement | null;
    resultCountContainer: HTMLElement | null;
    dotsContainer: HTMLElement | null;
    dotsCount: number;
    wordPriceContainer: HTMLElement | null;
    rightBtn: HTMLElement | null;
    wrongBtn: HTMLElement | null;
    gameResultsContainer: HTMLElement | null;
    gameResultsCorrect: HTMLElement | null;
    gameResultsWrong: HTMLElement | null;
    correctCount: HTMLElement | null;
    wrongCount: HTMLElement | null;
    resultCount: HTMLElement | null;
    playAgainBtn: HTMLElement | null;
    interval: number;

    constructor() {
        this.modal = document.querySelector<HTMLElement>('.sprint__modal');
        this.loadingScreen = document.querySelector<HTMLElement>('.sprint__load-screen');
        this.gameContainer = document.querySelector<HTMLElement>('.sprint__game');
        this.lvls = document.querySelector<HTMLElement>('.sprint__lvl');

        this.resultCountContainer = document.getElementById('sprint-result');
        this.dotsContainer = document.querySelector<HTMLElement>('.words__count');
        this.dotsCount = 0;
        this.wordPriceContainer = document.getElementById('word-price');

        this.rightBtn = document.querySelector<HTMLElement>('.sprint__right');
        this.wrongBtn = document.querySelector<HTMLElement>('.sprint__wrong');

        this.gameResultsContainer = document.querySelector<HTMLElement>('.sprint__results');
        this.gameResultsCorrect = document.querySelector<HTMLElement>('.results__correct');
        this.gameResultsWrong = document.querySelector<HTMLElement>('.results__wrong');
        this.correctCount = document.querySelector<HTMLElement>('.correct__count');
        this.wrongCount = document.querySelector<HTMLElement>('.wrong__count');
        this.resultCount = document.querySelector<HTMLElement>('.results__result');
        this.playAgainBtn = document.querySelector<HTMLElement>('.results__play-btn');
        this.interval = 0;
    }

    listenStartFromMain() {
        const sprintCardGames = document.getElementById('sprint-from-games');

        if (sprintCardGames) {
            sprintCardGames.addEventListener('click', () => {
                if (this.modal && this.gameResultsContainer && this.gameContainer && this.loadingScreen) {
                    document.body.style.overflow = 'hidden';
                    this.modal.classList.remove('hidden');
                    this.gameResultsContainer.classList.add('hidden');
                    this.gameContainer.classList.add('hidden');
                    this.loadingScreen.classList.remove('hidden');
                }
            });
        }
    }

    listenCloseGame(controller: SprintController) {
        const closeBtn = document.querySelector<HTMLElement>('.sprint__close-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => controller.endGame());
        }
    }

    closeGame() {
        if (this.modal) {
            document.body.style.overflow = 'visible';
            this.modal.classList.add('hidden');
            this.restartGame();
        }
    }

    listenLvlBtns(controller: SprintController) {
        const lvlBtnsArray = document.querySelectorAll('.lvls__btn');
        if (lvlBtnsArray) {
            lvlBtnsArray.forEach((btn) => {
                btn.addEventListener('click', async () => {
                    if (btn instanceof HTMLElement && this.lvls && this.resultCountContainer) {
                        this.lvls.classList.add('hidden');
                        this.resultCountContainer.classList.remove('hidden');
                        controller.startGame(Number(btn.dataset.lvl));
                    }
                });
            });
        }
    }

    showCountdown(controller: SprintController) {
        const countdownContainer = document.querySelector<HTMLElement>('.countdown');
        const closeBtn = document.querySelector<HTMLElement>('.sprint__close-btn');
        let count = 3;
        if (countdownContainer) {
            countdownContainer.classList.remove('hidden');
            countdownContainer.innerHTML = `<h3 class="countdown">${count}</h3>`;
            const interval = setInterval(function () {
                const countdownContainer = document.querySelector<HTMLElement>('.countdown');
                if (countdownContainer) {
                    count--;
                    countdownContainer.innerHTML = `<h3 class="countdown">${count}</h3>`;
                    if (count === 0) {
                        countdownContainer.innerHTML = `<h3 class="countdown">0</h3>`;
                        clearInterval(interval);
                        countdownContainer.classList.add('hidden');
                    }
                }
            }, 1000);
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    clearInterval(interval);
                    controller.endGame();
                });
            }
        }
    }

    renderGame() {
        const gameContainer = document.querySelector<HTMLElement>('.sprint__game');
        const loadingScreen = document.querySelector<HTMLElement>('.sprint__load-screen');
        const countdownContainer = document.querySelector<HTMLElement>('.countdown');

        if (gameContainer && loadingScreen && countdownContainer) {
            loadingScreen.classList.add('hidden');
            countdownContainer.classList.add('hidden');
            gameContainer.classList.remove('hidden');
        }
    }

    renderWord(word: string[]) {
        const wordText = document.querySelector<HTMLElement>('.sprint__word');
        const wordTranslateText = document.querySelector<HTMLElement>('.sprint__translate');
        if (wordText && wordTranslateText) {
            wordText.innerHTML = word[0];
            wordTranslateText.innerHTML = word[1];
        }
    }

    listenAnswerBtns(controller: SprintController) {
        if (this.rightBtn && this.wrongBtn) {
            this.rightBtn.addEventListener('click', () => controller.checkIfRight());
            this.wrongBtn.addEventListener('click', () => controller.checkIfWrong());
        }
    }

    listenKeyboard(controller: SprintController) {
        document.addEventListener('keydown', (event) => {
            if (event.code === 'ArrowLeft') {
                event.preventDefault();
                controller.checkIfRight();
            } else if (event.code === 'ArrowRight') {
                event.preventDefault();
                controller.checkIfWrong();
            }
        });
    }

    updateResultContainer(points: number) {
        if (this.resultCountContainer) {
            this.resultCountContainer.innerHTML = String(points);
        }
    }

    updateWordPriceContainer(price: number) {
        if (this.wordPriceContainer) {
            this.wordPriceContainer.innerHTML = String(price);
        }
    }

    updateDotsCount(answer: 'correct' | 'error') {
        if (answer === 'correct' && this.dotsContainer) {
            switch (this.dotsCount) {
                case 0:
                    this.dotsContainer.innerHTML = `<img src="./assets/sprint1.png" alt="word count">`;
                    this.dotsCount += 1;
                    break;
                case 1:
                    this.dotsContainer.innerHTML = `<img src="./assets/sprint2.png" alt="word count">`;
                    this.dotsCount += 1;
                    break;
                case 2:
                    this.dotsContainer.innerHTML = `<img src="./assets/sprint3.png" alt="word count">`;
                    this.dotsCount += 1;
                    break;
                case 3:
                    this.dotsContainer.innerHTML = `<img src="./assets/sprint0.png" alt="word count">`;
                    this.dotsCount = 0;
                    break;
            }
        } else if (answer === 'error' && this.dotsContainer) {
            this.dotsContainer.innerHTML = `<img src="./assets/sprint0.png" alt="word count">`;
            this.dotsCount = 0;
        }
    }

    startTimer(controller: SprintController) {
        console.log('игра началась');
        const closeBtn = document.querySelector<HTMLElement>('.sprint__close-btn');
        const thatController = controller;
        let count = 10;
        this.interval = setInterval(
            () => {
                count--;
                console.log(count);
                if (count === 0) {
                    console.log('время вышло');
                    clearInterval(this.interval);
                    thatController.showResult();
                }
            },
            1000,
            thatController
        );
        if (closeBtn) {
            closeBtn.addEventListener('click', () => clearInterval(this.interval));
        }
    }

    stopTimer() {
        clearInterval(this.interval);
    }

    showResult(correctAnswers: GetWords[], wrongAnswers: GetWords[]) {
        if (this.gameContainer && this.gameResultsContainer && this.correctCount && this.wrongCount) {
            this.gameContainer.classList.add('hidden');
            this.gameResultsContainer.classList.remove('hidden');
            correctAnswers.forEach((word) => {
                if (this.gameResultsCorrect) {
                    this.gameResultsCorrect.innerHTML += `
                    <div class="results__word">
                        <p><b>${word.word}</b> ${word.wordTranslate}</p>
                    </div>`;
                }
            });
            wrongAnswers.forEach((word) => {
                if (this.gameResultsWrong) {
                    this.gameResultsWrong.innerHTML += `
                    <div class="results__word">
                        <p><b>${word.word}</b> ${word.wordTranslate}</p>
                    </div>`;
                }
            });
            if (this.resultCount && this.resultCountContainer) {
                this.resultCount.innerHTML = this.resultCountContainer.innerHTML;
            }
            this.correctCount.innerHTML = String(correctAnswers.length);
            this.wrongCount.innerHTML = String(wrongAnswers.length);
        }
    }

    listenPlayAgain(controller: SprintController) {
        if (this.playAgainBtn) {
            this.playAgainBtn.addEventListener('click', () => {
                controller.restartGame();
                if (this.lvls && this.gameResultsContainer && this.gameContainer) {
                    this.lvls.classList.remove('hidden');
                    this.gameResultsContainer.classList.add('hidden');
                    this.gameContainer.classList.add('hidden');
                }
            });
        }
    }

    restartGame() {
        const countdownContainer = document.querySelector<HTMLElement>('.countdown');

        if (
            this.gameContainer &&
            this.loadingScreen &&
            this.resultCountContainer &&
            this.wordPriceContainer &&
            this.dotsContainer &&
            this.gameResultsContainer &&
            this.gameResultsCorrect &&
            this.gameResultsWrong &&
            this.correctCount &&
            this.wrongCount &&
            this.resultCount
        ) {
            this.gameContainer.classList.remove('hidden');
            this.resultCountContainer.innerHTML = '0';
            this.wordPriceContainer.innerHTML = '10';
            this.dotsContainer.innerHTML = `<img src="./assets/sprint0.png" alt="word count">`;
            this.dotsCount = 0;
            this.gameResultsCorrect.innerHTML = '';
            this.gameResultsWrong.innerHTML = '';
            this.correctCount.innerHTML = '0';
            this.wrongCount.innerHTML = '0';
            this.resultCount.innerHTML = '0';
        }

        if (this.lvls && this.loadingScreen && countdownContainer) {
            this.lvls.classList.remove('hidden');
            this.loadingScreen.classList.remove('hidden');
            countdownContainer.classList.add('hidden');
        }
    }
}
