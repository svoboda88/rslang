// import { storage } from '../storage/storage';
import { getWordsResult } from '../textbook/request';
import { Game, GetUserCards, GetWords } from '../types/types';
import { getCards } from '../wordList/userCards';

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
        const randomPageNumberExtra = randomPageNumber === 0 ? 1 : randomPageNumber - 1;

        const wordsArray = await getWordsResult(lvl, randomPageNumber);
        const wordsArrayExtraPage = await getWordsResult(lvl, randomPageNumberExtra);
        this.game.wordsToPlay = await this.filterEasyWords([...wordsArray, ...wordsArrayExtraPage]);
        this.game.wordsToPlay = this.game.wordsToPlay.concat(await this.checkIfEnoughWords(lvl, randomPageNumber));
    }

    async getWordsForTextbook() {
        const wordsArray = await getWordsResult(
            Number(localStorage.getItem('groupCount')),
            Number(localStorage.getItem('pageCount'))
        );
        const pageHarder = await getWordsResult(
            Number(localStorage.getItem('groupCount')),
            Number(localStorage.getItem('pageCount')) + 1
        );

        this.game.wordsToPlay = await this.filterEasyWords([...wordsArray, ...pageHarder]);
        this.game.wordsToPlay = this.game.wordsToPlay.concat(
            await this.checkIfEnoughWords(
                Number(localStorage.getItem('groupCount')),
                Number(localStorage.getItem('pageCount'))
            )
        );
    }

    async filterEasyWords(wordsToPlay: GetWords[]): Promise<GetWords[]> {
        let easyUserWordsSet: Set<string>;
        const filteredArrayPromise: Promise<GetWords[]> = getCards
            .getUserCards()
            .then((res: GetUserCards[]) => {
                easyUserWordsSet = new Set(
                    res.filter((word: GetUserCards) => word.difficulty === 'easy').map((word) => word.wordId)
                );
            })
            .then(() => {
                const filteredArray = wordsToPlay.filter((word) => {
                    return !easyUserWordsSet.has(word.id);
                });
                return filteredArray;
            });
        return filteredArrayPromise;
    }

    async checkIfEnoughWords(lvl: number, page: number): Promise<GetWords[]> {
        let extraWordsToConcat: GetWords[] = [];
        if (this.game.wordsToPlay.length < 40) {
            const extraWords = await getWordsResult(lvl + 1, page);
            extraWordsToConcat = await this.filterEasyWords(extraWords);
        }
        return extraWordsToConcat;
    }

    getWord(index: number): string[] {
        this.game.isWordCorrect = Math.random() < 0.6;
        const word = this.game.wordsToPlay[index].word;
        let translate = '';

        if (this.game.isWordCorrect) {
            translate = this.game.wordsToPlay[index].wordTranslate;
        } else {
            let randomIndex = Math.floor(Math.random() * this.game.wordsToPlay.length);
            if (index === randomIndex) {
                randomIndex = Math.floor(Math.random() * this.game.wordsToPlay.length);
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
