import { GetWords, Answers, GetUserCards } from '../types/types';
import { getWordsResult } from '../textbook/request';
import { getCards } from '../wordList/userCards';
import { updateUserWord, sendUserWord } from '../wordList/UserWordsRequest';
import { checkUserWords } from '../wordList/checkUserWords';

export class Audiocall {
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
    audiocallWordsWrapper: HTMLElement | null;
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
    resultsPlayBtn: Element | null;
    argumentsForAudiocall: number[];
    allWords: GetWords[];
    unUsedWords: GetWords[];
    wordVariants: GetWords[];
    wordIndex: number;
    correctAnswers: Answers[];
    wrongAnswers: Answers[];
    isFromTextbook: boolean;
    isLocked: boolean;

    constructor() {
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
        this.audiocallWordsWrapper = document.querySelector('.audiocall__words--wrapper');
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
        this.resultsPlayBtn = document.querySelectorAll('.results__play-btn')[1];
        this.argumentsForAudiocall = [];
        this.allWords = [];
        this.unUsedWords = [];
        this.wordVariants = [];
        this.wordIndex = 0;
        this.correctAnswers = [];
        this.wrongAnswers = [];
        this.isFromTextbook = false;
        this.isLocked = false;
    }

    init() {
        this.modalWindndowListeners();
        this.levelSelection();
    }

    modalWindndowListeners() {
        this.mainPage?.addEventListener('click', () => {
            if (this.modal && this.audiocallLvls) {
                document.body.style.overflow = 'hidden';
                this.modal.classList.remove('hidden');
                this.audiocallLvls.classList.remove('hidden');
                this.audiocallLvlsWrapper?.classList.remove('hidden');
                (this.description as HTMLDivElement).innerHTML = 'Выберите уровень сложности:';
                (this.startBtn as HTMLButtonElement).style.pointerEvents = 'none';
                window.localStorage.setItem('game', 'audiocallFromGames');
            }
        });

        this.textbookPage?.addEventListener('click', () => {
            if (this.modal && this.audiocallLvls) {
                document.body.style.overflow = 'hidden';
                this.modal.classList.remove('hidden');
                this.audiocallLvls.classList.remove('hidden');
                this.audiocallLvlsWrapper?.classList.add('hidden');
                (this.description as HTMLDivElement).innerHTML = 'Слова для игры берутся с текущей страницы учебника';
                (this.startBtn as HTMLButtonElement).style.pointerEvents = 'auto';
                this.isFromTextbook = true;
                window.localStorage.setItem('game', 'audiocallFromTextBook');
            }
        });

        this.modalCloseBtn?.addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('load', () => {
            if (window.localStorage.getItem('game') === 'audiocallFromGames') {
                if (this.modal && this.audiocallLvls) {
                    document.body.style.overflow = 'hidden';
                    this.modal.classList.remove('hidden');
                    this.audiocallLvls.classList.remove('hidden');
                    this.audiocallLvlsWrapper?.classList.remove('hidden');
                    (this.description as HTMLDivElement).innerHTML = 'Выберите уровень сложности:';
                    (this.startBtn as HTMLButtonElement).style.pointerEvents = 'none';
                }
            }
        });

        window.addEventListener('load', () => {
            if (window.localStorage.getItem('game') === 'audiocallFromTextBook') {
                if (this.modal && this.audiocallLvls) {
                    document.body.style.overflow = 'hidden';
                    this.modal.classList.remove('hidden');
                    this.audiocallLvls.classList.remove('hidden');
                    this.audiocallLvlsWrapper?.classList.add('hidden');
                    (this.description as HTMLDivElement).innerHTML =
                        'Слова для игры берутся с текущей страницы учебника';
                    (this.startBtn as HTMLButtonElement).style.pointerEvents = 'auto';
                    this.isFromTextbook = true;
                }
            }
        });
    }

