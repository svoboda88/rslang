import { Statistics, StatisticsOptional } from '../types/types';

export const createUserStatistics = async function () {
    const token = JSON.parse(window.localStorage.getItem('UserToken') as string).token;
    const userId = JSON.parse(window.localStorage.getItem('UserToken') as string).userId;
    const data: Statistics = {
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
            longterm: JSON.stringify([{}]),
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
    if (token && userId) {
        const response = await fetch(`https://react-learnwords-english.herokuapp.com/users/${userId}/statistics`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
            },
        });
        if (response.ok) {
            const content = await response.json();
            return content;
        } else {
            return undefined;
        }
    }
};

export const updateStatisticsField = async function (field: 'addLearned' | 'removeLearned') {
    const userStats: Statistics = await getUserStatistics();
    switch (field) {
        case 'addLearned':
            updateUserStatistics({
                learnedWords: userStats.learnedWords + 1,
                optional: {
                    today: {
                        date: userStats.optional.today.date,
                        newWords: userStats.optional.today.newWords,
                        sprintWords: userStats.optional.today.sprintWords,
                        sprintPercent: userStats.optional.today.sprintPercent,
                        sprintSeries: userStats.optional.today.sprintSeries,
                        audiocallWords: userStats.optional.today.audiocallWords,
                        audiocallPercent: userStats.optional.today.audiocallPercent,
                        audiocallSeries: userStats.optional.today.audiocallSeries,
                    },
                    longterm: userStats.optional.longterm,
                },
            });
            break;
        case 'removeLearned':
            if (userStats.learnedWords !== 0) {
                updateUserStatistics({
                    learnedWords: userStats.learnedWords - 1,
                    optional: {
                        today: {
                            date: userStats.optional.today.date,
                            newWords: userStats.optional.today.newWords,
                            sprintWords: userStats.optional.today.sprintWords,
                            sprintPercent: userStats.optional.today.sprintPercent,
                            sprintSeries: userStats.optional.today.sprintSeries,
                            audiocallWords: userStats.optional.today.audiocallWords,
                            audiocallPercent: userStats.optional.today.audiocallPercent,
                            audiocallSeries: userStats.optional.today.audiocallSeries,
                        },
                        longterm: userStats.optional.longterm,
                    },
                });
            }
            break;
    }
};
