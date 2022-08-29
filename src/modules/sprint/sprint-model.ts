import { storage } from '../storage/storage';
import { GetWords, getWordsResult } from '../textbook/request';
import { Game } from './types';

export class SprintModel {
    game: Game;

    constructor() {
        this.game = {
            wordsToPlay: [],
            isWordCorrect: false,
            wordIndex: 0,
            wordPrice: 10,
            resultCount: 0,
            correctAnswers: [],
            wrongAnswers: [],
        };
    }

    async getWordsForLvl(lvl: number) {
        const randomPageNumber = Math.floor(Math.random() * 30);
        let pageHarder: GetWords[];
        const wordsArray = await getWordsResult(lvl, randomPageNumber);
        if (randomPageNumber === 29) {
            pageHarder = await getWordsResult(lvl, randomPageNumber - 1);
        } else {
            pageHarder = await getWordsResult(lvl, randomPageNumber + 1);
        }

        this.game.wordsToPlay = [...wordsArray, ...pageHarder];
    }

    async getWordsForTextbook() {
        const wordsArray = await getWordsResult(storage.groupCount, storage.pageCount);
        const pageHarder = await getWordsResult(storage.groupCount, storage.pageCount + 1);

        this.game.wordsToPlay = [...wordsArray, ...pageHarder];
    }

    getWord(index: number): string[] {
        this.game.isWordCorrect = Math.random() < 0.6;
        const word = this.game.wordsToPlay[index].word;
        let translate = '';

        if (this.game.isWordCorrect) {
            translate = this.game.wordsToPlay[index].wordTranslate;
        } else {
            let randomIndex = Math.floor(Math.random() * 38);
            if (index === randomIndex) {
                randomIndex = Math.floor(Math.random() * 38);
            }
            translate = this.game.wordsToPlay[randomIndex].wordTranslate;
        }

        return [word, translate];
    }

    writeAnswer(index: number, result: 'correct' | 'error') {
        const word = this.game.wordsToPlay[index];
        if (result === 'correct') {
            this.game.correctAnswers.push(word);
        } else if (result === 'error') {
            this.game.wrongAnswers.push(word);
        }
    }

    updateWordPrice(dotsCount: number) {
        if (dotsCount === 3 && this.game.wordPrice === 10) {
            this.game.wordPrice = 20;
        } else if (dotsCount === 3) {
            this.game.wordPrice += 20;
        }
    }

    toInitState() {
        this.game.wordsToPlay = [];
        this.game.isWordCorrect = false;
        this.game.wordIndex = 0;
        this.game.wordPrice = 10;
        this.game.resultCount = 0;
        this.game.correctAnswers = [];
        this.game.wrongAnswers = [];
    }
}
