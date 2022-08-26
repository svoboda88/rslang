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
        this.view.listenCloseGame(this);
        this.view.listenAnswerBtns(this);
        this.view.listenLvlBtns(this);
    }

    async startGame(lvl: number) {
        this.view.showCountdown();
        setTimeout(this.view.renderGame, 3000);
        await this.model.getWordsForLvl(lvl);
        this.view.renderWord(this.model.getWord(0));
    }

    checkIfRight() {
        if (this.model.game.isWordCorrect) {
            this.model.game.resultCount += this.model.game.wordPrice;
            this.view.updateResultContainer(this.model.game.resultCount);
            this.model.game.correctAnswerCount += 1;
            this.model.updateWordPrice();
            this.view.updateWordPriceContainer(this.model.game.wordPrice);
        } else {
            console.log('Это неверно!');
        }
        this.model.game.wordIndex++;
        this.view.renderWord(this.model.getWord(this.model.game.wordIndex));
    }

    checkIfWrong() {
        if (!this.model.game.isWordCorrect) {
            this.model.game.resultCount += this.model.game.wordPrice;
            this.view.updateResultContainer(this.model.game.resultCount);
            this.model.game.correctAnswerCount += 1;
            this.model.updateWordPrice();
            this.view.updateWordPriceContainer(this.model.game.wordPrice);
        } else {
            console.log('Это было верно!');
        }
        this.model.game.wordIndex++;
        this.view.renderWord(this.model.getWord(this.model.game.wordIndex));
    }

    endGame() {
        this.model.toInitState();
    }
}
