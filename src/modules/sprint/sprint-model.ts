import { getWordsResult } from '../textbook/request';
import { Game } from './types';

export class SprintModel {
    game: Game;

    constructor() {
        this.game = {
            wordsToPlay: [],
            isWordCorrect: false,
            wordIndex: 0,
            wordPrice: 10,
            correctAnswerCount: 0,
            resultCount: 0,
        };
    }

    async getWordsForLvl(lvl: number) {
        const randomPageNumber = Math.floor(Math.random() * 30);

        const wordsArray = await getWordsResult(lvl, randomPageNumber);
        const hardWordsArr = await getWordsResult(lvl, randomPageNumber + 1);

        this.game.wordsToPlay = [...wordsArray, ...hardWordsArr];
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

    updateWordPrice() {
        console.log(this.game.correctAnswerCount);
        switch (this.game.correctAnswerCount) {
            case 4:
                this.game.wordPrice = 20;
                break;
            case 8:
                this.game.wordPrice = 40;
                break;
            case 12:
                this.game.wordPrice = 60;
                break;
            case 16:
                this.game.wordPrice = 80;
                break;
            case 18:
                this.game.wordPrice = 100;
                break;
            case 24:
                this.game.wordPrice = 120;
                break;
            case 28:
                this.game.wordPrice = 140;
                break;
            default:
                this.game.wordPrice = this.game.wordPrice;
        }
    }

    toInitState() {
        this.game.wordsToPlay = [];
        this.game.isWordCorrect = false;
        this.game.wordIndex = 0;
        this.game.wordPrice = 10;
        this.game.correctAnswerCount = 0;
        this.game.resultCount = 0;
    }
}
