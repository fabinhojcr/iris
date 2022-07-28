"use strict";
const fs = require("fs");
const {
	tools
} = require('./index');

/* JSON */
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

/* Executa todos os sistemas do firewall */
exports.runAll = async (k, m) => {

	/* Transforma as variáveis do exports em constantes */
	const kill = k;
	const message = m;

	/* Array de resultados gerais */
	const Fire_Promises = [];

	/* Anti Links */
	Fire_Promises.push(tools('antilinks').init(kill, message));

	/* Anti Travas */
	Fire_Promises.push(tools('antitravas').init(kill, message));

	/* Anti Porn */
	Fire_Promises.push(tools('antiporn').init(kill, message));

	/* Bad Words */
	Fire_Promises.push(tools('badwords').init(kill, message));

	/* Espera a promise, caso esteja usando o modo seguro */
	if (config.Perfomance_Mode == false) {

		/* Retorna true se estiver OK */
		Promise.all(Fire_Promises).then(g => {
			return !g.includes(false);
		});
		
	} else return true;

};