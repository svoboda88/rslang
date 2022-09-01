import { getWordsResult, getWordResult } from './request';
import { getCards } from '../wordList/userCards';
import { checkUserWords } from '../wordList/checkUserWords';
import { GetWords, GetUserCards } from '../types/types';
import { removeCardsFromEasyHard } from './removeEasyHardButtons';
import { sendWordsListener } from '../wordList/userWordsListeners';
import { UI } from '../ui/ui';

export class Textbook {
    UI: UI;
    textbookPage: HTMLElement | null;
    textbookPageCount: HTMLElement | null;
    textbookWords: Element | null;
    textbookHardWords: HTMLElement | null;
    textbookLvls: Element | null;
    paginationList: Element | null;
    prevBtn: HTMLElement | null;
    firstBtn: HTMLElement | null;
    nextBtn: HTMLElement | null;
    lastBtn: HTMLElement | null;
    gamesSection: HTMLElement | null;
    learnedWords: HTMLElement | null;
    textbookPageBtn: HTMLElement | null;
    loadScreen: HTMLElement | null;

    constructor(UI: UI) {
        this.UI = UI;
        this.textbookPage = document.getElementById('textbook-page');
        this.textbookWords = document.querySelector('.textbook__words');
        this.textbookHardWords = document.querySelector('.textbook__hard-words');
        this.textbookLvls = document.querySelector('.textbook__lvls');
        this.paginationList = document.querySelector('.pagination__list');
        this.textbookPageCount = document.querySelector('#textbook-count');
        this.prevBtn = document.getElementById('textbook-prev');
        this.firstBtn = document.getElementById('textbook-first');
        this.nextBtn = document.getElementById('textbook-next');
        this.lastBtn = document.getElementById('textbook-last');
        this.gamesSection = document.querySelector('.textbook__games');
        this.learnedWords = document.querySelector('.learned__words');
        this.textbookPageBtn = document.getElementById('textbook-btn');
        this.loadScreen = document.querySelector('.textbook__load-screen');
        this.listenTextbookPageBtn();
        this.listenTextbookSections();
    }

    listenTextbookPageBtn() {
        const textbookHardWords = document.querySelector('.textbook__hard-words');
        const textbookWords = document.querySelector('.textbook__words');
        const gamesSection = document.querySelector('.textbook__games');
        const paginationList = document.querySelector('.pagination__list');

        if (this.textbookPageBtn) {
            this.textbookPageBtn.addEventListener('click', () => {
                if (this.textbookPage && this.textbookPageBtn) {
                    if (
                        Number(localStorage.getItem('groupCount')) === 6 &&
                        textbookWords &&
                        textbookHardWords &&
                        paginationList &&
                        gamesSection &&
                        this.loadScreen
                    ) {
                        this.loadScreen.classList.remove('hidden');
                        (this.textbookHardWords as HTMLDivElement).innerHTML = '';
                        this.sortByDifficulty('hard')
                            .then((result) => {
                                this.loadScreen?.classList.add('hidden');
                                if (result.length === 0 && this.textbookHardWords) {
                                    this.textbookHardWords.innerHTML = `
                                    <h2>Ни одно слово не отмечено сложным. Пока что...</h2>`;
                                }
                                (this.textbookHardWords as HTMLDivElement).append(...this.getHardEasyCards(result));
                            })
                            .then(removeCardsFromEasyHard);
                        textbookHardWords.classList.remove('hidden');
                        textbookWords.classList.add('hidden');
                        gamesSection.classList.add('hidden');
                        paginationList.classList.add('hidden');
                    } else if (
                        textbookWords &&
                        textbookHardWords &&
                        paginationList &&
                        gamesSection &&
                        this.learnedWords?.classList.contains('hidden')
                    ) {
                        textbookHardWords.classList.add('hidden');
                        textbookWords.classList.remove('hidden');
                        gamesSection.classList.remove('hidden');
                        paginationList.classList.remove('hidden');
                    }
                    if (this.learnedWords && this.learnedWords.classList.contains('hidden')) {
                        this.gamesSection?.classList.remove('hidden');
                    }
                    if (Number(localStorage.getItem('pageCount')) !== 0) {
                        this.activatePrevBtns();
                    }
                    if (Number(localStorage.getItem('pageCount')) === 29) {
                        this.activatePrevBtns();
                        this.disableNextBtns();
                    }
                    this.UI.showPage(this.textbookPage, this.textbookPageBtn);
                }
            });
        }
    }

