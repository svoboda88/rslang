import { getWords } from './requestWords';
import cardWord from './cardWord';
import { storage } from '../storage/storage';
import groupWords from './groupWords';
import paginationWords from './paginationWords';

export default function renderCardWords() {
    const textbookWords = document.querySelector('.textbook__words') as HTMLDivElement;
    getWords(storage.groupCount, storage.pageCount).then((result) => {
        textbookWords.innerHTML = cardWord(result);

        textbookWords.addEventListener('click', (event) => {
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
    });

    groupWords();
    paginationWords();
}