    closeModal() {
        document.body.style.overflow = 'visible';
        this.modal?.classList.add('hidden');
        Array.from(this.audiocallLvlsWrapper?.children as HTMLCollection).forEach((item) => {
            item.classList.remove('audiocall__lvls--btn-active');
        });

        if (!this.gameWindow?.classList.contains('hidden')) {
            this.gameWindow?.classList.add('hidden');
        }

        if (!this.gameResults?.classList.contains('hidden')) {
            this.gameResults?.classList.add('hidden');
        }

        this.correctAnswers = [];
        this.wrongAnswers = [];
        this.isFromTextbook = false;
        localStorage.removeItem('unUsedWords');
        window.localStorage.removeItem('game');
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
                    this.argumentsForAudiocall[0] = groupCount;
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
            if (this.isFromTextbook && localStorage.getItem('Logged')) {
                this.argumentsForAudiocall = [
                    Number(localStorage.getItem('groupCount')),
                    Number(localStorage.getItem('pageCount')),
                ];
                getWordsResult(this.argumentsForAudiocall[0], this.argumentsForAudiocall[1]).then((result) => {
                    this.filterEasyWords(result).then((response) => {
                        this.renderWords(response);
                    });
                });
            } else if (this.isFromTextbook) {
                this.argumentsForAudiocall = [
                    Number(localStorage.getItem('groupCount')),
                    Number(localStorage.getItem('pageCount')),
                ];
                getWordsResult(this.argumentsForAudiocall[0], this.argumentsForAudiocall[1]).then((result) => {
                    this.renderWords(result);
                });
            } else {
                this.argumentsForAudiocall[1] = Math.floor(Math.random() * 20);
                getWordsResult(this.argumentsForAudiocall[0], this.argumentsForAudiocall[1]).then((result) => {
                    localStorage.removeItem('unUsedWords');
                    this.renderWords(result);
                });
            }
        }
    }

    renderWords(result: GetWords[]) {
        this.allWords = [...result];
        this.wordVariants = [];
        if (localStorage.getItem('unUsedWords')) {
            this.unUsedWords = JSON.parse(localStorage.getItem('unUsedWords') as string);

            if (this.isFromTextbook) {
                const wordsArray = JSON.parse(localStorage.getItem('unUsedWords') as string);
                if (wordsArray.length > 10) {
                    this.unUsedWords = wordsArray;
                }

                if (wordsArray.length < 10) {
                    const group = Number(localStorage.getItem('groupCount'));
                    let page = Number(localStorage.getItem('pageCount'));

                    if (page !== 0) {
                        page--;
                        getWordsResult(group, page).then((result) => {
                            this.filterEasyWords(result).then((response) => {
                                this.unUsedWords = wordsArray.concat(response);
                                localStorage.setItem('unUsedWords', JSON.stringify(this.unUsedWords));
                            });
                        });
                    }
                }
            }
        } else {
            this.unUsedWords = [...result].sort(() => 0.5 - Math.random());
            localStorage.setItem('unUsedWords', JSON.stringify(this.unUsedWords));
        }

        const lastWord = this.unUsedWords[this.unUsedWords.length - 1];
        this.wordVariants.push(lastWord);
        const indexes: number[] = [];

        for (let i = 0; i < this.allWords.length; i++) {
            const index = Math.floor(Math.random() * this.allWords.length);
            if (!indexes.includes(index)) {
                indexes.push(index);

                if (lastWord.word !== this.allWords[index].word) {
                    if (this.wordVariants.length >= 5) break;
                    this.wordVariants.push(this.allWords[index]);
                }
            }
        }

        this.wordVariants.sort(() => 0.5 - Math.random());
        this.wordVariants.forEach((item, i) => {
            if (item.word === this.unUsedWords[this.unUsedWords.length - 1].word) {
                this.wordIndex = i;
            }
        });

        this.voiceBtn?.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            this.wordVoice();
        });
        this.wordVoice();
        let resultWords = '';
        this.wordVariants.forEach((item, i) => {
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
            <img src="https://react-learnwords-english.herokuapp.com/${this.wordVariants[this.wordIndex].image}">
        `;
        (this.correctWord as HTMLDivElement).textContent = this.wordVariants[this.wordIndex].word;
        (this.audiocallWords?.children[this.wordIndex] as HTMLDivElement).style.backgroundColor = '#a7ff84';
        this.voiceBtn?.classList.add('smaller');
        (this.audiocallWordsWrapper as HTMLDivElement).style.pointerEvents = 'none';
    }

    hideCorrectWord() {
        (this.nextBtn as HTMLDivElement).textContent = 'Не знаю';
        (this.wordImg as HTMLDivElement).innerHTML = '';
        (this.correctWord as HTMLDivElement).textContent = '';
        this.voiceBtn?.classList.remove('smaller');
        (this.audiocallWordsWrapper as HTMLDivElement).style.pointerEvents = 'auto';
    }

    wordVoice() {
        const audioSource = `
            https://react-learnwords-english.herokuapp.com/${this.wordVariants[this.wordIndex].audio}
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
                if (this.isLocked) {
                    return;
                }

                if (!this.isLocked) {
                    this.nextWords();
                    setTimeout(() => {
                        this.isLocked = false;
                    }, 400);
                }

                this.isLocked = true;
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'Enter') {
                event.preventDefault();
                event.stopImmediatePropagation();
                if (this.isLocked) {
                    return;
                }

                if (!this.isLocked) {
                    this.nextWords();
                    setTimeout(() => {
                        this.isLocked = false;
                    }, 400);
                }

                this.isLocked = true;
            }
        });
        document.addEventListener('keyup', (event) => {
            if (event.code === 'NumpadEnter') {
                event.preventDefault();
                event.stopImmediatePropagation();
                if (this.isLocked) {
                    return;
                }

                if (!this.isLocked) {
                    this.nextWords();
                    setTimeout(() => {
                        this.isLocked = false;
                    }, 400);
                }

                this.isLocked = true;
            }
        });
    }

    checkWord(target: HTMLDivElement) {
        const choosenWord = Number(target.dataset.callWord);
        Array.from(this.audiocallWords?.children as HTMLCollection).forEach((item: Element) => {
            (item as HTMLDivElement).style.backgroundColor = '';
        });
        (this.audiocallWords?.children[this.wordIndex] as HTMLDivElement).style.backgroundColor = '#a7ff84';
        if (choosenWord === this.wordIndex) {
            if (this.correctAnswers.length <= 10) {
                this.correctAnswers.push({
                    id: this.wordVariants[this.wordIndex].id,
                    audio: this.wordVariants[this.wordIndex].audio,
                    word: this.wordVariants[this.wordIndex].word,
                    translate: this.wordVariants[this.wordIndex].wordTranslate,
                });
            }
        } else {
            (this.audiocallWords?.children[choosenWord] as HTMLDivElement).style.backgroundColor = '#ff6464';
            if (this.wrongAnswers.length <= 10) {
                this.wrongAnswers.push({
                    id: this.wordVariants[this.wordIndex].id,
                    audio: this.wordVariants[this.wordIndex].audio,
                    word: this.wordVariants[this.wordIndex].word,
                    translate: this.wordVariants[this.wordIndex].wordTranslate,
                });
            }
        }

        this.showCorrectWord();
    }

    nextWords() {
        if ((this.nextBtn as HTMLDivElement).textContent === 'Не знаю') {
            this.showCorrectWord();
            if (this.wrongAnswers.length <= 10) {
                this.wrongAnswers.push({
                    id: this.wordVariants[this.wordIndex].id,
                    audio: this.wordVariants[this.wordIndex].audio,
                    word: this.wordVariants[this.wordIndex].word,
                    translate: this.wordVariants[this.wordIndex].wordTranslate,
                });
            }
        } else {
            this.hideCorrectWord();
            if (this.correctAnswers.length + this.wrongAnswers.length <= 9) {
                const words: GetWords[] = JSON.parse(localStorage.getItem('unUsedWords') as string);
                words.pop();
                localStorage.setItem('unUsedWords', JSON.stringify(words));
                this.wordVariants = [];
                this.startGame();
            }
            this.showResult();
        }
    }

    showResult() {
        const answersSum = this.correctAnswers.length + this.wrongAnswers.length;
        const words: GetWords[] = JSON.parse(localStorage.getItem('unUsedWords') as string);
        if (answersSum === 10) {
            this.gameWindow?.classList.add('hidden');
            this.gameResults?.classList.remove('hidden');
            this.resultTable();
            this.sendResults();
            (this.resultsPlayBtn as HTMLDivElement).textContent = 'Играть ещё!';
        }

        if (!words.length) {
            this.gameWindow?.classList.add('hidden');
            this.gameResults?.classList.remove('hidden');
            this.resultTable();
            this.sendResults();
            this.hideCorrectWord();
            (this.resultsPlayBtn as HTMLDivElement).textContent = 'Выйты на страницу учебника';
        }

        this.resultsPlayBtn?.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            const target = event.target as HTMLElement;
            if (target.textContent === 'Играть ещё!') {
                this.gameResults?.classList.add('hidden');
                this.audiocallLvls?.classList.remove('hidden');
                this.correctAnswers = [];
                this.wrongAnswers = [];
                this.hideCorrectWord();
                words.pop();
                localStorage.setItem('unUsedWords', JSON.stringify(words));
            }

            if (target.textContent === 'Выйты на страницу учебника') {
                this.closeModal();
            }
        });
    }

    resultTable() {
        const correctLength = this.correctAnswers.length as number;
        const wrongLength = this.wrongAnswers.length as number;

        const percent = correctLength / (correctLength + wrongLength);
        this.renderResultBar(Math.round(percent * 100));

        let wrongList = '';
        this.wrongAnswers.forEach((item, i) => {
            wrongList += `
                <div class="audiocall__list">
                    <span class="material-symbols-outlined smallest" data-audiocall-wrong=${i}>
                        volume_up
                    </span>
                    <span class="audiocall__word audiocall__word-primary">
                        <b>${item.word}</b>
                    </span> 
                    <span class="audiocall__word">
                        ${item.translate}
                    </span>
                </div>
            `;
        });
        let correctlist = '';
        this.correctAnswers.forEach((item, i) => {
            correctlist += `
                <div class="audiocall__list">
                    <span class="material-symbols-outlined smallest" data-audiocall-correct=${i}>
                        volume_up
                    </span>
                    <span class="audiocall__word audiocall__word-primary">
                        <b> ${item.word} </b>
                    </span> -
                    <span class="audiocall__word">
                        ${item.translate}
                    </span>
                </div>
            `;
        });

        if (percent < 0.3) {
            (this.resultsTitle as HTMLHeadElement).innerHTML = 'Ты можешь лучше! Мы верим в тебя!';
        } else if (percent < 0.6) {
            (this.resultsTitle as HTMLHeadElement).innerHTML = 'Отличный результат! Но ты можешь лучше ;)';
        } else {
            (this.resultsTitle as HTMLHeadElement).innerHTML = 'Отличный результат!';
        }

        (this.resultsWrong as HTMLHeadElement).innerHTML = `
            Ошибки в словах <span class="wrong__count">${wrongLength}</span>
        `;
        (this.wrongContainer as HTMLHeadElement).innerHTML = wrongList;
        (this.resultsCorrect as HTMLHeadElement).innerHTML = `
            Изученные слова <span class="correct__count">${correctLength}</span>
        `;
        (this.correctContainer as HTMLHeadElement).innerHTML = correctlist;

        this.gameResults?.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            const target = event.target as HTMLElement;
            const current = target.dataset;
            let audioSrc = '';

            if (current.audiocallWrong) {
                this.wrongAnswers.forEach((item, i) => {
                    if (Number(current.audiocallWrong) === i) {
                        audioSrc = `
                            https://react-learnwords-english.herokuapp.com/${item.audio}
                        `;
                    }
                });
            }

            if (current.audiocallCorrect) {
                this.correctAnswers.forEach((item, i) => {
                    if (Number(current.audiocallCorrect) === i) {
                        audioSrc = `
                            https://react-learnwords-english.herokuapp.com/${item.audio}
                        `;
                    }
                });
            }

            const wordAudio = new Audio(audioSrc);
            wordAudio.play();
        });
    }

    renderResultBar(percent: number) {
        const barFilled = document.querySelector<SVGCircleElement>('.audiocall-bar__circle--filled');
        const resultPercent = document.querySelector<HTMLElement>('.audiocall-result__percent');

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

    sendResults() {
        getCards
            .getUserCards()
            .then((res: GetUserCards[]) => {
                this.correctAnswers.forEach((answer: Answers) => {
                    if (res.filter((word: GetUserCards) => word.wordId === answer.id).length) {
                        const word = res.filter((word: GetUserCards) => word.wordId === answer.id)[0];
                        if (word.difficulty === 'none') {
                            // проверяем, сделано ли три правильных ответа, если да:
                            if (word.optional.sprintRight + word.optional.audiocallRight + 1 === 3) {
                                updateUserWord(
                                    {
                                        difficulty: 'easy',
                                        optional: {
                                            sprintTries: word.optional.sprintTries,
                                            sprintRight: word.optional.sprintRight,
                                            audiocallRight: word.optional.audiocallRight + 1,
                                            audiocallTries: word.optional.audiocallTries + 1,
                                            mistakeAt: -1,
                                        },
                                    },
                                    answer.id
                                );
                            } else {
                                updateUserWord(
                                    {
                                        difficulty: 'none',
                                        optional: {
                                            sprintTries: word.optional.sprintTries,
                                            sprintRight: word.optional.sprintRight,
                                            audiocallRight: word.optional.audiocallRight + 1,
                                            audiocallTries: word.optional.audiocallTries + 1,
                                            mistakeAt: -1,
                                        },
                                    },
                                    answer.id
                                );
                            }
                        } else if (word.difficulty === 'hard') {
                            if (
                                (word.optional.mistakeAt || word.optional.mistakeAt === 0) &&
                                word.optional.sprintRight + word.optional.audiocallRight - word.optional.mistakeAt === 5
                            ) {
                                updateUserWord(
                                    {
                                        difficulty: 'easy',
                                        optional: {
                                            sprintTries: word.optional.sprintTries,
                                            sprintRight: word.optional.sprintRight,
                                            audiocallRight: word.optional.audiocallRight + 1,
                                            audiocallTries: word.optional.audiocallTries + 1,
                                            mistakeAt: -1,
                                        },
                                    },
                                    answer.id
                                );
                            } else if (word.optional.mistakeAt || word.optional.mistakeAt === 0) {
                                updateUserWord(
                                    {
                                        difficulty: 'hard',
                                        optional: {
                                            sprintTries: word.optional.sprintTries,
                                            sprintRight: word.optional.sprintRight,
                                            audiocallRight: word.optional.audiocallRight + 1,
                                            audiocallTries: word.optional.audiocallTries + 1,
                                            mistakeAt: word.optional.mistakeAt,
                                        },
                                    },
                                    answer.id
                                );
                            } else {
                                updateUserWord(
                                    {
                                        difficulty: 'hard',
                                        optional: {
                                            sprintTries: word.optional.sprintTries,
                                            sprintRight: word.optional.sprintRight,
                                            audiocallRight: word.optional.audiocallRight + 1,
                                            audiocallTries: word.optional.audiocallTries + 1,
                                            mistakeAt: -1,
                                        },
                                    },
                                    answer.id
                                );
                            }
                        }
                    } else {
                        sendUserWord(
                            {
                                difficulty: 'none',
                                optional: {
                                    sprintTries: 0,
                                    sprintRight: 0,
                                    audiocallRight: 1,
                                    audiocallTries: 1,
                                    mistakeAt: -1,
                                },
                            },
                            answer.id
                        );
                    }
                });
                this.wrongAnswers.forEach((answer: Answers) => {
                    if (res.filter((word: GetUserCards) => word.wordId === answer.id).length) {
                        const word = res.filter((word: GetUserCards) => word.wordId === answer.id)[0];
                        updateUserWord(
                            {
                                difficulty: 'hard',
                                optional: {
                                    sprintRight: word.optional.sprintRight,
                                    sprintTries: word.optional.sprintTries,
                                    audiocallRight: word.optional.audiocallRight,
                                    audiocallTries: word.optional.audiocallTries + 1,
                                    mistakeAt: word.optional.sprintRight + word.optional.audiocallRight,
                                },
                            },
                            answer.id
                        );
                    } else {
                        sendUserWord(
                            {
                                difficulty: 'hard',
                                optional: {
                                    sprintRight: 0,
                                    sprintTries: 0,
                                    audiocallRight: 0,
                                    audiocallTries: 1,
                                    mistakeAt: 0,
                                },
                            },
                            answer.id
                        );
                    }
                });
            })
            .then(() => {
                if (this.modalCloseBtn) {
                    this.modalCloseBtn.addEventListener('click', checkUserWords);
                }
            });
    }

    async filterEasyWords(wordsToPlay: GetWords[]): Promise<GetWords[]> {
        let easyUserWordsSet: Set<string>;
        const filteredArrayPromise: Promise<GetWords[]> = getCards
            .getUserCards()
            .then((res: GetUserCards[]) => {
                easyUserWordsSet = new Set(
                    res.filter((word: GetUserCards) => word.difficulty === 'easy').map((word) => word.wordId)
                );
            })
            .then(() => {
                const filteredArray = wordsToPlay.filter((word) => {
                    return !easyUserWordsSet.has(word.id);
                });
                return filteredArray;
            });

        return filteredArrayPromise;
    }
}
