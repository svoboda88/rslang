import { getWords } from './requestWords';
import { storage } from '../storage/storage';
import cardWord from './cardWord';

export class Textbook {
    textbookWords: Element | null;
    textbookLvls: Element | null;
    paginationList: Element | null;

    constructor() {
        this.textbookWords = document.querySelector('.textbook__words');
        this.textbookLvls = document.querySelector('.textbook__lvls');
        this.paginationList = document.querySelector('.pagination__list');
    }

    init() {
        getWords(storage.groupCount, storage.pageCount).then((result) => {
            if (this.textbookWords) {
                this.textbookWords.innerHTML = cardWord(result);
            }

            this.playlist();
        });

        this.group();
        this.pagination();
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

    group() {
        if (this.textbookLvls) {
            this.textbookLvls.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as HTMLDivElement;
                const count = Array.from((this.textbookLvls as HTMLElement).children).indexOf(target) as number;
                storage.groupCount = count;
                this.init();
            });
        }
    }

    pagination() {
        if (this.paginationList) {
            this.paginationList.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                const target = event.target as HTMLLIElement;

                if (target.id === 'textbook-next') {
                    storage.pageCount++;
                    this.init();
                }

                if (target.id === 'textbook-prev') {
                    storage.pageCount--;
                    this.init();
                }

                if (target.id === 'textbook-last') {
                    storage.pageCount = 29;
                    this.init();
                }

                if (target.id === 'textbook-first') {
                    storage.pageCount = 0;
                    this.init();
                }
            });
        }
    }
}
