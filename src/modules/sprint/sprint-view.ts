import { SprintController } from './sprint-controller';

export class SprintView {
    modal: HTMLElement | null;
    loadingScreen: HTMLElement | null;
    gameContainer: HTMLElement | null;
    lvls: HTMLElement | null;
    resultCountContainer: HTMLElement | null;
    wordPriceContainer: HTMLElement | null;
    rightBtn: HTMLElement | null;
    wrongBtn: HTMLElement | null;

    constructor() {
        this.modal = document.querySelector<HTMLElement>('.sprint__modal');
        this.loadingScreen = document.querySelector<HTMLElement>('.sprint__load-screen');
        this.gameContainer = document.querySelector<HTMLElement>('.sprint__game');
        this.lvls = document.querySelector<HTMLElement>('.sprint__lvl');
        this.resultCountContainer = document.getElementById('sprint-result');
        this.wordPriceContainer = document.getElementById('word-price');
        this.rightBtn = document.querySelector<HTMLElement>('.sprint__right');
        this.wrongBtn = document.querySelector<HTMLElement>('.sprint__wrong');
    }

    listenStartFromMain() {
        const sprintCardGames = document.getElementById('sprint-from-games');

        if (sprintCardGames) {
            sprintCardGames.addEventListener('click', () => {
                if (this.modal && this.loadingScreen && this.lvls) {
                    document.body.style.overflow = 'hidden';
                    this.modal.classList.remove('hidden');
                    this.loadingScreen.classList.remove('hidden');
                    this.lvls.classList.remove('hidden');
                }
            });
        }
    }

    listenCloseGame(controller: SprintController) {
        const closeBtn = document.querySelector<HTMLElement>('.sprint__close-btn');
        const countdownContainer = document.querySelector<HTMLElement>('.countdown');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (
                    this.modal &&
                    this.gameContainer &&
                    this.loadingScreen &&
                    countdownContainer &&
                    this.resultCountContainer &&
                    this.wordPriceContainer
                ) {
                    document.body.style.overflow = 'visible';
                    this.modal.classList.add('hidden');
                    this.gameContainer.classList.add('hidden');
                    this.loadingScreen.classList.add('hidden');
                    countdownContainer.classList.add('hidden');
                    this.resultCountContainer.innerHTML = '0';
                    this.wordPriceContainer.innerHTML = '10';
                    controller.endGame();
                }
            });
        }
    }

    listenLvlBtns(controller: SprintController) {
        const lvlBtnsArray = document.querySelectorAll('.lvls__btn');
        if (lvlBtnsArray) {
            lvlBtnsArray.forEach((btn) => {
                btn.addEventListener('click', async () => {
                    if (btn instanceof HTMLElement && this.lvls) {
                        this.lvls.classList.add('hidden');
                        controller.startGame(Number(btn.dataset.lvl));
                    }
                });
            });
        }
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
}
