import { removeUserWord, sendUserWord, updateUserWord } from './UserWordsRequest';

export const sendWordsListener = (e: MouseEvent) => {
    const hardBtns = Array.from(document.querySelectorAll('.word__btns--hard'));
    const learnedBtns = Array.from(document.querySelectorAll('.word__btns--learned'));
    const buttons = [...hardBtns, ...learnedBtns];
    const textbook = document.querySelector('.textbook__words');

    buttons.forEach((el) => {
        if (
            e.target === el &&
            !el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--hard') &&
            !el.parentNode?.children[0].classList.contains('word__btns--checked')
        ) {
            sendUserWord({ difficulty: 'hard' }, el.getAttribute('data-id') as string);
            el.classList.add('word__btns--checked');
        } else if (
            e.target === el &&
            el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--hard') &&
            !el.parentNode?.children[0].classList.contains('word__btns--checked')
        ) {
            removeUserWord(el.getAttribute('data-id') as string);
            el.classList.remove('word__btns--checked');
        } else if (
            e.target === el &&
            !el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--hard') &&
            el.parentNode?.children[0].classList.contains('word__btns--checked')
        ) {
            updateUserWord({ difficulty: 'hard' }, el.getAttribute('data-id') as string);
            el.classList.add('word__btns--checked');
            el.parentNode?.children[0].classList.remove('word__btns--checked');
        }

        if (
            e.target === el &&
            !el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--learned') &&
            !el.parentNode?.children[1].classList.contains('word__btns--checked')
        ) {
            sendUserWord({ difficulty: 'easy' }, el.getAttribute('data-id') as string);
            el.classList.add('word__btns--checked');
        } else if (
            e.target === el &&
            el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--learned') &&
            !el.parentNode?.children[1].classList.contains('word__btns--checked')
        ) {
            removeUserWord(el.getAttribute('data-id') as string);
            el.classList.remove('word__btns--checked');
        } else if (
            e.target === el &&
            !el.classList.contains('word__btns--checked') &&
            el.classList.contains('word__btns--learned') &&
            el.parentNode?.children[1].classList.contains('word__btns--checked')
        ) {
            updateUserWord({ difficulty: 'easy' }, el.getAttribute('data-id') as string);
            el.classList.add('word__btns--checked');
            el.parentNode?.children[1].classList.remove('word__btns--checked');
        }

        const hardButtonsChecked = hardBtns.filter((el) => el.classList.contains('word__btns--checked'));
        const LearnedButtonsChecked = learnedBtns.filter((el) => el.classList.contains('word__btns--checked'));
        if (hardButtonsChecked.length + LearnedButtonsChecked.length === 20 && LearnedButtonsChecked.length > 0) {
            textbook?.classList.add('textbook-learned');
        } else textbook?.classList.remove('textbook-learned');
    });
};
