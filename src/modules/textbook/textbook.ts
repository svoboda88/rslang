import { getWordsResult, getWordResult } from './request';
import { UI } from '../ui/ui';
import { getCards } from '../wordList/userCards';
import { checkUserWords } from '../wordList/checkUserWords';
import { GetWords, GetUserCards } from '../types/types';
import { removeCardsFromEasyHard } from './removeEasyHardButtons';

export class Textbook {
    UI: UI;

    textbookWords: Element | null;

    textbookLvls: Element | null;

    paginationList: Element | null;

    textbookPage: Element | null;

    prevBtn: HTMLElement | null;

    firstBtn: HTMLElement | null;

    nextBtn: HTMLElement | null;

    lastBtn: HTMLElement | null;

    gamesSection: HTMLElement | null;

    learnedWords: HTMLElement | null;

    constructor(UI: UI) {
        this.UI = UI;
        this.textbookWords = document.querySelector('.textbook__words');
        this.textbookLvls = document.querySelector('.textbook__lvls');
        this.paginationList = document.querySelector('.pagination__list');
        this.textbookPage = document.querySelector('#textbook-count');
        this.prevBtn = document.getElementById('textbook-prev');
        this.firstBtn = document.getElementById('textbook-first');
        this.nextBtn = document.getElementById('textbook-next');
        this.lastBtn = document.getElementById('textbook-last');
        this.gamesSection = document.querySelector('.textbook__games');
        this.learnedWords = document.querySelector('.learned__words');
    }

    async init() {
        await getWordsResult(
            Number(localStorage.getItem('groupCount')) || 0,
            Number(localStorage.getItem('pageCount')) || 0
        ).then((result) => {
            if (this.textbookWords) {
                this.textbookWords.innerHTML = '';
                this.textbookWords.append(...this.UI.getWordCards(result));
            }

            this.playWordAudio(this.textbookWords as HTMLDivElement);
        });

        this.renderEasyWords();
        this.toGroup();
        this.listenPaginationBtns();
        let localPageCount = Number(localStorage.getItem('pageCount')) + 1;
        if (localPageCount < 2) {
            localPageCount = 1;
        } else if (localPageCount > 29) {
            localPageCount = 30;
        }
        (this.textbookPage as Element).innerHTML = ` ${localPageCount} / 30 `;
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
        const learnedSectionButton = document.querySelectorAll('.textbook__section');
        window.addEventListener('click', (e) => {
            if (e.target === learnedSectionButton[1]) {
                this.sortByDifficulty('easy')
                    .then((result) => {
                        (this.learnedWords as HTMLDivElement).innerHTML = '';
                        (this.learnedWords as HTMLDivElement).append(...this.UI.getHardEasyCards(result as GetWords[]));
                    })
                    .then(removeCardsFromEasyHard);

                const scrollBtn = document.querySelector('.scroll-btn') as HTMLButtonElement;
                scrollBtn.classList.remove('hidden');
                this.playWordAudio(this.learnedWords as HTMLDivElement);
            }
        });
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
                this.init().then(getCards.getWordCards).then(checkUserWords);

                if (Number(localStorage.getItem('groupCount')) === 6 && this.paginationList && this.textbookWords) {
                    this.paginationList.classList.add('hidden');
                    this.gamesSection?.classList.add('hidden');
                    this.textbookWords.innerHTML = '';
                    this.sortByDifficulty('hard')
                        .then((result) => {
                            (this.textbookWords as HTMLDivElement).append(...this.UI.getHardEasyCards(result));
                        })
                        .then(removeCardsFromEasyHard);
                } else if (this.paginationList) {
                    this.paginationList.classList.remove('hidden');
                    this.gamesSection?.classList.remove('hidden');
                }
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
