"use strict";
const {
	tools
} = require('./index');

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

	/* Retorna true se estiver OK, da em nada se usar 'Perfomance_Mode' */
	Promise.all(Fire_Promises).then(g => {
		return !g.includes(false);
	});

};