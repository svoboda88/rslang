import { GetWords } from '../textbook/request';

export interface Game {
    wordsToPlay: GetWords[] | [];
    isWordCorrect: boolean;
    wordIndex: number;
    wordPrice: number;
    correctAnswerCount: number;
    resultCount: number;
}
