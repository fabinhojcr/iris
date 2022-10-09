"use strict";
const chalk = require('chalk');
const crypto = require('crypto');
const shell = require('shelljs');
const notifier = require('node-notifier');
const moment = require('moment-timezone');
const fs = require('fs');
const removeAccents = require('remove-accents');
const wordwrap = require('word-wrapper');
const {
	tools
} = require('./index');
const {
	prettyNum
} = require("pretty-num");

// JSON's
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

/* Converte unidade por letra */
exports.unit_let = (uni) => {
  const ptnum = parseFloat(uni); // Remove as letras
  if (uni.toLowerCase().match(/k/)) return Math.round(ptnum * 1000); // Milhar
  if (uni.toLowerCase().match(/m/)) return Math.round(ptnum * 1000000); // Milhão
  if (uni.toLowerCase().match(/b/)) return Math.round(ptnum * 1000000000); // Bilhão
  if (uni.toLowerCase().match(/t/)) return Math.round(ptnum * 1000000000000); // Trilhão
  return ptnum; // Quatrilhão adiante não possui sigla...
};

/* Converte números em números compactos */
exports.num_let = (num) => Intl.NumberFormat('en-US', {
  "notation": "compact"
}).format(num);

/* Checa se é link de grupo */
exports.Is_Invite_Link = (text) => /chat.whatsapp.com/gim.test(text) || /(https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-])+/gim.test(text) || text.includes('chat.whatsapp.com');

/* Confirma os valores de bonus da loja */
exports.Bonus_Value = (value, user, chatId, type_check) => {

	// JSON's
	const Bonus_Gain = JSON.parse(fs.readFileSync('./lib/config/Gerais/bonus.json'));

	// Inicia
	if (isNaN(value)) return 0;
	let Bonuses_Value = Number(value);
	let User_Information = tools('gaming').getValue(user, chatId, null);

	// Shopping 01 - Ganhos de Guilda
	if (type_check == 'win' && Object.keys(Bonus_Gain.Win_Rate_Guild).includes(User_Information.guild)) {
		Bonuses_Value = Math.floor((Bonuses_Value += parseInt((Bonuses_Value * Number(Bonus_Gain.Win_Rate_Guild[User_Information.guild]) / 100) + Number(Bonus_Gain.Win_Rate_Guild[User_Information.guild]))));
	}

	// Shopping 02 - Diminuir percas
	if (type_check == 'lose' && Object.keys(Bonus_Gain.Stop_Loss).includes(user)) {
		Bonuses_Value = Math.floor((Bonuses_Value / ((100 + Number(Bonus_Gain.Stop_Loss[user])) / 100)));
	}

	// Shopping 04 - Diminuir ganhos de alguém
	if (type_check == 'win' && Object.keys(Bonus_Gain.Friend_Loss).includes(user)) {
		Bonuses_Value = Math.floor((Bonuses_Value / ((100 + Number(Bonus_Gain.Friend_Loss[user])) / 100)));
	}

	// Shopping 05 - Aumentar ganhos pessoais
	if (type_check == 'win' && Object.keys(Bonus_Gain.Win_Rate).includes(user)) {
		Bonuses_Value = Math.floor((Bonuses_Value += parseInt((Bonuses_Value * Number(Bonus_Gain.Win_Rate[user]) / 100) + Number(Bonus_Gain.Win_Rate[user]))));
	}

	return Bonuses_Value;

};

// Converte HEX para RGB
exports.hexToRgb = (hex) => {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (!result) return 'rgb(0,0,0)';
	return `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})`;
};

