import { GetWords } from '../textbook/request';

interface Storage {
    groupCount: number;
    pageCount: number;
    groupCountAudiocall: number;
    wordVariants: GetWords[];
    wordIndex: number;
    correctAnswers: Answers[];
    wrongAnswers: Answers[];
}

interface Answers {
    audio: string;
    word: string;
    translate: string;
}

export const storage: Storage = {
    groupCount: 0,
    pageCount: 0,
    groupCountAudiocall: 0,
    wordVariants: [],
    wordIndex: 0,
    correctAnswers: [],
    wrongAnswers: [],
};
