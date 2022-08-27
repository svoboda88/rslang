import { storage } from '../storage/storage';
import { GetWords, getWordsResult } from '../textbook/request';

export class Audiocall {
    mainPage: HTMLElement | null;
    modal: HTMLElement | null;
    modalCloseBtn: HTMLElement | null;
    audiocallLvls: HTMLElement | null;
    nextBtn: HTMLElement | null;
    voiceBtn: HTMLElement | null;
    audiocallWords: HTMLElement | null;
    gameWindow: HTMLElement | null;
    gameResults: HTMLElement | null;
    wordImg: HTMLElement | null;
    correctWord: HTMLElement | null;

    constructor() {
        this.mainPage = document.getElementById('audiocall-from-games');
        this.modal = document.querySelector('.audiocall__modal');
        this.modalCloseBtn = document.querySelector('.audiocall__close-btn');
        this.audiocallLvls = document.querySelector('.audiocall__lvls');
        this.nextBtn = document.querySelector('.audiocall__next');
        this.voiceBtn = document.querySelector('.audiocall__voice');
        this.audiocallWords = document.querySelector('.audiocall__words');
        this.gameWindow = document.querySelector('.audiocall__game');
        this.gameResults = document.querySelector('.audiocall__results');
        this.wordImg = document.querySelector('.audiocall__img');
        this.correctWord = document.querySelector('.audiocall__correct-word');
    }

    init() {
        this.openModal();
        this.closeModal();
        this.levelSelection();
    }

    openModal() {
        this.mainPage?.addEventListener('click', () => {
            if (this.modal && this.audiocallLvls) {
                document.body.style.overflow = 'hidden';
                this.modal.classList.remove('hidden');
                this.audiocallLvls.classList.remove('hidden');
            }
        });
    }

    closeModal() {
        this.modalCloseBtn?.addEventListener('click', () => {
            if (this.modal) {
                document.body.style.overflow = 'visible';
                this.modal.classList.add('hidden');

                if (!this.gameWindow?.classList.contains('hidden')) {
                    this.gameWindow?.classList.add('hidden');
                }

                if (!this.gameResults?.classList.contains('hidden')) {
                    this.gameResults?.classList.add('hidden');
                }
            }
        });
    }

    levelSelection() {
        if (this.audiocallLvls) {
            this.audiocallLvls.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as HTMLDivElement;
                if (target.classList.contains('audiocall-lvls__btn')) {
                    const groupCount = Number(target.dataset.callLvl);
                    storage.groupCountAudiocall = groupCount;
                    this.startGame();
                }

                return;
            });
        }
    }

    startGame() {
        if (this.audiocallLvls && this.gameWindow) {
            this.audiocallLvls.classList.add('hidden');
            this.gameWindow.classList.remove('hidden');
            const pageCount = Math.floor(Math.random() * 20);
            getWordsResult(storage.groupCountAudiocall, pageCount).then((result) => {
                const shuffled: GetWords[] = [...result].sort(() => 0.5 - Math.random());
                const sliced: GetWords[] = shuffled.slice(0, 5);
                const index = Math.floor(Math.random() * 5);
                storage.wordVariants = [];
                storage.wordVariants = [...sliced];
                storage.wordIndex = index;
                this.voiceBtn?.addEventListener('click', (event) => {
                    event.stopImmediatePropagation();
                    this.wordVoice();
                });
                this.wordVoice();
                let resultWords = '';
                storage.wordVariants.forEach((item, i) => {
                    resultWords += `
                        <div class="audiocall__word-btn" data-call-word=${i}>${item.wordTranslate}</div>
                    `;
                });
                (this.audiocallWords as HTMLDivElement).innerHTML = resultWords;
                this.answerWord();
                this.nextBtn?.addEventListener('click', (event) => {
                    event.stopImmediatePropagation();
                    if ((this.nextBtn as HTMLDivElement).textContent === 'Не знаю') {
                        this.showCorrectWord();
                        storage.wrongAnswers.push({
                            audio: storage.wordVariants[storage.wordIndex].audio,
                            word: storage.wordVariants[storage.wordIndex].word,
                            translate: storage.wordVariants[storage.wordIndex].wordTranslate,
                        });
                        this.showResult();
                    } else {
                        this.hideCorrectWord();
                        this.startGame();
                    }
                });
            });
        }
    }

    showCorrectWord() {
        (this.nextBtn as HTMLDivElement).textContent = 'Дальше';
        (this.wordImg as HTMLDivElement).innerHTML = `
            <img src="https://react-learnwords-english.herokuapp.com/${storage.wordVariants[storage.wordIndex].image}">
        `;
        (this.correctWord as HTMLDivElement).textContent = storage.wordVariants[storage.wordIndex].word;
        (this.audiocallWords?.children[storage.wordIndex] as HTMLDivElement).style.backgroundColor = 'green';
        this.voiceBtn?.classList.add('smaller');
    }

    hideCorrectWord() {
        (this.nextBtn as HTMLDivElement).textContent = 'Не знаю';
        (this.wordImg as HTMLDivElement).innerHTML = '';
        (this.correctWord as HTMLDivElement).textContent = '';
        this.voiceBtn?.classList.remove('smaller');
    }

    wordVoice() {
        const audioSource = `
            https://react-learnwords-english.herokuapp.com/${storage.wordVariants[storage.wordIndex].audio}
        `;
        const audio = new Audio(audioSource);
        audio.play();
    }

    answerWord() {
        if (this.audiocallWords) {
            this.audiocallWords.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as HTMLDivElement;
                const choosenWord = Number(target.dataset.callWord);
                Array.from(this.audiocallWords?.children as HTMLCollection).forEach((item: Element) => {
                    (item as HTMLDivElement).style.backgroundColor = '';
                });
                (this.audiocallWords?.children[storage.wordIndex] as HTMLDivElement).style.backgroundColor = 'green';
                if (choosenWord === storage.wordIndex) {
                    storage.correctAnswers.push({
                        audio: storage.wordVariants[storage.wordIndex].audio,
                        word: storage.wordVariants[storage.wordIndex].word,
                        translate: storage.wordVariants[storage.wordIndex].wordTranslate,
                    });
                } else {
                    target.style.backgroundColor = 'red';
                    storage.wrongAnswers.push({
                        audio: storage.wordVariants[storage.wordIndex].audio,
                        word: storage.wordVariants[storage.wordIndex].word,
                        translate: storage.wordVariants[storage.wordIndex].wordTranslate,
                    });
                }
                this.showCorrectWord();
                this.showResult();
            });
        }
    }

    showResult() {
        const answersSum = storage.correctAnswers.length + storage.wrongAnswers.length;
        console.log(storage.correctAnswers, storage.wrongAnswers);
        if (answersSum === 10) {
            this.gameWindow?.classList.add('hidden');
            this.gameResults?.classList.remove('hidden');
            this.gameResults?.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as HTMLElement;
                if (target.classList.contains('results__play-btn')) {
                    this.gameResults?.classList.add('hidden');
                    this.audiocallLvls?.classList.remove('hidden');
                    storage.correctAnswers = [];
                    storage.wrongAnswers = [];
                    this.hideCorrectWord();
                }

                return;
            });
        }
    }
}