// Checa se a cor usada é um hex
exports.isHex = (hex) => {
	const All_Hex = JSON.parse(fs.readFileSync('./lib/config/Gerais/colors.json'));
	let New_HEX = Object.keys(All_Hex).map(h => h.hex);
	if (New_HEX.includes(hex) || /((0x){0,1}|#{0,1})([0-9A-F]{8}|[0-9A-F]{6})/gim.test(hex)) {
		return {
			"found": true,
			"color": hex
		};
	} else return {
		"found": false,
		"color": tools('others').randVal(New_HEX)
	};
};

// Adquire os arquivos de uma pasta organizados do mais antigo ao mais novo
exports.mostRecent = (dir, filter) => {
	const files = fs.readdirSync(dir);
	return files.map(fileName => ({
		name: fileName,
		time: fs.statSync(`${dir}/${fileName}`).mtime.getTime()
	})).sort((a, b) => a.time - b.time).map(file => file.name).slice(0, filter);
};

// Converte exponenciais em números inteiros
exports.toLargeNumber = (nbr, accent, full) => {
	const mopt = {
        "precision": 10,
        "precisionSetting": 2
    };
	if (accent == true || accent == null) {
		mopt.thousandsSeparator = ".";
	}
	const Final_Num = prettyNum(nbr, mopt).toString();
	var Last_IndexO = Final_Num.lastIndexOf(',');
	Last_IndexO = Last_IndexO == -1 ? Final_Num.lastIndexOf('.') : Last_IndexO;
	Last_IndexO = Last_IndexO == -1 ? Final_Num.length : Last_IndexO+4;
	if (full !== true) return Final_Num.slice(0, Last_IndexO);
	return Final_Num;
};

// Converte o tempo dos jogos e sistemas da Íris em formatos 'certos'
exports.getRemainTime = (mode, timing) => Math.abs((Number(config.Wait_to_Play * 60000) - (Date.now() - timing)) / mode).toFixed(2);

// Acha a posição de algo numa string
exports.findPos = (str, search, index) => {
	let posString = str.split(search, index).join(search).length;
	if (str.slice(posString) == '') {
		posString = str.lastIndexOf(search);
	}
	return posString;
};

// Filtro para o awaitMessages
exports.filterMsg = (msgw, whoSend, place, buttID, regex) => {
	if (msgw.quotedMsg !== null) {
		if (msgw.sender.id == whoSend && msgw.from == place && buttID.includes(msgw.quotedMsg.id)) {
			return true;
		} else if (msgw.sender.id == whoSend && msgw.from == place && regex.test(removeAccents(msgw.body))) {
			return true;
		} else return false;
	} else {
		if (msgw.sender.id == whoSend && msgw.from == place && regex.test(removeAccents(msgw.body))) {
			return true;
		} else return false;
	}
};

// Faz a primeira letra de uma string ser maiscula
exports.makeCaps = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Regex que retorna se a string é um local
exports.isFolder = (string) => new RegExp(/^(.+)\/([^\/]+)$/gi).test(string);

// Formata uma string para pegar o valor de um object
exports.multikey = (string, obj) => {
	return string.split('.').reduce((old, next) => {
		return old ? old[next] : null;
	}, obj || 'Fail');
};

// Informa erros no console de forma humanizada
exports.reportConsole = (command, error) => console.log(chalk.keyword('crimson')(`[${command.toUpperCase()}]`), chalk.keyword('gold')(`→ Obtive erros no comando "${config.Prefix}${command}" → "${error.message}" - Você pode ignorar.`));

// Conta quantas vezes uma string/palavra aparece | Por Pedro B.
exports.countHave = (string, word) => string.split(word).length - 1;

// Faz uma tabela como o /menu || Pedro B.
exports.tablefy = (imput, titulo) => {
	var tabelinha = '';
	if (titulo) {
		tabelinha = '```╭───── 「``` ' + titulo.toUpperCase() + ' ```」 ──────```\n```│```\n\`\`\`│\`\`\` ';
	} else tabelinha = '```╭───────────────────────```\n```│```\n\`\`\`│\`\`\` ';
	var mapimput = wordwrap(imput, {
		width: 36
	}).trim().split(/\n/);
	for (let i = 0; i < mapimput.length; i++) {
		if (tools('others').countHave(mapimput[i], '*') % 2 !== 0) {
			mapimput[i] += '*';
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '*' + mapimput[i + 1];
			}
		}
		if (tools('others').countHave(mapimput[i], '_') % 2 !== 0) {
			mapimput[i] += '_';
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '_' + mapimput[i + 1];
			}
		}
		if (tools('others').countHave(mapimput[i], '~') % 2 !== 0) {
			mapimput[i] += '~';
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '~' + mapimput[i + 1];
			}
		}
		if (tools('others').countHave(mapimput[i], '```') % 2 !== 0) {
			mapimput[i] += '```';
			if (mapimput[i + 1]) {
				mapimput[i + 1] = '```' + mapimput[i + 1];
			}
		}
		tabelinha += mapimput[i] + '\n\`\`\`│\`\`\` ';
	}
	return tabelinha += '\n\`\`\`╰───────────────────────\`\`\`';
};

