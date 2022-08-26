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
                if (!this.gameResults?.classList.contains('hidden')) {
                    this.gameResults?.classList.add('hidden');
                }
            }
        });
    }

    levelSelection() {
        if (this.audiocallLvls) {
            this.audiocallLvls.addEventListener('click', (event) => {
                const target = event.target as HTMLDivElement;
                const groupCount = Number(target.dataset.callLvl);
                storage.groupCountAudiocall = groupCount;
                this.startGame();
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
                    this.wordVoice(storage.wordVariants, storage.wordIndex);
                });
                this.wordVoice(sliced, index);
                let resultWords = '';
                sliced.forEach((item, i) => {
                    resultWords += `
                        <div class="audiocall__word-btn" data-call-word=${i}>${item.word}</div>
                    `;
                });
                (this.audiocallWords as HTMLDivElement).innerHTML = resultWords;
                console.log(this.audiocallWords);
                this.answerWord(sliced, index);
                this.nextBtn?.addEventListener('click', (event) => {
                    event.stopImmediatePropagation();
                    this.startGame();
                });
                this.showResult();
            });
        }
    }

    wordVoice(arr: GetWords[], i: number) {
        const audioSource = `https://react-learnwords-english.herokuapp.com/${arr[i].audio}`;
        const audio = new Audio(audioSource);
        audio.play();
    }

    answerWord(arr: GetWords[], i: number) {
        if (this.audiocallWords) {
            this.audiocallWords.addEventListener('click', (event) => {
                const target = event.target as HTMLDivElement;
                const choosenWord = Number(target.dataset.callWord);
                if (choosenWord === i) {
                    target.style.backgroundColor = 'green';
                    arr.forEach((item) => {
                        if (item.word === target.textContent) {
                            storage.correctAnswers.push({
                                audio: item.audio,
                                word: item.word,
                                translate: item.wordTranslate,
                            });
                        }
                    });
                    (this.nextBtn as HTMLDivElement).textContent = 'Дальше';
                } else {
                    target.style.backgroundColor = 'red';
                    arr.forEach((item) => {
                        if (item.word === target.textContent) {
                            storage.wrongAnswers.push({
                                audio: item.audio,
                                word: item.word,
                                translate: item.wordTranslate,
                            });
                        }
                    });
                    (this.nextBtn as HTMLDivElement).textContent = 'Дальше';
                }
            });
        }
    }

    showResult() {
        const answersSum = storage.correctAnswers.length + storage.wrongAnswers.length;
        console.log(answersSum);
        if (answersSum === 10) {
            this.gameWindow?.classList.add('hidden');
            this.gameResults?.classList.remove('hidden');
        }
    }
}
