import { removeUserWord } from '../wordList/UserWordsRequest';

export const removeCardsFromEasyHard = function () {
    const wordsCards = document.querySelectorAll('.words__card');

    wordsCards.forEach((el) => {
        el.addEventListener('click', (e) => {
            const buttons = document.querySelectorAll('.word__btns-remove');
            buttons.forEach((elem) => {
                if (e.target === elem) {
                    removeUserWord(el.id);
                    el.classList.add('words__card--disabled');
                }
            });
        });
    });
};
