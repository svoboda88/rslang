import { GetWords } from '../types/types';
import { SprintController } from './sprint-controller';

export class SprintView {
    modal: HTMLElement | null;
    loadingScreen: HTMLElement | null;
    gameContainer: HTMLElement | null;
    lvls: HTMLElement | null;
    lvlsDescription: HTMLElement | null;
    timerContainer: HTMLElement | null;
    ringFilled: SVGCircleElement | null;
    resultsText: HTMLElement | null;
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
    playAgainBtn: HTMLElement | null;
    tryAgainBtn: HTMLElement | null;
    interval: number;

    constructor() {
        this.modal = document.querySelector<HTMLElement>('.sprint__modal');
        this.loadingScreen = document.querySelector<HTMLElement>('.sprint__load-screen');
        this.gameContainer = document.querySelector<HTMLElement>('.sprint__game');
        this.lvls = document.querySelector<HTMLElement>('.sprint__lvl');
        this.lvlsDescription = document.querySelector<HTMLElement>('.lvls__description');
        this.timerContainer = document.querySelector<HTMLElement>('.sprint__timer');
        this.ringFilled = document.querySelector('.ring__circle--filled');
        this.resultsText = document.querySelector<HTMLElement>('.results__text');

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
        this.playAgainBtn = document.querySelector<HTMLElement>('.results__play-btn');
        this.tryAgainBtn = document.querySelector<HTMLElement>('.results__try-again-btn');
        this.interval = 0;
    }

    listenStartFromMain() {
        const sprintCardGames = document.getElementById('sprint-from-games');

        if (sprintCardGames) {
            sprintCardGames.addEventListener('click', () => {
                this.start();
                if (this.lvls && this.playAgainBtn && this.tryAgainBtn) {
                    this.lvls.classList.remove('hidden');
                    this.playAgainBtn.classList.remove('hidden');
                    this.tryAgainBtn.classList.add('hidden');
                }
                window.localStorage.setItem('game', 'sprintFromGames');
            });
        }
        window.addEventListener('load', () => {
            if (window.localStorage.getItem('game') === 'sprintFromGames') {
                this.start();
                if (this.lvls && this.playAgainBtn && this.tryAgainBtn) {
                    this.lvls.classList.remove('hidden');
                    this.playAgainBtn.classList.remove('hidden');
                    this.tryAgainBtn.classList.add('hidden');
                }
            }
        });
    }

    listenStartFromTextbook(controller: SprintController) {
        const sprintCardTextbook = document.getElementById('sprint-from-textbook');

        if (sprintCardTextbook) {
            sprintCardTextbook.addEventListener('click', () => {
                this.start();
                if (this.lvls && this.playAgainBtn && this.tryAgainBtn) {
                    this.lvls.classList.add('hidden');
                    this.playAgainBtn.classList.add('hidden');
                    this.tryAgainBtn.classList.remove('hidden');
                }
                controller.startGameTextbook();
                window.localStorage.setItem('game', 'sprintFromTextBook');
            });
        }
        window.addEventListener('load', () => {
            if (window.localStorage.getItem('game') === 'sprintFromTextBook') {
                this.start();
                if (this.lvls && this.playAgainBtn && this.tryAgainBtn) {
                    this.lvls.classList.add('hidden');
                    this.playAgainBtn.classList.add('hidden');
                    this.tryAgainBtn.classList.remove('hidden');
                }
                controller.startGameTextbook();
            }
        });
    }

    start() {
        if (
            this.modal &&
            this.gameResultsContainer &&
            this.gameContainer &&
            this.loadingScreen &&
            this.timerContainer
        ) {
            document.body.style.overflow = 'hidden';
            this.modal.classList.remove('hidden');
            this.gameResultsContainer.classList.add('hidden');
            this.gameContainer.classList.add('hidden');
            this.loadingScreen.classList.remove('hidden');
            this.timerContainer.classList.add('hidden');
            this.updateTimer(0);
        }
    }

