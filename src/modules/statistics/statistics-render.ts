import { GetUserCards, Statistics } from '../types/types';
import { getCards } from '../wordList/userCards';
import { getUserStatistics, updateUserStatistics } from './statistics-request';

export class StatisticsRender {
    newWords: HTMLElement | null;
    learnedWords: HTMLElement | null;
    answersPercent: HTMLElement | null;

    sprintWords: HTMLElement | null;
    sprintPercent: HTMLElement | null;
    sprintSeries: HTMLElement | null;

    audiocallWords: HTMLElement | null;
    audiocallPercent: HTMLElement | null;
    audiocallSeries: HTMLElement | null;

    constructor() {
        this.newWords = document.getElementById('new-words');
        this.learnedWords = document.getElementById('learned-words');
        this.answersPercent = document.getElementById('answers-percent');

        this.sprintWords = document.getElementById('sprint-new-words');
        this.sprintPercent = document.getElementById('sprint-answers-percent');
        this.sprintSeries = document.getElementById('sprint-series');

        this.audiocallWords = document.getElementById('audiocall-new-words');
        this.audiocallPercent = document.getElementById('audiocall-answers-percent');
        this.audiocallSeries = document.getElementById('audiocall-series');
    }

    init() {
        console.log('init');
    }

    checkIfToday(statisticsObject: Statistics) {
        const statisticsDate = new Date(Date.parse(String(statisticsObject.optional.today.date)));
        const now = new Date();
        let userLearnedWords: GetUserCards[] = [];
        if (statisticsDate.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0)) {
            console.log('статистика актуальна на сегодняшний день');
        } else {
            console.log('нужно обнулить статистику');
            getCards
                .getUserCards()
                .then((res) => {
                    userLearnedWords = res.filter((word: GetUserCards) => word.difficulty === 'easy');
                })
                .then(() => {
                    updateUserStatistics({
                        learnedWords: userLearnedWords.length,
                        optional: {
                            today: {
                                date: new Date(),
                                newWords: 0,
                                sprintWords: 0,
                                sprintPercent: 0,
                                sprintSeries: 0,
                                audiocallWords: 0,
                                audiocallPercent: 0,
                                audiocallSeries: 0,
                            },
                            // need to push today.newWords & today.learnedWords
                            longterm: {
                                newWords: [],
                                learnedWords: [],
                            },
                        },
                    });
                });
        }
    }

    async updatePage() {
        const statisticsObject: Statistics = await getUserStatistics();
        const percent = Math.round(
            (statisticsObject.optional.today.audiocallPercent + statisticsObject.optional.today.sprintPercent) / 2
        );
        this.checkIfToday(statisticsObject);
        if (
            this.newWords &&
            this.learnedWords &&
            this.answersPercent &&
            this.sprintWords &&
            this.sprintPercent &&
            this.sprintSeries &&
            this.audiocallWords &&
            this.audiocallPercent &&
            this.audiocallSeries
        ) {
            this.newWords.innerHTML = String(statisticsObject.optional.today.newWords);
            this.learnedWords.innerHTML = String(statisticsObject.learnedWords);
            this.answersPercent.innerHTML = String(percent);
            this.sprintWords.innerHTML = String(statisticsObject.optional.today.sprintWords);
            this.sprintPercent.innerHTML = String(statisticsObject.optional.today.sprintPercent);
            this.sprintSeries.innerHTML = String(statisticsObject.optional.today.sprintPercent);

            this.audiocallWords.innerHTML = String(statisticsObject.optional.today.audiocallWords);
            this.audiocallPercent.innerHTML = String(statisticsObject.optional.today.audiocallPercent);
            this.audiocallSeries.innerHTML = String(statisticsObject.optional.today.audiocallSeries);
        }
    }
}
