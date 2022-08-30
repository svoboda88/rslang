import { storage } from '../storage/storage';
import { GetWords, getWordsResult } from '../textbook/request';
// import { UI } from '../ui/ui';
// import { Textbook } from '../textbook/textbook';

export class Audiocall {
    // ui: UI;
    // textbook: Textbook;
    mainPage: HTMLElement | null;
    textbookPage: HTMLElement | null;
    modal: HTMLElement | null;
    modalCloseBtn: HTMLElement | null;
    audiocallLvls: HTMLElement | null;
    audiocallLvlsWrapper: HTMLElement | null;
    description: HTMLElement | null;
    startBtn: HTMLElement | null;
    nextBtn: HTMLElement | null;
    voiceBtn: HTMLElement | null;
    audiocallWords: HTMLElement | null;
    gameWindow: HTMLElement | null;
    gameResults: HTMLElement | null;
    wordImg: HTMLElement | null;
    correctWord: HTMLElement | null;
    resultsTitle: HTMLElement | null;
    resultsWrong: HTMLElement | null;
    resultsCorrect: HTMLElement | null;
    wrongContainer: HTMLElement | null;
    correctContainer: HTMLElement | null;

    constructor() {
        // this.ui = new UI();
        // this.textbook = new Textbook(this.ui);
        this.mainPage = document.getElementById('audiocall-from-games');
        this.textbookPage = document.getElementById('audiocall-from-textbook');
        this.modal = document.querySelector('.audiocall__modal');
        this.modalCloseBtn = document.querySelector('.audiocall__close-btn');
        this.audiocallLvls = document.querySelector('.audiocall__lvls');
        this.audiocallLvlsWrapper = document.querySelector('.audiocall__lvls--wrapper');
        this.description = document.querySelector('.audiocall__description');
        this.startBtn = document.querySelector('.audiocall__start');
        this.nextBtn = document.querySelector('.audiocall__next');
        this.voiceBtn = document.querySelector('.audiocall__voice');
        this.audiocallWords = document.querySelector('.audiocall__words');
        this.gameWindow = document.querySelector('.audiocall__game');
        this.gameResults = document.querySelector('.audiocall__results');
        this.wordImg = document.querySelector('.audiocall__img');
        this.correctWord = document.querySelector('.audiocall__correct-word');
        this.resultsTitle = document.querySelector('.audiocall__results-title');
        this.resultsWrong = document.querySelector('.audiocall__results-wrong');
        this.resultsCorrect = document.querySelector('.audiocall__results-correct');
        this.wrongContainer = document.querySelector('.audiocall__wrong');
        this.correctContainer = document.querySelector('.audiocall__correct');
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
                this.audiocallLvlsWrapper?.classList.remove('hidden');
                (this.description as HTMLDivElement).innerHTML = 'Выберите уровень сложности:';
                (this.startBtn as HTMLButtonElement).style.pointerEvents = 'none';
            }
        });

        this.textbookPage?.addEventListener('click', () => {
            if (this.modal && this.audiocallLvls) {
                document.body.style.overflow = 'hidden';
                this.modal.classList.remove('hidden');
                this.audiocallLvls.classList.remove('hidden');
                this.audiocallLvlsWrapper?.classList.add('hidden');
                (this.description as HTMLDivElement).innerHTML = 'Слов для игры берется с текущей страницы учебника';
                (this.startBtn as HTMLButtonElement).style.pointerEvents = 'auto';
                storage.isFromTextbook = true;
            }
        });
    }

    closeModal() {
        this.modalCloseBtn?.addEventListener('click', () => {
            if (this.modal) {
                document.body.style.overflow = 'visible';
                this.modal.classList.add('hidden');
                Array.from(this.audiocallLvlsWrapper?.children as HTMLCollection).forEach((item) => {
                    item.classList.remove('audiocall__lvls--btn-active');
                });

                if (!this.gameWindow?.classList.contains('hidden')) {
                    this.gameWindow?.classList.add('hidden');
                }

                if (!this.gameResults?.classList.contains('hidden')) {
                    this.gameResults?.classList.add('hidden');
                }

                storage.correctAnswers = [];
                storage.wrongAnswers = [];
                storage.isFromTextbook = false;
            }
        });
    }

    levelSelection() {
        if (this.audiocallLvls) {
            this.audiocallLvls.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as HTMLDivElement;
                if (target.classList.contains('audiocall__lvls--btn')) {
                    const groupCount = Number(target.dataset.callLvl);
                    Array.from(this.audiocallLvlsWrapper?.children as HTMLCollection).forEach((item) => {
                        item.classList.remove('audiocall__lvls--btn-active');
                    });
                    target.classList.add('audiocall__lvls--btn-active');
                    (this.startBtn as HTMLButtonElement).style.pointerEvents = 'auto';
                    storage.argumentsForAudiocall[0] = groupCount;
                } else if (target.classList.contains('audiocall__start')) {
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
            if (storage.isFromTextbook && localStorage.getItem('Logged')) {
                storage.argumentsForAudiocall = [storage.groupCount, storage.pageCount];
                getWordsResult(storage.argumentsForAudiocall[0], storage.argumentsForAudiocall[1]).then((result) => {
                    // let temp: GetWords[] = [];
                    // setTimeout(() => {
                    //     this.textbook.sortByEasy().then((result) => {
                    //         temp = result;
                    //     });
                    // }, 500);
                    // console.log(temp);
                    this.renderWords(result);
                });
            } else if (storage.isFromTextbook) {
                storage.argumentsForAudiocall = [storage.groupCount, storage.pageCount];
                getWordsResult(storage.argumentsForAudiocall[0], storage.argumentsForAudiocall[1]).then((result) => {
                    this.renderWords(result);
                });
            } else {
                storage.argumentsForAudiocall[1] = Math.floor(Math.random() * 20);
                getWordsResult(storage.argumentsForAudiocall[0], storage.argumentsForAudiocall[1]).then((result) => {
                    this.renderWords(result);
                });
            }
        }
    }

    renderWords(result: GetWords[]) {
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
        this.mouseControl();
        this.keyboardControl();
        this.nextBtn?.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            this.nextWords();
        });
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

    mouseControl() {
        if (this.audiocallWords) {
            this.audiocallWords.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as HTMLDivElement;
                this.checkWord(target);
            });
        }
    }

    keyboardControl() {
        const firstWord = this.audiocallWords?.children[0] as HTMLDivElement;
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Digit1') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.checkWord(firstWord);
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Numpad1') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.checkWord(firstWord);
            }
        });

        const secondWord = this.audiocallWords?.children[1] as HTMLDivElement;
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Digit2') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.checkWord(secondWord);
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Numpad2') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.checkWord(secondWord);
            }
        });

        const thirdWord = this.audiocallWords?.children[2] as HTMLDivElement;
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Digit3') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.checkWord(thirdWord);
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Numpad3') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.checkWord(thirdWord);
            }
        });

        const fourthWord = this.audiocallWords?.children[3] as HTMLDivElement;
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Digit4') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.checkWord(fourthWord);
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Numpad4') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.checkWord(fourthWord);
            }
        });

        const fifthWord = this.audiocallWords?.children[4] as HTMLDivElement;
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Digit5') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.checkWord(fifthWord);
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Numpad5') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.checkWord(fifthWord);
            }
        });

        document.addEventListener('keyup', (event) => {
            if (event.code === 'Space') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.nextWords();
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.nextWords();
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'NumpadEnter') {
                event.preventDefault();
                event.stopImmediatePropagation();
                this.nextWords();
            }
        });
    }

    checkWord(target: HTMLDivElement) {
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
            (this.audiocallWords?.children[choosenWord] as HTMLDivElement).style.backgroundColor = 'red';
            storage.wrongAnswers.push({
                audio: storage.wordVariants[storage.wordIndex].audio,
                word: storage.wordVariants[storage.wordIndex].word,
                translate: storage.wordVariants[storage.wordIndex].wordTranslate,
            });
        }

        Array.from(this.audiocallWords?.children as HTMLCollection).forEach((item: Element) => {
            (item as HTMLDivElement).style.pointerEvents = 'none';
        });
        this.showCorrectWord();
    }

    nextWords() {
        if ((this.nextBtn as HTMLDivElement).textContent === 'Не знаю') {
            this.showCorrectWord();
            storage.wrongAnswers.push({
                audio: storage.wordVariants[storage.wordIndex].audio,
                word: storage.wordVariants[storage.wordIndex].word,
                translate: storage.wordVariants[storage.wordIndex].wordTranslate,
            });
        } else {
            this.hideCorrectWord();
            if (storage.correctAnswers.length + storage.wrongAnswers.length <= 9) {
                this.startGame();
            }
            this.showResult();
        }
    }

    showResult() {
        const answersSum = storage.correctAnswers.length + storage.wrongAnswers.length;
        if (answersSum === 10) {
            this.gameWindow?.classList.add('hidden');
            this.gameResults?.classList.remove('hidden');
            this.resultTable();
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

    resultTable() {
        const correctLength = storage.correctAnswers.length as number;
        const wrongLength = storage.wrongAnswers.length as number;
        let wrongList = '';
        storage.wrongAnswers.forEach((item, i) => {
            wrongList += `
                <div class="audiocall__list">
                    <span class="material-symbols-outlined smallest" data-audiocall-wrong=${i}>
                        volume_up
                    </span>
                    <span class="audiocall__word audiocall__word-primary">
                        ${item.word}
                    </span> -
                    <span class="audiocall__word">
                        ${item.translate}
                    </span>
                </div>
            `;
        });
        let correctlist = '';
        storage.correctAnswers.forEach((item, i) => {
            correctlist += `
                <div class="audiocall__list">
                    <span class="material-symbols-outlined smallest" data-audiocall-correct=${i}>
                        volume_up
                    </span>
                    <span class="audiocall__word audiocall__word-primary">
                        ${item.word}
                    </span> -
                    <span class="audiocall__word">
                        ${item.translate}
                    </span>
                </div>
            `;
        });

        (this.resultsTitle as HTMLHeadElement).innerHTML = `
            Твой результат: <span class="results__result">${correctLength * 10}%</span>
        `;

        (this.resultsWrong as HTMLHeadElement).innerHTML = `
            Ошибки в словах <span class="wrong__count">${wrongLength}</span>
        `;
        (this.wrongContainer as HTMLHeadElement).innerHTML = wrongList;
        this.gameResults?.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const current = target.dataset;
            storage.wrongAnswers.forEach((item, i) => {
                if (Number(current.audiocallWrong) === i) {
                    const audioSrc = `
                        https://react-learnwords-english.herokuapp.com/${item.audio}
                    `;
                    const wordAudio = new Audio(audioSrc);
                    wordAudio.play();
                }
            });
        });

        (this.resultsCorrect as HTMLHeadElement).innerHTML = `
            Изученные слова <span class="correct__count">${correctLength}</span>
        `;
        (this.correctContainer as HTMLHeadElement).innerHTML = correctlist;
        this.gameResults?.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            const current = target.dataset;
            storage.correctAnswers.forEach((item, i) => {
                if (Number(current.audiocallCorrect) === i) {
                    const audioSrc = `
                        https://react-learnwords-english.herokuapp.com/${item.audio}
                    `;
                    const wordAudio = new Audio(audioSrc);
                    wordAudio.play();
                }
            });
        });
    }
}
