import { SprintModel } from './sprint-model';
import { SprintView } from './sprint-view';

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
        setTimeout(this.view.renderGame, 3000, this.view);
        setTimeout(this.view.startTimer, 3000, this, this.view);
        setTimeout(this.view.listenKeyboard, 3000, this);
        await this.model.getWordsForLvl(lvl);
        this.view.renderWord(this.model.getWord(0));
    }

    async startGameTextbook() {
        this.view.showCountdown();
        setTimeout(this.view.renderGame, 3000, this.view);
        setTimeout(this.view.startTimer, 3000, this, this.view);
        setTimeout(this.view.listenKeyboard, 3000, this);
        await this.model.getWordsForTextbook();
        this.view.renderWord(this.model.getWord(0));
    }

    checkIfRight() {
        if (this.model.game.isWordCorrect) {
            this.model.game.resultCount += this.model.game.wordPrice;
            this.view.updateResultContainer(this.model.game.resultCount);
            this.model.updateWordPrice(this.view.dotsCount);
            this.view.updateWordPriceContainer(this.model.game.wordPrice);
            this.view.updateDotsCount('correct');
            this.model.writeAnswer(this.model.game.wordIndex, 'correct');
            this.view.playAudio('correct');
        } else {
            this.model.writeAnswer(this.model.game.wordIndex, 'error');
            this.view.updateDotsCount('error');
            this.model.game.wordPrice = 10;
            this.view.updateWordPriceContainer(10);
            this.view.playAudio('wrong');
        }
        this.model.game.wordIndex++;
        if (this.model.game.wordIndex > 39) {
            this.model.game.wordIndex = 0;
        }
        this.view.renderWord(this.model.getWord(this.model.game.wordIndex));
    }

    checkIfWrong() {
        if (!this.model.game.isWordCorrect) {
            this.model.game.resultCount += this.model.game.wordPrice;
            this.view.updateResultContainer(this.model.game.resultCount);
            this.model.updateWordPrice(this.view.dotsCount);
            this.view.updateWordPriceContainer(this.model.game.wordPrice);
            this.view.updateDotsCount('correct');
            this.model.writeAnswer(this.model.game.wordIndex, 'correct');
            this.view.playAudio('correct');
        } else {
            this.model.writeAnswer(this.model.game.wordIndex, 'error');
            this.view.updateDotsCount('error');
            this.model.game.wordPrice = 10;
            this.view.updateWordPriceContainer(10);
            this.view.playAudio('wrong');
        }
        this.model.game.wordIndex++;
        if (this.model.game.wordIndex > 39) {
            this.model.game.wordIndex = 0;
        }
        this.view.renderWord(this.model.getWord(this.model.game.wordIndex));
    }

    showResult() {
        this.view.showResult(this.model.game.correctAnswers, this.model.game.wrongAnswers);
    }

    endGame() {
        this.view.stopTimer();
        this.model.toInitState();
        this.view.closeGame();
    }

    restartGame() {
        this.model.toInitState();
        this.view.restartGame();
        setTimeout(this.view.listenKeyboard, 3000, this);
    }
}
