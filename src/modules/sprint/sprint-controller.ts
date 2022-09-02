import { SprintModel } from './sprint-model';
import { SprintView } from './sprint-view';
import { getCards } from '../wordList/userCards';
import { GetUserCards, GetWords } from '../types/types';
import { sendUserWord, updateUserWord } from '../wordList/UserWordsRequest';
import { checkUserWords } from '../wordList/checkUserWords';

export class SprintController {
    model: SprintModel;
    view: SprintView;

    constructor(model: SprintModel, view: SprintView) {
        this.model = model;
        this.view = view;
    }

    init() {
        this.view.listenStartFromMain();
        this.view.listenStartFromTextbook(this);
        this.view.listenCloseGame(this);
        this.view.listenLvlBtns(this);
        this.view.listenAnswerBtns(this);
        this.view.listenPlayAgain(this);
        this.view.listenTryAgain(this);
    }

    async startGame(lvl: number) {
        this.view.showCountdown();
        setTimeout(this.view.renderGame, 5000, this.view);
        setTimeout(this.view.startTimer, 5000, this, this.view);
        setTimeout(this.view.listenKeyboard, 5000, this);
        await this.model.getWordsForLvl(lvl);
        this.view.renderWord(this.model.getWord(0));
    }

    async startGameTextbook() {
        this.view.showCountdown();
        setTimeout(this.view.renderGame, 5000, this.view);
        setTimeout(this.view.startTimer, 5000, this, this.view);
        setTimeout(this.view.listenKeyboard, 5000, this);
        await this.model.getWordsForTextbook();
        this.view.renderWord(this.model.getWord(0));
    }

    checkIfRight() {
        if (this.model.game.isWordCorrect) {
            this.model.game.resultCount += this.model.game.wordPrice;
            this.model.updateWordPrice(this.view.dotsCount);
            this.model.writeAnswer(this.model.game.wordIndex, 'correct');
            this.model.game.series += 1;

            this.view.updateResultContainer(this.model.game.resultCount);
            this.view.updateWordPriceContainer(this.model.game.wordPrice);
            this.view.updateDotsCount('correct');
            this.view.playAudio('correct');
        } else {
            this.model.writeAnswer(this.model.game.wordIndex, 'error');
            this.model.game.wordPrice = 10;
            if (this.model.game.series !== 0) {
                this.model.game.correctAnswersSeries.push(this.model.game.series);
            }
            this.model.game.series = 0;

            this.view.updateDotsCount('error');
            this.view.updateWordPriceContainer(10);
            this.view.playAudio('wrong');
        }

        this.model.game.wordIndex++;
        if (this.model.game.wordIndex === this.model.game.wordsToPlay.length) {
            this.showResult();
        } else {
            this.view.renderWord(this.model.getWord(this.model.game.wordIndex));
        }
    }

    checkIfWrong() {
        if (!this.model.game.isWordCorrect) {
            this.model.game.resultCount += this.model.game.wordPrice;
            this.model.updateWordPrice(this.view.dotsCount);
            this.model.writeAnswer(this.model.game.wordIndex, 'correct');
            this.model.game.series += 1;

            this.view.updateResultContainer(this.model.game.resultCount);
            this.view.updateWordPriceContainer(this.model.game.wordPrice);
            this.view.updateDotsCount('correct');
            this.view.playAudio('correct');
        } else {
            this.model.writeAnswer(this.model.game.wordIndex, 'error');
            this.model.game.wordPrice = 10;
            if (this.model.game.series !== 0) {
                this.model.game.correctAnswersSeries.push(this.model.game.series);
            }
            this.model.game.series = 0;

            this.view.updateDotsCount('error');
            this.view.updateWordPriceContainer(10);
            this.view.playAudio('wrong');
        }

        this.model.game.wordIndex++;
        if (this.model.game.wordIndex === this.model.game.wordsToPlay.length) {
            this.showResult();
        } else {
            this.view.renderWord(this.model.getWord(this.model.game.wordIndex));
        }
    }

    showResult() {
        this.view.showResult(this.model.game.correctAnswers, this.model.game.wrongAnswers);
        this.sendResults();
    }

    sendResults() {
        getCards
            .getUserCards()
            .then((res: GetUserCards[]) => {
                this.model.game.correctAnswers.forEach((answer: GetWords) => {
                    if (res.filter((word: GetUserCards) => word.wordId === answer.id).length) {
                        const word = res.filter((word: GetUserCards) => word.wordId === answer.id)[0];
                        updateUserWord(
                            {
                                difficulty: 'easy',
                                optional: {
                                    sprintTries: word.optional.sprintTries + 1,
                                    sprintRight: word.optional.sprintRight + 1,
                                    audiocallRight: word.optional.audiocallRight,
                                    audiocallTries: word.optional.audiocallTries,
                                },
                            },
                            answer.id
                        );
                    } else {
                        sendUserWord(
                            {
                                difficulty: 'easy',
                                optional: {
                                    sprintTries: 1,
                                    sprintRight: 1,
                                    audiocallRight: 0,
                                    audiocallTries: 0,
                                },
                            },
                            answer.id
                        );
                    }
                });
                this.model.game.wrongAnswers.forEach((answer: GetWords) => {
                    if (res.filter((word: GetUserCards) => word.wordId === answer.id).length) {
                        const word = res.filter((word: GetUserCards) => word.wordId === answer.id)[0];
                        updateUserWord(
                            {
                                difficulty: 'hard',
                                optional: {
                                    sprintRight: word.optional.sprintRight,
                                    sprintTries: word.optional.sprintTries + 1,
                                    audiocallRight: word.optional.audiocallRight,
                                    audiocallTries: word.optional.audiocallTries,
                                },
                            },
                            answer.id
                        );
                    } else {
                        sendUserWord(
                            {
                                difficulty: 'hard',
                                optional: { sprintRight: 0, sprintTries: 1, audiocallRight: 0, audiocallTries: 0 },
                            },
                            answer.id
                        );
                    }
                });
            })
            .then(() => {
                const closeBtn = document.querySelector<HTMLElement>('.sprint__close-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', checkUserWords);
                }
            });
    }

    endGame() {
        this.model.toInitState();
        this.view.closeGame();
    }

    restartGame() {
        this.model.toInitState();
        this.view.restartGame();
        setTimeout(this.view.listenKeyboard, 3000, this);
    }
}
