"use strict";
const fs = require('fs');
const {
	tools
} = require('./index');

// JSON's
const commandslist = JSON.parse(fs.readFileSync("./lib/config/Gerais/comandos.json"));

// Pega todos os menus da Íris - Créditos da construção a Pedro Batistop
exports.getAllMenus = () => {
	var allMenus = [];
	for (let i in Object.keys(commandslist.commands)) {
		if (commandslist.commands[Object.keys(commandslist.commands)[i]].menus) {
			for (let cmdmn of commandslist.commands[Object.keys(commandslist.commands)[i]].menus) {
				if (!allMenus.includes(cmdmn)) {
					allMenus.push(cmdmn);
				}
			}
		}
	}
	return allMenus;
};

// Pega um menu especifico
exports.getMenu = (mSearch, permit, prefix) => {
	var formattedMenu = '';
	let cPos = 0;
	let allMenus = tools('menu').getAllMenus();
	if (!mSearch) mSearch = 'menu';
	var cArray = [];
	for (let i in Object.keys(commandslist.commands)) {
		if (commandslist.commands[Object.keys(commandslist.commands)[i]].menus) {
			if (commandslist.commands[Object.keys(commandslist.commands)[i]].menus.includes(mSearch)) {
				cArray.push(Object.keys(commandslist.commands)[i]);
			}
		}
	}
	if (mSearch == 'menu') {
		for (let p in allMenus) {
			if (!cArray.includes(allMenus[p]) && allMenus[p] !== 'menu') {
				commandslist.commands[allMenus[p]] = {
					"media": [],
					"menus": [
						"menu"
					],
					"description": {
						"en": "No description.",
						"es": "No hay una descripción.",
						"pt": "Sem descrição."
					}
				};
				cArray.push(allMenus[p]);
			}
		}
	}
	for (let i in cArray) {
		if (commandslist.commands[cArray[i]].menus && commandslist.commands[cArray[i]].menus.includes("adult") && permit || commandslist.commands[cArray[i]].menus && !commandslist.commands[cArray[i]].menus.includes("adult")) {
			cPos++;
			if (commandslist.commands[cArray[i]].emoji) {
				formattedMenu += commandslist.commands[cArray[i]].emoji + ' - ';
			}
			formattedMenu += `*${cPos}° → ` + `${prefix}${tools('others').makeCaps(commandslist.commands[cArray[i]].menus.includes("menu") ? 'menut ' : '')}` + `${tools('others').makeCaps(cArray[i])}${commandslist.commands[cArray[i]].menus.includes("adult") ? ' 🔞' : ''}`;
			if (commandslist.commands[cArray[i]].media.length !== 0) {
				formattedMenu += ' ';
				for (let j = 0; j < commandslist.commands[cArray[i]].media.length; j++) {
					formattedMenu += `<${commandslist.commands[cArray[i]].media[j]}>${j == commandslist.commands[cArray[i]].media.length - 1 ? '' : '|'}`;
				}
			}
			formattedMenu += '*\n';
			if (!commandslist.commands[cArray[i]].description) {
				commandslist.commands[cArray[i]].description = {
					"en": "No description.",
					"es": "No hay una descripción.",
					"pt": "Sem descrição."
				};
			}
			formattedMenu += `ᐳ _${commandslist.commands[cArray[i]].description[region] ? commandslist.commands[cArray[i]].description[region] : commandslist.commands[cArray[i]].description[0]}_\n\n`;
		}
	}
	return {
		"name": mSearch,
		"menu": formattedMenu
	};
};