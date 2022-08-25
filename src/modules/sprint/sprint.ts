import { getWordsResult, GetWords } from '../textbook/request';

export class Sprint {
    modal: HTMLElement | null;
    loadingScreen: HTMLElement | null;
    gameContainer: HTMLElement | null;
    lvls: HTMLElement | null;

    wordsToPlay: GetWords[] | [];
    isWordCorrect: boolean;
    wordIndex: number;
    wordPrice: number;
    correctAnswerCount: number;
    resultCountContainer: HTMLElement | null;
    resultCount: number;
    wordPriceContainer: HTMLElement | null;

    constructor() {
        this.modal = document.querySelector<HTMLElement>('.game__modal');
        this.loadingScreen = document.querySelector<HTMLElement>('.game__load-screen');
        this.gameContainer = document.querySelector<HTMLElement>('.game__sprint');
        this.lvls = document.querySelector<HTMLElement>('.sprint__lvl');

        this.wordsToPlay = [];
        this.isWordCorrect = false;
        this.wordIndex = 0;
        this.wordPrice = 10;
        this.correctAnswerCount = 0;
        this.resultCount = 0;
        this.resultCountContainer = document.getElementById('sprint-result');
        this.wordPriceContainer = document.getElementById('word-price');
    }

    init() {
        this.listenCloseGame();
        this.listenStartFromMain();
        this.listenAnswerBtns();
    }

    listenStartFromMain() {
        const sprintCardGames = document.getElementById('sprint-from-games');

        if (sprintCardGames) {
            sprintCardGames.addEventListener('click', () => {
                if (this.modal && this.loadingScreen) {
                    document.body.style.overflow = 'hidden';
                    this.modal.classList.remove('hidden');
                    this.loadingScreen.classList.remove('hidden');
                    this.renderLvl();
                }
            });
        }
    }

    listenCloseGame() {
        const closeBtn = document.querySelector<HTMLElement>('.games__close-btn');
        const countdownContainer = document.querySelector<HTMLElement>('.countdown');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (this.modal && this.gameContainer && this.loadingScreen && countdownContainer) {
                    document.body.style.overflow = 'visible';
                    this.modal.classList.add('hidden');
                    this.gameContainer.classList.add('hidden');
                    this.loadingScreen.classList.remove('hidden');
                    countdownContainer.classList.add('hidden');
                    this.wordIndex = 0;
                    this.wordPrice = 10;
                    this.resultCount = 0;
                }
            });
        }
    }

    renderLvl() {
        if (this.lvls) {
            this.lvls.classList.remove('hidden');
            this.lvls.innerHTML = `
            <h1>Спринт</h1>
            <h2>Выберите уровень сложности:</h2>
            <div class="lvls__wrapper">
              <button class="lvls__btn" type="button" data-lvl="1">1</button>
              <button class="lvls__btn" type="button" data-lvl="2">2</button>
              <button class="lvls__btn" type="button" data-lvl="3">3</button>
              <button class="lvls__btn" type="button" data-lvl="4">4</button>
              <button class="lvls__btn" type="button" data-lvl="5">5</button>
              <button class="lvls__btn" type="button" data-lvl="6">6</button>
            </div>
            `;
        }
        const lvlBtnsArray = document.querySelectorAll('.lvls__btn');
        if (lvlBtnsArray) {
            lvlBtnsArray.forEach((btn) => {
                btn.addEventListener('click', async () => {
                    if (btn instanceof HTMLElement && this.lvls) {
                        await this.getWordsForLvl(Number(btn.dataset.lvl));
                        this.lvls.classList.add('hidden');
                        this.startGame();
                    }
                });
            });
        }
    }

    async getWordsForLvl(lvl: number) {
        const randomizedPageNumber1 = Math.floor(Math.random() * 30);
        const randomizedPageNumber2 = Math.floor(Math.random() * 30);

        const wordsArray1 = await getWordsResult(lvl, randomizedPageNumber1);
        const wordsArray2 = await getWordsResult(lvl, randomizedPageNumber2);

        this.wordsToPlay = [...wordsArray1, ...wordsArray2];
        console.log(this.wordsToPlay);
    }

    startGame() {
        this.showCountdown();
        setTimeout(this.renderGame, 3000);
        this.showWord(this.wordIndex);
    }

    showCountdown() {
        const countdownContainer = document.querySelector<HTMLElement>('.countdown');
        let count = 3;
        if (countdownContainer) {
            countdownContainer.classList.remove('hidden');
            countdownContainer.innerHTML = `<h3 class="countdown">${count}</h3>`;
            const interval = setInterval(function () {
                const countdownContainer = document.querySelector<HTMLElement>('.countdown');
                if (countdownContainer) {
                    console.log(count);

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

    renderGame() {
        const gameContainer = document.querySelector<HTMLElement>('.game__sprint');
        const loadingScreen = document.querySelector<HTMLElement>('.game__load-screen');
        const countdownContainer = document.querySelector<HTMLElement>('.countdown');

        if (gameContainer && loadingScreen && countdownContainer) {
            loadingScreen.classList.add('hidden');
            countdownContainer.classList.add('hidden');
            gameContainer.classList.remove('hidden');
        }
    }

    showWord(wordIndex: number) {
        const word = document.querySelector<HTMLElement>('.sprint__word');
        const wordTranslate = document.querySelector<HTMLElement>('.sprint__translate');

        this.isWordCorrect = Math.random() < 0.7;

        if (word && wordTranslate) {
            word.innerHTML = this.wordsToPlay[wordIndex].word;
            if (this.isWordCorrect) {
                wordTranslate.innerHTML = this.wordsToPlay[wordIndex].wordTranslate;
            } else {
                const randomIndex = Math.floor(Math.random() * 39);
                wordTranslate.innerHTML = this.wordsToPlay[randomIndex].wordTranslate;
            }
        }
    }

    listenAnswerBtns() {
        const rightBtn = document.querySelector<HTMLElement>('.sprint__right');
        const wrongBtn = document.querySelector<HTMLElement>('.sprint__wrong');

        if (rightBtn && wrongBtn) {
            rightBtn.addEventListener('click', () => this.checkIfRight());
            wrongBtn.addEventListener('click', () => this.checkIfWrong());
        }
    }

    checkIfRight() {
        if (this.isWordCorrect && this.resultCountContainer) {
            this.resultCount += this.wordPrice;
            this.resultCountContainer.innerHTML = String(this.resultCount);
            this.correctAnswerCount += 1;
            this.updateWordPrice();
        } else {
            console.log('wrong!');
        }
        this.wordIndex++;
        this.showWord(this.wordIndex);
    }

    checkIfWrong() {
        if (!this.isWordCorrect && this.resultCountContainer) {
            this.resultCount += this.wordPrice;
            this.resultCountContainer.innerHTML = String(this.resultCount);
            this.correctAnswerCount += 1;
            this.updateWordPrice();
        } else {
            console.log('wrong!');
        }
        this.wordIndex++;
        this.showWord(this.wordIndex);
    }

    updateWordPrice() {
        if (this.wordPriceContainer) {
            if (this.correctAnswerCount === 4) {
                this.wordPrice = 20;
            }
            if (this.correctAnswerCount === 8) {
                this.wordPrice = 40;
            }
            if (this.correctAnswerCount === 12) {
                this.wordPrice = 60;
            }
            this.wordPriceContainer.innerHTML = String(this.wordPrice);
        }
    }
}
