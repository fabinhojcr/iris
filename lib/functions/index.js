"use strict";
const fs = require("fs");

// JSON's
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

function tools(fun) {
	try {
		const Usage_Tools = exports[fun] = require(`./${fun}`);
		return Usage_Tools;
	} catch (error) {
		if (config.Show == true) {
			console.log('Tool não encontrada ou erro, detalhes abaixo!\n\n', error);
		}
	}
}

module.exports = {
	tools
};