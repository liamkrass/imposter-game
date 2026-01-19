const wordList = [
    { category: 'Animals', words: ['Lion', 'Elephant', 'Giraffe', 'Penguin', 'Shark', 'Eagle', 'Dolphin'] },
    { category: 'Food', words: ['Pizza', 'Sushi', 'Burger', 'Tacos', 'Pasta', 'Ice Cream', 'Salad'] },
    { category: 'Jobs', words: ['Doctor', 'Teacher', 'Pilot', 'Artist', 'Chef', 'Firefighter', 'Programmer'] },
    { category: 'Objects', words: ['Chair', 'Laptop', 'Bicycle', 'Camera', 'Guitar', 'Clock', 'Umbrella'] },
];

function getRandomWord() {
    const categoryObj = wordList[Math.floor(Math.random() * wordList.length)];
    const word = categoryObj.words[Math.floor(Math.random() * categoryObj.words.length)];
    return { word, category: categoryObj.category };
}

module.exports = { getRandomWord };
