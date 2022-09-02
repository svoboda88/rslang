import { Statistics, StatisticsOptional } from '../types/types';

export const createUserStatistics = async function () {
    const token = JSON.parse(window.localStorage.getItem('UserToken') as string).token;
    const userId = JSON.parse(window.localStorage.getItem('UserToken') as string).userId;
    const data: Statistics = {
        learnedWords: 0,
        optional: {
            today: {
                date: new Date('Fri Sep 01 2022 21:03:15 GMT+0300 (Moscow Standard Time)'),
                newWords: 0,
                sprintWords: 0,
                sprintPercent: 0,
                sprintSeries: 0,
                audiocallWords: 0,
                audiocallPercent: 0,
                audiocallSeries: 0,
            },
            longterm: {
                newWords: [],
                learnedWords: [],
            },
        },
    };
    const response = await fetch(`https://react-learnwords-english.herokuapp.com/users/${userId}/statistics`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const content = await response.json();
    return content;
};

export const updateUserStatistics = async function (data: { learnedWords: number; optional: StatisticsOptional }) {
    const token = JSON.parse(window.localStorage.getItem('UserToken') as string).token;
    const userId = JSON.parse(window.localStorage.getItem('UserToken') as string).userId;
    const response = await fetch(`https://react-learnwords-english.herokuapp.com/users/${userId}/statistics`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const content = await response.json();
    return content;
};

export const getUserStatistics = async function () {
    const token = JSON.parse(window.localStorage.getItem('UserToken') as string).token;
    const userId = JSON.parse(window.localStorage.getItem('UserToken') as string).userId;
    const response = await fetch(`https://react-learnwords-english.herokuapp.com/users/${userId}/statistics`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
        },
    });
    if (response.ok) {
        const content = await response.json();
        console.log(content);
        return content;
    } else {
        return undefined;
    }
};
