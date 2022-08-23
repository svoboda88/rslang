import { getWordsResult } from './request';
import { storage } from '../storage/storage';
import { UI } from '../ui/ui';

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
    }

    init() {
        getWordsResult(storage.groupCount, storage.pageCount).then((result) => {
            if (this.textbookWords) {
                this.textbookWords.innerHTML = this.UI.renderWordCards(result);
            }

            this.playWordAudio();
        });

        this.toGroup();
        this.listenPaginationBtns();
        (this.textbookPage as Element).innerHTML = ` ${Number(storage.pageCount) + 1} / 30 `;
    }

    playWordAudio() {
        if (this.textbookWords) {
            this.textbookWords.addEventListener('click', (event) => {
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
                    const audio = new Audio(audioArr[0]);

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
                }
                storage.pageCount = 0;
                this.disablePrevBtns();
                this.activateNextBtns();
                this.init();

                const scrollBtn = document.querySelector<HTMLElement>('.scroll-btn');

                if (storage.groupCount === 6 && this.paginationList && scrollBtn) {
                    this.paginationList.classList.add('hidden');
                    scrollBtn.classList.add('hidden');
                } else if (this.paginationList && scrollBtn) {
                    this.paginationList.classList.remove('hidden');
                    scrollBtn.classList.remove('hidden');
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
                    this.init();
                }

                if (parent.id === 'textbook-prev') {
                    storage.pageCount--;

                    if (storage.pageCount === 0) {
                        this.disablePrevBtns();
                    } else if (storage.pageCount !== 0) {
                        this.activateNextBtns();
                    }
                    this.init();
                }

                if (parent.id === 'textbook-last') {
                    storage.pageCount = 29;
                    this.disableNextBtns();
                    this.activatePrevBtns();
                    this.init();
                }

                if (parent.id === 'textbook-first') {
                    storage.pageCount = 0;
                    this.disablePrevBtns();
                    this.activateNextBtns();
                    this.init();
                }
            });
        }
    }
}
