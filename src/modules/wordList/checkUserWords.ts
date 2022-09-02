import { GetUserCards } from '../types/types';
import { getCards } from './userCards';

export const checkUserWords = async function () {
    const cardsOnPage = JSON.parse(window.localStorage.getItem('CardsOnPage') as string);
    await getCards
        .getUserCards()
        .then((res) => {
            return cardsOnPage
                .map((el1: string) => {
                    return res.filter((el2: { id: string; difficulty: string; wordId: string }) => el2.wordId === el1);
                })
                .flat();
        })
        .then((res) => {
            const activeBtnsOnPage = document.querySelectorAll<HTMLElement>('.word__btns--checked');
            activeBtnsOnPage.forEach((btn) => btn.classList.remove('word__btns--checked'));

            const hardBtns = Array.from(document.querySelectorAll('.word__btns--hard'));
            const learnedBtns = Array.from(document.querySelectorAll('.word__btns--learned'));
            const textbook = document.querySelector('.textbook__words');
            const activeHardBtns = res
                .map((el1: { id: string; difficulty: string; wordId: string }) => {
                    return hardBtns.filter(
                        (el2: Element) => el2.getAttribute('data-id') === el1.wordId && el1.difficulty === 'hard'
                    );
                })
                .flat();
            activeHardBtns.forEach((el: Element) => el.classList.add('word__btns--checked'));

            const activeEasyBtns = res
                .map((el1: { id: string; difficulty: string; wordId: string }) => {
                    return learnedBtns.filter(
                        (el2: Element) => el2.getAttribute('data-id') === el1.wordId && el1.difficulty === 'easy'
                    );
                })
                .flat();
            activeEasyBtns.forEach((el: Element) => el.classList.add('word__btns--checked'));
            const activeBtns = document.querySelectorAll('.word__btns--checked');
            const activeHardBtnsArray = [];
            activeBtns.forEach((el) => {
                if (el.classList.contains('word__btns--hard')) {
                    activeHardBtnsArray.push(el);
                }
            });
            if (activeBtns.length === 20 && activeHardBtnsArray.length !== 20) {
                textbook?.classList.add('textbook-learned');
            } else {
                textbook?.classList.remove('textbook-learned');
            }

            const gameSection = document.querySelector<HTMLElement>('.textbook__games');
            const activeEasyBtnsArray = [];
            activeBtns.forEach((el) => {
                if (el.classList.contains('word__btns--learned')) {
                    activeEasyBtnsArray.push(el);
                }
            });
            if (activeEasyBtnsArray.length === 20) {
                gameSection?.classList.add('hidden');
            } else if (
                activeEasyBtnsArray.length < 20 &&
                localStorage.getItem('Logged') === 'logged' &&
                Number(localStorage.getItem('groupCount')) !== 6 &&
                !localStorage.getItem('easy')
            ) {
                gameSection?.classList.remove('hidden');
            }
            return res;
        })
        .then((res) => {
            res.forEach((el: GetUserCards) => {
                if (el.optional) {
                    addGamesTries(
                        el.wordId,
                        el.optional.sprintRight as number,
                        el.optional.sprintTries as number,
                        el.optional.audiocallRight as number,
                        el.optional.audiocallTries as number
                    );
                } else addGamesTries(el.wordId, 0, 0, 0, 0);
            });
            const cardsOnPage = document.querySelectorAll('.words__card');
            cardsOnPage.forEach((el) => {
                if (!el.classList.contains('active')) {
                    nullGames(el.id);
                }
            });
        });
};

export const TextbookSwitchListener = function () {
    const textbookButton = document.querySelector('#section-textbook');
    window.addEventListener('click', (e) => {
        if (e.target === textbookButton) {
            checkUserWords();
        }
    });
};

export const addGamesTries = function (
    wordId: string,
    sprintRight: number,
    sprintTries: number,
    audioCallRight: number,
    audiocallTries: number
) {
    const wordCard = document.getElementById(`${wordId}`);
    const wrapper = wordCard?.querySelector('.word__games');

    const wrapperInner = `<h3>Ответы в играх:</h3>
    <p> Спринт: ${sprintRight} из ${sprintTries}</p>
    <p> Аудиовызов:${audioCallRight} из ${audiocallTries} </p>
`;
    (wrapper as HTMLElement).innerHTML = wrapperInner;
    wordCard?.classList.add('active');
};

export const nullGames = function (wordId: string) {
    const wordCard = document.getElementById(`${wordId}`);
    const wrapper = wordCard?.querySelector('.word__games');
    const wrapperInner = `<h3>Ответы в играх:</h3>
    <p> Спринт: 0 из 0 </p>
    <p> Аудиовызов:0 из 0 </p>
`;
    (wrapper as HTMLElement).innerHTML = wrapperInner;
};

export const checkHardWords = async function (difficulty: string) {
    await getCards
        .getUserCards()
        .then((res) => {
            return res.filter((el: GetUserCards) => el.difficulty === difficulty);
        })
        .then((res) => {
            const cardsOnPage = document.querySelectorAll('.easy');
            cardsOnPage.forEach((el) => {
                if (!el.classList.contains('active')) {
                    el.classList.add('active');
                }
            });
            res.forEach((el: GetUserCards) => {
                if (el.optional) {
                    addGamesTries(
                        el.wordId,
                        el.optional.sprintRight,
                        el.optional.sprintTries,
                        el.optional.audiocallRight,
                        el.optional.audiocallTries
                    );
                } else addGamesTries(el.wordId, 0, 0, 0, 0);
            });
        });
};

export const addGamesTriesEasy = function (
    wordId: string,
    sprintRight: number,
    sprintTries: number,
    audioCallRight: number,
    audiocallTries: number
) {
    const wordCard = document.querySelector(`div[data-id="${wordId}"]`);
    wordCard?.classList.remove('active');
    const wrapper = wordCard?.querySelector('.word__games');

    const wrapperInner = `<h3>Ответы в играх:</h3>
    <p> Спринт: ${sprintRight} из ${sprintTries}</p>
    <p> Аудиовызов:${audioCallRight} из ${audiocallTries} </p>
`;
    (wrapper as HTMLElement).innerHTML = wrapperInner;
};

export const checkEasyWords = async function () {
    await getCards
        .getUserCards()
        .then((res) => {
            return res.filter((el: GetUserCards) => el.difficulty === 'easy');
        })
        .then((res) => {
            res.forEach((el: GetUserCards) => {
                if (el.optional) {
                    addGamesTriesEasy(
                        el.wordId,
                        el.optional.sprintRight,
                        el.optional.sprintTries,
                        el.optional.audiocallRight,
                        el.optional.audiocallTries
                    );
                } else addGamesTriesEasy(el.wordId, 0, 0, 0, 0);
            });
        });
};