    async init() {
        await getWordsResult(
            Number(localStorage.getItem('groupCount')) || 0,
            Number(localStorage.getItem('pageCount')) || 0
        ).then((result) => {
            if (this.textbookWords) {
                this.textbookWords.innerHTML = '';
                this.textbookWords.append(...this.getWordCards(result));
            }

            this.playWordAudio(this.textbookWords as HTMLDivElement);
        });

        this.toGroup();
        this.listenPaginationBtns();
        let localPageCount = Number(localStorage.getItem('pageCount')) + 1;
        if (localPageCount < 2) {
            localPageCount = 1;
        } else if (localPageCount > 29) {
            localPageCount = 30;
        }
        (this.textbookPageCount as Element).innerHTML = ` ${localPageCount} / 30 `;
    }

    async sortByDifficulty(difficulty: string) {
        const sorted: GetWords[] = await getCards
            .getUserCards()
            .then((res) => {
                return res.filter((el: GetUserCards) => el.difficulty === `${difficulty}`);
            })
            .then((res) => {
                return res.map((el: GetUserCards) => el.wordId);
            })
            .then((res) => {
                return Promise.all(
                    res.map((el: string) => {
                        return getWordResult(el).then((res) => res);
                    })
                );
            });
        return sorted;
    }

    renderEasyWords() {
        if (this.loadScreen) {
            this.loadScreen.classList.remove('hidden');
            this.sortByDifficulty('easy')
                .then((result) => {
                    (this.learnedWords as HTMLDivElement).innerHTML = '';
                    if (result.length === 0 && this.learnedWords) {
                        this.learnedWords.innerHTML = `
                                <h2>Здесь пока что пусто.</h2>`;
                    }
                    (this.learnedWords as HTMLDivElement).append(...this.getHardEasyCards(result as GetWords[]));
                    this.loadScreen?.classList.add('hidden');
                })
                .then(removeCardsFromEasyHard);

            const scrollBtn = document.querySelector('.scroll-btn') as HTMLButtonElement;
            scrollBtn.classList.remove('hidden');
            this.playWordAudio(this.learnedWords as HTMLDivElement);
        }
    }

