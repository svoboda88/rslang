import { getWordsResult, getWordResult, GetWords } from './request';
import { storage } from '../storage/storage';
import { UI } from '../ui/ui';
import { hardWords, GetCards } from '../wordList/userCards';
import { checkUserWords } from '../wordList/checkUserWords';
import { GetUserCards } from '../storage/storage';

export class Textbook {
    UI: UI;

    getCards: GetCards;

    textbookWords: Element | null;

    textbookLvls: Element | null;

    paginationList: Element | null;

    textbookPage: Element | null;

    prevBtn: HTMLElement | null;

    firstBtn: HTMLElement | null;

    nextBtn: HTMLElement | null;

    lastBtn: HTMLElement | null;

    gamesSection: HTMLElement | null;

    textbookSections: HTMLElement | null;

    learnedWords: HTMLElement | null;

    constructor(UI: UI) {
        this.UI = UI;
        this.getCards = new GetCards();
        this.textbookWords = document.querySelector('.textbook__words');
        this.textbookLvls = document.querySelector('.textbook__lvls');
        this.paginationList = document.querySelector('.pagination__list');
        this.textbookPage = document.querySelector('#textbook-count');
        this.prevBtn = document.getElementById('textbook-prev');
        this.firstBtn = document.getElementById('textbook-first');
        this.nextBtn = document.getElementById('textbook-next');
        this.lastBtn = document.getElementById('textbook-last');
        this.gamesSection = document.querySelector('.textbook__games');
        this.textbookSections = document.querySelector('.textbook__sections');
        this.learnedWords = document.querySelector('.learned__words');
    }

    async init() {
        await getWordsResult(storage.groupCount, storage.pageCount).then((result) => {
            if (this.textbookWords) {
                this.textbookWords.innerHTML = '';
                this.textbookWords.append(...this.UI.getWordCards(result));
            }

            this.playWordAudio(this.textbookWords as HTMLDivElement);
        });

        this.renderEasyWords();
        this.toGroup();
        this.listenPaginationBtns();
        (this.textbookPage as Element).innerHTML = ` ${Number(storage.pageCount) + 1} / 30 `;
    }

    async sortByEasy() {
        const sorted: GetWords[] = await this.getCards.getUserCards().then((result: GetUserCards[]) => {
            const easyWords: GetUserCards[] = [];
            result.forEach((item) => {
                if (item.difficulty === 'easy') {
                    easyWords.push(item);
                }

                return;
            });

            const easyWordsFull: GetWords[] = [];
            easyWords.forEach((item) => {
                getWordResult(item.wordId).then((result) => {
                    easyWordsFull.push(result);
                });
            });

            return easyWordsFull;
        });

        return sorted;
    }

    async sortByHard() {
        const sorted: GetWords[] = await this.getCards.getUserCards().then((result: GetUserCards[]) => {
            const hardWords: GetUserCards[] = [];
            result.forEach((item) => {
                if (item.difficulty === 'hard') {
                    hardWords.push(item);
                }

                return;
            });

            const hardWordsFull: GetWords[] = [];
            hardWords.forEach((item) => {
                getWordResult(item.wordId).then((result) => {
                    hardWordsFull.push(result);
                });
            });

            return hardWordsFull;
        });

        return sorted;
    }

    renderEasyWords() {
        if (this.textbookSections) {
            this.textbookSections.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                this.sortByEasy().then((result) => {
                    setTimeout(() => {
                        (this.learnedWords as HTMLDivElement).innerHTML = '';
                        (this.learnedWords as HTMLDivElement).append(...this.UI.getWordCards(result));
                    }, 700);
                });

                const scrollBtn = document.querySelector('.scroll-btn') as HTMLButtonElement;
                scrollBtn.classList.remove('hidden');
                this.playWordAudio(this.learnedWords as HTMLDivElement);
            });
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

            this.textbookLvls.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as HTMLDivElement;
                const parent = target.parentNode as HTMLDivElement;
                const grandParent = parent.parentNode as HTMLDivElement;

                if (grandParent.classList.contains('lvl__card')) {
                    arrayGroup.forEach((item) => item.classList.remove('picked'));
                    grandParent.classList.add('picked');
                    const count = arrayGroup.indexOf(grandParent) as number;
                    storage.groupCount = count;
                } else if (parent.classList.contains('lvl__card')) {
                    arrayGroup.forEach((item) => item.classList.remove('picked'));
                    parent.classList.add('picked');
                    const count = arrayGroup.indexOf(parent) as number;
                    storage.groupCount = count;
                } else if (target.classList.contains('lvl__card')) {
                    arrayGroup.forEach((item) => item.classList.remove('picked'));
                    target.classList.add('picked');
                    const count = arrayGroup.indexOf(target) as number;
                    storage.groupCount = count;
                }
                storage.pageCount = 0;
                this.disablePrevBtns();
                this.activateNextBtns();
                this.init().then(hardWords.getWordCards).then(checkUserWords);

                if (storage.groupCount === 6 && this.paginationList && this.textbookWords) {
                    this.paginationList.classList.add('hidden');
                    this.gamesSection?.classList.add('hidden');
                    this.textbookWords.innerHTML = '';
                    this.sortByHard().then((result) => {
                        setTimeout(() => {
                            (this.textbookWords as HTMLDivElement).append(...this.UI.getWordCards(result));
                        }, 700);
                    });
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
                    storage.pageCount++;

                    if (storage.pageCount === 29) {
                        this.disableNextBtns();
                    } else if (storage.pageCount !== 0) {
                        this.activatePrevBtns();
                    }
                    this.init().then(hardWords.getWordCards).then(checkUserWords);
                }

                if (parent.id === 'textbook-prev') {
                    storage.pageCount--;

                    if (storage.pageCount === 0) {
                        this.disablePrevBtns();
                    } else if (storage.pageCount !== 0) {
                        this.activateNextBtns();
                    }
                    this.init().then(hardWords.getWordCards).then(checkUserWords);
                }

                if (parent.id === 'textbook-last') {
                    storage.pageCount = 29;
                    this.disableNextBtns();
                    this.activatePrevBtns();
                    this.init().then(hardWords.getWordCards).then(checkUserWords);
                }

                if (parent.id === 'textbook-first') {
                    storage.pageCount = 0;
                    this.disablePrevBtns();
                    this.activateNextBtns();
                    this.init().then(hardWords.getWordCards).then(checkUserWords);
                }
            });
        }
    }
}
