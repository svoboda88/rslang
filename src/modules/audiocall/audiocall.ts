import { storage } from '../storage/storage';
import { GetWords, getWordsResult } from '../textbook/request';

export class Audiocall {
    modal: Element | null;
    audiocallLvls: Element | null;
    startBtn: Element | null;
    voiceBtn: Element | null;
    wordVariants: Element | null;

    constructor() {
        this.modal = document.querySelector('.game__modal');
        this.audiocallLvls = document.querySelector('.audiocall-lvls');
        this.startBtn = document.getElementById('start-call');
        this.voiceBtn = document.getElementById('word-voice');
        this.wordVariants = document.getElementById('word-variants');
    }

    init() {
        this.levelSelection();
        this.startGame();
    }

    levelSelection() {
        if (this.audiocallLvls) {
            this.audiocallLvls.addEventListener('click', (event) => {
                const target = event.target as HTMLDivElement;
                const groupCount = Number(target.dataset.callLvl);
                storage.groupCountAudiocall = groupCount;
            });
        }
    }

    startGame() {
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => {
                const pageCount = Math.floor(Math.random() * 20);
                getWordsResult(storage.groupCountAudiocall, pageCount).then((result) => {
                    const shuffled: GetWords[] = [...result].sort(() => 0.5 - Math.random());
                    const sliced: GetWords[] = shuffled.slice(0, 5);
                    const index = Math.floor(Math.random() * 5);
                    this.wordVoice(sliced, index);
                    (this.voiceBtn as HTMLDivElement).addEventListener('click', () => {
                        this.wordVoice(sliced, index);
                    });
                    let resultWords = '';
                    sliced.forEach((item) => {
                        resultWords += `<div>${item.word}</div>`;
                    });
                    (this.wordVariants as HTMLDivElement).innerHTML = resultWords;
                    (this.startBtn as HTMLDivElement).innerHTML = 'Next';
                });
            });
        }
    }

    wordVoice(arr: GetWords[], i: number) {
        const audioSource = `https://react-learnwords-english.herokuapp.com/${arr[i].audio}`;
        const audio = new Audio(audioSource);
        audio.play();
    }
}
