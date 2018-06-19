/**
 * @author Varun Kumar <https://github.com/varunon9>
 * Date: 20th June, 2018
 */

const request = require('request-promise');

// to read input from terminal
const stdin = process.openStdin();

const suggestions = require('./suggestions.json');

const getIntent = (inputChatMessage) => {
	const payload = {
		q: inputChatMessage
	};

	return new Promise((resolve, reject) => {
		request({
			method: 'post',
			uri: 'http://localhost:5000/parse',
			body: payload,
			json: true // Automatically stringifies the body to JSON
		}).then((response) => {
			if (response.intent) {
				resolve(response.intent.name);
			} else {
				reject('Error occured');
			}
		}).catch((err) => {
			console.log('============================================');
			console.log('Error: ', err);
			console.log('============================================');
			reject('Error occured');
		});
	});
}

// min, max both inclusive
const getRandomInt = ((min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
});

const getSuggestion = (intent, number) => {
    const suggestionsArrayLength = suggestions[intent][number].length;
    const randomIndex = getRandomInt(0, suggestionsArrayLength - 1);
    return suggestions[intent][number][randomIndex];
}

const getSuggestionsArray = (intent) => {
	const suggestionsArray = [];
	suggestionsArray.push(getSuggestion(intent, 'first'));
	suggestionsArray.push(getSuggestion(intent, 'second'));
	suggestionsArray.push(getSuggestion(intent, 'third'));
	return suggestionsArray;
}

console.log('Enter a chat message to get suggestions.');
console.log('First message will take time (around 15s)');

stdin.addListener('data', (d) => {
    // note:  d is an object, and when converted to a string it will
    // end with a linefeed.  so we (rather crudely) account for that  
    // with toString() and then trim() 
    const enteredSentence = d.toString().trim();

    getIntent(enteredSentence).then((intent) => {
    	console.log(getSuggestionsArray(intent));
    	console.log('------------------------');
    	console.log();
    }).catch((e) => {
    });
});