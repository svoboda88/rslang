import { GetWords } from './requestWords';

export default function cardWord(result: GetWords[]) {
    let card = '';
    result.forEach((item, i) => {
        card += `
            <div class="words__card">
                <img class="word__img" src="https://react-learnwords-english.herokuapp.com/${item.image}" alt="word image">
                <div class="word__card--right">
                    <h2 class="word__title">${item.word} ${item.transcription}
                        <span class="material-symbols-outlined" data-volume=${i}>
                            volume_up
                        </span>
                    </h2>
                    <div class="words__audio" data-audio=${i}>
                        <audio src="https://react-learnwords-english.herokuapp.com/${item.audio}"></audio>
                        <audio src="https://react-learnwords-english.herokuapp.com/${item.audioMeaning}"></audio>
                        <audio src="https://react-learnwords-english.herokuapp.com/${item.audioExample}"></audio>
                    </div>
                    <p class="word__translate">${item.wordTranslate}</p>
                    <br>
                    <p>${item.textMeaning}</p>
                    <p class="word__translate">${item.textMeaningTranslate}</p>
                    <br>
                    <p>${item.textExample}</p>
                    <p class="word__translate">${item.textExampleTranslate}</p>
                </div>
            </div>
        `;
    });

    return card;
}
