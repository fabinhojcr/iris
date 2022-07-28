"use strict";
const {
	tools
} = require('./index');

// Adquire o Deck
exports.getDeck = (obj) => Object.keys(obj.deck).map(isr => `"@${isr.replace('@c.us', '')}" = ${tools('blackjack').getValue(obj, isr)}\n\n`);

// Gera um deck aleatório
exports.randomDeck = () => {
	var suits = ['H', 'D', 'C', 'S'];
	var cardValues = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	return [tools('others').randVal(cardValues) + tools('others').randVal(suits), tools('others').randVal(cardValues) + tools('others').randVal(suits)];
};

// Conta o valor das Cartas
exports.getValue = (obj, user) => {
	var cardValue = 0;
	for (let i of obj.deck[user]) {
		if (i.startsWith('10') || i.startsWith('J') || i.startsWith('K') || i.startsWith('Q')) {
			cardValue = Number(cardValue) + 10;
		} else if (i.startsWith('A')) {
			cardValue = Number(cardValue) + 1;
		} else {
			cardValue = Number(cardValue) + i[0];
		}
	}
	return Number(cardValue);
};