    playWordAudio(section: HTMLDivElement) {
        section.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            const target = event.target as HTMLElement;
            const wordTitle = target.parentElement;

            if (target.dataset.volume) {
                const selector = `[data-audio="${target.dataset.volume}"]`;
                const wordsAudio = document.querySelector(selector) as HTMLDivElement;
                const audiofirst = (wordsAudio.children[0] as HTMLAudioElement).src;
                const audiosecond = (wordsAudio.children[1] as HTMLAudioElement).src;
                const audiothird = (wordsAudio.children[2] as HTMLAudioElement).src;
                const audioArr = [audiofirst, audiosecond, audiothird];
                const audio = new Audio();

                audio.src = audioArr[0];
                audio.play();
                if (event.target instanceof HTMLElement) {
                    const wordTitle = event.target.parentElement;
                    if (wordTitle) {
                        wordTitle.classList.add('audio-active');
                    }
                }

                let index = 1;
                audio.onended = function () {
                    if (index < audioArr.length) {
                        audio.src = audioArr[index];
                        audio.play();
                        index++;
                    }

                    if (wordTitle) {
                        wordTitle.classList.remove('audio-active');
                    }
                };
            }
        });
    }

    toGroup() {
        if (this.textbookLvls) {
            const arrayGroup = Array.from((this.textbookLvls as HTMLElement).children);
            arrayGroup.forEach((item) => item.classList.remove('picked'));
            arrayGroup[Number(localStorage.getItem('groupCount'))].classList.add('picked');

            this.textbookLvls.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as HTMLDivElement;
                const parent = target.parentNode as HTMLDivElement;
                const grandParent = parent.parentNode as HTMLDivElement;

                if (grandParent.classList.contains('lvl__card')) {
                    const count = arrayGroup.indexOf(grandParent) as number;
                    localStorage.setItem('groupCount', count.toString());
                } else if (parent.classList.contains('lvl__card')) {
                    const count = arrayGroup.indexOf(parent) as number;
                    localStorage.setItem('groupCount', count.toString());
                } else if (target.classList.contains('lvl__card')) {
                    const count = arrayGroup.indexOf(target) as number;
                    localStorage.setItem('groupCount', count.toString());
                }
                localStorage.setItem('pageCount', String(0));
                this.disablePrevBtns();
                this.activateNextBtns();
                if (Number(localStorage.getItem('groupCount')) === 6) {
                    this.init().then(getCards.getWordCards);
                } else {
                    this.init().then(getCards.getWordCards).then(checkUserWords);
                }

                if (
                    Number(localStorage.getItem('groupCount')) === 6 &&
                    this.paginationList &&
                    this.textbookWords &&
                    this.gamesSection &&
                    this.textbookHardWords &&
                    this.loadScreen
                ) {
                    this.paginationList.classList.add('hidden');
                    this.gamesSection.classList.add('hidden');
                    this.textbookWords.classList.add('hidden');
                    this.textbookHardWords.classList.remove('hidden');
                    this.loadScreen.classList.remove('hidden');
                    (this.textbookHardWords as HTMLDivElement).innerHTML = '';
                    this.sortByDifficulty('hard')
                        .then((result) => {
                            if (result.length === 0 && this.textbookHardWords) {
                                this.textbookHardWords.innerHTML = `
                                <h2>Ни одно слово не отмечено сложным. Пока что...</h2>`;
                            }
                            (this.textbookHardWords as HTMLDivElement).append(...this.getHardEasyCards(result));
                            if (this.loadScreen) {
                                this.loadScreen.classList.add('hidden');
                                window.localStorage.setItem('hard', 'hardWords');
                            }
                        })
                        .then(removeCardsFromEasyHard);
                } else if (this.paginationList && this.textbookWords && this.gamesSection && this.textbookHardWords) {
                    this.paginationList.classList.remove('hidden');
                    if (localStorage.getItem('Logged') === 'logged') {
                        this.gamesSection.classList.remove('hidden');
                    }
                    this.textbookWords.classList.remove('hidden');
                    this.textbookHardWords.classList.add('hidden');
                }
            });
        }
    }

    getWordCards(result: GetWords[]) {
        return result.map((item) => {
            const card = document.createElement('div');
            card.classList.add('words__card');
            card.id = item.id;

            card.innerHTML = `
                    <img class="word__img"
                    src="https://react-learnwords-english.herokuapp.com/${item.image}" alt="word image">
                    <div class="word__text">
                        <div class="word__title">
                            <div class="word__title--top">
                                <h2>${item.word} ${item.transcription}</h2>
                                <span class="material-symbols-outlined word__audio" data-volume=${item.id}>
                                volume_up
                                </span>
                            </div>
                            <p class="word__translate">${item.wordTranslate}</p>
                        </div>
                        <br>

                        <div class="${
                            localStorage.getItem('Logged') === 'logged' ? 'word__btns' : 'word__btns hidden'
                        }">
                            <button class="word__btns--learned" data-id="${item.id}">Изученное</button>

                            <button class="word__btns--hard" data-id="${item.id}">Сложное</button> 

                        </div>

                        <div class="words__audio" data-audio=${item.id}>
                            <audio src="https://react-learnwords-english.herokuapp.com/${item.audio}"></audio>
                            <audio src="https://react-learnwords-english.herokuapp.com/${item.audioMeaning}"></audio>
                            <audio src="https://react-learnwords-english.herokuapp.com/${item.audioExample}"></audio>
                        </div>

                        <br>
                        <div class=
                        "${localStorage.getItem('Logged') === 'logged' ? 'word__games' : 'word__games hidden'}">
                            <h3>Ответы в играх:</h3>
                            <p>Спринт - 0 из 0</p>
                            <p>Аудиовызов - 0 из 0</p>
                        </div>

                        <br>

                        <p>${item.textMeaning}</p>
                        <p class="word__translate">${item.textMeaningTranslate}</p>
                        <p>${item.textExample}</p>
                        <p class="word__translate">${item.textExampleTranslate}</p>
                    </div>
            `;

            card.addEventListener('click', sendWordsListener);
            return card;
        });
    }

    getHardEasyCards(result: GetWords[]) {
        return result.map((item) => {
            const card = document.createElement('div');
            card.classList.add('words__card');
            card.id = item.id;

            card.innerHTML = `
                    <img class="word__img"
                    src="https://react-learnwords-english.herokuapp.com/${item.image}" alt="word image">
                    <div class="word__text">
                        <div class="word__title">
                            <div class="word__title--top">
                                <h2>${item.word} ${item.transcription}</h2>
                                <span class="material-symbols-outlined word__audio" data-volume=${item.id}>
                                volume_up
                                </span>
                            </div>
                            <p class="word__translate">${item.wordTranslate}</p>
                        </div>
                        <br>

                        <div class="${
                            localStorage.getItem('Logged') === 'logged' ? 'word__btns' : 'word__btns hidden'
                        }">
                            <button class="word__btns-remove data-id="${item.id}">Восстановить<button>
                        </div>

                        <div class="words__audio" data-audio=${item.id}>
                            <audio src="https://react-learnwords-english.herokuapp.com/${item.audio}"></audio>
                            <audio src="https://react-learnwords-english.herokuapp.com/${item.audioMeaning}"></audio>
                            <audio src="https://react-learnwords-english.herokuapp.com/${item.audioExample}"></audio>
                        </div>

                        <br>
                        <div class=
                        "${localStorage.getItem('Logged') === 'logged' ? 'word__games' : 'word__games hidden'}">
                            <h3>Ответы в играх:</h3>
                            <p>Спринт - 0 из 0</p>
                            <p>Аудиовызов - 0 из 0</p>
                        </div>

                        <br>

                        <p>${item.textMeaning}</p>
                        <p class="word__translate">${item.textMeaningTranslate}</p>
                        <p>${item.textExample}</p>
                        <p class="word__translate">${item.textExampleTranslate}</p>
                    </div>
            `;
            return card;
        });
    }

    listenTextbookSections() {
        const textbookBtn = document.getElementById('section-textbook');
        const learnedBtn = document.getElementById('section-learned');

        const textbookSection = document.querySelector<HTMLElement>('.textbook__wrapper');
        const learnedSection = document.querySelector<HTMLElement>('.learned__wrapper');

        const scrollBtn = document.querySelector<HTMLElement>('.scroll-btn');

        const gamesBtns = document.querySelector<HTMLElement>('.textbook__games');

        if (textbookBtn && learnedBtn && textbookSection && learnedSection && scrollBtn && gamesBtns) {
            textbookBtn.addEventListener('click', () => {
                textbookBtn.classList.add('section--active');
                learnedBtn.classList.remove('section--active');
                textbookSection.classList.remove('hidden');
                learnedSection.classList.add('hidden');
                scrollBtn.classList.remove('hidden');
                if (Number(localStorage.getItem('groupCount')) === 6) {
                    gamesBtns.classList.add('hidden');
                } else {
                    gamesBtns.classList.remove('hidden');
                }
                this.init().then(checkUserWords);
            });

            window.addEventListener('click', (e) => {
                if (e.target === learnedBtn) {
                    learnedBtn.classList.add('section--active');
                    textbookBtn.classList.remove('section--active');
                    textbookSection.classList.add('hidden');
                    learnedSection.classList.remove('hidden');
                    scrollBtn.classList.add('hidden');
                    gamesBtns.classList.add('hidden');
                    (this.learnedWords as HTMLDivElement).innerHTML = '';
                    this.renderEasyWords();
                    window.localStorage.setItem('easy', 'easyWords');
                } else if (e.target === textbookBtn) {
                    window.localStorage.removeItem('easy');
                }
            });
            window.addEventListener('load', () => {
                if (window.localStorage.getItem('easy') === 'easyWords') {
                    learnedBtn.classList.add('section--active');
                    textbookBtn.classList.remove('section--active');
                    textbookSection.classList.add('hidden');
                    learnedSection.classList.remove('hidden');
                    scrollBtn.classList.add('hidden');
                    gamesBtns.classList.add('hidden');
                    (this.learnedWords as HTMLDivElement).innerHTML = '';
                    this.renderEasyWords();
                }
            });
            window.addEventListener('load', () => {
                setTimeout(() => {
                    if (window.localStorage.getItem('groupCount') === '6') {
                        const button = document.querySelector('#hard-lvl');
                        (button as HTMLDivElement).click();
                    }
                }, 200);
            });
        }
    }

    disableNextBtns() {
        if (this.nextBtn && this.lastBtn) {
            this.nextBtn.classList.add('disabled-btn');
            this.lastBtn.classList.add('disabled-btn');
            this.nextBtn.style.pointerEvents = 'none';
            this.lastBtn.style.pointerEvents = 'none';
        }
    }

    activateNextBtns() {
        if (this.nextBtn && this.lastBtn) {
            this.nextBtn.classList.remove('disabled-btn');
            this.lastBtn.classList.remove('disabled-btn');
            this.nextBtn.style.pointerEvents = 'auto';
            this.lastBtn.style.pointerEvents = 'auto';
        }
    }

    disablePrevBtns() {
        if (this.prevBtn && this.firstBtn) {
            this.prevBtn.classList.add('disabled-btn');
            this.firstBtn.classList.add('disabled-btn');
            this.prevBtn.style.pointerEvents = 'none';
            this.firstBtn.style.pointerEvents = 'none';
        }
    }

    activatePrevBtns() {
        if (this.prevBtn && this.firstBtn) {
            this.prevBtn.classList.remove('disabled-btn');
            this.firstBtn.classList.remove('disabled-btn');
            this.prevBtn.style.pointerEvents = 'auto';
            this.firstBtn.style.pointerEvents = 'auto';
        }
    }

    listenPaginationBtns() {
        if (this.paginationList) {
            this.paginationList.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as Element;
                const parent = target.parentNode as Element;

                if (parent.id === 'textbook-next') {
                    const count = Number(localStorage.getItem('pageCount')) + 1;
                    localStorage.setItem('pageCount', count.toString());

                    if (Number(localStorage.getItem('pageCount')) === 29) {
                        this.disableNextBtns();
                    } else if (Number(localStorage.getItem('pageCount')) !== 0) {
                        this.activatePrevBtns();
                    }
                    this.init().then(getCards.getWordCards).then(checkUserWords);
                }

                if (parent.id === 'textbook-prev') {
                    const count = Number(localStorage.getItem('pageCount')) - 1;
                    localStorage.setItem('pageCount', count.toString());

                    if (Number(localStorage.getItem('pageCount')) === 0) {
                        this.disablePrevBtns();
                    } else if (Number(localStorage.getItem('pageCount')) !== 0) {
                        this.activateNextBtns();
                    }
                    this.init().then(getCards.getWordCards).then(checkUserWords);
                }

                if (parent.id === 'textbook-last') {
                    const count = 29;
                    localStorage.setItem('pageCount', count.toString());
                    this.disableNextBtns();
                    this.activatePrevBtns();
                    this.init().then(getCards.getWordCards).then(checkUserWords);
                }

                if (parent.id === 'textbook-first') {
                    const count = 0;
                    localStorage.setItem('pageCount', count.toString());
                    this.disablePrevBtns();
                    this.activateNextBtns();
                    this.init().then(getCards.getWordCards).then(checkUserWords);
                }
            });
        }
    }
}
