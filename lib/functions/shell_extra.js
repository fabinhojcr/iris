"use strict";
const args = process.argv.slice(2);
const fs = require('fs');

// Função de espera
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Função de formatação
const formatJSON = () => {

	// JSON's atuais e antigos
	const LocJSON = `${args[1]}`;
	const firstJSON = JSON.parse(fs.readFileSync(`${args[0]}`));
	const secJSON = JSON.parse(fs.readFileSync(LocJSON));
	const newJSON = {};
	const keys = Object.keys(firstJSON);
	var timeCount = 0;
	var downCount = keys.length;

	// Faz a formatação do JSON
	for (let vars of keys) {
		timeCount++;
		downCount--;
		if (Object.keys(secJSON).includes(vars)) {
			newJSON[vars] = firstJSON[vars] || secJSON[vars];
		}
		let valueCem = (100 + timeCount) - keys.length;
		process.stdout.write("\r");
		process.stdout.write(`[${'#'.repeat(timeCount / 3)}${'@'.repeat(downCount / 3)}] | ${valueCem}% de 100% | [${timeCount} / ${keys.length}] | "${vars}"`);
		sleep(300).then(console.clear);
	}
	
	/* Escreve na tela a barra de progresso */
	process.stdout.write("\r");
	process.stdout.write(`[${'#'.repeat(downCount / 3)}] | 100% de 100% | [${keys.length} / ${keys.length}] | "Todas as keys editadas com sucesso!"`);

	// Aplica o JSON
	fs.writeFileSync(LocJSON, JSON.stringify(newJSON, null, "\t"));

};

/* Inicia */
formatJSON();