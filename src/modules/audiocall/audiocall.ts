import { storage } from '../storage/storage';
import { GetWords, getWordsResult } from '../textbook/request';

export class Audiocall {
    modal: Element | null;
    audiocallLvls: Element | null;
    startBtn: Element | null;
    voiceBtn: Element | null;
    wordVariants: Element | null;
    wrapper: Element | null;

    constructor() {
        this.modal = document.querySelector('.game__modal');
        this.audiocallLvls = document.querySelector('.audiocall-lvls');
        this.startBtn = document.getElementById('start-call');
        this.voiceBtn = document.getElementById('word-voice');
        this.wordVariants = document.getElementById('word-variants');
        this.wrapper = document.querySelector('.audiocall');
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
                // console.log(storage);
                const pageCount = Math.floor(Math.random() * 20);
                getWordsResult(storage.groupCountAudiocall, pageCount).then((result) => {
                    const shuffled: GetWords[] = [...result].sort(() => 0.5 - Math.random());
                    const sliced: GetWords[] = shuffled.slice(0, 5);
                    const index = Math.floor(Math.random() * 5);
                    storage.wordVariants = [];
                    storage.wordVariants = [...sliced];
                    storage.wordIndex = index;
                    (this.voiceBtn as HTMLDivElement).addEventListener('click', (event) => {
                        event.stopImmediatePropagation();
                        this.wordVoice(storage.wordVariants, storage.wordIndex);
                    });
                    this.wordVoice(sliced, index);
                    let resultWords = '';
                    sliced.forEach((item, i) => {
                        resultWords += `<div data-call-word=${i}>${item.word}</div>`;
                    });
                    (this.wordVariants as HTMLDivElement).innerHTML = resultWords;
                    (this.startBtn as HTMLDivElement).innerHTML = 'Next';
                    this.answerWord(sliced, index);
                    this.showResult();
                });
            });
        }
    }

    wordVoice(arr: GetWords[], i: number) {
        const audioSource = `https://react-learnwords-english.herokuapp.com/${arr[i].audio}`;
        const audio = new Audio(audioSource);
        audio.play();
    }

    answerWord(arr: GetWords[], i: number) {
        if (this.wordVariants) {
            this.wordVariants.addEventListener('click', (event) => {
                const target = event.target as HTMLDivElement;
                const choosenWord = Number(target.dataset.callWord);
                if (choosenWord === i) {
                    target.style.backgroundColor = 'green';
                    arr.forEach((item) => {
                        if (item.word === target.textContent) {
                            storage.correctAnswers.push({
                                audio: item.audio,
                                word: item.word,
                                translate: item.wordTranslate,
                            });
                        }
                    });
                } else {
                    target.style.backgroundColor = 'red';
                    arr.forEach((item) => {
                        if (item.word === target.textContent) {
                            storage.wrongAnswers.push({
                                audio: item.audio,
                                word: item.word,
                                translate: item.wordTranslate,
                            });
                        }
                    });
                }
            });
        }
    }

    showResult() {
        const answersSum = storage.correctAnswers.length + storage.wrongAnswers.length;
        console.log(answersSum);
        if (answersSum === 10) {
            (this.wrapper as HTMLDivElement).innerHTML = `Correct:`;
        }
    }
}
