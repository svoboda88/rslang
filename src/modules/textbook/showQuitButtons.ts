import { removeUserWord } from '../wordList/UserWordsRequest';

export const disableButtons = function () {
    const learnedButtons = document.querySelectorAll('.word__btns--learned');
    const hardButtons = document.querySelectorAll('.word__btns--hard');
    learnedButtons.forEach((el) => el.classList.add('button-disabled'));
    hardButtons.forEach((el) => el.classList.add('button-disabled'));

    const wordsButtons = document.querySelectorAll('.word__btns');
    const removeButton = `<button class="word__btns-remove"> Восстановить <button>`;
    wordsButtons.forEach((el) => (el.innerHTML = removeButton));

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
