import { SprintModel } from './sprint-model';
import { SprintView } from './sprint-view';
import { getCards } from '../wordList/userCards';
import { GetUserCards, GetWords } from '../types/types';
import { sendUserWord, updateUserWord } from '../wordList/UserWordsRequest';
import { checkUserWords } from '../wordList/checkUserWords';
import { getUserStatistics, updateUserStatistics } from '../statistics/statistics-request';

export class SprintController {
    model: SprintModel;
    view: SprintView;

    constructor(model: SprintModel, view: SprintView) {
        this.model = model;
        this.view = view;
    }

    init() {
        this.view.listenStartFromMain();
        this.view.listenStartFromTextbook();
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
                this.model.game.correctAnswers.forEach(async (answer: GetWords) => {
                    if (res.filter((word: GetUserCards) => word.wordId === answer.id).length) {
                        const word = res.filter((word: GetUserCards) => word.wordId === answer.id)[0];
                        if (word.difficulty === 'none') {
                            if (word.optional.sprintRight + word.optional.audiocallRight + 1 === 3) {
                                updateUserWord(
                                    {
                                        difficulty: 'easy',
                                        optional: {
                                            sprintTries: word.optional.sprintTries + 1,
                                            sprintRight: word.optional.sprintRight + 1,
                                            audiocallRight: word.optional.audiocallRight,
                                            audiocallTries: word.optional.audiocallTries,
                                            mistakeAt: 0,
                                        },
                                    },
                                    answer.id
                                );
                                this.model.game.learnedWords = this.model.game.learnedWords + 1;
                            } else {
                                updateUserWord(
                                    {
                                        difficulty: 'none',
                                        optional: {
                                            sprintTries: word.optional.sprintTries + 1,
                                            sprintRight: word.optional.sprintRight + 1,
                                            audiocallRight: word.optional.audiocallRight,
                                            audiocallTries: word.optional.audiocallTries,
                                            mistakeAt: 0,
                                        },
                                    },
                                    answer.id
                                );
                            }
                        } else if (word.difficulty === 'hard') {
                            if (
                                (word.optional.mistakeAt || word.optional.mistakeAt === 0) &&
                                word.optional.sprintRight + word.optional.audiocallRight - word.optional.mistakeAt === 3
                            ) {
                                updateUserWord(
                                    {
                                        difficulty: 'easy',
                                        optional: {
                                            sprintTries: word.optional.sprintTries + 1,
                                            sprintRight: word.optional.sprintRight + 1,
                                            audiocallRight: word.optional.audiocallRight,
                                            audiocallTries: word.optional.audiocallTries,
                                            mistakeAt: 0,
                                        },
                                    },
                                    answer.id
                                );
                                this.model.game.learnedWords = this.model.game.learnedWords + 1;
                            } else if (word.optional.mistakeAt || word.optional.mistakeAt === 0) {
                                updateUserWord(
                                    {
                                        difficulty: 'hard',
                                        optional: {
                                            sprintTries: word.optional.sprintTries + 1,
                                            sprintRight: word.optional.sprintRight + 1,
                                            audiocallRight: word.optional.audiocallRight,
                                            audiocallTries: word.optional.audiocallTries,
                                            mistakeAt: word.optional.mistakeAt,
                                        },
                                    },
                                    answer.id
                                );
                            }
                        } else if (word.difficulty === 'easy') {
                            updateUserWord(
                                {
                                    difficulty: 'easy',
                                    optional: {
                                        sprintTries: word.optional.sprintTries + 1,
                                        sprintRight: word.optional.sprintRight + 1,
                                        audiocallRight: word.optional.audiocallRight,
                                        audiocallTries: word.optional.audiocallTries,
                                        mistakeAt: 0,
                                    },
                                },
                                answer.id
                            );
                        }
                    } else {
                        sendUserWord(
                            {
                                difficulty: 'none',
                                optional: {
                                    sprintTries: 1,
                                    sprintRight: 1,
                                    audiocallRight: 0,
                                    audiocallTries: 0,
                                    mistakeAt: 0,
                                },
                            },
                            answer.id
                        );
                        this.model.game.newWords = this.model.game.newWords + 1;
                    }
                });
                this.model.game.wrongAnswers.forEach(async (answer: GetWords) => {
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
                                    mistakeAt: word.optional.sprintTries + word.optional.audiocallTries + 1,
                                },
                            },
                            answer.id
                        );
                    } else {
                        sendUserWord(
                            {
                                difficulty: 'hard',
                                optional: {
                                    sprintRight: 0,
                                    sprintTries: 1,
                                    audiocallRight: 0,
                                    audiocallTries: 0,
                                    mistakeAt: 1,
                                },
                            },
                            answer.id
                        );
                        this.model.game.newWords = this.model.game.newWords + 1;
                    }
                });
                this.sendStatisctics();
            })
            .then(() => {
                const closeBtn = document.querySelector<HTMLElement>('.sprint__close-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', checkUserWords);
                }
            });
    }

    async sendStatisctics() {
        const userStats = await getUserStatistics();
        const percent = Math.round(
            (this.model.game.correctAnswers.length /
                (this.model.game.correctAnswers.length + this.model.game.wrongAnswers.length)) *
            100
        );
        let maxSeries: number;
        if (!this.model.game.correctAnswersSeries.length && this.model.game.series) {
            maxSeries = this.model.game.series;
        } else if (!this.model.game.correctAnswersSeries.length && !this.model.game.series) {
            maxSeries = 0;
        } else {
            maxSeries = Math.max(...this.model.game.correctAnswersSeries);
        }

        updateUserStatistics({
            learnedWords: userStats.learnedWords + this.model.game.learnedWords,
            optional: {
                today: {
                    date: userStats.optional.today.date,
                    newWords: userStats.optional.today.newWords + this.model.game.newWords,
                    sprintWords: userStats.optional.today.sprintWords + this.model.game.newWords,
                    sprintPercent: percent,
                    sprintSeries:
                        userStats.optional.today.sprintSeries < maxSeries
                            ? maxSeries
                            : userStats.optional.today.sprintSeries,
                    audiocallWords: userStats.optional.today.audiocallWords,
                    audiocallPercent: userStats.optional.today.audiocallPercent,
                    audiocallSeries: userStats.optional.today.audiocallSeries,
                },
                longterm: userStats.optional.longterm,
            },
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
