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
            series: 0,
            correctAnswersSeries: [],
            correctAnswers: [],
            wrongAnswers: [],
            extraWords: [],
            newWords: 0,
            learnedWords: 0,
        };
    }

    async getWordsForLvl(lvl: number) {
        const randomPage = Math.floor(Math.random() * 30);
        const wordsArray = await getWordsResult(lvl, randomPage);
        this.game.extraWords = await getWordsResult(5, randomPage);
        let prevPageWordsArray: GetWords[] = [];

        if (randomPage > 1) {
            prevPageWordsArray = [
                ...(await getWordsResult(lvl, randomPage - 1)),
                ...(await getWordsResult(lvl, randomPage - 2)),
            ];
            this.game.wordsToPlay = [...wordsArray, ...prevPageWordsArray];
        } else if (randomPage === 1) {
            prevPageWordsArray = await getWordsResult(lvl, randomPage - 1);
            this.game.wordsToPlay = [...wordsArray, ...prevPageWordsArray];
        } else if (randomPage === 0) {
            this.game.wordsToPlay = wordsArray;
        }
    }

    async getWordsForTextbook() {
        const lvl = Number(localStorage.getItem('groupCount'));
        const page = Number(localStorage.getItem('pageCount'));
        const wordsArray = await getWordsResult(lvl, page);
        this.game.extraWords = await getWordsResult(lvl === 5 ? lvl - 1 : lvl + 1, page);
        let prevPages: GetWords[] = [];
        if (page > 1) {
            prevPages = [...(await getWordsResult(lvl, page - 1)), ...(await getWordsResult(lvl, page - 1))];
            if (localStorage.getItem('Logged') === 'logged') {
                this.game.wordsToPlay = await this.filterEasyWords([...wordsArray, ...prevPages]);
            } else {
                this.game.wordsToPlay = [...wordsArray, ...prevPages];
            }
        } else if (page === 1) {
            prevPages = await getWordsResult(lvl, page - 1);
            if (localStorage.getItem('Logged') === 'logged') {
                this.game.wordsToPlay = await this.filterEasyWords([...wordsArray, ...prevPages]);
            } else {
                this.game.wordsToPlay = [...wordsArray, ...prevPages];
            }
        } else if (page === 0) {
            if (localStorage.getItem('Logged') === 'logged') {
                this.game.wordsToPlay = await this.filterEasyWords(wordsArray);
            } else {
                this.game.wordsToPlay = wordsArray;
            }
        }
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

    getWord(index: number): string[] {
        this.game.isWordCorrect = Math.random() < 0.6;
        const word = this.game.wordsToPlay[index].word;
        let translate = '';

        if (this.game.isWordCorrect) {
            translate = this.game.wordsToPlay[index].wordTranslate;
        } else {
            const randomIndex = Math.floor(Math.random() * this.game.wordsToPlay.length);
            if (index === randomIndex || this.game.wordsToPlay.length < 5) {
                const random = Math.floor(Math.random() * 20);
                translate = this.game.extraWords[random].wordTranslate;
            } else {
                translate = this.game.wordsToPlay[randomIndex].wordTranslate;
            }
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
        this.game.series = 0;
        this.game.correctAnswersSeries = [];
        this.game.correctAnswers = [];
        this.game.wrongAnswers = [];
        this.game.extraWords = [];
        this.game.newWords = 0;
        this.game.learnedWords = 0;
    }
}
