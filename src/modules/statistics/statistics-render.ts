/* eslint-disable prettier/prettier */
import { BarData, LineData, LongtermStatistics, Statistics } from '../types/types';
import { getUserStatistics, updateUserStatistics } from './statistics-request';
import { Chart, ChartItem, registerables } from 'chart.js';
import { drawBarChart, drawLineChart } from './charts';
Chart.register(...registerables);

export class StatisticsRender {
    statisticsNavBtn: HTMLElement | null;

    newWords: HTMLElement | null;
    learnedWords: HTMLElement | null;
    answersPercent: HTMLElement | null;

    sprintWords: HTMLElement | null;
    sprintPercent: HTMLElement | null;
    sprintSeries: HTMLElement | null;

    audiocallWords: HTMLElement | null;
    audiocallPercent: HTMLElement | null;
    audiocallSeries: HTMLElement | null;

    longtermContainer: HTMLElement | null;

    constructor() {
        this.statisticsNavBtn = document.getElementById('stats-btn');

        this.newWords = document.getElementById('new-words');
        this.learnedWords = document.getElementById('learned-words');
        this.answersPercent = document.getElementById('answers-percent');

        this.sprintWords = document.getElementById('sprint-new-words');
        this.sprintPercent = document.getElementById('sprint-answers-percent');
        this.sprintSeries = document.getElementById('sprint-series');

        this.audiocallWords = document.getElementById('audiocall-new-words');
        this.audiocallPercent = document.getElementById('audiocall-answers-percent');
        this.audiocallSeries = document.getElementById('audiocall-series');

        this.longtermContainer = document.querySelector('.longterm__wrapper');
    }

    init() {
        if (this.statisticsNavBtn) {
            this.statisticsNavBtn.addEventListener('click', () => this.updatePage());
        }
    }

    checkIfToday(statisticsObject: Statistics) {
        const statisticsDate = new Date(Date.parse(String(statisticsObject.optional.today.date)));
        const now = new Date();
        if (statisticsDate.setHours(0, 0, 0, 0) !== now.setHours(0, 0, 0, 0)) {
            this.updateLongtermStatistics(statisticsObject);
        } else {
            this.formDataForLongtermStats(statisticsObject);
        }
    }

    updateLongtermStatistics(statisticsObject: Statistics) {
        const lastDay: LongtermStatistics = {
            date: statisticsObject.optional.today.date,
            newWords: statisticsObject.optional.today.newWords,
            learnedWords: statisticsObject.learnedWords,
        };
        const longtermStatistics = JSON.parse(statisticsObject.optional.longterm);
        longtermStatistics.push(lastDay);
        const updatedStatObject: Statistics = {
            learnedWords: 0,
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
                longterm: JSON.stringify(longtermStatistics),
            },
        };
        updateUserStatistics(updatedStatObject);
        this.formDataForLongtermStats(updatedStatObject);
    }

    async updatePage() {
        const statisticsObject: Statistics = await getUserStatistics();
        let percent: number;
        if (statisticsObject.optional.today.audiocallPercent === 0) {
            percent = statisticsObject.optional.today.sprintPercent;
        } else if (statisticsObject.optional.today.sprintPercent === 0) {
            percent = statisticsObject.optional.today.audiocallPercent;
        } else {
            percent = Math.round(
                (statisticsObject.optional.today.audiocallPercent + statisticsObject.optional.today.sprintPercent) / 2
            );
        }
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
            this.sprintSeries.innerHTML = String(statisticsObject.optional.today.sprintSeries);

            this.audiocallWords.innerHTML = String(statisticsObject.optional.today.audiocallWords);
            this.audiocallPercent.innerHTML = String(statisticsObject.optional.today.audiocallPercent);
            this.audiocallSeries.innerHTML = String(statisticsObject.optional.today.audiocallSeries);
        }
    }

    formDataForLongtermStats(statisticsObject: Statistics) {
        const data: LongtermStatistics[] = JSON.parse(statisticsObject.optional.longterm);
        const dataForBar: BarData[] = [];
        const dataForLine: LineData[] = [];
        if (data.length !== 1 && Object.keys(data[0]).length !== 0) {
            data.forEach((day) => {
                const dayDataBar: BarData = {
                    date: this.dateFormater(new Date(Date.parse(String(day.date)))),
                    learnedWords: day.learnedWords,
                };
                const dayDataLine: LineData = {
                    date: this.dateFormater(new Date(Date.parse(String(day.date)))),
                    newWords: day.newWords,
                };
                dataForBar.push(dayDataBar);
                dataForLine.push(dayDataLine);
            });
        }

        const todayForBar: BarData = {
            date: this.dateFormater(new Date(Date.parse(String(statisticsObject.optional.today.date)))),
            learnedWords: statisticsObject.learnedWords,
        };
        const todayForLine: LineData = {
            date: this.dateFormater(new Date(Date.parse(String(statisticsObject.optional.today.date)))),
            newWords: statisticsObject.optional.today.newWords,
        }
        dataForBar.push(todayForBar);
        dataForLine.push(todayForLine);

        if (this.longtermContainer) {
            this.longtermContainer.innerHTML = '';
            this.longtermContainer.classList.remove('hidden');
            this.drawBar(dataForBar);
            this.drawLine(dataForLine);
        }
    }

    dateFormater(date: Date): string {
        const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
        let day = String(date.getDate());
        if (Number(day) < 10) {
            day = '0' + String(day);
        }

        const month = date.getMonth();
        const monthString = months[month];

        return day + ' ' + monthString;
    }

    drawBar(dataForBar: BarData[]) {
        const labelsForData: string[] = [];
        const dataValues: number[] = [];

        dataForBar.forEach((day) => {
            labelsForData.push(day.date);
            dataValues.push(day.learnedWords);
        })

        const text = document.createElement('p');
        text.innerHTML = 'Количество изученных слов за весь период обучения';
        this.longtermContainer?.appendChild(text);
        const canvas = document.createElement('canvas');
        this.longtermContainer?.appendChild(canvas);
        const canvasContex = canvas.getContext('2d');


        drawBarChart(canvasContex as ChartItem, labelsForData, dataValues);
    }

    drawLine(dataForBar: LineData[]) {
        const labelsForData: string[] = [];
        const dataValues: number[] = [];

        dataForBar.forEach((day) => {
            labelsForData.push(day.date);
            dataValues.push(day.newWords);
        })

        const text = document.createElement('p');
        text.innerHTML = 'Количество новых слов за весь период обучения';
        this.longtermContainer?.appendChild(text);
        const canvas = document.createElement('canvas');
        this.longtermContainer?.appendChild(canvas);
        const canvasContex = canvas.getContext('2d');

        drawLineChart(canvasContex as ChartItem, labelsForData, dataValues);
    }
}