    listenCloseGame(controller: SprintController) {
        const closeBtn = document.querySelector<HTMLElement>('.sprint__close-btn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                window.localStorage.removeItem('game');
                controller.endGame();
            });
        }
    }

    closeGame() {
        if (this.modal) {
            document.body.style.overflow = 'visible';
            this.modal.classList.add('hidden');
            this.restartGame();
        }
        document.onkeyup = null;
    }

    listenLvlBtns(controller: SprintController) {
        const lvlBtnsArray = document.querySelectorAll('.lvls__btn');
        if (lvlBtnsArray) {
            lvlBtnsArray.forEach((btn) => {
                btn.addEventListener('click', () => {
                    lvlBtnsArray.forEach((btn) => btn.classList.remove('lvls__btn--active'));
                    btn.classList.add('lvls__btn--active');
                    const sprintStart = document.querySelector<HTMLElement>('.sprint__start');
                    if (sprintStart) {
                        sprintStart.onclick = () => {
                            if (btn instanceof HTMLElement && this.lvls && this.resultCountContainer) {
                                btn.classList.remove('lvls__btn--active');
                                this.lvls.classList.add('hidden');
                                this.resultCountContainer.classList.remove('hidden');
                                controller.startGame(Number(btn.dataset.lvl));
                            }
                        };
                    }
                });
            });
        }
    }

    showCountdown() {
        const closeBtn = document.querySelector<HTMLElement>('.sprint__close-btn');
        if (closeBtn) {
            closeBtn.classList.add('hidden');
        }

        const countdownContainer = document.querySelector<HTMLElement>('.countdown');
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
        }
    }

    renderGame(view: SprintView) {
        const countdownContainer = document.querySelector<HTMLElement>('.countdown');
        const closeBtn = document.querySelector<HTMLElement>('.sprint__close-btn');
        if (closeBtn) {
            closeBtn.classList.remove('hidden');
        }

        if (view.timerContainer) {
            view.timerContainer.classList.remove('hidden');
        }
        if (view.gameContainer && view.loadingScreen && countdownContainer) {
            view.loadingScreen.classList.add('hidden');
            countdownContainer.classList.add('hidden');
            view.gameContainer.classList.remove('hidden');
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
        document.onkeyup = (event) => {
            if (event.code === 'ArrowLeft') {
                event.preventDefault();
                controller.checkIfRight();
            } else if (event.code === 'ArrowRight') {
                event.preventDefault();
                controller.checkIfWrong();
            }
        };
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

    startTimer(controller: SprintController, view: SprintView) {
        const closeBtn = document.querySelector<HTMLElement>('.sprint__close-btn');
        const thatController = controller;
        const thatView = view;
        thatView.updateTimer(0);
        let count = 60;
        let percent = 0;
        this.interval = setInterval(
            () => {
                count--;
                percent += 100 / 60;
                thatView.updateTimer(percent);
                if (count === 0) {
                    percent = 100;
                    thatView.updateTimer(percent);
                    clearInterval(this.interval);
                    thatController.showResult();
                }
            },
            1000,
            thatController,
            thatView
        );
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearInterval(this.interval);
                thatView.updateTimer(0);
                if (thatView.timerContainer) {
                    thatView.timerContainer?.classList.add('hidden');
                }
            });
        }
    }

    updateTimer(percent: number) {
        if (this.ringFilled) {
            const radius = this.ringFilled.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;

            this.ringFilled.style.strokeDasharray = `${circumference}  ${circumference}`;
            this.ringFilled.style.strokeDashoffset = String(circumference);

            const offset = circumference - (percent / 100) * circumference;
            this.ringFilled.style.strokeDashoffset = String(offset);
        }
    }

    stopTimer() {
        clearInterval(this.interval);
    }

    showResult(correctAnswers: GetWords[], wrongAnswers: GetWords[]) {
        const correctAnswersSet = [...new Set(correctAnswers)];
        const wrongAnswersSet = [...new Set(wrongAnswers)];

        wrongAnswersSet.forEach((wrongAnswer) => {
            correctAnswersSet.forEach((correctAnswer, index) => {
                if (correctAnswer.word === wrongAnswer.word) {
                    correctAnswersSet.splice(index, 1);
                }
            });
        });

        const percent = correctAnswersSet.length / (correctAnswersSet.length + wrongAnswersSet.length);
        this.renderResultBar(Math.round(percent * 100));

        if (
            this.gameContainer &&
            this.gameResultsContainer &&
            this.correctCount &&
            this.wrongCount &&
            this.timerContainer &&
            this.resultsText
        ) {
            this.timerContainer.classList.add('hidden');
            this.gameContainer.classList.add('hidden');
            this.gameResultsContainer.classList.remove('hidden');
            correctAnswersSet.forEach((word) => {
                if (this.gameResultsCorrect) {
                    this.gameResultsCorrect.innerHTML += `
                    <div class="results__word">
                        <span class="material-symbols-outlined sprint__word-audio smallest" data-sprintaudio=${word.audio}>
                            volume_up
                        </span>
                        <span>
                            <b>${word.word}</b>
                        </span> -
                        <span>
                            ${word.wordTranslate}
                        </span>
                    </div>`;
                }
            });
            wrongAnswersSet.forEach((word) => {
                if (this.gameResultsWrong) {
                    this.gameResultsWrong.innerHTML += `
                    <div class="results__word">
                        <span class="material-symbols-outlined sprint__word-audio smallest" data-sprintaudio=${word.audio}>
                            volume_up
                        </span>
                        <span>
                            <b>${word.word}</b>
                        </span> -
                        <span>
                            ${word.wordTranslate}
                        </span>
                    </div>`;
                }
            });

            this.correctCount.innerHTML = String(correctAnswersSet.length);
            this.wrongCount.innerHTML = String(wrongAnswersSet.length);

            if (percent < 0.3) {
                this.resultsText.innerHTML = 'Ты можешь лучше! Мы верим в тебя!';
            } else if (percent < 0.6) {
                this.resultsText.innerHTML = 'Отличный результат! Но ты можешь лучше ;)';
            } else {
                this.resultsText.innerHTML = 'Отличный результат!';
            }
        }

        const audioBts = document.querySelectorAll<HTMLElement>('.sprint__word-audio');
        if (audioBts) {
            audioBts.forEach((btn) => {
                btn.addEventListener('click', (event) => {
                    const target = event.target;
                    if (target instanceof HTMLElement) {
                        const currentWord = String(target.dataset.sprintaudio);
                        console.log(currentWord);
                        const wordAudio = new Audio(`https://react-learnwords-english.herokuapp.com/${currentWord}`);
                        wordAudio.play();
                    }
                });
            });
        }

        document.onkeyup = null;
    }

    renderResultBar(percent: number) {
        const barFilled = document.querySelector<SVGCircleElement>('.bar__circle--filled');
        const resultPercent = document.querySelector<HTMLElement>('.result__percent');

        if (barFilled && resultPercent) {
            const radius = barFilled.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;

            barFilled.style.strokeDasharray = `${circumference}  ${circumference}`;
            barFilled.style.strokeDashoffset = String(circumference);

            const offset = circumference - (percent / 100) * circumference;
            setTimeout(function () {
                barFilled.style.strokeDashoffset = String(offset);
            }, 500);

            resultPercent.innerHTML = `${percent}%`;
        }
    }

    listenPlayAgain(controller: SprintController) {
        if (this.playAgainBtn) {
            this.playAgainBtn.addEventListener('click', () => {
                controller.restartGame();
                if (this.gameResultsContainer && this.gameContainer && this.lvls) {
                    this.lvls.classList.remove('hidden');
                    this.gameResultsContainer.classList.add('hidden');
                    this.gameContainer.classList.add('hidden');
                }
            });
        }
    }

    listenTryAgain(controller: SprintController) {
        if (this.tryAgainBtn) {
            this.tryAgainBtn.addEventListener('click', () => {
                controller.restartGame();
                controller.startGameTextbook();
                if (this.lvls && this.gameResultsContainer && this.gameContainer) {
                    this.lvls.classList.add('hidden');
                    this.gameResultsContainer.classList.add('hidden');
                    this.gameContainer.classList.add('hidden');
                }
            });
        }
    }

    restartGame() {
        const countdownContainer = document.querySelector<HTMLElement>('.countdown');

        if (
            this.resultCountContainer &&
            this.wordPriceContainer &&
            this.dotsContainer &&
            this.gameResultsContainer &&
            this.gameResultsCorrect &&
            this.gameResultsWrong &&
            this.correctCount &&
            this.wrongCount
        ) {
            this.resultCountContainer.innerHTML = '0';
            this.wordPriceContainer.innerHTML = '10';
            this.dotsContainer.innerHTML = `<img src="./assets/sprint0.png" alt="word count">`;
            this.dotsCount = 0;
            this.gameResultsCorrect.innerHTML = '';
            this.gameResultsWrong.innerHTML = '';
            this.correctCount.innerHTML = '0';
            this.wrongCount.innerHTML = '0';
        }

        if (this.gameContainer && this.lvls && this.loadingScreen && countdownContainer && this.timerContainer) {
            this.gameContainer.classList.remove('hidden');
            this.lvls.classList.remove('hidden');
            this.loadingScreen.classList.remove('hidden');
            countdownContainer.classList.add('hidden');
            this.timerContainer.classList.add('hidden');
        }
    }

    playAudio(sound: 'correct' | 'wrong') {
        const url = `../../assets/${sound}.mp3`;
        const audio = new Audio(url);

        audio.play();
    }
}
