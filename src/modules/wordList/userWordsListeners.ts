import { updateStatisticsField } from '../statistics/statistics-request';
import { nullGames } from './checkUserWords';
import { getUserWord, removeUserWord, sendUserWord, updateUserWord } from './UserWordsRequest';
import { GetUserCards } from '../types/types';
import { getCards } from './userCards';

export const sendWordsListener = (e: MouseEvent) => {
    const hardBtns = Array.from(document.querySelectorAll('.word__btns--hard'));
    const learnedBtns = Array.from(document.querySelectorAll('.word__btns--learned'));
    const buttons = [...hardBtns, ...learnedBtns];
    const textbook = document.querySelector('.textbook__words');

    buttons.forEach(async (el) => {
        if (
            e.target === el &&
            !el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--hard') &&
            !el.parentNode?.children[0].classList.contains('word__btns--checked')
        ) {
            const userWords: GetUserCards[] = await getCards.getUserCards();
            if (!userWords.filter((word) => word.wordId === (el.getAttribute('data-id') as string)).length) {
                sendUserWord(
                    {
                        difficulty: 'hard',
                        optional: {
                            sprintRight: 0,
                            sprintTries: 0,
                            audiocallRight: 0,
                            audiocallTries: 0,
                            mistakeAt: 0,
                        },
                    },
                    el.getAttribute('data-id') as string
                );
            } else {
                const word: GetUserCards = await getUserWord(el.getAttribute('data-id') as string);
                updateUserWord(
                    {
                        difficulty: 'hard',
                        optional: {
                            sprintRight: word.optional.sprintRight,
                            sprintTries: word.optional.sprintTries,
                            audiocallRight: word.optional.audiocallRight,
                            audiocallTries: word.optional.audiocallTries,
                            mistakeAt: word.optional.sprintTries + word.optional.audiocallTries - 1,
                        },
                    },
                    el.getAttribute('data-id') as string
                );
            }
            el.classList.add('word__btns--checked');
            el.parentElement?.parentElement?.parentElement?.classList.add('active');
        } else if (
            e.target === el &&
            el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--hard') &&
            !el.parentNode?.children[0].classList.contains('word__btns--checked')
        ) {
            removeUserWord(el.getAttribute('data-id') as string);
            el.classList.remove('word__btns--checked');
            el.parentElement?.parentElement?.parentElement?.classList.remove('active');
            nullGames(el.getAttribute('data-id') as string);
        } else if (
            e.target === el &&
            !el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--hard') &&
            el.parentNode?.children[0].classList.contains('word__btns--checked')
        ) {
            updateUserWord(
                {
                    difficulty: 'hard',
                    optional: { sprintRight: 0, sprintTries: 0, audiocallRight: 0, audiocallTries: 0, mistakeAt: 0 },
                },
                el.getAttribute('data-id') as string
            );
            el.classList.add('word__btns--checked');
            el.parentNode?.children[0].classList.remove('word__btns--checked');
            await updateStatisticsField('removeLearned');
        }

        if (
            e.target === el &&
            !el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--learned') &&
            !el.parentNode?.children[1].classList.contains('word__btns--checked')
        ) {
            const userWords: GetUserCards[] = await getCards.getUserCards();
            if (!userWords.filter((word) => word.wordId === (el.getAttribute('data-id') as string)).length) {
                sendUserWord(
                    {
                        difficulty: 'easy',
                        optional: {
                            sprintRight: 0,
                            sprintTries: 0,
                            audiocallRight: 0,
                            audiocallTries: 0,
                            mistakeAt: 0,
                        },
                    },
                    el.getAttribute('data-id') as string
                );
            } else {
                const word: GetUserCards = await getUserWord(el.getAttribute('data-id') as string);
                updateUserWord(
                    {
                        difficulty: 'easy',
                        optional: {
                            sprintRight: word.optional.sprintRight,
                            sprintTries: word.optional.sprintTries,
                            audiocallRight: word.optional.audiocallRight,
                            audiocallTries: word.optional.audiocallTries,
                            mistakeAt: word.optional.sprintTries + word.optional.audiocallTries - 1,
                        },
                    },
                    el.getAttribute('data-id') as string
                );
            }

            el.classList.add('word__btns--checked');
            el.parentElement?.parentElement?.parentElement?.classList.add('active');
            await updateStatisticsField('addLearned');
        } else if (
            e.target === el &&
            el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--learned') &&
            !el.parentNode?.children[1].classList.contains('word__btns--checked')
        ) {
            removeUserWord(el.getAttribute('data-id') as string);
            el.classList.remove('word__btns--checked');
            el.parentElement?.parentElement?.parentElement?.classList.remove('active');
            nullGames(el.getAttribute('data-id') as string);
            await updateStatisticsField('removeLearned');
        } else if (
            e.target === el &&
            !el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--learned') &&
            el.parentNode?.children[1].classList.contains('word__btns--checked')
        ) {
            updateUserWord(
                {
                    difficulty: 'easy',
                    optional: { sprintRight: 0, sprintTries: 0, audiocallRight: 0, audiocallTries: 0, mistakeAt: -1 },
                },
                el.getAttribute('data-id') as string
            );
            el.classList.add('word__btns--checked');
            el.parentNode?.children[1].classList.remove('word__btns--checked');
            await updateStatisticsField('addLearned');
        }

        const hardButtonsChecked = hardBtns.filter((el) => el.classList.contains('word__btns--checked'));
        const LearnedButtonsChecked = learnedBtns.filter((el) => el.classList.contains('word__btns--checked'));
        const gameSection = document.querySelector<HTMLElement>('.textbook__games');
        const paginationBtn = document.querySelector<HTMLElement>('.page-count-btn');

        if (hardButtonsChecked.length + LearnedButtonsChecked.length === 20 && LearnedButtonsChecked.length > 0) {
            textbook?.classList.add('textbook-learned');
            paginationBtn?.classList.add('check-count-btn--learned');
        } else {
            textbook?.classList.remove('textbook-learned');
            paginationBtn?.classList.remove('check-count-btn--learned');
        }

        if (LearnedButtonsChecked.length === 20) {
            gameSection?.classList.add('hidden');
        } else {
            gameSection?.classList.remove('hidden');
        }
    });
};
