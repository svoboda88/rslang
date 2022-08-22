import { getWordsResult } from './request';
import { storage } from '../storage/storage';
import renderWordCard from './cardWord';

export class Textbook {
    textbookWords: Element | null;
    textbookLvls: Element | null;
    paginationList: Element | null;
    textbookPage: Element | null;

    constructor() {
        this.textbookWords = document.querySelector('.textbook__words');
        this.textbookLvls = document.querySelector('.textbook__lvls');
        this.paginationList = document.querySelector('.pagination__list');
        this.textbookPage = document.querySelector('#textbook-count');
    }

    init() {
        getWordsResult(storage.groupCount, storage.pageCount).then((result) => {
            if (this.textbookWords) {
                this.textbookWords.innerHTML = renderWordCard(result);
            }

            this.playlist();
        });

        this.toGroup();
        this.pagination();
        (this.textbookPage as Element).innerHTML = ` ${Number(storage.pageCount) + 1} / 30 `;
    }

    playlist() {
        if (this.textbookWords) {
            this.textbookWords.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as HTMLElement;

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

                    let index = 1;
                    audio.onended = function () {
                        if (index < audioArr.length) {
                            audio.src = audioArr[index];
                            audio.play();
                            index++;
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
                    storage.pageCount = 0;
                    this.init();
                } else if (parent.classList.contains('lvl__card')) {
                    arrayGroup.forEach((item) => item.classList.remove('picked'));
                    parent.classList.add('picked');
                    const count = arrayGroup.indexOf(parent) as number;
                    storage.groupCount = count;
                    storage.pageCount = 0;
                    this.init();
                }
            });
        }
    }

    pagination() {
        if (this.paginationList) {
            this.paginationList.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as Element;
                const parent = target.parentNode as Element;
                const nextBtn = document.getElementById('textbook-next') as HTMLLIElement;
                const prevBtn = document.getElementById('textbook-prev') as HTMLLIElement;
                const firstBtn = document.getElementById('textbook-first') as HTMLLIElement;
                const lastBtn = document.getElementById('textbook-last') as HTMLLIElement;

                if (parent.id === 'textbook-next') {
                    storage.pageCount++;

                    if (storage.pageCount === 29) {
                        nextBtn.classList.remove('active-btn');
                        nextBtn.classList.add('non-active-btn');
                        nextBtn.style.pointerEvents = 'none';

                        prevBtn.classList.remove('non-active-btn');
                        prevBtn.classList.add('active-btn');
                        prevBtn.style.pointerEvents = 'auto';

                        lastBtn.classList.remove('active-btn');
                        lastBtn.classList.add('non-active-btn');
                        lastBtn.style.pointerEvents = 'none';

                        firstBtn.classList.remove('non-active-btn');
                        firstBtn.classList.add('active-btn');
                        firstBtn.style.pointerEvents = 'auto';
                    } else {
                        nextBtn.style.pointerEvents = 'auto';
                        if (nextBtn.classList.contains('non-active-btn')) {
                            nextBtn.classList.remove('non-active-btn');
                            nextBtn.classList.add('active-btn');
                        }

                        prevBtn.style.pointerEvents = 'auto';
                        if (prevBtn.classList.contains('non-active-btn')) {
                            prevBtn.classList.remove('non-active-btn');
                            prevBtn.classList.add('active-btn');
                        }

                        lastBtn.style.pointerEvents = 'auto';
                        if (lastBtn.classList.contains('non-active-btn')) {
                            lastBtn.classList.remove('non-active-btn');
                            lastBtn.classList.add('active-btn');
                        }

                        firstBtn.style.pointerEvents = 'auto';
                        if (firstBtn.classList.contains('non-active-btn')) {
                            firstBtn.classList.remove('non-active-btn');
                            firstBtn.classList.add('active-btn');
                        }
                    }

                    this.init();
                }

                if (parent.id === 'textbook-prev') {
                    storage.pageCount--;

                    if (storage.pageCount === 0) {
                        prevBtn.classList.remove('active-btn');
                        prevBtn.classList.add('non-active-btn');
                        prevBtn.style.pointerEvents = 'none';

                        nextBtn.classList.remove('non-active-btn');
                        nextBtn.classList.add('active-btn');
                        nextBtn.style.pointerEvents = 'auto';

                        firstBtn.classList.remove('active-btn');
                        firstBtn.classList.add('non-active-btn');
                        firstBtn.style.pointerEvents = 'none';

                        lastBtn.classList.remove('non-active-btn');
                        lastBtn.classList.add('active-btn');
                        lastBtn.style.pointerEvents = 'auto';
                    } else {
                        nextBtn.style.pointerEvents = 'auto';
                        if (nextBtn.classList.contains('non-active-btn')) {
                            nextBtn.classList.remove('non-active-btn');
                            nextBtn.classList.add('active-btn');
                        }

                        prevBtn.style.pointerEvents = 'auto';
                        if (prevBtn.classList.contains('non-active-btn')) {
                            prevBtn.classList.remove('non-active-btn');
                            prevBtn.classList.add('active-btn');
                        }

                        lastBtn.style.pointerEvents = 'auto';
                        if (lastBtn.classList.contains('non-active-btn')) {
                            lastBtn.classList.remove('non-active-btn');
                            lastBtn.classList.add('active-btn');
                        }

                        firstBtn.style.pointerEvents = 'auto';
                        if (firstBtn.classList.contains('non-active-btn')) {
                            firstBtn.classList.remove('non-active-btn');
                            firstBtn.classList.add('active-btn');
                        }
                    }

                    this.init();
                }

                if (parent.id === 'textbook-last') {
                    storage.pageCount = 29;

                    nextBtn.classList.remove('active-btn');
                    nextBtn.classList.add('non-active-btn');
                    nextBtn.style.pointerEvents = 'none';

                    prevBtn.classList.remove('non-active-btn');
                    prevBtn.classList.add('active-btn');
                    prevBtn.style.pointerEvents = 'auto';

                    lastBtn.classList.remove('active-btn');
                    lastBtn.classList.add('non-active-btn');
                    lastBtn.style.pointerEvents = 'none';

                    firstBtn.classList.remove('non-active-btn');
                    firstBtn.classList.add('active-btn');
                    firstBtn.style.pointerEvents = 'auto';

                    this.init();
                }

                if (parent.id === 'textbook-first') {
                    storage.pageCount = 0;

                    prevBtn.classList.remove('active-btn');
                    prevBtn.classList.add('non-active-btn');
                    prevBtn.style.pointerEvents = 'none';

                    nextBtn.classList.remove('non-active-btn');
                    nextBtn.classList.add('active-btn');
                    nextBtn.style.pointerEvents = 'auto';

                    firstBtn.classList.remove('active-btn');
                    firstBtn.classList.add('non-active-btn');
                    firstBtn.style.pointerEvents = 'none';

                    lastBtn.classList.remove('non-active-btn');
                    lastBtn.classList.add('active-btn');
                    lastBtn.style.pointerEvents = 'auto';

                    this.init();
                }
            });
        }
    }
}