// Transforma uma Buffer em Base64
exports.dataURI = (type, image) => `data:${type};base64,${image.toString('base64')}`;

// Cria uma string aleatoria
exports.randomString = (length) => crypto.randomBytes(length).toString('hex');

// Verifica se é um número inteiro
exports.isInt = (val) => Number.isInteger(Number(val));

// Aleatoriza arrays
exports.randomArr = (arr) => arr.sort(() => Math.random() - 0.5);

exports.newArray = (min, max, lenmin, lenmax) => {
	let array = Array(max - min + 1).fill().map((_, idx) => min + idx);
	return lenmin !== null ? array.slice(lenmin, lenmax) : array;
};

// Da a cor as mensagens do terminal
exports.color = (text, color) => !color ? chalk.green(text) : chalk.keyword(color)(text);

// Verifica se é uma URL
exports.isUrl = (url) => new RegExp(/(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|(www\.)?){1}([0-9A-Za-z-\.@:%_+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/gi).test(url);

// Faz a função esperar 'x' tempo antes de avançar
exports.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Envia notificações
exports.notify = (title, message, icon) => {
	notifier.notify({
		title: title,
		message: message,
		icon: icon
	});
};

// Escolhe um número aleatório
exports.randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// Adquire o tempo de processamento
exports.processTime = (timestamp, now) => moment.duration(now - moment(timestamp * 1000)).asSeconds();

// Formata uma array com object de forma crescente
exports.sort = (obj, value) => {
	let objRetn = {};
	Object.keys(obj).sort(function(a, b) {
		return obj[b][value] - obj[a][value];
	}).map(k => objRetn[k] = obj[k]);
	return objRetn;
};

// Randomiza uma array
exports.randVal = (value) => value[Math.floor(Math.random() * value.length)];

// Função que separa o "Sim" de cada língua da Íris
exports.yesAwnsers = () => region == 'pt' ? 'Sim' : region == 'en' ? 'Yes' : 'Si';

// Função que separa o "Não" de cada língua na Íris [eu sei, ambas são 'inúteis' :)]
exports.noAwnsers = () => region == 'pt' ? 'Não' : 'No';

// Função que pega uma linha aleatoria do texto usando shell script
exports.getRandLine = (qtd, file) => {
	return shell.exec(`bash lib/functions/config.sh line ${qtd} "${file}"`, {
		silent: true
	}).stdout.split('\n');
};

// Função que verifica se algo existe e então o apaga em "x" tempo
exports.clearFile = (p, t = 10000, isDir = false) => {
	try {
		if (fs.existsSync(p)) {
			setTimeout(() => {
				if (isDir) {
					fs.rmSync(p, {
						recursive: true
					});
				} else fs.unlinkSync(p);
			}, t);
		}
	} catch (error) {
		if (config.Show_Error == true) {
			console.log(error, '\nTalvez você não tenha permissão de edição, tente mudar o local da pasta da Íris ou rodar como administrador.');
		}
	}
};