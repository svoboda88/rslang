export interface GetWords {
    id: 'string';
    group: 0;
    page: 0;
    word: 'string';
    image: 'string';
    audio: 'string';
    audioMeaning: 'string';
    audioExample: 'string';
    textMeaning: 'string';
    textExample: 'string';
    transcription: 'string';
    wordTranslate: 'string';
    textMeaningTranslate: 'string';
    textExampleTranslate: 'string';
}

export interface Answers {
    audio: string;
    word: string;
    translate: string;
}

export interface GetUserCards {
    difficulty: string;
    optional: Optional;
    id: string;
    wordId: string;
}

export interface Game {
    wordsToPlay: GetWords[];
    isWordCorrect: boolean;
    wordIndex: number;
    wordPrice: number;
    resultCount: number;
    correctAnswers: GetWords[];
    wrongAnswers: GetWords[];
}

export interface Optional {
    sprintRight: number;
    sprintTries: number;
    audiocallRight: number;
    audiocallTries: number;
}
