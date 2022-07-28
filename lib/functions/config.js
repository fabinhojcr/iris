"use strict";
/*----------- VERY IMPORTANT NOTICE - AVISO MUITO IMPORTANTE - AVISO MUY IMPORTANTE ------------------
*
* Reprodução, edição e outros estão autorizados MAS SEM REMOVER MEUS CRÉDITOS.
* Caso remova, resulta na quebra da licença do mesmo, sendo um crime.
* Leia mais sobre o que você pode fazer aqui -> https://escolhaumalicenca.com.br/licencas/mit/
* Ou digite o comando /Termos, fiz um resumo em 3 idiomas lá.
*
* Desculpem pelos comandos em "inglês", eu e meu pessoal gostamos do inglês. 
* Então os programo dessa forma. (Desconheço palavras suficientes em português) :'D
*
* Plagiar meus códigos não te torna coder, vá estudar, não seja um ladrão miserável.
* Esse projeto é feito com muita disposição, sem fins lucrativos, apenas para divertir, e claro, de graça.
* Eu realmente não gosto de ter minhas coisas roubadas, especialmente as que fiz gratuitamente, e você?
*
* Se ainda planeja roubar, saiba que quando baixou a Íris, você aceitou um acordo eheheheh
* Isso mesmo, plagiar meu código significa estar vendendo a alma para mim! 򓠻
*
* Agradecimentos especiais -> Pedro Batistop - Por sua enorme ajuda durante esses meses.
*
*				Obrigado também a todos que ajudam e a você que escolheu a Íris.
*
* -------------- DUVIDAS? LEIA A GITHUB OU ABRA UMA ISSUE POR LÁ PARA PEDIR AJUDA -------------------

/*MODULOS*/
const {
	decryptMedia
} = require('@open-wa/wa-decrypt');
const {
	EmojiAPI
} = require("emoji-api");
const {
	IamAuthenticator
} = require('ibm-watson/auth');
const {
	removeBackgroundFromImageBase64
} = require('remove.bg');
const axios = require('axios');
const canvacord = require('canvacord');
const chess = require('chess.js');
const chessImageGenerator = require('chess-image-generator');
const creditCard = require('creditcard-generator');
const ddg = require('ddg-scraper');
const deepai = require('deepai');
const duck = require('ddgimages-node');
const fs = require('fs');
const genshin = require('genshin-db');
const maker = require('free-textmaker-alpha');
const math = require('mathjs');
const moment = require('moment-timezone');
const os = require('os');
const petPetGif = require('pet-pet-gif');
const Pokemon = require('pokemon.js');
const removeAccents = require('remove-accents');
const sharp = require('sharp');
const shell = require('shelljs');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1');
const store = require('playstore-scraper');
const stringSimilarity = require('string-similarity');
const text2png = require('text2png');
const TicTacToe = require('tictactoe-agent');
const translate = require('@imlinhanchao/google-translate-api');
const wordwrap = require('word-wrapper');
const ytsearch = require('yt-search');
const extmoji = require('get-emojis-from-string');
const cleverbot = require("cleverbot-free");
const animeCharacter = require('anime-character-random');
const NASA = require('@killovsky/nasa');
const _4devs = require('@killovsky/4devs');
const trendings = require('@killovsky/trendings');
const tts = require('@killovsky/gtts');
const tesseract = require('node-tesseract-ocr');

/*UTILIDADES*/
const {
	mylang
} = require('../lang');
const {
	tools
} = require('./index');

/*JSON'S*/
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));
const Default_APIS = JSON.parse(fs.readFileSync('./lib/config/Settings/Default_APIS.json'));
const APIS = JSON.parse(fs.readFileSync('./lib/config/Settings/APIS.json'));

// CONFIGURE SUA API DEEPAI PARA EVITAR ERROS MAIORES
const My_KEY = Default_APIS.API_DeepAI !== APIS.API_DeepAI ? APIS.API_DeepAI : 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K';
deepai.setApiKey(My_KEY);

/* CONFIGS EXTRAS */
var Mesing = mylang(region);
moment.tz.setDefault(config.Moment_Timezone).locale(config.Moment_Locale);
axios.defaults.headers.common["User-Agent"] = config.User_Agent;

/* VARIAVEIS DE COMANDOS */
const gameconfig = {};
const bjConfig = {};
const chessGame = {};
const quizPlacar = {};
const Select_Quiz_Awnser = {};
const usersVoted = {};
const lotery = {};
const objconfig = {
	"GuildExist": 0,
	"agiotas": [],
	"ohayo": [],
	"bonjour": [],
	"noch": [],
	"dawn": [],
	"isMuteAll": 0,
	"isTyping": [],
	"akistarted": 0,
	"jogadas": 0,
	"noLimits": 0,
	"oneImage": 0,
	"oneLink": 0,
	"oneTrava": 0
};
const tttSet = {};
const placar = {};
const on_Poll = {};
const Mix_Waiting = {};
var Wait_Messages_Sent = 0;
var onShutdown = false;
var marryOngoing = [];
var onDivorce = [];
var Usage_Offline = false;
var Shutdown_Without = false;
var Register_Wait = [];
var stopCasamen = false;
var Last_Valid_ID = false;
var chessg = false;
var stop_intvl = false;

/* Função 1° - Transmite arquivos */
const Broad_Files = async (isFiler, canCaption, kill, it, encryptMedia, pushname, body, cmd) => {
	if (isFiler) {
		const mediaData = await decryptMedia(encryptMedia);
		if (canCaption) {
			await kill.sendFile(it, tools('others').dataURI(encryptMedia.mimetype, mediaData), 'file.' + encryptMedia.mimetype, `[Transmissão de ${pushname} ]\n\n${body.slice(cmd.length+6)}`);
		} else {
			await kill.sendFile(it, tools('others').dataURI(encryptMedia.mimetype, mediaData), 'file.' + encryptMedia.mimetype, '');
			await kill.sendText(it, `[Transmissão de ${pushname} ]\n\n${body.slice(cmd.length+6)}`);
		}
	} else await kill.sendText(it, `[Transmissão de ${pushname} ]\n\n${body.slice(cmd.length+6)}`);
};

/* Função 2° - Converte tempo */
const timeCreation = key => moment(Number(key.toString().padEnd(moment.now().toString().length, '0'))).format("HH:mm:ss • YYYY-MM-DD");

/* Função 3° - Shutdown por falta de uso */
const Shutdown_NO = (timing, kill) => {
	stop_intvl = setInterval(() => {
		if (!Usage_Offline) {
			Usage_Offline = true;
		} else {
			config.SafeBoot = 0;
			fs.writeFileSync('./lib/config/Settings/config.json', JSON.stringify(config, null, "\t"));
			kill.kill();
		}
	}, timing);
};

/* Função 4° - Sticker editor */
const sharpre = async (mediaData, kill, chatId, objC) => {
	let resizedImageBuffer = await sharp(mediaData).resize({
		width: 512,
		height: 512,
		fit: 'fill'
	}).toBuffer();
	await kill.sendImageAsSticker(chatId, resizedImageBuffer, objC);
};

/* Função 5° - Adquire o jogo de xadrez */
const getGame = async (chessglate, chessGame, chatId, kill, stickerConfig, onlyShow, mess, id) => {
	await chessglate.loadFEN(chessGame[chatId].fen);
	let imageBoard = await chessglate.generateBuffer();
	try {
		await kill.sendImageAsSticker(chatId, tools('others').dataURI('image/png', imageBoard), stickerConfig);
		if (onlyShow) await kill.sendTextWithMentions(chatId, mess.Chess_Human(chessGame, chatId, chessg));
		if (!onlyShow) await kill.sendTextWithMentions(chatId, mess.Chess_BOT(chessGame, chatId, chessg));
	} catch (error) {
		console.error(error);
		await kill.reply(chatId, mess.fail('CHESS', error, (new Date().toString())), id);
	}
};

/* Função 6° - Checa por jogada no 21 */
const checkPlayed = async (chatId, kill, mess, resetDeck) => {
	if (bjConfig[chatId].isPlaying == true) {
		bjConfig[chatId].oldPlayer = bjConfig[chatId].atualPlayer;
		bjConfig[chatId].atualPlayer = bjConfig[chatId].validPlayers[bjConfig[chatId].validPlayers.indexOf(bjConfig[chatId].oldPlayer) + 1];
		if (bjConfig[chatId].atualPlayer == null) {
			bjConfig[chatId].atualPlayer = bjConfig[chatId].validPlayers[bjConfig[chatId].validPlayers.indexOf(bjConfig[chatId].oldPlayer) - 1];
		}
		if (!bjConfig[chatId].haveDeck.includes(bjConfig[chatId].oldPlayer)) {
			bjConfig[chatId].validPlayers = bjConfig[chatId].validPlayers.filter(f => f !== bjConfig[chatId].oldPlayer);
			await kill.sendTextWithMentions(chatId, mess.BlackJack_Disqualified(bjConfig, chatId));
		} else {
			bjConfig[chatId].haveDeck.splice(bjConfig[chatId].oldPlayer, 1);
			await kill.sendTextWithMentions(chatId, mess.BlackJack_Step(bjConfig, chatId));
			await tools('others').sleep(120000);
			checkPlayed(chatId, kill, mess, resetDeck);
		}
		if (bjConfig[chatId].validPlayers.length < 2) {
			await kill.sendTextWithMentions(chatId, mess.BlackJack_EndPlayers(bjConfig, chatId));
			return resetDeck(chatId);
		}
	}
};

/* Função 7° - Reseta o 21 */
const resetDeck = (chatId) => {
	bjConfig[chatId] = {
		isPlaying: false,
		players: [],
		startedAt: 0,
		atualPlayer: 0,
		oldPlayer: 0,
		haveDeck: [],
		deck: {},
		validPlayers: []
	};
};

/* Função 8° - Envia stickers URL com nome */
const mandarFig = async (kill, chatId, link, stickerConfig) => {
	await kill.sendStickerfromUrl(chatId, link, {
		method: 'get'
	}, stickerConfig);
};

exports.kconfig = async (fun, mesg) => {
	
	/* Define a function padrão */
	const kill = fun;
	const message = mesg;

	/* Permite retornar os erros no WhatsApp */
	var Fail_CMD = 'SYSTEM';
	var Fail_From = false;

	/* Try Catch para caso der erro */
	try {

		// Retorna caso seja a inicialização de teste
		if (kill == 'test' || message == 'test') return;

		// Impede comandos quando está em modo shutdown
		if (onShutdown == true && !config.Owner.includes(message.sender.id)) return;

		// Medidor de tempo
		const t = message.t || message.t || Date.now();
		const procTime = moment.duration(moment.now() - moment(t * 1000)).asSeconds();
		const time = moment(t * 1000).format('DD/MM/YY HH:mm:ss');

		// Envia apenas o ping pré-carregado para fins de DEBUG (Envie /debugping)
		if (message.body == '/debugping') return await kill.reply(message.from, `DEBUG: ${procTime} segundos`, message.id);

		// JSON's
		const cmds = JSON.parse(fs.readFileSync('./lib/config/Gerais/cmds.json'));
		const sesConfig = JSON.parse(fs.readFileSync('./lib/config/Settings/session.json'));
		const ctmprefix = JSON.parse(fs.readFileSync('./lib/config/Gerais/prefix.json'));
		const custom = JSON.parse(fs.readFileSync('./lib/config/Gerais/custom.json'));
		const hail = JSON.parse(fs.readFileSync('./lib/config/Gerais/greetings.json'));
		const languages = JSON.parse(fs.readFileSync('./lib/config/Gerais/lang.json'));
		const reward = JSON.parse(fs.readFileSync('./lib/config/Gerais/rewards.json'));
		const shopconf = JSON.parse(fs.readFileSync('./lib/config/Settings/shop.json'));
		const blockcmd = JSON.parse(fs.readFileSync('./lib/config/Gerais/disable.json'));
		const afk = JSON.parse(fs.readFileSync('./lib/config/Gerais/AFK.json'));
		const married = JSON.parse(fs.readFileSync('./lib/config/Gerais/marry.json'));
		const commandslist = JSON.parse(fs.readFileSync("./lib/config/Gerais/comandos.json"));
		const V_CMDS = JSON.parse(fs.readFileSync('./lib/config/Settings/commands.json'));
		const nivel = JSON.parse(fs.readFileSync('./lib/config/Gerais/level.json'));
		const rpgJson = JSON.parse(fs.readFileSync('./lib/config/Gerais/rpg.json'));
		const CharInfo = JSON.parse(fs.readFileSync('./lib/config/Gerais/characters.json'));
		const Fights = JSON.parse(fs.readFileSync('./lib/config/Gerais/fights.json'));
		const warn = JSON.parse(fs.readFileSync('./lib/config/Gerais/warn.json'));
		const randEven = JSON.parse(fs.readFileSync('./lib/config/Gerais/events.json'));
		const register = JSON.parse(fs.readFileSync('./lib/config/Gerais/register.json'));
		const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'));
		const bank = JSON.parse(fs.readFileSync('./lib/config/Gerais/bank.json'));

		/* Variáveis importantes */
		const botNumber = (await kill.getHostNumber())+'@c.us';
		const chatId = message.chatId || message.from || message.chat.contact.id || message.chat.groupMetadata.id || false;
		var from = chatId;
		Fail_From = chatId;
		const type = message.type || 'chat';
		const chat = message.chat || {};
		const isMedia = message.isMedia || false;
		var body = message.text || '';
		body = (type == 'image' || type == 'video' || type == 'document' ? message.caption : (type == 'location' ? message.comment : body)) || '';
		var oldBodSave = body;
		const prefix = (!ctmprefix[chatId] && config.Prefix.includes(body.slice(0, 1)) && body.length > 1) ? body.slice(0, 1) : ctmprefix[chatId] ? ctmprefix[chatId] : config.Prefix[0];
		const command = removeAccents(body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase());
		Fail_CMD = command;
		const fromMe = message.fromMe || false;
		const id = message.id || Last_Valid_ID || false;
		Last_Valid_ID = id;
		const isGroupMsg = message.isGroupMsg || false;
		const mentionedJidList = message.mentionedJidList || [];
		const mimetype = message.mimetype || '';
		const name = chat.name || chat.formattedName || chat.contact.name || chat.contact.formattedName || 'Unknown';
		const sender = message.sender || {};
		const user = fromMe == true ? botNumber : message.author || sender.id || config.Owner[0];
		const pushname = sender.pushname || message.notifyName || sender.verifiedName || '"Censored by Government"'; // Caso der erros e.e
		const mentioned_name = (mentionedJidList.length > 0 ? await kill.getContact(mentionedJidList[0]) : {"pushname":""}).pushname || '"Censored by Government"';
		const quotedMsg = message.quotedMsg !== null ? message.quotedMsg : (message.quotedMsgObj !== null ? message.quotedMsgObj : {});
		const quotedMsgObj = message.quotedMsgObj !== null ? message.quotedMsgObj : quotedMsg;
		const blockNumber = await kill.getBlockedIds();
		const isBlocked = blockNumber.includes(user);
		const isBot = fromMe || botNumber == user || false;
		const groupAdmins = isGroupMsg ? await kill.getGroupAdmins(chatId) : [];
		const isGroupAdmins = isGroupMsg ? groupAdmins.includes(user) : false;
		const isBotGroupAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false;
		const isGroupCreator = isGroupMsg ? user == chat.groupMetadata.owner : false;
		const isOwner = config.Owner.includes(user) || body.includes(config.Owner_SECRET_Password);
		var groupMembersId = isGroupMsg ? await kill.getGroupMembersId(chatId) : [];

		/* Funções de verificação */
		const isActivated = func => functions[func].includes(chatId);
		const Can_Run_CMD = wcmd => isVIP && !isModerator ? V_CMDS.VIP_Commands.includes(wcmd) : (isModerator ? V_CMDS.MOD_Commands.includes(wcmd) : false);
		const isType = mime => quotedMsgObj && quotedMsgObj.type == mime || quotedMsgObj && quotedMsgObj.mimetype == mime || type == mime || mimetype == mime;

		/* Variáveis secundarias [ainda importantes] */
		const isVIP = Object.keys(functions.vips).includes(chatId) ? Object.keys(functions.vips[chatId]).includes(user) : false;
		const isModerator = isVIP ? functions.vips[chatId][user] : false;
		const dateOfDay = (new Date()).getHours();
		var arg = body.trim().substring(body.indexOf(' ') + 1);
		var args = body.trim().split(/ +/).slice(1);
		var all_args = body.trim().split(/ +/);
		var arqs = body.trim().split(' ');
		var argl = args.map(argl => argl.toLowerCase());
		var arks = argl.join(' ');
		var argc = args.map(argc => argc.toUpperCase());
		const allCommands = fs.readFileSync('./lib/config/Utilidades/Comandos_Automate.txt').toString();
		const pollfile = `./lib/media/poll/${chatId.replace('@g.us', '')}.json`;
		const side = tools('others').randomNumber(1, 2);
		const lvpc = tools('others').randomNumber(1, 100);
		const checkLvL = tools('gaming').getValue(user, chatId, 'level');
		const patente = tools('gaming').getPatent(checkLvL);
		const fileFor = ["pais", "fruta", "capital", "empresa", "nome"];
		const Win_Rewards = ["xp", "coin", "dima", "rubi", "stone", "gold", "iron", "wood"];
		const typeChat = isGroupMsg ? '-gp' : '-pv';
		const typeName = isGroupMsg ? name : pushname;
		const typeId = isGroupMsg ? chatId.replace('@g.us', '') : user.replace('@c.us', '');
		const randomMember = isGroupMsg ? tools('others').randVal(groupMembersId) : user;
		const encryptMedia = quotedMsgObj || isType('sticker') ? await kill.getMessageById(quotedMsgObj.id) : message;
		const isCmd = body.startsWith(prefix);
		[oldBodSave, body] = isCmd && body.slice(1) !== '' ? [oldBodSave.slice(1), body.slice(1)] : [oldBodSave, body]; // Caso seja um cmd, remove o prefix da msg

		/* Sistema que permite desativar a Íris em um grupo */
		if (isGroupMsg && isCmd && !isOwner && !isBot && functions.Disabled_Chats.includes(chatId)) return;

		// Refaz o cronometro do shutdown por utilização
		Usage_Offline = (isCmd && Usage_Offline == true && Shutdown_Without !== false) ? false : Usage_Offline;

		/* Contador de Mensagens (em grupo) | Para contar do PV bote sem aspas "isGroupMsg || !isGroupMsg" */
		if (isGroupMsg) {
			tools('gaming').addValue(user, 1, chatId, 'msg');
		}

		// Edita o sticker para inserir nome do user e grupo nele, nomes cheios de ASCII são problemáticos
		var stckAuth = config.Sticker_Author;
		if (config.Sticker_Author.includes('DONTEDITGPN')) {
			stckAuth = removeAccents(config.Sticker_Author.replace(/DONTEDITGPN/g, name).replace(/DONTEDITUSR/g, pushname));
			if (/[^\u0000-\u007f]/.test(stckAuth)) {
				let sticPA = [removeAccents(name), removeAccents(pushname)].filter(j => !/[^\u0000-\u007f]/.test(j));
				stckAuth = sticPA.length == 2 ? `${sticPA[0]} - ${sticPA[1]}` : (sticPA.length == 1 ? `${sticPA[0]}` : removeAccents(config.Your_Name));
			}
			stckAuth = '🎁 ' + stckAuth + ' ☆';
		}
		const stckPack = (removeAccents(config.Sticker_Pack).toString() || "🔰 Legião Z [bit.ly/BOT-IRIS] Íris ⚜️");

		// Metadados do Sticker
		const stickerConfig = {
			author: stckAuth,
			pack: stckPack,
			keepScale: true,
			circle: false
		};

		// Metadados do Sticker MP4
		const stickMp4Config = {
			author: stckAuth,
			pack: stckPack,
			crop: false,
			loop: 1,
			fps: config.Fig_FPS,
			stickerMetadata: true
		};

		// Caso tenha configurado um nome
		if (Object.keys(custom).includes(user)) {
			if (custom[user].pack !== false && custom[user].author !== false) {
				stickerConfig.pack = custom[user].pack;
				stickMp4Config.pack = custom[user].pack;
				stickMp4Config.author = custom[user].author;
				stickerConfig.author = custom[user].author;
			}
		}

		/* Muda a linguagem para a requisitada no comando newlang para grupos e usuários */
		if (isGroupMsg && isCmd && languages.en.includes(chatId) || isCmd && languages.en.includes(user)) {
			Mesing = mylang('en');
			global.region = 'en';
		} else if (isGroupMsg && isCmd && languages.es.includes(chatId) || isCmd && languages.es.includes(user)) {
			Mesing = mylang('es');
			global.region = 'es';
		} else if (isGroupMsg && isCmd && languages.pt.includes(chatId) || isCmd && languages.pt.includes(user)) {
			Mesing = mylang('pt');
			global.region = 'pt';
		}
		
		/* Cria a mess e muda o prefix */
		const mess = Mesing;
		mess.newprefix(prefix);
		
		/* Impede comandos durante votações */
		if (Object.keys(on_Poll).includes(chatId) && !isOwner && !isGroupAdmins && isCmd) {
			if (!['newpoll', 'ins', 'vote', 'poll'].includes(command.toLowerCase()) && on_Poll[chatId]) return console.log(tools('others').color('> [SILENCE]', 'red'), tools('others').color(`Ignorando comando de ${pushname} pois o grupo está em votação...`, 'yellow'));
		}

		/* Impede comandos em PV'S mutados */
		if (!isGroupMsg && isCmd && functions.mute.includes(user) && !isOwner) return console.log(tools('others').color('> [SILENCE]', 'red'), tools('others').color(`Ignorando comando de ${pushname} - [${user.replace('@c.us', '')}] pois ele está mutado...`, 'yellow'));

		/* Impede comandos em grupos mutados */
		if (isGroupMsg && isCmd && !isGroupAdmins && isActivated('mute') && !isOwner) return console.log(tools('others').color('> [SILENCE]', 'red'), tools('others').color(`Ignorando comando de ${name} pois ele está mutado...`, 'yellow'));

		/* Muta geral, reseta ao reiniciar */
		if (isCmd && !isOwner && objconfig.isMuteAll == 1) return console.log(tools('others').color('> [SILENCE]', 'red'), tools('others').color(`Ignorando comando de ${pushname} pois os PV'S e Grupos estão mutados...`, 'yellow'));

		/* Ignora pessoas bloqueadas */
		if (isBlocked && isCmd && !isOwner) return console.log(tools('others').color('> [BLOCK]', 'red'), tools('others').color(`Ignorando comando de ${pushname} - [${user.replace('@c.us', '')}] por ele estar bloqueado...`, 'yellow'));

		/* Anti Flood para PV'S */
		if (isCmd && tools('cooldown').isFiltered(chatId) && !isGroupMsg && !isOwner) return console.log(tools('others').color('> [FLOOD AS]', 'red'), tools('others').color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), tools('others').color(`"[${prefix}${command.toUpperCase()}] [${args.length}]"`, 'red'), 'DE', tools('others').color(`"${pushname} - [${user.replace('@c.us', '')}]"`, 'red'));

		/* Anti Flood para grupos */
		if (isCmd && tools('cooldown').isFiltered(chatId) && isGroupMsg && !isOwner) return console.log(tools('others').color('> [FLOOD AS]', 'red'), tools('others').color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), tools('others').color(`"[${prefix}${command.toUpperCase()}] [${args.length}]"`, 'red'), 'DE', tools('others').color(`"${pushname} - [${user.replace('@c.us', '')}]"`, 'red'), 'EM', tools('others').color(`"${name}"`));

		// Sistema de eventos aleatórios, só precisa ser executado uma vez após ligar a Íris
		if (isGroupMsg && isActivated('event') && isActivated('rank') && !randEven.eventOnline) {
			tools('events').manage(kill, message, chatId);
		}

		// Sistema de checagem de mineração
		if (isGroupMsg) {
			tools('mining').miner(kill, message, chatId, user, 'check', 'none');
		}

		// Impede de usar a Íris se o dono quiser apenas registrados
		if (!Object.keys(register).includes(user) && isCmd && !isBlocked && !isOwner && command !== 'register') {
			if (isGroupMsg && config.Members_Group_Register || !isGroupMsg && config.Private_Chat_Register) {
				if (!isGroupCreator && !isBot && !isModerator && !isVIP && !isGroupAdmins || config.Adm_Vip_Mod_Register == true && !isBot) {
					if (!Register_Wait.includes(user)) {
						await kill.reply(chatId, mess.Register_Please(), id);
						Register_Wait.push(user);
						await tools("others").sleep(3600000); // 1 hora de antispam
						Register_Wait = Register_Wait.filter(h => h !== user);
						return Register_Wait;
					} else return;
				}
			}
		}

		// Desativador de comandos específicos em grupos, FT. Pedro B.
		if (isCmd && !isOwner) {
			if (Object.keys(blockcmd.yes).includes(chatId) || blockcmd.global.length !== 0) {
				if (blockcmd.yes[chatId] && blockcmd.yes[chatId].includes(command) && !isGroupAdmins || blockcmd.global.includes(command)) {
					await kill.reply(chatId, mess.disabledCMD(), id);
					return console.log(tools('others').color('> [DISABLED]', 'red'), tools('others').color(`Ignorando comando ${command.toUpperCase()} de ${pushname} - [${user.replace('@c.us', '')}] pois o comando foi desabilitado...`, 'yellow'));
				}
			}
		}

		/* Mensagens no PV */
		if (!isCmd && !isGroupMsg) return console.log('> MENSAGEM AS', tools('others').color(time, 'yellow'), 'DE', tools('others').color(`"${pushname} - [${user.replace('@c.us', '')}]"`));

		/* Mensagem em Grupo */
		if (!isCmd && isGroupMsg) return console.log('> MENSAGEM AS', tools('others').color(time, 'yellow'), 'DE', tools('others').color(`"${pushname} - [${user.replace('@c.us', '')}]"`), 'EM', tools('others').color(`"${name}"`));

		/* Comandos no PV */
		if (isCmd && !isGroupMsg) {
			console.log(tools('others').color(`> COMANDO "[${prefix}${command.toUpperCase()}]"`), 'AS', tools('others').color(time, 'yellow'), 'DE', tools('others').color(`"${pushname} - [${user.replace('@c.us', '')}]"`));
		}

		/* Comandos em grupo */
		if (isCmd && isGroupMsg) {
			console.log(tools('others').color(`> COMANDO "[${prefix}${command.toUpperCase()}]"`), 'AS', tools('others').color(time, 'yellow'), 'DE', tools('others').color(`"${pushname} - [${user.replace('@c.us', '')}]"`), 'EM', tools('others').color(`"${name}"`));
		}

		/*Impede SPAM*/
		if (isCmd && !isOwner) {
			if (!Object.keys(on_Poll).includes(chatId) && !['vote'].includes(command.toLowerCase())) {
				const Limiter = (config.Filter_Type == 'user' ? user : chatId);
				tools('cooldown').addFilter(Limiter);
			}
		}

		// Envia um sinal de ter lido a mensagem
		if (config.Iris_Read_Messages) {
			try {
				await kill.sendSeen(chatId);
			} catch (error) {
				if (config.Secure_Mode) {
					config.Iris_Read_Messages = false;
					fs.writeFileSync('./lib/config/Settings/config.json', JSON.stringify(config, null, "\t"));
					console.log(tools('others').color('> [SECURE MODE]', 'red'), tools('others').color(`Desativei a leitura de mensagens pois obtive erros na função, mesmo que apenas uma vez...`, 'yellow'));
				}
			}
		}

		// Sistema de aniversario
		if (isGroupMsg && Object.keys(functions.birthdays).includes(user)) {
			if (moment().format('DD/MM') == functions.birthdays[user].date && functions.birthdays[user].last_check !== moment().format('DD/MM/YYYY')) {
				functions.birthdays[user].last_check = moment().format('DD/MM/YYYY');
				fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
				await kill.sendTextWithMentions(chatId, mess.Omedetou(sender));
				tools('gaming').addValue(user, Number(config.Niver_Present), chatId, 'coin');
			}
		}

		// Aniversario do grupo
		if (isGroupMsg) {
			try {
				if (!Object.keys(functions.birthdays).includes(chatId)) {
					let GP_Info = (await kill.getAllGroups()).filter(h => h.id == chatId)[0];
					functions.birthdays[chatId] = {
						"date": moment(Number(GP_Info.groupMetadata.creation.toString().padEnd(moment.now().toString().length, '0'))).format("DD/MM"),
						"year": moment(Number(GP_Info.groupMetadata.creation.toString().padEnd(moment.now().toString().length, '0'))).format('YYYY'),
						"last_check": "never"
					};
					fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
				}
				if (moment().format('DD/MM') == functions.birthdays[chatId].date && functions.birthdays[chatId].last_check !== moment().format('DD/MM/YYYY')) {
					functions.birthdays[chatId].last_check = moment().format('DD/MM/YYYY');
					fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
					await kill.sendTextWithMentions(chatId, mess.Many_Years(chatId, groupMembersId));
				}
			} catch (error) {
				// Esconde os erros pra não floodar o terminal, ative para exibir a versão simples, tire o '.message' para exibir tudo (NÃO RECOMENDADO!)
				// console.log(error.message)
			}
		}

		// Sistema de validade do casamento
		if (isGroupMsg && married.all.includes(user)) {
			let isEndMar = Object.keys(married.persons).filter(p => married.persons[p].love == user || married.persons[p].request == user);
			if (isEndMar.length >= 1) {
				let marriEnd = '';
				if (user == married.persons[isEndMar[0]].request) {
					marriEnd = married.persons[isEndMar[0]].love;
				} else if (user == married.persons[isEndMar[0]].love) {
					marriEnd = married.persons[isEndMar[0]].request;
				}
				if (moment().unix() >= married.persons[isEndMar[0]].finishAt && stopCasamen == false) {
					stopCasamen = true;
					await kill.sendTextWithMentions(married.persons[isEndMar[0]].place, mess.marryEnd(sender, marriEnd, married, isEndMar));
					married.all = married.all.filter(i => i !== user && i !== married.persons[isEndMar[0]].love && i !== married.persons[isEndMar[0]].request);
					delete married.persons[isEndMar[0]];
					fs.writeFileSync('./lib/config/Gerais/marry.json', JSON.stringify(married, null, "\t"));
				}
			}
		}

		// Sistema de AFK
		if (isGroupMsg && mentionedJidList.length !== 0 && Object.keys(afk).length !== 0) {
			var afkMessage = '';
			mentionedJidList.map(m => {
				if (Object.keys(afk).includes(m)) {
					if (afk[m].enabled == true) {
						afkMessage += mess.AFKmode(afk, m);
					}
				}
			});
			if (afkMessage !== '') {
				await kill.reply(chatId, afkMessage, id);
			}
		}

		/*Manda Bom Dia/Tarde/Noite, mas somente se o Auto_Update estiver offline, pois interfere*/
		if (config.Day_Messages && !config.Auto_Update) {
			if (isGroupMsg && dateOfDay >= '5' && dateOfDay < '11') {
				if (!objconfig.ohayo.includes(chatId)) {
					objconfig.ohayo.push(chatId);
					await kill.sendText(chatId, mess.ohayo());
				}
			} else if (isGroupMsg && dateOfDay >= '12' && dateOfDay <= '17') {
				if (!objconfig.bonjour.includes(chatId)) {
					objconfig.bonjour.push(chatId);
					objconfig.ohayo.splice(chatId, 1);
					await kill.sendText(chatId, mess.bonjour());
				}
			} else if (isGroupMsg && dateOfDay >= '18' && dateOfDay < '23') {
				if (!objconfig.noch.includes(chatId)) {
					objconfig.noch.push(chatId);
					objconfig.ohayo.splice(chatId, 1);
					objconfig.bonjour.splice(chatId, 1);
					await kill.sendText(chatId, mess.noch());
				}
			} else if (isGroupMsg && dateOfDay >= '0' && dateOfDay < '6') {
				if (!objconfig.dawn.includes(chatId)) {
					objconfig.dawn.push(chatId);
					objconfig.ohayo.splice(chatId, 1);
					objconfig.bonjour.splice(chatId, 1);
					objconfig.noch.splice(chatId, 1);
					await kill.sendText(chatId, mess.dawn());
				}
			}
		}

		/*Mantém a BOT escrevendo caso o dono queira*/
		if (isGroupMsg && objconfig.isTyping.includes(chatId) || isCmd) {
			await kill.simulateTyping(chatId, true);
		}

		/*Sistema do XP - Baseado no de Bocchi - Slavyan*/
		if (isGroupMsg && isActivated('rank') && !tools('gaming').isWin(user) && !isBlocked) {
			try {
				tools('gaming').wait(user);
				var gainedXP = Math.floor(Math.random() * Number(config.Max_XP_Earn)) + Number(config.Min_XP_Earn);
				const usuarioLevel = tools('gaming').getValue(user, chatId, 'level');
				var myGuildN = tools('gaming').getValue(user, chatId, 'guild');
				if (myGuildN.toUpperCase() == 'COMPANIONS') {
					gainedXP = parseInt(gainedXP + (usuarioLevel * 4)); /*Guilda Companions ganha 4X*/
				} else if (myGuildN.toUpperCase() == 'THIEVES') {
					gainedXP = parseInt(gainedXP + (usuarioLevel * 3)); /*Guilda Thieves ganha 3X*/
				} else if (myGuildN.toUpperCase() !== 'NO_GUILD') {
					gainedXP = parseInt(gainedXP + (usuarioLevel * 2)); /* Guildas genéricas ganham 2X */
				}
				if (randEven.eventOnline && randEven.eventType == 'xp') {
					gainedXP = parseInt(tools('others').randomNumber(gainedXP, gainedXP*randEven.events[randEven.eventIndex].multiplier)); /* Efeito de evento aleatório */
				}
				gainedXP = tools('others').Bonus_Value(gainedXP, user, chatId, 'win');
				tools('gaming').addValue(user, gainedXP, chatId, 'xp');
				const haveXptoUp = tools('gaming').getValue(user, chatId, 'xp');
				if (tools('gaming').LevelEXP(checkLvL) <= haveXptoUp) {
					tools('gaming').addValue(user, 1, chatId, 'level');
					if (randEven.eventOnline && randEven.eventType == 'coin') {
						let what_Coin_Wins = tools('others').Bonus_Value(parseInt(tools('others').randomNumber(Number(config.Iris_Coin), Number(config.Iris_Coin)*randEven.events[randEven.eventIndex].multiplier)), user, chatId, 'win');
						tools('gaming').addValue(user, what_Coin_Wins, chatId, 'xp'); /* Efeito de evento aleatório */
					} else {
						let wh_Icoins = tools('others').Bonus_Value(Number(config.Iris_Coin), user, chatId, 'win');
						tools('gaming').addValue(user, wh_Icoins, chatId, 'coin');
					}
					if (isActivated('levelup')) {
						let userStats = tools('gaming').getValue(user, chatId, null);
						var ohotLev = await kill.getProfilePicFromServer(user);
						if (typeof ohotLev == 'object' || !tools('others').isUrl(ohotLev)) ohotLev = config.Profile_Error_Photo;
						let rankCard = await tools('canvas').ranking(ohotLev, haveXptoUp, tools('gaming').LevelEXP(userStats.level), userStats.level, Object.keys(nivel[chatId]).indexOf(user), Number(gainedXP), `${tools('gaming').getPatent(userStats.level)} - ${(userStats.guild).toUpperCase()}`, pushname);
						await kill.sendFile(chatId, rankCard, `${user.replace('@c.us', '')}_card.png`, mess.Rank_Card(pushname, name, haveXptoUp, userStats), id);
					}
				}
			} catch (error) {
				console.log(tools('others').color('[XP]', 'crimson'), error);
			}
		}

		// Adiciona nível caso tenha ganhado XP demais e coloca a BOT no ranking de coin's
		if (isGroupMsg && isActivated('rank')) {
			let userStats = tools('gaming').getValue(user, chatId, null);
			if (userStats.xp >= tools('gaming').LevelEXP(userStats.level)) {
				tools('gaming').addValue(user, 1, chatId, 'level');
			}
			tools('gaming').addValue(botNumber, 1, chatId, 'msg'); /* Serve de N° de msgs recebidas */
		}

		/*Auto-stickers de fotos*/
		if (isGroupMsg && isActivated('autosticker') && isType('image') && !isCmd && !isBot && encryptMedia && !quotedMsgObj) {
			const mediaData = await decryptMedia(encryptMedia);
			await kill.sendImageAsSticker(chatId, mediaData, stickerConfig);
		}

		/*Auto-sticker de videos & gifs*/
		if (isGroupMsg && isActivated('autosticker') && isType('video') && !isCmd && !isBot && encryptMedia && !quotedMsgObj) {
			const mediaData = await decryptMedia(encryptMedia);
			await kill.sendMp4AsSticker(chatId, mediaData, null, stickMp4Config);
		}

		/*Comandos sem prefix, esse responde se marcar a BOT*/
		if (!tools('cooldown').isFiltered(chatId) && mentionedJidList.includes(botNumber)) {
			await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], id);
		}

		/*Comandos sem prefix mas configurados pelos ADM's de um grupo*/
		if (!tools('cooldown').isFiltered(chatId) && !isCmd && Object.keys(cmds).includes(chatId)) {
			let Only_ADM_M = Object.keys(cmds[chatId]).filter(j => cmds[chatId][j].Admin_Set == true);
			for (let Arr_CMDER of Only_ADM_M) {
				if (body.includes(Arr_CMDER)) {
					await kill.reply(chatId, cmds[chatId][Arr_CMDER].msg, id);
					break;
				}
			}
		}

		// Caso deseje criar siga o estilo disso abaixo, para usar a base remova a '; /*' & '*/', edite-a e pronto.
		/*if (!tools('cooldown').isFiltered(chatId) && !isCmd) {
			try {
				// Se não funcionar, tente mudar para -> body.toLowerCase() == 'Mensagem a receber'
				if (body.toLowerCase().includes('Mensagem a receber')) {
					await kill.reply(chatId, 'Resposta para enviar', id);
				}
			} catch (e) {
				// Esconde os erros pra não floodar o terminal, ative para exibir a versão simples, tire o '.message' para exibir tudo (NÃO RECOMENDADO!)
				// console.log(error.message)
			}
		}*/

		/*Comandos sem prefix no PV, esse responde mensagens, sem API - PS, pode quebrar comandos do PV*/
		/*if (!tools('cooldown').isFiltered(chatId) && !isGroupMsg && !isCmd && !encryptMedia) {
			await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], id);
		}*/

		/*Avisa para esperar o comando terminar*/
		if (isCmd && !V_CMDS.Ignore_CMDs.includes(command) && config.Wait_Message && allCommands.includes(command)) {
			Wait_Messages_Sent++;
			await kill.reply(chatId, mess.wait(Wait_Messages_Sent), id);
		}

		/* Roda diversos comandos ao mesmo tempo - Corrige automaticamente os digitados incorretamente */
		var multiCommand = [];
		if (config.Multitasking) {
			all_args.map(c => {
				if (config.Prefix.includes(c[0]) && !mentionedJidList.includes(c) && !tools('others').isUrl(c) && !tools('others').isFolder(c)) {
					let Command_List_Array = allCommands.replace(/\r/gim, '').split('\n').filter(v => v !== '');
					if (!Command_List_Array.includes(c.slice(1, (c.length / 2)))) {
						let best_choice = stringSimilarity.findBestMatch(c.slice(1), Command_List_Array);
						if (best_choice.bestMatch.rating >= Number(config.Minimal_Similarity_Command)) {
							multiCommand.push(best_choice.bestMatch.target);
						}
					} else if (Object.keys(cmds).includes(chatId) && Object.keys(cmds[chatId]).includes(c.slice(1)) || Object.keys(cmds.global).includes(c.slice(1))) {
						multiCommand.push(c.slice(1));
					} else {
						multiCommand.push(c.slice(1));
					}
				}
			});
		}
		if (multiCommand.length == 0 && isCmd) {
			multiCommand.push(command);
		}
		// Se você criar um comando, insira-o no arquivo 'Comandos_Automate.txt' para que ele funcione "adequadamente" em múltiplos comandos

		for (let i = 0; i < multiCommand.length; i++) {

			// Define os argumentos de forma mais correta em 2 comandos ou mais [EXPERIMENTAL = NÃO ESTÁ 100%]
			const cmd = multiCommand[i];

			// Especifica o inicio da body
			if (multiCommand.length > 1 && config.Multitasking) {

				// Define a nova body
				if (cmd == multiCommand[Number(i)+1]) {
					body = oldBodSave.slice(oldBodSave.indexOf(cmd), oldBodSave.lastIndexOf(cmd));
				} else if (multiCommand[Number(i)+1] !== null) {
					body = oldBodSave.slice(oldBodSave.indexOf(cmd), oldBodSave.indexOf(multiCommand[Number(i)+1]));
				} else {
					body = oldBodSave.slice(oldBodSave.indexOf(cmd), oldBodSave.length);
				}

				// Remove o prefixo dos demais args
				if (config.Prefix.includes(body.charAt(body.length-1))) {
					body = body.slice(0, body.length-1);
				}

				// Argumentos sub-sequentes
				args = body.trim().split(/ +/).slice(1);
				arg = body.trim().substring(body.indexOf(' ') + 1);
				arqs = body.trim().split(' ');
				argl = args.map(argl => argl.toLowerCase());
				arks = argl.join(' ');
				argc = args.map(argc => argc.toUpperCase());
		
			}

			// Body aprimorada para rodar os comandos como msg, print, covid, etc
			const Sliced_Body = oldBodSave.replace(cmd, '').replace(/^ /gi, '');

			switch (cmd) {

				case 'fake':
				case 'blacklist':
				case 'nsfw':
				case 'welcome':
				case 'goodbye':
				case 'mute':
				case 'anylinks':
				case 'antiporn':
				case 'levelup':
				case 'antilinks':
				case 'nodelete':
				case 'antitravas':
				case 'rank':
				case 'event':
				case 'autosticker':
				case 'advise':
				case 'safelinks':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						await tools('handler').switchs(argl[0], functions, cmd.toLowerCase(), chatId, mess.kldica1(), kill, message);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;
		
				case 'chatbot':
					if (!/[1-4]/.test(args[0]) || argl[0] == '-help') return await kill.reply(chatId, mess.changeAI(), id); // 5 = SimSimi com Key, se quiser, adicione na array, não acho boa ideia | !/[1-5]/.test(args[0])
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						functions.chatBot_Type[chatId] = argl[0];
						fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
						await kill.reply(chatId, mess.AIChanged(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'warn':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						if (argl[0] == '-help' || !quotedMsgObj && mentionedJidList.length == 0) return await kill.reply(chatId, mess.Warn_Nooo(), id);
						let Warn_Person = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : argl[0]+'@c.us');
						let Warn_Text = Sliced_Body.replace(Warn_Person.replace('@c.us', '').replace('@c.us', ''), '').slice(1);
						if (config.Owner.includes(Warn_Person) || groupAdmins.includes(Warn_Person)) return await kill.reply(chatId, mess.Wont_Warn(), id);
						if (!Object.keys(warn).includes(chatId)) {
							warn[chatId] = {};
						}
						if (!Object.keys(warn[chatId]).includes(Warn_Person)) {
							warn[chatId][Warn_Person] = 1;
						} else {
							warn[chatId][Warn_Person]++;
						}
						if (Number(warn[chatId][Warn_Person]) >= Number(config.Max_Warning)) {
							await kill.sendTextWithMentions(chatId, mess.Final_Warn(Warn_Person, Warn_Text, warn, chatId));
							await kill.removeParticipant(chatId, Warn_Person);
							delete warn[chatId][Warn_Person];
						} else await kill.sendTextWithMentions(chatId, mess.YouRe_Advised(warn, chatId, Warn_Person, Warn_Text));
						fs.writeFileSync('./lib/config/Gerais/warn.json', JSON.stringify(warn, null, "\t"));
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'bklist':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						const personToBK = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : argl[1]+'@c.us');
						if (argl[0] == 'on') {
							if (functions.antinumbers.includes(personToBK)) return await kill.reply(chatId, mess.jaenabled(), id);
							functions.antinumbers.push(personToBK);
							await kill.reply(chatId, mess.bkliston(), id);
						} else if (argl[0] == 'off') {
							if (!functions.antinumbers.includes(personToBK)) return await kill.reply(chatId, mess.jadisabled(), id);
							functions.antinumbers = functions.antinumbers.filter(bp => bp !== personToBK);
							await kill.reply(chatId, mess.bklistoff(), id);
						} else return await kill.reply(chatId, mess.kldica2(), id);
						fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;
		
				case 'vip':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner) {
						if (args.length < 2) return await kill.reply(chatId, mess.insertVIP(), id);
						if (!Object.keys(functions.vips).includes(chatId)) {
							functions.vips[chatId] = {};
						}
						let New_VIP_User = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : argl[1]+'@c.us');
						let Is_New_Vip = mentionedJidList.length !== 0 ? args[1] : (quotedMsgObj ? args[0] : argl[1]);
						let Use_Dar_CMDS = mentionedJidList.length !== 0 ? args[2] : (quotedMsgObj ? args[1] : argl[2]);
						if (Is_New_Vip == 'on') {
							functions.vips[chatId][New_VIP_User] = (Use_Dar_CMDS == 'on' ? true : false);
							if (Use_Dar_CMDS == 'on') {
								await kill.reply(chatId, mess.welcomeToMOD(V_CMDS.MOD_Commands), id);
							} else await kill.reply(chatId, mess.welcomeToVIP(V_CMDS.VIP_Commands), id);
						} else if (Is_New_Vip == 'off') {
							delete functions.vips[chatId][New_VIP_User];
							if (Use_Dar_CMDS == 'off') {
								await kill.reply(chatId, mess.goodbyeMOD(), id);
							} else await kill.reply(chatId, mess.goodbyeVIP(), id);
						} else return await kill.reply(chatId, mess.kldica2(), id);
						fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'onlyadms':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						if (argl[0] == 'on') {
							await kill.setGroupToAdminsOnly(chatId, true);
							await kill.sendText(chatId, mess.admson());
						} else if (argl[0] == 'off') {
							await kill.setGroupToAdminsOnly(chatId, false);
							await kill.sendText(chatId, mess.admsoff());
						} else return await kill.reply(chatId, mess.kldica1(), id);
						if (args[1] == '-time') {
							const Open_Close = argl[0] == 'off' ? true : false;
							await tools('others').sleep(Number(args[2]) * 60000);
							await kill.setGroupToAdminsOnly(chatId, Open_Close);
						}
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'revoke':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						await kill.revokeGroupInviteLink(chatId);
						await kill.reply(chatId, mess.revoga(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'setimage':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						if (isType('image')) {
							var picgp = await kill.getProfilePicFromServer(chatId);
							if (tools('others').isUrl(picgp)) {
								await kill.sendFileFromUrl(chatId, picgp, 'group.png', 'Backup', id);
							}
							const mediaData = await decryptMedia(encryptMedia);
							await kill.setGroupIcon(chatId, tools('others').dataURI(mimetype, mediaData));
						} else if (tools('others').isUrl(args[0])) {
							var picgpo = await kill.getProfilePicFromServer(chatId);
							if (!tools('others').isUrl(picgpo)) {
								await kill.sendFileFromUrl(chatId, picgpo, 'group.png', 'Backup', id);
							}
							const GP_iURL = await kill.setGroupIconByUrl(chatId, args[0]);
							if (GP_iURL == true) {
								if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
							} else await kill.reply(chatId, mess.cmdfailed(), id);
						} else await kill.reply(chatId, mess.onlyimg(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'link':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						const inviteLink = await kill.getGroupInviteLink(chatId);
						await kill.sendLinkWithAutoPreview(chatId, inviteLink, `\n❤️ - ${name} - ❤️`);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'everyone':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						if (arks.includes('-hideimage')) {
							var letImsg = await kill.getProfilePicFromServer(chatId);
							var theGpT = letImsg.includes('ERR') || letImsg == null || typeof letImsg == 'object' || !tools('others').isUrl(letImsg) ? config.Commands_Error_Photo : letImsg;
							await kill.sendFileFromUrl(chatId, theGpT, 'gpimg.png', mess.Everyone_Image(Sliced_Body, groupMembersId), id, {}, false, false, false, true, false);
						} else if (arks.includes('-hidereply')) {
							await kill.sendReplyWithMentions(chatId, mess.Everyone_Reply(Sliced_Body, groupMembersId), id, true);
						} else if (arks.includes('-hidetext') || arks.includes('-hide')) {
							await kill.sendTextWithMentions(chatId, mess.Everyone_Reply(Sliced_Body, groupMembersId), true);
						} else await kill.sendReplyWithMentions(chatId, mess.Everyone(Sliced_Body, groupMembersId), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'add':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						let addRobots = Sliced_Body.replace(/->/g, '').replace(/@/g, '').replace(/c.us/g, '').replace(/-/g, '').replace(/\+/g,'').replace(/ /g, '').split('').join('').replace(/\n/g, ' ').split(' ').filter(o => !isNaN(o) && o !== '' && o);
						if (addRobots.length == 0) return await kill.reply(chatId, mess.usenumber(), id);
						let failAtKill = mess.isInGroup();
						for (let ads of addRobots) {
							try {
								let is_Valid_Wa = await kill.checkNumberStatus(`${ads}@c.us`);
								if (groupMembersId.includes(`${is_Valid_Wa.id._serialized}`) || !is_Valid_Wa.numberExists) {
									failAtKill += `-> @${ads} \n`;
									if (addRobots.length == 1) return await kill.sendTextWithMentions(chatId, failAtKill + mess.stopNoMore());
								} else await kill.addParticipant(chatId, `${is_Valid_Wa.id._serialized}`);
							} catch (error) {
								tools('others').reportConsole(cmd, error);
								console.log(error);
							}
						}
						if (failAtKill !== mess.isInGroup()) return await kill.sendTextWithMentions(chatId, failAtKill);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'unban':
				case 'unkick':
					try {
						if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
						if (!quotedMsgObj) return await kill.reply(chatId, mess.nomark, id);
						if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
							if (groupMembersId.includes(quotedMsgObj.sender.id)) return await kill.reply(chatId, mess.janogp(), id);
							await kill.sendTextWithMentions(chatId, mess.unban(quotedMsgObj.sender.id));
							await kill.addParticipant(chatId, quotedMsgObj.sender.id);
						} else if (isGroupMsg) {
							await kill.reply(chatId, mess.soademiro(), id);
						} else await kill.reply(chatId, mess.sogrupo(), id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.addpessoa() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				case 'kick':
				case 'k':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						let wontBan = mess.notInOrVIP();
						var banPerson = quotedMsg || quotedMsgObj ? new Array(quotedMsgObj.sender.id) : (mentionedJidList ? mentionedJidList : false);
						if (banPerson == false) return await kill.reply(chatId, mess.semmarcar(), id);
						await kill.sendTextWithMentions(chatId, mess.kick(banPerson.map(p => p.replace('@c.us', ''))));
						for (let i = 0; i < banPerson.length; i++) {
							if (config.Owner.includes(banPerson[i]) || groupAdmins.includes(banPerson[i]) || botNumber.includes(banPerson[i]) || !groupMembersId.includes(banPerson[i])) {
								wontBan += `-> @${banPerson[i].replace('@c.us', '')}\n`;
								if (banPerson.length == 1) return await kill.sendTextWithMentions(chatId, wontBan+mess.stopNoMore());
							} else await kill.removeParticipant(chatId, banPerson[i]);
						}
						if (wontBan !== mess.notInOrVIP()) return await kill.sendTextWithMentions(chatId, wontBan);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'sair':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						await kill.sendText(chatId, mess.goodbye());
						await kill.leaveGroup(chatId);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'promote':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						let wontPromote = mess.isAnAdmin();
						var promoPerson = quotedMsg || quotedMsgObj ? new Array(quotedMsgObj.sender.id) : (mentionedJidList ? mentionedJidList : false);
						if (promoPerson == false) return await kill.reply(chatId, mess.semmarcar(), id);
						await kill.sendTextWithMentions(chatId, mess.promote(promoPerson.map(p => p.replace('@c.us', ''))));
						for (let i = 0; i < promoPerson.length; i++) {
							if (groupAdmins.includes(promoPerson[i]) || !groupMembersId.includes(promoPerson[i])) {
								wontPromote += `-> @${promoPerson[i].replace('@c.us', '')}\n`;
								if (promoPerson.length == 1) return await kill.sendTextWithMentions(chatId, wontPromote+mess.stopNoMore());
							} else await kill.promoteParticipant(chatId, promoPerson[i]);
						}
						if (wontPromote !== mess.isAnAdmin()) return await kill.sendTextWithMentions(chatId, wontPromote);
						if (args[0] == '-time' && !isNaN(args[1])) {
							await tools('others').sleep(Number(args[1]));
							await kill.sendText(chatId, mess.Temp_Promote());
							for (let prote of promoPerson) {
								await kill.demoteParticipant(chatId, prote);
							}
						}
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'demote':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						let wontDemon = mess.isNotAnAdmin();
						var demonBitch = quotedMsg || quotedMsgObj ? new Array(quotedMsgObj.sender.id) : (mentionedJidList ? mentionedJidList : false);
						if (demonBitch == false) return await kill.reply(chatId, mess.semmarcar(), id);
						await kill.sendTextWithMentions(chatId, mess.demote(demonBitch.map(p => p.replace('@c.us', ''))));
						for (let i = 0; i < demonBitch.length; i++) {
							if (!groupAdmins.includes(demonBitch[i]) || !groupMembersId.includes(demonBitch[i])) {
								wontDemon += `-> @${demonBitch[i].replace('@c.us', '')}\n`;
								if (demonBitch.length == 1) return await kill.sendTextWithMentions(chatId, wontDemon+mess.stopNoMore());
							} else await kill.demoteParticipant(chatId, mentionedJidList[i]);
						}
						if (wontDemon !== mess.isNotAnAdmin()) return await kill.sendTextWithMentions(chatId, wontDemon);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'delete':
				case 'del':
					if (quotedMsgObj && !quotedMsgObj.fromMe) return await kill.reply(chatId, mess.mymess(), id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						await kill.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'admins':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						await kill.reply(chatId, mess.admins(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'ghost':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (isNaN(args[0])) return await kill.reply(chatId, mess.kickcount(), id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						let groupWelcome = false;
						let groupGoodbye = false;
						var userRem = mess.noGhosts(args);
						await kill.reply(chatId, mess.superMarilis(), id);
						if (functions.welcome.includes(chatId)) {
							groupWelcome = true;
							functions.welcome.splice(chatId, 1);
							if (functions.goodbye.includes(chatId)) {
								groupGoodbye = true;
								functions.goodbye.splice(chatId, 1);
							}
							fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
						}
						for (let member of groupMembersId) {
							var msgQuantity = (tools('gaming').getValue(member, chatId, 'msg') || 0);
							msgQuantity = isNaN(msgQuantity) ? 0 : Number(msgQuantity);
							if (!groupAdmins.includes(member) && chat.groupMetadata.owner !== member && !botNumber.includes(member) && !config.Owner.includes(member) && Number(args[0]) > msgQuantity) {
								await kill.removeParticipant(chatId, member);
								userRem += `-> ${member.replace('@c.us', '')} \n`;
							}
						}
						if (groupWelcome) {
							functions.welcome.push(chatId);
							if (groupGoodbye) {
								functions.goodbye.push(chatId);
							}
							fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
						}
						if (userRem !== mess.noGhosts(args)) return await kill.sendText(chatId, '|'+userRem);
						if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				/*Obrigado pela base Leonardo*/
				case 'softban':
					try {
						if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
							if (args.length == 0 || isNaN(args[0]) && isNaN(args[1]) || !quotedMsgObj && mentionedJidList.length == 0) return await kill.reply(chatId, mess.nomark() + ' + time/tempo (minutos/minutes)\n\nExemplo -> "${prefix}Softban 30 @user1 @user2"', id);
							if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
							var banThisGuy = quotedMsg || quotedMsgObj ? new Array(quotedMsgObj.sender.id) : (mentionedJidList ? mentionedJidList : false);
							if (banThisGuy == false) return await kill.reply(chatId, mess.nomark() + ' + time/tempo (minutos/minutes)\n\nExemplo -> "${prefix}Softban 30 @user1 @user2"', id);
							await kill.sendTextWithMentions(chatId, mess.irritouml(banThisGuy, args));
							let notBanned = mess.notInOrVIP();
							let banLength = 0;
							for (let i = 0; i < banThisGuy.length; i++) {
								if (config.Owner.includes(banThisGuy[i]) || groupAdmins.includes(banThisGuy[i]) || botNumber.includes(banThisGuy[i]) || !groupMembersId.includes(banThisGuy[i])) {
									notBanned += `\n-> @${banThisGuy[i].replace('@c.us', '')}`;
									if (banThisGuy.length == 1) return await kill.sendTextWithMentions(chatId, notBanned+mess.stopNoMore());
								} else {
									await kill.removeParticipant(chatId, banThisGuy[i]);
									banLength++;
								}
							}
							if (notBanned !== mess.notInOrVIP()) {
								await kill.sendTextWithMentions(chatId, notBanned);
							}
							if (banLength == 0) return;
							await tools('others').sleep(Number(args[0] * 60000));
							groupMembersId = await kill.getGroupMembersId(chatId);
							await kill.reply(chatId, mess.timeadd(), id);
							notBanned = mess.isInGroup();
							banLength = 0;
							for (let i = 0; i < banThisGuy.length; i++) {
								if (groupMembersId.includes(banThisGuy[i])) {
									notBanned += `\n-> @${banThisGuy[i].replace('@c.us', '')}`;
									if (banThisGuy.length == 1) return await kill.sendTextWithMentions(chatId, notBanned+mess.stopNoMore());
								} else {
									await kill.addParticipant(chatId, banThisGuy[i]);
									banLength++;
								}
							}
							if (notBanned !== mess.isInGroup()) {
								await kill.sendTextWithMentions(chatId, notBanned);
							}
							if (banLength == 0) return;
							await tools('others').sleep(2000);
							await kill.sendText(chatId, mess.voltargp());
						} else if (isGroupMsg) {
							await kill.reply(chatId, mess.soademiro(), id);
						} else await kill.reply(chatId, mess.sogrupo(), id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.addpessoa() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				case 'destrava':
					if (isGroupMsg && isGroupAdmins || isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						let howmuch = !isNaN(args[0]) ? args[0] : 1;
						await kill.reply(chatId, mess.destrava().repeat(Number(howmuch)), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'newprefix':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						if (args.length == 0 || argl[0] == '-help') return await kill.reply(chatId, mess.noargs() + 'new prefix.', id);
						ctmprefix[chatId] = args[0];
						fs.writeFileSync('./lib/config/Gerais/prefix.json', JSON.stringify(ctmprefix, null, "\t"));
						await kill.reply(chatId, mess.newprefix(args), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;
		
				case 'hideOwner':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (argl[0] !== 'on' && argl[0] !== 'off') return await kill.reply(chatId, mess.kldica2(), id);
					const hideShowN = argl[0] == 'on' ? true : false;
					await kill.reply(chatId, mess.hideOwner(hideShowN), id);
				break;

				case 'newlang':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd) || arks.includes('-me')) {
						const Limit_Single = argl[1] == '-me' ? user : chatId;
						if (!/en|es|pt/gim.test(argl[0])|| !Object.keys(languages).includes(argl[0]) || languages[argl[0]].includes(Limit_Single)) return await kill.reply(chatId, mess.usinglang(), id);
						Object.keys(languages).map(g => {
							if (languages[g].includes(Limit_Single)) {
								languages[g] = languages[g].filter(o => o !== Limit_Single);
							}
						});
						languages[argl[0]].push(Limit_Single);
						fs.writeFileSync('./lib/config/Gerais/lang.json', JSON.stringify(languages, null, "\t"));
						await kill.reply(chatId, mess.enabled(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'greet':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						if (args.length <= 1 || !arks.includes('|') || argl[0] == '-help') return await kill.reply(chatId, mess.customWlc() + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
						hail[chatId] = {
							"welcome": {
								message: `${arg.split('|')[0]}`,
								onlyText: arg.split('|')[1].replace(' ', '') == 'on' ? true : false
							}
						};
						fs.writeFileSync('./lib/config/Gerais/greetings.json', JSON.stringify(hail, null, "\t"));
						await kill.reply(chatId, mess.enabled(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'bye':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						if (args.length <= 1 || !arks.includes('|') || argl[0] == '-help') return await kill.reply(chatId, mess.customWlc() + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
						hail[chatId] = {
							"goodbye": {
								message: `${arg.split('|')[0]}`,
								onlyText: arg.split('|')[1].replace(' ', '') == 'on' ? true : false
							}
						};
						fs.writeFileSync('./lib/config/Gerais/greetings.json', JSON.stringify(hail, null, "\t"));
						await kill.reply(chatId, mess.enabled(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				/*Feito por Pedro Batistop*/
				case 'dellast':
					if (isNaN(args[0])) return await kill.reply(chatId, mess.onlynumber(), id);
					if (isGroupMsg && isGroupAdmins || isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						try {
							var lastMes = (await kill.getAllMessagesInChat(chatId, true)).filter(my => my.sender.id == botNumber && my.type !== "revoked");
							lastMes = (lastMes.slice(Math.max(lastMes.length - Number(args[0]), 0))).map(m => m.id);
							await kill.deleteMessage(chatId, lastMes);
						} catch (error) {
							await kill.reply(chatId, mess.dellastmsg(args[0]), id);
							tools('others').reportConsole(cmd, error);
						}
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'broad':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (args.length == 0) return await kill.reply(chatId, mess.broad(), id);
					const chatall = await kill.getAllChatIds();
					const isGroupC = chatall.filter(group => group.includes('@g.us'));
					const isPrivateC = chatall.filter(privat => privat.includes('@c.us'));
					try {
						const isFiler = isType('image') || isType('audio') || isType('ptt') || isType('video') || isType('sticker') || isType('document') || isType('ptt');
						const canCaption = isType('video') || isType('image');
						if (argl[0] == '-all') {
							for (let ids of chatall) {
								const chopn = await kill.getChatById(ids);
								if (!chopn.isReadOnly) {
									try {
										await Broad_Files(isFiler, canCaption, kill, ids, encryptMedia, pushname, body, cmd);
									} catch (error) {
										console.log(tools('others').color('[BROADCAST]', 'crimson'), tools('others').color(`→ Uma das mensagens não foi enviada - Você pode ignorar.`, 'gold'));
									}
								}
							}
							if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
						} else if (argl[0] == '-gps') {
							for (let ids of isGroupC) {
								const check_open = await kill.getChatById(ids);
								if (!check_open.isReadOnly) {
									try {
										await Broad_Files(isFiler, canCaption, kill, ids, encryptMedia, pushname, body, cmd);
									} catch (error) {
										console.log(tools('others').color('[BROADCAST]', 'crimson'), tools('others').color(`→ Uma das mensagens não foi enviada - Você pode ignorar.`, 'gold'));
									}
								}
							}
							if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
						} else if (argl[0] == '-pvs') {
							for (let ids of isPrivateC) {
								try {
									await Broad_Files(isFiler, canCaption, kill, ids, encryptMedia, pushname, body, cmd);
								} catch (error) {
									console.log(tools('others').color('[BROADCAST]', 'crimson'), tools('others').color(`→ Uma das mensagens não foi enviada - Você pode ignorar.`, 'gold'));
								}
							}
							if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
						} else await kill.reply(chatId, mess.broad(), id);
					} catch (error) {
						await kill.reply(chatId, mess.noctt() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
						tools('others').reportConsole(cmd, error);
					}
				break;

				case 'arquivar':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					if (isGroupCreator || isOwner) {
						let notFuk = mess.readdArq();
						for (let memb of groupMembersId) {
							if (!groupAdmins.includes(memb) && chat.groupMetadata.owner !== memb && botNumber !== memb && !config.Owner.includes(memb)) {
								await kill.removeParticipant(chatId, memb);
								if (groupMembersId.length == 3) return await kill.sendTextWithMentions(chatId, notFuk+mess.stopNoMore());
								notFuk += `-> ${memb.replace('@c.us', '')} \n`;
							}
						}
						if (notFuk !== mess.readdArq()) return await kill.sendTextWithMentions(chatId, '|'+notFuk);
						if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
					} else await kill.reply(chatId, mess.gpowner(), id);
				break;

				case 'leave':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					var allGroups = (await kill.getAllChatIds()).filter(x => x.includes('@g.us') && x !== chatId);
					for (let idl of allGroups) {
						await kill.sendText(idl, mess.goodbye());
						await kill.leaveGroup(idl);
					}
					if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
				break;

				case 'startup':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (args.length == 0 || argl[0] == 'on' || argl[0] == 'off') return await kill.reply(chatId, mess.onoff() + '\n\n' + mess.kldica1(), id);
					config.StartUP_MSGs_Groups = (argl[0] == 'on' ? true : false);
					fs.writeFileSync('./lib/config/Settings/config.json', JSON.stringify(config, null, "\t"));
					if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id)	;
				break;

				case 'clear':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					const all_Private = (await kill.getAllChatIds()).filter(x => x.includes('@c.us'));
					for (let chatCr of all_Private) {
						await kill.deleteChat(chatCr);
					}
					await tools('others').sleep(10000); // Espera 10 seg
					await kill.clearAllChats(); // Limpa todos os grupos sem apagar eles
					if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
				break;

				case 'tela':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					const sesPic = await kill.getSnapshot();
					await kill.sendFile(chatId, sesPic, 'session.png', 'Neh...', id);
				break;
		
				case 'getlinks':
					if (isGroupMsg) return await kill.reply(chatId, mess.sopv(), id);
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					const getAll_Groups = (await kill.getAllChatIds()).filter(x => x.includes('@g.us'));
					var group_Links = mess.Heres_Link();
					for (let gpid of getAll_Groups) {
						const The_Bot_Admin = await kill.getGroupAdmins(gpid);
						if (The_Bot_Admin.includes(botNumber)) {
							const get_Invite = await kill.getGroupInviteLink(gpid);
							try {
								const Invite_Info = await kill.inviteInfo(get_Invite);
								if (Invite_Info.status == 200) {
									group_Links += mess.Adc_Links(Invite_Info, get_Invite, timeCreation(Invite_Info.groupMetadata.creation));
								} else {
									group_Links += `🌐 Link -> ${get_Invite}\n\n『——————————————————』\n\n`;
								}
							} catch (error) {
								tools('others').reportConsole(cmd, error);
								group_Links += `🌐 Link -> ${get_Invite}\n\n『——————————————————』\n\n`;
							}
						}
					}
					await kill.reply(chatId, group_Links, id);
				break;

				case 'status':
					const statusFromWho = [user].concat(mentionedJidList.length !== 0 ? mentionedJidList : (quotedMsg || quotedMsgObj ? new Array(quotedMsgObj.sender.id) : new Array(botNumber)));
					var allRec = mess.recStatus();
					for (let userSt of statusFromWho) {
						const recStat = await kill.getStatus(userSt);
						allRec += `\n@${userSt.replace('@c.us', '')} -> ${recStat.status || 'Status oculto'}\n`;
					}
					await kill.sendTextWithMentions(chatId, allRec);
				break;
		
				case 'botadmin':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					let irisAdmin = await kill.iAmAdmin().then(res => res.map(j => `\n-> ${typeof j == 'object' ? j._serialized : j}`).join('\n'));
					await kill.reply(chatId, mess.gpIamAdmin() + '\n\n' + irisAdmin, id);
				break;

				case 'blocklist':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					await kill.sendTextWithMentions(chatId, `🔐 - Block: ${blockNumber.length}\n\n${blockNumber.join('\n➸ @').replace(/@c.us/g, '')}`);
				break;

				case 'shutdown':
				case 'encerrar':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (argl[0] == 'cancel') {
						onShutdown = false;
						clearInterval(stop_intvl);
						await kill.reply(chatId, mess.Stop_Shutdown(), id);
					} else if (argl[0] == 'nousage') {
						var no_US_Time = !isNaN(args[1]) ? (Number(args[1]) * 60000) / 2 : 300000;
						no_US_Time = no_US_Time < 300000 ? 300000 : no_US_Time;
						Shutdown_Without = Number(no_US_Time);
						Shutdown_NO(Shutdown_Without, kill);
						await kill.reply(chatId, mess.Ok_DieTimes(Shutdown_Without), id);
					} else {
						var timeToShut = !isNaN(args[0]) ? Number(args[0]) * 1000 : 30000;
						timeToShut = timeToShut < 10000 ? 10000 : timeToShut; // Força a ser no mínimo 10 segundos, questão de segurança
						await kill.reply(chatId, mess.shutdown((timeToShut / 1000).toString()) + mess.ignStop() + `\n\nIf you want to cancel the shutdown, type "${prefix}Exec onShutdown = false" or "${prefix}Shutdown Cancel" before the timer runs out, make sure to run this at MINIMUM 10 seconds early.\n\nSi desea cancelar el shutdown, escriba "${prefix}Exec onShutdown = false" o "${prefix}Shutdown Cancel" antes de que se agote el tiempo, asegúrese de ejecutarlo en lo MÍNIMO 10 segundos antes.`, id);
						onShutdown = true;
						config.SafeBoot = 0;
						fs.writeFileSync('./lib/config/Settings/config.json', JSON.stringify(config, null, "\t"));
						await tools('others').sleep(timeToShut);
						if (onShutdown == true) {
							await kill.kill();
						}
					}
				break;

				case 'create':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(chatId, mess.newgp(), id);
					const peopleAdd = [user].concat((mentionedJidList.length !== 0 ? mentionedJidList : (quotedMsg || quotedMsgObj ? new Array(quotedMsgObj.sender.id) : new Array(user))));
					await kill.createGroup(arg.split('|')[0], Array.from(new Set(peopleAdd)));
					if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
				break;

				case 'dono':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					await kill.reply(chatId, mess.owner(), id);
				break;

				case 'cmd':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					await kill.reply(chatId, mess.cmd(), id);
					const cmdw = shell.exec(`bash -c "${Sliced_Body}"`, {
						silent: true
					});
					const CMD_OUT = cmdw.stdout || cmdw.stderr;
					console.log(CMD_OUT);
					await kill.reply(chatId, CMD_OUT, id);
				break;

				case 'mutepv':
					if (args.length == 0) return await kill.reply(chatId, mess.kldica2(), id);
					let pvmt = argl[0] == 'on' ? `${body.slice(11)}@c.us` : `${body.slice(12)}@c.us`;
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (argl[0] == 'on') {
						if (functions.mute.includes(pvmt)) return await kill.reply(chatId, mess.enabled(), id);
						functions.mute.push(pvmt);
						fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
						await kill.reply(chatId, mess.enabled(), id);
					} else if (argl[0] == 'off') {
						if (!functions.mute.includes(pvmt)) return await kill.reply(chatId, mess.jadisabled(), id);
						functions.mute.splice(pvmt, 1);
						fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
						await kill.reply(chatId, mess.disabled(), id);
					} else return await kill.reply(chatId, mess.kldica2(), id);
				break;

				case 'unblock':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (isGroupMsg && quotedMsgObj || isGroupMsg && mentionedJidList.length !== 0 || args.length !== 0) {
						const unblokea = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : args[0] + '@c.us');
						await kill.contactUnblock(`${unblokea}`);
						await kill.sendTextWithMentions(chatId, mess.unblock(unblokea));
					} else await kill.reply(chatId, mess.semmarcar(), id);
				break;

				case 'block':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (isGroupMsg && quotedMsgObj || isGroupMsg && mentionedJidList.length !== 0 || args.length !== 0) {
						const blokea = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : args[0] + '@c.us');
						await kill.contactBlock(`${blokea}`);
						await kill.sendTextWithMentions(chatId, mess.block(blokea));
					} else await kill.reply(chatId, mess.semmarcar(), id);
				break;

				case 'give':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (args.length <= 2 || argl[0] == 'coin' || argl[0] == 'level' || argl[0] == 'xp' || argl[0] == 'dima' || argl[0] == 'rubi') {
						var userGainXp = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : user);
						var theValuetoAdd = quotedMsgObj ? args[1] : (mentionedJidList.length !== 0 ? args[2] : args[2]);
						if (isNaN(theValuetoAdd)) return await kill.reply(chatId, mess.onlynumber(), id);
						tools('gaming').addValue(userGainXp, Number(theValuetoAdd), chatId, argl[0]);
						await kill.sendTextWithMentions(chatId, mess.gainxp(userGainXp, theValuetoAdd) + argc[0] + '.');
					} else await kill.reply(chatId, mess.semmarcar() + `\n\nEx: ${prefix}give -xp/-level/-coin @user <value/valor>`, id);
				break;

				case 'botnome':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					if (Sliced_Body.length >= 25) return await kill.reply(chatId, mess.letlimit() + '25.', id);
					await kill.setMyName(Sliced_Body);
					if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
				break;

				case 'recado':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					if (Sliced_Body.length >= 250) return await kill.reply(chatId, mess.letlimit() + '250.', id);
					await kill.setMyStatus(Sliced_Body);
					if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
				break;

				case 'desc':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
						if (Sliced_Body.length >= 512) return await kill.reply(chatId, mess.letlimit() + '512.', id);
						const Old_Desc = await kill.getGroupInfo(chatId);
						await kill.reply(chatId, 'Backup:\n'+Old_Desc.description, id);
						await kill.setGroupDescription(chatId, Sliced_Body);
						if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'botfoto':
					if (!isType('image')) return await kill.reply(chatId, mess.onlyimg(), id);
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					const bkmypic = await kill.getProfilePicFromServer(botNumber);
					if (typeof bkmypic == 'object' || !tools('others').isUrl(bkmypic)) {
						await kill.reply(chatId, mess.failIMGbackup(), id);
					} else await kill.sendFileFromUrl(chatId, bkmypic, 'backup.jpg', 'Backup', id);
					const mediaData = await decryptMedia(encryptMedia);
					await kill.setProfilePic(tools('others').dataURI(`${encryptMedia.mimetype}`, mediaData));
					if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
				break;

				case 'exec':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + `JS Code/Código.`, id);
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					try {
						eval(Sliced_Body);
						await kill.reply(chatId, mess.Code_Worked(), id);
					} catch (error) {
						console.log(tools('others').color('[EXEC]', 'crimson'), tools('others').color(`→ Obtive erros no comando ${prefix}${cmd} → ${error.message} - Você pode ignorar.`, 'gold'));
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'resetall':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					fs.writeFileSync('./lib/config/Utilidades/lolicon.txt', 'Lolicons ↓');
					fs.writeFileSync('./lib/config/Utilidades/reversecon.txt', 'Menores Denunciados ↓');
					fs.writeFileSync('./lib/config/Utilidades/entregados.txt', 'Auto-denuncias ↓');
					fs.writeFileSync('./lib/config/Utilidades/gaysreport.txt', 'LGTB\'S Denunciados ↓');
					fs.writeFileSync('./lib/config/Utilidades/crimereport.txt', 'Crimes Reportados ↓');
					if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
				break;

				case 'nolimit':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (argl[0] == 'on' || argl[0] == 'off') {
						if (argl[0] == 'on') {
							fs.writeFileSync('./lib/config/Gerais/limit.json', JSON.stringify(JSON.parse("{\n\t\"games\": {},\n\t\"steal\": {},\n\t\"guild\": {},\n\t\"bank\": {},\n\t\"reward\": {}\n}"), null, "\t"));
						}
						objconfig.noLimits = argl[0] == 'on' ? 1 : 0;
						if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
					} else return await kill.reply(chatId, mess.kldica2(), id);
				break;

				case 'muteall':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (argl[0] == 'on' || argl[0] == 'off') {
						objconfig.isMuteAll = argl[0] == 'on' ? 1 : 0;
						if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
					} else return await kill.reply(chatId, mess.kldica2(), id);
				break;

				case 'noadms':
				case 'noadmin':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					if (isGroupCreator || isOwner) {
						let wontDemote = mess.goodbyeAdmin();
						for (let noadms of groupAdmins) {
							if (chat.groupMetadata.owner !== noadms || !config.Owner.includes(noadms) || botNumber !== noadms) {
								wontDemote += `-> @${noadms.replace('@c.us', '')}\n`;
								if (groupAdmins.length == 3) return await kill.sendTextWithMentions(chatId, wontDemote+mess.stopNoMore());
								await kill.demoteParticipant(chatId, noadms);
							}
						}
						if (wontDemote !== mess.goodbyeAdmin()) return await kill.sendTextWithMentions(chatId, wontDemote);
						if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
					} else await kill.reply(chatId, mess.gpowner(), id);
				break;

				case 'alladms':
				case 'alladmin':
					if (!isBotGroupAdmins) return await kill.reply(chatId, mess.botademira(), id);
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					if (isGroupCreator || isOwner) {
						let isGerent = mess.isAnAdmin();
						for (let memb of groupMembersId) {
							if (groupAdmins.includes(memb)) {
								isGerent += `-> @${memb.replace('@c.us', '')}\n`;
								if (groupMembersId.length == 3) return await kill.sendTextWithMentions(chatId, isGerent+mess.stopNoMore());
							} else await kill.promoteParticipant(chatId, memb);
						}
						if (isGerent !== mess.isAnAdmin()) return await kill.sendTextWithMentions(chatId, isGerent);
						if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
					} else await kill.reply(chatId, mess.gpowner(), id);
				break;

				case 'reload':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					await kill.refresh();
					await kill.reply(chatId, mess.refreshed(), id);
				break;
		
				case 'reboot':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					await kill.reply(chatId, mess.rebootM(), id);
					try {
						let isWorked = shell.exec(`pm2 reload iris`, {
							silent: true
						});
						if (isWorked) return await kill.reply(chatId, mess.pmReboot(), id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'type':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (args.length == 0) return await kill.reply(chatId, mess.onoff(), id);
					if (argl[0] == 'on') {
						objconfig.isTyping.push(chatId);
						await kill.reply(chatId, mess.enabled(), id);
					} else if (argl[0] == 'off') {
						objconfig.isTyping.splice(chatId, 1);
						await kill.reply(chatId, mess.disabled(), id);
					} else return await kill.reply(chatId, mess.kldica2(), id);
				break;

				case 'darkmode':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (args.length == 0) return await kill.reply(chatId, mess.onoff(), id);
					if (argl[0] == 'on' || argl[0] == 'off') {
						const downORstart = argl[0] == 'on' ? true : false;
						await kill.darkMode(downORstart);
						if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
					} else return await kill.reply(chatId, mess.kldica2(), id);
				break;

				case 'star':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (args.length == 0) return await kill.reply(chatId, mess.onoff(), id);
					if (!quotedMsgObj) return await kill.reply(chatId, mess.nomark(), id);
					if (argl[0] == 'on') {
						await kill.starMessage(quotedMsgObj.id);
					} else await kill.unstarMessage(quotedMsgObj.id);
				break;

				case 'upload':
					try {
						if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
						if (args.length < 2 || !arks.includes('|')) return await kill.reply(chatId, mess.filesend(), id);
						const files_upload = arg.split('|').map(i => i.replace(/^ /g, '').replace(/ $/g, ''));
						await kill.sendFile(chatId, files_upload[0], files_upload[1], '', id);
					} catch (err) {
						console.log(err);
						await kill.reply(chatId, mess.filexist(args), id);
					}
				break;

				case 'sticker':
				case 'fig':
				case 'figurinha':
				case 'stiker':
				case 'f':
				case 's':
				case 'st':
				case 'stickergif':
				case 'gif':
				case 'g':
				case 'gifsticker':
					try {
						if (argl[0] == '-help') return await kill.reply(chatId, mess.sticker(), id);
						if (isType('image') || isType('image/png') || isType('image/jpeg') || isType('image/webp') || isType('image/bmp')) {
							const mediaData = await decryptMedia(encryptMedia);
							stickerConfig.circle = arks.includes('-circle') ? true : false;
							stickerConfig.keepScale = arks.includes('-cut') ? false : true;
							if (arks.includes('-fill')) return await sharpre(mediaData, kill, chatId, stickerConfig);
							await kill.sendImageAsSticker(chatId, mediaData, stickerConfig);
						} else if (isType('video') || isType('image/gif')) {
							try {
								const mediaData = await decryptMedia(encryptMedia);
								await kill.sendMp4AsSticker(chatId, mediaData, null, stickMp4Config);
							} catch (error) {
								await kill.reply(chatId, mess.gifail(), id);
							}
						} else if (args.length == 1) {
							if (tools('others').isUrl(args[0])) {
								stickerConfig.circle = arks.includes('-circle') ? true : false;
								stickerConfig.keepScale = arks.includes('-cut') ? false : true;
								await mandarFig(kill, chatId, args[0], stickerConfig);
							} else await kill.reply(chatId, mess.nolink(), id);
						} else await kill.reply(chatId, mess.sticker(), id);
					} catch (err) {
						await kill.reply(chatId, 'Obtive alguns erros em fazer desta forma, se estiver usando o comando dentro da midia, tente usar o comando marcando ela.', id);
						tools('others').reportConsole(cmd, err);
					}
				break;

				case 'ttp':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers | color (english).', id);
					let ttpstker = await text2png(wordwrap(arg.split('|')[0], {
						width: 20
					}), {
						font: '80px sans-serif',
						color: 'white',
						strokeWidth: 2,
						strokeColor: (arg.split('|')[1] || ' white').slice(1),
						textAlign: 'center',
						lineSpacing: 10,
						padding: 20,
						backgroundColor: 'transparent'
					});
					await kill.sendImageAsSticker(chatId, ttpstker, stickerConfig);
				break;

				case 'attp':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					let attp = await tools('attp').create(Sliced_Body);
					await kill.sendImageAsSticker(chatId, attp, stickerConfig);
				break;

				case 'emoji':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'emoji.', id);
					let emoji = new EmojiAPI();
					let Get_Moji = extmoji(args[0]);
					if (Get_Moji.length == 0) return await kill.reply(chatId, mess.noargs() + 'valid emoji.', id);
					const Emoji_Data = await emoji.get(Get_Moji[0].name);
					if (Emoji_Data.emoji == null) return await kill.reply(chatId, mess.noemoji(), id);
					await kill.reply(chatId, `Emoji: ${Emoji_Data.emoji}\n\nUnicode: ${Emoji_Data.unicode}\n\nNome: ${Emoji_Data.name}\n\nInformações: ${Emoji_Data.description}\n\n` + Emoji_Data.images.map(res => `${res.vendor} → ${res.url}\n\n`) + mess.emojis(), id);
					await mandarFig(kill, chatId, Emoji_Data.images[0].url, stickerConfig);
				break;

				case 'getsticker':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					let filterAdu = isActivated('nsfw') || isActivated('antiporn') ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT;
					const getSticker = await duck.search(Sliced_Body, filterAdu);
					if (getSticker.length == 0) return await kill.sendFileFromUrl(chatId, config.Commands_Error_Photo, '', mess.noresult() + '\n\nTãn tãn tãn...', id);
					const Sticker_Images_G = getSticker.map(c => c.image);
					await mandarFig(kill, chatId, tools('others').randVal(Sticker_Images_G), stickerConfig);
				break;

				case 'wasted':
					try {
						let thePicWasted = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
						const wasting = await canvacord.Canvas.wasted(thePicWasted[0]);
						await kill.sendFile(chatId, tools('others').dataURI('image/png', wasting), `wasted.png`, '', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;
		
				case 'toon':
					try {
						let toonPerson = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
						var tdaip = await deepai.callStandardApi("toonify", {
							image: toonPerson[0],
						});
						await kill.sendFileFromUrl(chatId, tdaip.output_url, 'toon.png', mess.Toonify(), id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;
		
				case 'colorfy':
					if (isType('image')) {
						const mediaData = await decryptMedia(encryptMedia);
						var colorOld = await tools('cloud').upload(mediaData);
						var cphot = await deepai.callStandardApi("colorizer", {
							image: colorOld,
						});
						await kill.sendFileFromUrl(chatId, cphot.output_url, 'color.png', mess.photoWord()+'\n\n'+mess.donotuse(), id);
					} else await kill.reply(chatId, mess.onlyimg(), id);
				break;
		
				case 'textify':
				case 'maketext':
					if (args.length == 0 || argl[0] == '-help') return await kill.reply(chatId, mess.textify(), id);
					let textGen = arks.includes('-orig') ? Sliced_Body.replace('-orig', '') : Sliced_Body;
					var neweTx = await deepai.callStandardApi("text-generator", {
						text: textGen,
					});
					if (region == 'en' || arks.includes('-orig')) return await kill.reply(chatId, neweTx.output+'...', id);
					const textext = (await translate(neweTx.output, {
						to: region
					})).text;
					await kill.reply(chatId, textext+'...', id);
					await kill.reply(chatId, mess.donotuse(), id);
				break;

				case 'reduce':
					if (args.length == 0) return await kill.reply(chatId, mess.reduceText(), id);
					var summar = await deepai.callStandardApi("summarization", {
						text: Sliced_Body,
					});
					await kill.reply(chatId, summar.output, id);
					await kill.reply(chatId, mess.donotuse(), id);
				break;

				case 'trigger':
					try {
						let getTrigger = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
						const triggering = await canvacord.Canvas.trigger(getTrigger[0]);
						await kill.sendFile(chatId, tools('others').dataURI('image/png', triggering), `trigger.png`, 'Run...', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

					/*LEMBRE-SE, REMOVER CRÈDITO È CRIME E PROIBIDO*/
				case 'about':
					await kill.sendFileFromUrl(chatId, 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/iris.jpg', 'iris.png', mess.about(), id);
					await kill.reply(chatId, mess.everhost(), id);
				break;

				case 'nobg':
					if (Default_APIS.API_RemoveBG !== APIS.API_RemoveBG) {
						if (isType('image')) {
							if (Object.keys(functions.NoBG).includes(user) || isOwner || config.Use_Tokens == false) {
								if (functions.NoBG[user] == 0 && !isOwner && config.Use_Tokens == true) return await kill.reply(chatId, mess.Buy_Fichas(), id);
								const mediaData = await decryptMedia(encryptMedia);
								var result = await removeBackgroundFromImageBase64({
									base64img: tools('others').dataURI(`${encryptMedia.mimetype}`, mediaData),
									apiKey: APIS.API_RemoveBG,
									size: 'auto',
									type: 'auto'
								});
								await kill.sendImageAsSticker(chatId, tools('others').dataURI(encryptMedia.mimetype, result.base64img), stickerConfig);
								if (config.Use_Tokens == true && Object.keys(functions.NoBG).includes(user)) {
									functions.NoBG[user] -= 1;
									fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
									await kill.reply(chatId, mess.nobgms() + '\n' + mess.Ficha_Usada(functions.NoBG[sender.id]), id);
								}
							} else return await kill.reply(chatId, mess.Zero_Fichas(), id);
						} else return await kill.reply(chatId, mess.onlyimg(), id);
					} else return await kill.reply(chatId, mess.Command_Unusable(), id);
				break;

				case 'simg':
					try {
						if (isType('image')) {
							const mediaData = await decryptMedia(encryptMedia);
							const sImgUp = await tools('cloud').upload(mediaData);
							let googleRes = (await axios.get(`https://node-reverse-image-search.herokuapp.com/?imageUrl=${sImgUp}`)).data;
							await kill.reply(chatId, googleRes.map(a => '\n' + a.title + '\n' + a.url + '\n').slice(1).join(''), id);
						} else await kill.reply(chatId, mess.onlyimg(), id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time) + '\n\nMaybe/Talvez...' + mess.upfail(), id);
					}
				break;

				case 'upimg':
					try {
						if (isType('image')) {
							const mediaData = await decryptMedia(encryptMedia);
							const upImg = await tools('cloud').upload(mediaData);
							await kill.reply(chatId, mess.tempimg(upImg), id);
						} else await kill.reply(chatId, mess.onlyimg(), id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time) + '\n\nMaybe/Talvez...' + mess.upfail(), id);
					}
				break;

				case 'morte':
				case 'death':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'nomes/nombres/names.', id);
					const predea = await axios.get(`https://api.agify.io/?name=${encodeURIComponent(args[0])}`);
					if (predea.data.age == null) return await kill.reply(chatId, mess.validname(), id);
					await kill.reply(chatId, mess.death(predea), id);
				break;

				/*Botei todas as Tags do Xvideos que achei*/
				case 'oculto':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					await kill.sendTextWithMentions(chatId, mess.oculto(randomMember, tools('others').getRandLine(1, './lib/config/Utilidades/porn.txt')[0]));
				break;

				case 'gender':
				case 'genero':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'nomes/nombres/names.', id);
					const seanl = await axios.get(`https://api.genderize.io/?name=${encodeURIComponent(args[0])}`);
					if (seanl.data.gender == null) return await kill.reply(chatId, mess.validname(), id);
					await kill.reply(chatId, mess.genero(seanl), id);
				break;

				case 'detector':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					await kill.sendTextWithMentions(chatId, mess.gostosa(randomMember));
				break;

				case 'math':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'número & simbolos matematicos/numbers & mathematical symbols.', id);
					try {
						await kill.reply(chatId, `${Sliced_Body}\n\n*=*\n\n${math.evaluate(Sliced_Body)}`, id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.onlynumber() + '\nUse	+	-	*	/' + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				case 'inverter':
					const whoCount = quotedMsgObj.text || quotedMsgObj.caption || Sliced_Body || 'error';
					if (whoCount == 'error' || whoCount == null || typeof whoCount !== 'string') return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					await kill.reply(chatId, `${mess.reversing()[0]}\n\n${whoCount.split(' ').reverse().join(' ')}\n\n${mess.reversing()[1]}\n\n${whoCount.split('').reverse().join('')}`, id);
				break;

				case 'contar':
					const whoCou = quotedMsgObj.text || quotedMsgObj.caption || Sliced_Body || 'error';
					if (whoCou == 'error' || whoCou == null || typeof whoCou !== 'string') return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					await kill.reply(chatId, mess.contar(whoCou), id);
				break;

				case 'giphy':
					if (!tools('others').isUrl(args[0])) return await kill.reply(chatId, mess.nolink(), id);
					const isGiphy = args[0].match(new RegExp(/https?:\/\/(www\.)?giphy.com/, 'gi'));
					const isMediaGiphy = args[0].match(new RegExp(/https?:\/\/media.giphy.com\/media/, 'gi'));
					if (isGiphy) {
						const getGiphyCode = args[0].match(new RegExp(/(\/|\-)(?:.(?!(\/|\-)))+$/, 'gi'));
						if (!getGiphyCode) return await kill.reply(chatId, mess.noresult(), id);
						await kill.sendGiphyAsSticker(chatId, `https://media.giphy.com/media/${getGiphyCode[0].replace(/[-\/]/gi, '')}/giphy-downsized.gif`);
					} else if (isMediaGiphy) {
						const gifUrl = args[0].match(new RegExp(/(giphy|source).(gif|mp4)/, 'gi'));
						if (!gifUrl) return await kill.reply(chatId, mess.noresult(), id);
						await kill.sendGiphyAsSticker(chatId, args[0].replace(gifUrl[0], 'giphy-downsized.gif'));
					} else await kill.reply(chatId, mess.nolink(), id);
				break;

				case 'msg':
				case 'print':
					if (!isOwner && config.Bot_Commands == true) return await kill.reply(from, mess.sodono(), id);
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					await kill.sendText(chatId, `${Sliced_Body}`);
				break;

				case 'id':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					await kill.reply(chatId, mess.idgrupo(chatId), id);
				break;

				/*LEMBRE-SE, REMOVER CREDITO É CRIME E PROIBIDO*/
				case 'legiao':
					if (isGroupMsg) return await kill.reply(chatId, mess.sopv(), id);
					await kill.sendLinkWithAutoPreview(chatId, 'https://bit.ly/BOT-IRIS', mess.onlyRecLz());
				break;

				case 'water':
					if (args.length == 0 || arks.length >= 16) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.\n\nMax: 10 letras/letters.', id);
					try {
						const waterye = await maker.textpro('https://textpro.me/dropwater-text-effect-872.html', Sliced_Body);
						await kill.sendFileFromUrl(chatId, waterye, 'textpro.jpg', '', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'img':
					if (isType('sticker')) {
						const mediaData = await decryptMedia(encryptMedia);
						await kill.sendFile(chatId, tools('others').dataURI('image/png', mediaData), 'image.png', 'Tatakae.', id);
					} else await kill.reply(chatId, mess.onlyst(), id);
				break;

				case 'tomp4':
					if (isType('sticker')) {
						const mediaData = await decryptMedia(encryptMedia);
						await tools('tomp4').convert(`./lib/media/video/sticker-${tools('others').randomString(10)}.webp`, mediaData, kill, message);
					} else await kill.reply(chatId, mess.onlyst(), id);
				break;

				case 'quiz':
					if (args[0] == '-placar') {
						if (!Object.keys(quizPlacar).includes(chatId)) return await kill.reply(chatId, mess.needVotes(), id);
						if (Object.keys(quizPlacar[chatId]).length !== 0) {
							var The_Winners_Quiz = '';
							for (let usz of quizPlacar[chatId]) {
								The_Winners_Quiz += `["@${usz.replace('@c.us', '')} - wa.me/${usz.replace('@c.us', '')}"] = "${quizPlacar[chatId][usz]}" Points\n\n`;
							}
							await kill.sendTextWithMentions(chatId, The_Winners_Quiz);
						} else return await kill.reply(chatId, mess.needVotes(), id);
					}
					if (!Object.keys(quizPlacar).includes(chatId)) {
						quizPlacar[chatId] = {};
					}
					if (!Object.keys(usersVoted).includes(chatId)) {
						usersVoted[chatId] = {
							"Max_Votes_Quiz": 0,
							"started": false,
							"total": 0,
							"all": [],
							"votes": {}
						};
					}
					let allQuesAwn = JSON.parse(fs.readFileSync('./lib/config/Gerais/quiz.json'));
					let theTestQuiz = tools('others').randomNumber(0, allQuesAwn.Total_Questions);
					Select_Quiz_Awnser[chatId] = allQuesAwn.All_Questions[theTestQuiz];
					var Parse_Argmt = '';
					if (arks.includes('-set')) {
						Parse_Argmt = argl[argl.indexOf('-set')+1];
						if (allQuesAwn.Total_Questions >= Number(Parse_Argmt)) {
							Select_Quiz_Awnser[chatId] = allQuesAwn.All_Questions[Parse_Argmt];
							theTestQuiz = Parse_Argmt;
						}
					}
					if (isNaN(args[0])) {
						await kill.reply(chatId, mess.maxVotingQ(), id);
						usersVoted[chatId].Max_Votes_Quiz = 5;
					} else {
						usersVoted[chatId].Max_Votes_Quiz = Number(args[0]);
					}
					Select_Quiz_Awnser[chatId].Final_Awnser = allQuesAwn.All_Questions[theTestQuiz].Awnser;
					Select_Quiz_Awnser[chatId].Awnser = allQuesAwn.All_Questions[theTestQuiz].Awnser == true ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					if (region !== 'en' || !arks.includes('-orig')) {
						Select_Quiz_Awnser[chatId].Question = (await translate(Select_Quiz_Awnser[chatId].Question, {
							to: region
						})).text;
					}
					if (sesConfig.Multi_Devices == true) {
						await kill.sendText(chatId, `🔎 - QUIZ N° "${theTestQuiz}"\n\n❓ - "${Select_Quiz_Awnser[chatId].Question}"\n\n1️⃣ - "${tools('others').yesAwnsers().toUpperCase()}"\n\n2️⃣ - "${tools('others').noAwnsers().toUpperCase()}"\n\n${mess.howToQuiz()} - [${usersVoted[chatId].Max_Votes_Quiz}].`);
					} else {
						await kill.sendButtons(chatId, `❓ - "${Select_Quiz_Awnser[chatId].Question}"\n\n1️⃣ - "${tools('others').yesAwnsers().toUpperCase()}"\n\n2️⃣ - "${tools('others').noAwnsers().toUpperCase()}"`,
						[
							{
								"id": "1",
								"text": `✔️ ${tools('others').yesAwnsers()} ✔️`
							},
							{
								"id": "2",
								"text": "✖️ ${tools('others').noAwnsers()} ✖️"
							}
						], `🔎 - QUIZ N° "${theTestQuiz}"`, `${mess.howToQuiz()}  - [${usersVoted[chatId].Max_Votes_Quiz}] →`);
					}
					const Filter_Qz = msgw => !usersVoted[chatId].all.includes(msgw.sender.id) && /sim|si|yes|no|not|nao/gi.test(removeAccents(msgw.body)); /* Function é necessária aqui */
					const Max_Aw_Msgs = usersVoted[chatId].Max_Votes_Quiz;
					kill.awaitMessages(chatId, Filter_Qz, {
						max: Max_Aw_Msgs,
						time: 300000,
						errors: ['time', 'max']
					}).then(c => {
						if (/sim|si|yes/gim.test(removeAccents(Array.from(c)[0][1].body))) {
							usersVoted[chatId].votes[Array.from(c)[0][1].sender.id] = {
								"vote": true
							};
							usersVoted[chatId].total++;
							usersVoted[chatId].all.push(Array.from(c)[0][1].sender.id);
						} else if (/no|not|nao/gim.test(removeAccents(Array.from(c)[0][1].body))) {
							usersVoted[chatId].votes[Array.from(c)[0][1].sender.id] = {
								"vote": false
							};
							usersVoted[chatId].total++;
							usersVoted[chatId].all.push(Array.from(c)[0][1].sender.id);
						}
						if (usersVoted[chatId].total >= Number(usersVoted[chatId].Max_Votes_Quiz)) {
							throw Error('Finish Vote');
						}
					}).catch(async c => {
						var whoWinQuiz = Object.keys(usersVoted[chatId].votes).filter(o => usersVoted[chatId].votes[o].vote == Select_Quiz_Awnser[chatId].Final_Awnser);
						whoWinQuiz = whoWinQuiz.map(g => g.replace(/@c.us/gim, ''));
						await kill.sendTextWithMentions(chatId, mess.Finish_Quiz(Select_Quiz_Awnser, chatId, whoWinQuiz));
						whoWinQuiz.map(rs => {
							if (Object.keys(quizPlacar).includes(rs)) {
								quizPlacar[chatId][rs]++;
							} else {
								quizPlacar[chatId][rs] = 1;
							}
						});
						Select_Quiz_Awnser[chatId] = {};
						usersVoted[chatId] = {
							"Max_Votes_Quiz": 0,
							"started": false,
							"total": 0,
							"all": [],
							"votes": {}
						};
					});
				break;

				case 'randomanime':
					const nime = await axios.get('https://nekos.life/api/v2/img/wallpaper');
					await kill.sendFileFromUrl(chatId, `${nime.data.url}`, ``, 'e.e', id);
				break;

				case 'frase':
					const aiquote = await axios.get("https://inspirobot.me/api?generate=true");
					await kill.sendFileFromUrl(chatId, aiquote.data, 'quote.jpg', '~Ok...?~\n\n❤️', id);
				break;

				case 'make':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					const diary = await axios.get(`https://st4rz.herokuapp.com/api/nulis?text=${encodeURIComponent(Sliced_Body)}`);
					await kill.sendImage(chatId, `${diary.data.result}`, '', mess.diary(), id);
				break;

				case 'neko':
					const neko = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["neko", "ngif", "fox_girl"])}`);
					await kill.sendFileFromUrl(chatId, `${neko.data.url}`, ``, `🌝`, id);
				break;

				case 'image':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					let filterP = isActivated('nsfw') || isActivated('antiporn') ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT;
					const getImage = await duck.search(Sliced_Body, filterP);
					if (getImage.length == 0) return await kill.sendFileFromUrl(chatId, config.Commands_Error_Photo, '', 'Tãn tãn tãn...', id);
					await kill.sendFileFromUrl(chatId, tools('others').randVal(getImage.map(c => c.image)), '', ';)', id);
				break;

				case 'yaoi':
					let filterH = isActivated('nsfw') || isActivated('antiporn') ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT;
					const iHateYaoi = await duck.search('yaoi', filterH);
					if (iHateYaoi.length == 0) return await kill.sendFileFromUrl(chatId, config.Commands_Error_Photo, '', 'Tãn tãn tãn...', id);
					await kill.sendFileFromUrl(chatId, tools('others').randVal(iHateYaoi.map(c => c.image)), '', ';)', id);
				break;

				/*Adicione mais no arquivo fml.txt na pasta config, obs, em inglês*/
				case 'life':
					if (region == 'en' || arks.includes('-orig')) return await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/fml.txt')[0], id);
					const lifetr = (await translate(tools('others').getRandLine(1, './lib/config/Utilidades/fml.txt')[0], {
						to: region
					})).text;
					await kill.reply(chatId, lifetr, id);
				break;

				case 'fox':
					const fox = await axios.get(`https://some-random-api.ml/img/fox`);
					await kill.sendFileFromUrl(chatId, fox.data.link, `@${groupMembersId.join('\n-> @')}`, '🥰', id);
				break;

				case 'wiki':
					try {
						if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
						const wikip = await axios.get(`https://${region}.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(Sliced_Body)}&prop=info&inprop=url`);
						const wikis = await axios.get(`https://${region}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&pageids=${wikip.data.query.search[0].pageid}`);
						await kill.reply(chatId, wikis.data.query.pages[Object.keys(wikis.data.query.pages)].extract, id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.noresult() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				case 'nasa':
					if (arks.includes('-help')) return await kill.reply(chatId, mess.nasaUsage(), id);
					const needsTime = args.length !== 0 ? args[1] : '';
					const NASA_INFO = await NASA.APOD(APIS.API_NASA, needsTime, false, false);
					var Explanation_Data = NASA_INFO.nasa.explanation;
					if (region !== 'en' && !arks.includes('-orig')) {
						Explanation_Data = (await translate(Explanation_Data, {
							to: region
						})).text;
					}
					if (NASA_INFO.best_image !== false) {
						await kill.sendFileFromUrl(chatId, NASA_INFO.best_image, 'NASA.jpg', mess.NASA_Space(NASA_INFO, Explanation_Data), id);
					} else await kill.reply(chatId, mess.NASA_Space(NASA_INFO, Explanation_Data), id);
				break;

				case 'fatos':
					const animl = await axios.get(`https://some-random-api.ml/facts/${tools('others').randVal(["dog", "cat", "bird", "panda", "fox", "koala"])}`);
					if (region == 'en' || arks.includes('-orig')) return await kill.reply(chatId, animl.data.fact, id);
					const fatosAni = (await translate(animl.data.fact, {
						to: region
					})).text;
					await kill.reply(chatId, fatosAni, id);
				break;

				// Lista dos locais compatíveis -> https://ytdl-org.github.io/youtube-dl/supportedsites.html
				case 'downvideo':
					if (args.length == 0 || !tools('others').isUrl(args[0])) return await kill.reply(chatId, mess.nolink(), id);
					try {
						const vdoClip = await tools('youtube').getVideo(args[0]);
						if (vdoClip instanceof Error) {
							await kill.reply(chatId, mess.verybig() + mess.fail(cmd, vdoClip, time), id);
							tools('others').reportConsole(cmd, vdoClip);
						} else await kill.sendFileFromUrl(chatId, vdoClip, `downloads.mp4`, `e.e`, id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.verybig() + mess.fail(cmd, error, time), id);
					}
				break;

				/* Não deixem floodarem, se o arquivo corromper tem uma chance de corromper o sistema, embora extremamente rara de ocorrer */
				case 'play':
				case 'video':
				case 'ytsearch':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Títulos do YouTube/YouTube Titles.', id);
					const ytres = await ytsearch(`${Sliced_Body}`);
					const playbody = Sliced_Body.toLowerCase();
					var videoFinded = ytres;
					videoFinded.all = videoFinded.all.filter(v => !v.url.includes('playlist'));
					videoFinded.all = videoFinded.all.filter(f => argl[0].includes(f.videoId.toLowerCase()) || f.url.toLowerCase().includes(argl[0]) || f.title.toLowerCase().includes(playbody) || f.description.includes(playbody) || f.author.name.includes(playbody));
					videoFinded.all = videoFinded.all.concat(ytres.all);
					kill.sendYoutubeLink(chatId, `${videoFinded.all[0].url}`, '\n' + mess.play(videoFinded)).then(() => {}).catch(() => {});
					var Temp_BID = 'Nothing here sir';
					if (sesConfig.Multi_Devices == false) {
						Temp_BID = await kill.sendButtons(chatId, mess.buttonStop("Cancelar"), [
							{
								"id": "1",
								"text": "📀 Áudio 🎵"
							},
							{
								"id": "2",
								"text": "🎥 Vídeo 📹"
							},
							{
								"id": "3",
								"text": "🚫 Cancelar 🚫"
							}
						], mess.whatFormat(), mess.Choice_Bete('audio', 'video', 'cancelar', '5'));
					} else await kill.reply(chatId, mess.downFormatC(), id);
					const buttID = Temp_BID;
					const filter = msgw => tools('others').filterMsg(msgw, user, chatId, buttID, /video|audio|cancel/gi);
					kill.awaitMessages(chatId, filter, {
						max: 1,
						time: 300000,
						errors: ['time']
					}).then(async collected => {
						if (/audio/gi.test(removeAccents(Array.from(collected)[0][1].body))) {
							await kill.reply(chatId, mess.youChoose('audio'), id);
							const playMusic = await tools('youtube').downPlay(videoFinded.all[0].url);
							if (playMusic instanceof Error) {
								await kill.reply(chatId, mess.verybig() + mess.fail(cmd, playMusic, time), id);
								tools('others').reportConsole(cmd, playMusic);
							} else {
								await kill.sendPtt(chatId, playMusic, id);
								tools('others').clearFile(playMusic);
							}
						} else if (/video/gi.test(removeAccents(Array.from(collected)[0][1].body))) {
							await kill.reply(chatId, mess.youChoose('video'), id);
							try {
								const ytClip = await tools('youtube').downVideo(videoFinded.all[0].url);
								if (ytClip instanceof Error) {
									await kill.reply(chatId, mess.verybig() + mess.fail(cmd, ytClip, time), id);
									tools('others').reportConsole(cmd, ytClip);
								} else await kill.sendFileFromUrl(chatId, ytClip, `${videoFinded.all[0].title}.mp4`, `${videoFinded.all[0].title}`, id);
							} catch (error) {
								tools('others').reportConsole(cmd, error);
								await kill.reply(chatId, mess.verybig() + mess.fail(cmd, error, time), id);
							}
						} else if (/cancel/gi.test(removeAccents(Array.from(collected)[0][1].body))) {
							await kill.reply(chatId, mess.youCanceled(), id);
						}
					}).catch(async collected => await kill.reply(chatId, mess.timeEndedDP(), id));
				break;

				case 'qr':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					await kill.sendFileFromUrl(chatId, `https://api.qrserver.com/v1/create-qr-code/?data=${Sliced_Body}`, '', mess.maked(), id);
				break;

				case 'readqr':
					try {
						if (isType('image')) {
							const mediaData = await decryptMedia(encryptMedia);
							const upQrCode = await tools('cloud').upload(mediaData);
							const getQrText = await axios.get(`https://api.qrserver.com/v1/read-qr-code/?fileurl=${upQrCode}`);
							if (getQrText.data[0].symbol[0].data == null) return await kill.reply(chatId, 'Not a QR - Não é um QR.\n\nOu erro - Or error.', id);
							await kill.reply(chatId, `→ ${getQrText.data[0].symbol[0].data}`, id);
						} else await kill.reply(chatId, mess.onlyimg() + '\nQR-Code!', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time) + '\n\nMaybe/Talvez...' + mess.upfail(), id);
					}
				break;

				case 'send':
					try {
						if (args.length == 0 || !tools('others').isUrl(args[0])) return await kill.reply(chatId, mess.nolink(), id);
						await kill.sendFileFromUrl(chatId, args[0], '', '', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time) + '\n\nMaybe/Talvez...' + mess.onlyimg(), id);
					}
				break;

				case 'translate':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'idioma/language & words/palavras ou/or marca/mark a message/mensagem.', id);
					try {
						let transType = quotedMsgObj.type == 'chat' ? quotedMsgObj.body : quotedMsgObj.type == 'image' ? quotedMsgObj.caption : body.slice(11+args[0].length);
						const Trans_Text = (await translate(transType, {
							to: args[0]
						})).text;
						await kill.reply(chatId, `→ ${Trans_Text}`, id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.ttsiv() + '\n\nOu' + mess.gblock() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				case 'tts':
					if (args.length <= 1) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					try {
						const TTS_Voice = await tts.create(argl[0], body.slice(cmd.length+argl[0].length+1), false, false);
						await kill.sendPtt(chatId, tools('others').dataURI('audio/mpeg', TTS_Voice.gtts.buffer.toString('base64')), id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.ttsiv() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				case 'idiomas':
					await kill.reply(chatId, mess.idiomas(), id);
					await kill.reply(chatId, `Idiomas disponíveis para o ${prefix}Translate ->\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​${Object.keys(translate.languages).filter(c => c !== 'isSupported' && c !== 'getCode').map(t => `${t} -> ${translate.languages[t]}\n\n`).join('\n')}`, id);
				break;

				case 'resposta':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers/emojis/etc.', id);
					fs.appendFileSync('./lib/config/Utilidades/reply.txt', `\n${Sliced_Body}`);
					if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
				break;

				case 'criador':
					let hostNot = config.Hide_Owner_Number ? '' : `☀️ - Host: https://wa.me/${config.Owner[0].replace('@c.us', '')}\n`;
					await kill.reply(chatId, `${hostNot}🌙 - Dev: Lucas R. - KillovSkyᴸᶻ [http://bit.ly/BOT-IRIS]\n\n${mess.everhost()}`, id);
				break;
		
				case 'badwords':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						if (args[0] == '3' || args[0] == '1' && args[1] !== null || args[0] == '2' && args[1] !== null) {
							functions.badwords[chatId] = {
								"ban": true,
								"lang": argl[1]
							};
							if (argl[0] == '1') {
								functions.badwords[chatId] = functions.badwords[chatId];
							} else if (argl[0] == '2') {
								functions.badwords[chatId].ban = false;
							} else if (argl[0] == '3') {
								delete functions.badwords[chatId];
							} else {
								delete functions.badwords[chatId];
								return await kill.reply(chatId, mess.whatTheFuck(), id);
							}
							fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
							if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
						} else return await kill.reply(chatId, mess.badWordsUsage(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'akinator':
				case 'aki':
					if (args.length == 0 || /[2-3]/.test(argl[0]) && argl.length <= 1 || /[^1-5]/.test(argl[0])) return await kill.reply(chatId, mess.Welcome_Akinator(), id);
					await tools('akinator').play(kill, message, argl[0], argl[1]);
				break;

					/*Se quiser adicione respostas na reply.txt ou use o comando '/resposta', Íris também consegue adicionar ela mesma sozinha*/
				case removeAccents(config.Bot_Name.toLowerCase()):
					if (args.length == 0 || APIS.Chat_Bot_Type == 5 && !tools('others').isUrl(APIS.SimSimi_Host) || APIS.Chat_Bot_Type == 3 && APIS.API_Brainshop == Default_APIS.API_Brainshop) return await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], id);
					try {
						if (argl[0] == '-g') {
							let awnser = shell.exec(`bash -c "grep -i '${args[1]}' './lib/config/Utilidades/reply.txt' | shuf -n 1"`, {
								silent: true
							}).stdout;
							if (awnser == '') {
								await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], id);
							} else await kill.reply(chatId, awnser, id);
						} else {
							var IrisResponse = false;
							const chatBotMode = Object.keys(functions.chatBot_Type).includes(chatId) ? functions.chatBot_Type[chatId] : APIS.Chat_Bot_Type;
							if (chatBotMode == 5) {
								const Res_CBMFv = await axios.get(`${APIS.SimSimi_Host}?key=${tools('others').randVal(APIS.API_SimSimi)}&lc=${region}&text=${encodeURIComponent(Sliced_Body)}`);
								IrisResponse = Res_CBMFv.data.result == 100 && Res_CBMFv.data.success ? Res_CBMFv.data.success : tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							} else if (chatBotMode == 4 && APIS.API_SimSimi) {
								const My_Cliv = await cleverbot(Sliced_Body);
								IrisResponse = My_Cliv ? My_Cliv : tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							} else if (chatBotMode == 3 && APIS.API_Brainshop) {
								const Res_CBMTr = await axios.get(`http://api.brainshop.ai/get?bid=${APIS.BID_Brainshop}&key=${APIS.API_Brainshop}&uid=${user.replace('@c.us', '')}&msg=${encodeURIComponent(Sliced_Body)}`);
								IrisResponse = Res_CBMTr.data.cnt ? Res_CBMTr.data.cnt : tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							} else if (chatBotMode == 2) {
								IrisResponse = tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							} else if (chatBotMode == 1) {
								const Res_CBMOn = await axios.get(`https://api-sv2.simsimi.net/v2/?text=${encodeURIComponent(Sliced_Body)}&lc=${region}&name=${removeAccents(config.Bot_Name.toLowerCase())}&cf=false`);
								IrisResponse = Res_CBMOn.data.success ? Res_CBMOn.data.success : tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							} else IrisResponse = tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							if (chatBotMode !== 2) {
								fs.appendFileSync('./lib/config/Utilidades/reply.txt', `\n${IrisResponse}`);
							}
							await kill.reply(chatId, IrisResponse, id);
						}
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'speak':
					try {
						if (args.length == 0 || APIS.Chat_Bot_Type == 5 && !tools('others').isUrl(APIS.SimSimi_Host) || APIS.Chat_Bot_Type == 3 && APIS.API_Brainshop == Default_APIS.API_Brainshop) {
							const Speaky = await tts.create(region, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], false, false);
							await kill.sendPtt(chatId, tools('others').dataURI('audio/mpeg', Speaky.gtts.buffer.toString('base64')), id);
						} else if (argl[0] == '-g') {
							var Speaking = '';
							let voiceaw = shell.exec(`bash -c "grep -i '${args[1]}' './lib/config/Utilidades/reply.txt' | shuf -n 1"`, {
								silent: true
							}).stdout;
							if (voiceaw == '') {
								Speaking = await tts.create(region, tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0], false, false);
							} else {
								Speaking = await tts.create(region, voiceaw, false, false);
							}
							await kill.sendPtt(chatId, tools('others').dataURI('audio/mpeg', Speaking.gtts.buffer.toString('base64')), id);
						} else {
							var IrisSpeak = false;
							const ChatSpeakm = Object.keys(functions.chatBot_Type).includes(chatId) ? functions.chatBot_Type[chatId] : APIS.Chat_Bot_Type;
							if (ChatSpeakm == 5) {
								const Res_CBMFv = await axios.get(`${APIS.SimSimi_Host}?key=${tools('others').randVal(APIS.API_SimSimi)}&lc=${region}&text=${encodeURIComponent(Sliced_Body)}`);
								IrisSpeak = Res_CBMFv.data.result == 100 && Res_CBMFv.data.success ? Res_CBMFv.data.success : tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							} else if (ChatSpeakm == 4 && APIS.API_SimSimi) {
								const My_Cliv = await cleverbot(Sliced_Body);
								IrisSpeak = My_Cliv ? My_Cliv : tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							} else if (ChatSpeakm == 3 && APIS.API_Brainshop) {
								const Res_CBMTr = await axios.get(`http://api.brainshop.ai/get?bid=${APIS.BID_Brainshop}&key=${APIS.API_Brainshop}&uid=${user.replace('@c.us', '')}&msg=${encodeURIComponent(Sliced_Body)}`);
								IrisSpeak = Res_CBMTr.data.cnt ? Res_CBMTr.data.cnt : tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							} else if (ChatSpeakm == 2) {
								IrisSpeak = tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							} else if (ChatSpeakm == 1) {
								const Res_CBMOn = await axios.get(`https://api-sv2.simsimi.net/v2/?text=${encodeURIComponent(Sliced_Body)}&lc=${region}&name=${removeAccents(config.Bot_Name.toLowerCase())}&cf=false`);
								IrisSpeak = Res_CBMOn.data.success ? Res_CBMOn.data.success : tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							} else IrisSpeak = tools('others').getRandLine(1, './lib/config/Utilidades/reply.txt')[0];
							if (ChatSpeakm !== 2) {
								fs.appendFileSync('./lib/config/Utilidades/reply.txt', `\n${IrisSpeak}`);
							}
							const F_Speak = await tts.create(region, IrisSpeak, false, false);
							await kill.sendPtt(chatId, tools('others').dataURI('audio/mpeg', F_Speak.gtts.buffer.toString('base64')), id);
						}
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'curiosidade':
					try {
						if (argl[0] == '-g') {
							let curist = shell.exec(`bash -c "grep -i "${args[1]}" lib/config/Utilidades/curiosidades.txt | shuf -n 1"`, {
								silent: true
							});
							if (curist.stdout == '') {
								await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/curiosidades.txt')[0], id);
							} else await kill.reply(chatId, curist.stdout, id);
						} else await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/curiosidades.txt')[0], id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'trecho':
					try {
						if (argl[0] == '-g') {
							let trecd = shell.exec(`bash -c "grep -i "${args[1]}" lib/config/Utilidades/frases.txt | shuf -n 1"`, {
								silent: true
							}).stdout;
							if (trecd == '') {
								await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/frases.txt')[0], id);
							} else await kill.reply(chatId, trecd, id);
						} else await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/frases.txt')[0], id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'roll':
					await mandarFig(kill, chatId, `https://www.random.org/dice/dice${tools('others').randomNumber(1, 6)}.png`, stickerConfig);
				break;

				case 'rolette':
				case 'roleta':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (tools('gaming').getLimit(user, chatId, false, 'games')) return await kill.reply(chatId, mess.limitgame(), id);
					const gamerRol = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
					if (isNaN(args[0]) || !tools('others').isInt(args[0]) || Number(args[0]) > gamerRol) return await kill.reply(chatId, mess.gaming(gamerRol), id);
					var iRoll = Math.abs(parseInt(tools('others').randomNumber(Number(config.Iris_Coin), Number(args[0]) * 1.5) / Number(config.Max_Divider_Win)) + Number(args[0]));
					if (side == 1) {
						iRoll = tools('others').Bonus_Value(iRoll, user, chatId, 'lose');
						await kill.sendFileFromUrl(chatId, 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/roleta1.png', 'rol1.png', mess.loseshot(iRoll), id);
						tools('gaming').addValue(user, Number(-iRoll), chatId, 'coin');
					} else {
						if (randEven.eventOnline && randEven.eventType == 'coin') {
							iRoll = parseInt(tools('others').randomNumber(iRoll, iRoll*randEven.events[randEven.eventIndex].multiplier)); /* Efeito de evento aleatório */
						}
						iRoll = tools('others').Bonus_Value(iRoll, user, chatId, 'win');
						await kill.sendFileFromUrl(chatId, 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/roleta.jpg', 'rol.jpg', mess.winshot(iRoll), id);
						tools('gaming').addValue(user, Number(iRoll), chatId, 'coin');
					}
					if (objconfig.noLimits == 0) return tools('gaming').addLimit(user, chatId, 'games');
				break;

				case 'flip':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (tools('gaming').getLimit(user, chatId, false, 'games') == 1) return await kill.reply(chatId, mess.limitgame(), id);
					const gamerFlip = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
					if (isNaN(args[1]) || !tools('others').isInt(args[1]) || Number(args[1]) > gamerFlip) return await kill.reply(chatId, mess.gaming(gamerFlip), id);
					var iFlip = Math.abs(parseInt(tools('others').randomNumber(Number(config.Iris_Coin), Number(args[1]) * 1.5) / Number(config.Max_Divider_Win)) + Number(args[1]));
					if (argl[0] == 'cara' && side == 1 || argl[0] == 'coroa' && side == 2) {
						let winFlipURL = side == 1 ? 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/heads.png' : 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/tails.png';
						await mandarFig(kill, chatId, winFlipURL, stickerConfig);
						await kill.reply(chatId, mess.flipwin(iFlip) + ` "${argl[0]}".`, id);
						if (randEven.eventOnline && randEven.eventType == 'coin') {
							iFlip = parseInt(tools('others').randomNumber(iFlip, iFlip*randEven.events[randEven.eventIndex].multiplier)); /* Efeito de evento aleatório */
						}
						iFlip = tools('others').Bonus_Value(iFlip, user, chatId, 'win');
						tools('gaming').addValue(user, Number(iFlip), chatId, 'coin');
					} else if (argl[0] == 'coroa' || argl[0] == 'cara') {
						iFlip = tools('others').Bonus_Value(iFlip, user, chatId, 'lose');
						await kill.reply(chatId, mess.fliplose(iFlip) + ` "${argl[0]}".`, id);
						tools('gaming').addValue(user, Number(-iFlip), chatId, 'coin');
					} else await kill.reply(chatId, mess.fliphow(), id);
					if (objconfig.noLimits == 0) return tools('gaming').addLimit(user, chatId, 'games');
				break;

				case 'cassino':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (tools('gaming').getLimit(user, chatId, false, 'games')) return await kill.reply(chatId, mess.limitgame(), id);
					const gamerCas = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
					if (isNaN(args[0]) || !tools('others').isInt(args[0]) || Number(args[0]) > gamerCas) return await kill.reply(chatId, mess.gaming(gamerCas), id);
					var iCass = Math.abs(parseInt(tools('others').randomNumber(Number(config.Iris_Coin), Number(args[0]) * 1.5) / Number(config.Max_Divider_Win)) + Number(args[0]));
					var cassin = ['- 🍒 ', '- 🎃 ', '- 🍐 '];
					var cassinend = tools('others').randVal(cassin) + tools('others').randVal(cassin) + tools('others').randVal(cassin) + '-';
					if (cassinend == '- 🍒 - 🍒 - 🍒 -' || cassinend == '- 🍐 - 🍐 - 🍐 -' || cassinend == '- 🎃 - 🎃 - 🎃 -') {
						if (randEven.eventOnline && randEven.eventType == 'coin') {
							iCass = parseInt(tools('others').randomNumber(iCass, iCass*randEven.events[randEven.eventIndex].multiplier)); /* Efeito de evento aleatório */
						}
						iCass = tools('others').Bonus_Value(iCass, user, chatId, 'win');
						tools('gaming').addValue(user, Number(iCass), chatId, 'coin');
						await kill.reply(chatId, mess.caswin(cassinend, Number(iCass)), id);
					} else {
						iCass = tools('others').Bonus_Value(iCass, user, chatId, 'lose');
						tools('gaming').addValue(user, Number(-iCass), chatId, 'coin');
						await kill.reply(chatId, mess.caslose(cassinend, Number(iCass)), id);
					}
					if (objconfig.noLimits == 0) return tools('gaming').addLimit(user, chatId, 'games');
				break;

				case 'poll':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					if (argl[0] == '-delete') {
						tools('others').clearFile(pollfile, 1000);
						await kill.reply(chatId, mess.Del_Polls(), id);
					} else await tools('poll').get(kill, message, pollfile);
				break;

				case 'vote':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					await tools('poll').vote(kill, message, args[0], pollfile, groupAdmins);
				break;

				case 'newpoll':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					let Special_Poll = 'nada';
					if (isGroupAdmins || isGroupCreator || isOwner) {
						if (arks.includes('-kick')) {
							Special_Poll = 'kick';
						} else if (arks.includes('-promote')) {
							Special_Poll = 'promote';
						} else if (arks.includes('-demote')) {
							Special_Poll = 'demote';
						} else if (arks.includes('-vip')) {
							Special_Poll = 'vip';
						} else if (arks.includes('-mod')) {
							Special_Poll = 'mod';
						}
					}
					await tools('poll').create(kill, message, pollfile, Special_Poll, arg.split('|'));
					if (!arks.includes('-allow')) {
						await kill.reply(chatId, mess.Polls_Only(), id);
						on_Poll[chatId] = true;
						await tools('others').sleep(600000);
						if (on_Poll[chatId] == true) {
							delete on_Poll[chatId];
							await kill.reply(chatId, mess.Polls_Usable(), id);
						}
					}
				break;

				case 'ins':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					let isAdminOrVIP = isGroupAdmins || isOwner || Can_Run_CMD(cmd) ? true : false;
					let Cand_ToVote = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : Sliced_Body);
					await tools('poll').add(kill, message, Cand_ToVote.replace('@c.us', ''), pollfile, isAdminOrVIP);
				break;

				case 'macaco':
				case 'monkey':
					await kill.sendFileFromUrl(chatId, `https://source.unsplash.com/featured/?monkey,monkey`, "result.jpg", "🙏\n~Brazil loves monkey soup~.", id);
				break;

				case 'ball':
					const ball = await axios.get('https://nekos.life/api/v2/img/8ball');
					await mandarFig(kill, chatId, ball.data.url, stickerConfig);
				break;

				case 'cafune':
					const cfnean = await axios.get(`https://nekos.life/api/v2/img/${tools('others').randVal(["pat", "cuddle"])}`);
					if (cfnean.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(cfnean.data.url, cmd, kill, message);
					} else await mandarFig(kill, chatId, cfnean.data.url, stickerConfig);
				break;

				case 'quack':
					const patu = await axios.get('https://nekos.life/api/v2/img/goose');
					await kill.sendFileFromUrl(chatId, patu.data.url, '', '', id);
				break;

				case 'poke':
					const pokean = await axios.get('http://api.nekos.fun:8080/api/poke');
					if (pokean.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(pokean.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, pokean.data.url, stickerConfig);
				break;

				case 'cocegas':
					const cocegas = await axios.get('https://nekos.life/api/v2/img/tickle');
					if (cocegas.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(cocegas.data.url, cmd, kill, message);
					} else await mandarFig(kill, chatId, cocegas.data.url, stickerConfig);
				break;

				case 'food':
					const feed = await axios.get('https://nekos.life/api/v2/img/feed');
					await mandarFig(kill, chatId, feed.data.url, stickerConfig);
				break;

				case 'baka':
					let bakaYaro = await axios.get("http://api.nekos.fun:8080/api/baka");
					if (bakaYaro.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(bakaYaro.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, bakaYaro.data.url, stickerConfig);
				break;

				case 'lizard':
					const lizard = await axios.get('https://nekos.life/api/v2/img/lizard');
					await kill.sendFileFromUrl(chatId, lizard.data.url, '', '', id);
				break;

				case 'duck':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					ddg.search({
						q: Sliced_Body,
						max: config.Search_Results
					}, async (err, urls) => {
						if (err) return await kill.reply(chatId, mess.noresult(), id);
						await kill.reply(chatId, '🦆 - ' + urls.join('\n\n🦆 - '), id);
					});
				break;

				case 'clima':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'city names/nomes de cidade/nombres de ciudad.', id);
					const clima = await axios.get(`https://pt.wttr.in/${encodeURIComponent(Sliced_Body)}?format=Cidade%20=%20%l+\n\nEstado%20=%20%C+%c+\n\nTemperatura%20=%20%t+\n\nUmidade%20=%20%h\n\nVento%20=%20%w\n\nLua agora%20=%20%m\n\nNascer%20do%20Sol%20=%20%S\n\nPor%20do%20Sol%20=%20%s`);
					await kill.sendFileFromUrl(chatId, `https://wttr.in/${encodeURIComponent(Sliced_Body)}.png`, '', mess.wttr(clima), id);
				break;

				case 'boy':
					await kill.sendFileFromUrl(chatId, 'https://source.unsplash.com/featured/?boy,man', "result.jpg", "😍", id);
				break;

				case 'aptoide':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'app name/Nome do App/Nombre de aplicación.', id);
					const aptoide = await axios.get(`https://ws75.aptoide.com/api/7/apps/search?query=${encodeURIComponent(Sliced_Body)}&trusted=true`);
					if (aptoide.data.datalist.total == 0) return await kill.reply(chatId, mess.noresult(), id);
					await kill.sendFileFromUrl(chatId, `${aptoide.data.datalist.list[0].graphic}`, 'aptoide.png', mess.aptoide(aptoide.data.datalist.list[0], (aptoide.data.datalist.list[0].size / 1048576).toFixed(1)), id);
				break;

				case 'girl':
					await kill.sendFileFromUrl(chatId, 'https://source.unsplash.com/featured/?girl,woman', "result.jpg", "😍", id);
				break;

				case 'anime':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'anime name/nome do anime/nombre de anime.', id);
					const getAnime = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${encodeURIComponent(Sliced_Body.replace('-orig', ''))}&limit=1`);
					if (getAnime.data.status == 404 || getAnime.data.results[0] == '') return await kill.sendFileFromUrl(chatId, config.Commands_Error_Photo, 'error.png', mess.noresult());
					if (region == 'en' || arks.includes('-orig')) return await kill.sendFileFromUrl(chatId, `${getAnime.data.results[0].image_url}`, 'anime.jpg', `✔️ - Is that?\n\n✨️ *Title:* ${getAnime.data.results[0].title}\n\n🎆️ *Episode:* ${getAnime.data.results[0].episodes}\n\n💌️ *Rating:* ${getAnime.data.results[0].rated}\n\n❤️ *Note:* ${getAnime.data.results[0].score}\n\n💚️ *Synopsis:* ${getAnime.data.results[0].synopsis}\n\n🌐️ *Link*: ${getAnime.data.results[0].url}`, id);
					const aniTradu = (await translate(getAnime.data.results[0].synopsis, {
						to: region
					})).text;
					await kill.sendFileFromUrl(chatId, `${getAnime.data.results[0].image_url}`, 'anime.jpg', mess.getanime(aniTradu), id);
				break;

				case 'manga':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'manga name/nome do manga/nombre de manga.', id);
					const getManga = await axios.get(`https://api.jikan.moe/v3/search/manga?q=${encodeURIComponent(Sliced_Body.replace('-orig', ''))}&limit=1`);
					if (getManga.data.status == 404 || getManga.data.results[0] == '') return await kill.sendFileFromUrl(chatId, config.Commands_Error_Photo, 'error.png', mess.noresult());
					if (region == 'en' || arks.includes('-orig')) return await kill.sendFileFromUrl(chatId, `${getManga.data.results[0].image_url}`, 'manga.jpg', `✔️ - Is that?\n\n✨️ *Title:* ${getManga.data.results[0].title}\n\n🎆️ *Chapters:* ${getManga.data.results[0].chapters}\n\n💌️ *Volumes:* ${getManga.data.results[0].volumes}\n\n❤️ *Note:* ${getManga.data.results[0].score}\n\n💚️ *Synopsis:* ${getManga.data.results[0].synopsis}\n\n🌐️ *Link*: ${getManga.data.results[0].url}`, id);
					const mangaTradu = (await translate(getManga.data.results[0].synopsis, {
						to: region
					})).text;
					await kill.sendFileFromUrl(chatId, `${getManga.data.results[0].image_url}`, 'manga.jpg', mess.getmanga(mangaTradu), id)
				break;

				case 'profile':
				case 'perfil':
					if (isGroupMsg) {
						const qmid = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : user);
						const userGame = tools('gaming').getValue(qmid, chatId, null);
						const pfp = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
						const namae = mentionedJidList.length !== 0 ? mentioned_name : (quotedMsgObj ? quotedMsgObj.sender.pushname : pushname);
						let sts = await kill.getStatus(qmid);
						sts = (sts == null || sts.status == '' || sts.status == '401' ? false : sts.status);
						const myGroupS = (await kill.getAllGroups()).filter(g => g.groupMetadata.participants.includes(qmid.replace(/@c.us/gim, '')));
						const samePlaces = myGroupS.length > 0 ? '👪 Clãs ↴'+myGroupS.map(gsnm => '\n→ '+gsnm.formattedTitle) : false;
						const profDetail = {
							"status": sts,
							"namae": namae,
							"adm": (groupAdmins.includes(qmid) ? true : false),
							"mute": (functions.mute.includes(qmid) ? true : false),
							"block": (blockNumber.includes(qmid) ? true : false),
							"married": false,
							"same": (samePlaces !== false ? samePlaces : false),
							"custom": (Object.keys(custom).includes(qmid) ? custom[qmid].msg : false)
						};
						if (married.all.includes(qmid)) {
							const theMarry = Object.keys(married.persons).filter(p => married.persons[p].love == qmid || married.persons[p].request == qmid);
							if (theMarry.length >= 1) {
								const isMarried = married.persons[theMarry[0]];
								profDetail.married = (qmid == isMarried.request ? isMarried.love_name : isMarried.request_name);
							} else {
								if (qmid == botNumber) {
									profDetail.married = config.Your_Name;
								} else {
									profDetail.married = false;
								}
							}
						} else if (qmid == botNumber) {
							profDetail.married = config.Your_Name;
						}
						await kill.sendFileFromUrl(chatId, pfp[0], 'pfo.jpg', mess.profile(namae, profDetail, userGame), id).catch(async () => {
							await kill.reply(chatId, mess.profile(namae, profDetail, userGame), id);
						});
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'store':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'app name/Nome do App/Nombre de aplicación.', id);
					const storeInfo = await store.search(Sliced_Body.replace('-orig', ''));
					if (storeInfo.results.length == 0) return await kill.reply(from, mess.noresult(), id);
					const stsp = await store.getExtendedInfo(storeInfo.results[0].link);
					if (region == 'en' || arks.includes('-orig')) return await kill.sendFileFromUrl(chatId, stsp.icon, '', mess.store(stsp, stsp.description), id);
					const storet = (await translate(stsp.description, {
						to: region
					})).text;
					await kill.sendFileFromUrl(chatId, stsp.icon, '', mess.store(stsp, storet), id);
				break;

				case 'search':
					if (isType('image')) {
						await kill.reply(chatId, mess.searchanime(), id);
						const mediaData = await decryptMedia(encryptMedia);
						const sAnimeH = await tools('cloud').upload(mediaData);
						const animeFind = await axios.get(`https://api.trace.moe/search?anilistInfo&url=${sAnimeH}`);
						await kill.sendText(chatId, animeFind.data.result[0].filename + '\n\n' + mess.sanimetk(animeFind.data));
						await kill.sendFileFromUrl(chatId, animeFind.data.result[0].video, `${animeFind.data.result[0].filename}`, '', id);
					} else await kill.sendFileFromUrl(chatId, config.Commands_Error_Photo, 'error.png', mess.searchanime() + '\n\n' + mess.onlyimg());
				break;

				case 'ptt':
					if (isType('audio') || isType('ptt')) {
						const mediaData = await decryptMedia(encryptMedia);
						await kill.sendPtt(chatId, tools('others').dataURI(quotedMsgObj.mimetype, mediaData), '', id);
					} else kill.reply(chatId, mess.onlyaudio(), id);
				break;

				case 'get':
					if (isType('image') || isType('audio') || isType('ptt') || isType('video') || isType('sticker') || isType('image/gif') || quotedMsgObj || isMedia) {
						const mediaData = await decryptMedia(encryptMedia);
						await kill.sendFile(chatId, tools('others').dataURI(quotedMsgObj.mimetype, mediaData), 'resend.'+quotedMsgObj.mimetype, '', id);
					} else kill.reply(chatId, mess.onlymidia(), id);
				break;

				case 'adms':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					await kill.sendReplyWithMentions(chatId, `═✪〘 🎻 - ADEMIROS - 🐂 〙✪═​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n\n- @${groupAdmins.toString().replace(/@c.us/g, '').replace(/,/g, '\n- @')}\n\n═✪〘 ❤️ - ${name} - 📢 〙✪═`, id);
				break;

				case 'groupinfo':
				case 'info':
					if (args[0] !== null) {
						var All_GIDS = (await kill.getAllChatIds()).filter(x => x.includes('@g.us'));
						if (All_GIDS.includes(args[0]+'@g.us')) {
							from = args[0]+'@g.us';
						}
					}
					const GroupGID = from || chatId;
					if (!isGroupMsg && args.length !== 0 && !GroupGID.endsWith('@g.us') || !isGroupMsg && args.length == 0) return await kill.reply(chatId, mess.sogrupo(), id);
					const nmDes = (await kill.getAllGroups()).filter(h => h.id == GroupGID)[0];
					const getAdmins = await kill.getGroupAdmins(GroupGID);
					var admgp = '';
					for (let admon of getAdmins) {
						let adminsls = await kill.getContact(admon);
						if (!isGroupMsg && isOwner) {
							admgp += (adminsls == null || adminsls.pushname == null) ? `\nNome Desconhecido -> [wa.me/${admon.replace(/@c.us/g, '')}]\n` : `\n${adminsls.pushname} -> [wa.me/${admon.replace(/@c.us/g, '')}]\n`;
						} else {
							admgp += (adminsls == null || adminsls.pushname == null) ? `\nNome Desconhecido\n` : `\n${adminsls.pushname}\n`;
						}
					}
					const donodeGp = await kill.getContact(nmDes.groupMetadata.descOwner._serialized);
					var gpOwner = (donodeGp == null || donodeGp.pushname == null) ? `??? - Top secret name` : `${donodeGp.pushname}`;
					gpOwner = !isGroupMsg && isOwner ? gpOwner + ` - [wa.me/${nmDes.groupMetadata.descOwner.user}]` : gpOwner;
					const welgrp = isActivated('welcome') ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const fakegp = isActivated('fake') ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const bklistgp = isActivated('blacklist') ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const xpgp = isActivated('rank') ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const slcegp = isActivated('mute') ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const ngrp = isActivated('nsfw') ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const autostk = isActivated('autosticker') ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const atpngy = isActivated('antiporn') ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const atlka = isActivated('antilinks') ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const anttra = isActivated('antitravas') ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const grouppic = await kill.getProfilePicFromServer(GroupGID);
					const gpDescT = (GroupGID == chatId || !isGroupMsg && isOwner ? nmDes.groupMetadata.desc : mess.onlyDescPV()) + `\n\n⏱️ ${mess.lastEdit()} -> ${timeCreation(nmDes.groupMetadata.descTime)}`;
					const pfp = grouppic.includes('ERR') || grouppic == null || typeof grouppic == 'object' || !tools('others').isUrl(grouppic) ? config.Commands_Error_Photo : grouppic;
					var messGPI = ' ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.groupinfo((nmDes.name || nmDes.formattedTitle), nmDes.participantsCount, welgrp, atpngy, atlka, anttra, xpgp, fakegp, bklistgp, slcegp, autostk, ngrp, gpDescT, gpOwner, admgp) + `\n🆔 ID do Grupo -> ${GroupGID}\n\n📅 Criado as -> ${timeCreation(nmDes.groupMetadata.creation)}`;
					if (!isGroupMsg && isOwner && getAdmins.includes(botNumber) && getAdmins.includes(botNumber)) {
						const gpLinkFO = await kill.getGroupInviteLink(GroupGID);
						messGPI += `\n🔗 Link do grupo -> ${gpLinkFO}`;
					}
					await kill.sendFileFromUrl(GroupGID, pfp, 'group.png', messGPI, id);
				break;

				case 'chefe':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					await kill.sendReplyWithMentions(chatId, `👉 @${chat.groupMetadata.owner}`, id);
				break;

				case 'wame':
					const wameSes = [user].concat(quotedMsg || quotedMsgObj ? new Array(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? mentionedJidList : new Array(botNumber)));
					await kill.sendReplyWithMentions(chatId, Array.from(new Set(wameSes)).map(w => `📞 - https://wa.me/${w.replace('@c.us', '')} - @${w.replace('@c.us', '')} | [${w.replace('@c.us', '')}]\n\n`).join(''), id);
				break;

				case 'sip':
					if (args.length !== 1) return await kill.reply(chatId, mess.noargs() + 'IPV4 (ex: 8.8.8.8).', id);
					const ip = await axios.get(`https://ipwhois.app/json/${encodeURIComponent(Sliced_Body)}`);
					if (ip.data.latitude == null) return await kill.reply(chatId, mess.noresult(), id);
					await kill.sendLocation(chatId, `${ip.data.latitude}`, `${ip.data.longitude}`, '');
					await kill.reply(chatId, mess.sip(ip) + '\n\n' + 'Searching place photo - Buscando foto do local...', id);
					await kill.sendFileFromUrl(chatId, `https://maps.googleapis.com/maps/api/streetview?size=800x800&location=${ip.data.latitude},%20${ip.data.longitude}&sensor=false&key=${APIS.API_Google_Maps}`, id);
				break;

				case 'scep':
					if (region !== 'pt') return await kill.reply(chatId, 'Brazil only/Brasil solamente!', id);
					if (args.length !== 1 || Sliced_Body.length > 8) return await kill.reply(chatId, mess.noargs() + 'CEP (ex: 03624090).', id);
					const viacep = await axios.get(`https://viacep.com.br/ws/${encodeURIComponent(Sliced_Body)}/json/`);
					if (viacep.data.erro) return await kill.reply(chatId, mess.noresult(), id);
					await kill.reply(chatId, mess.scep(viacep), id);
					await axios.get(`https://brasilapi.com.br/api/cep/v2/${args[0]}`).then(async (cep) => {
						await kill.sendLocation(chatId, `${cep.data.location.coordinates.latitude}`, `${cep.data.location.coordinates.longitude}`, `${cep.data.street}, ${cep.data.city}`);
					}).catch(async (error) => {
						await kill.reply(chatId, `[${error.response.data.name} - ${error.response.data.type}]\n\n${error.response.data.message}\n\n` + error.response.data.errors.map(res => `${res.service.toUpperCase()} -> ${res.message}\n\n`).join(''), id);
					});
				break;

				case 'random':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					let Random_Text = arks.includes('-promote') ? Sliced_Body.replace('-promote', '') : (arks.includes('-kick') ? Sliced_Body.replace('-kick', '') : (arks.includes('-demote') ? Sliced_Body.replace('-demote', '') : Sliced_Body));
					await kill.sendTextWithMentions(chatId, `═✪〘 👉 - ${Random_Text} - 🐂 〙✪═ \n\n@${randomMember.replace(/@c.us/g, '')}`);
					if (isGroupAdmins || isGroupCreator || isOwner) {
						if (arks.includes('-kick')) {
							await kill.removeParticipant(chatId, randomMember);
						} else if (arks.includes('-promote')) {
							if (!groupAdmins.includes(randomMember)) {
								await kill.promoteParticipant(chatId, randomMember);
							}
						} else if (arks.includes('-demote')) {
							if (groupAdmins.includes(randomMember)) {
								await kill.demoteParticipant(chatId, randomMember);
							}
						}
						/*else if (arks.includes('-vip')) {
							Special_Poll = 'vip';
						} else if (arks.includes('-mod')) {
							Special_Poll = 'mod';
						}*/
					}
				break;

				case '3d':
					if (args.length == 0 || arks.length >= 16) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.\n\nMax: 10 letras/letters.', id);
					try {
						const thirdime = await maker.textpro(tools('others').randVal(["https://textpro.me/3d-gradient-text-effect-online-free-1002.html", "https://textpro.me/3d-box-text-effect-online-880.html"]), Sliced_Body);
						await kill.sendFileFromUrl(chatId, thirdime, 'textpro.jpg', '', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'slogan':
					if (args.length == 0 || arks.length >= 16) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.\n\nMax: 10 letras/letters.', id);
					try {
						const sloganbes = await maker.textpro("https://textpro.me/1917-style-text-effect-online-980.html", Sliced_Body);
						await kill.sendFileFromUrl(chatId, sloganbes, 'textpro.jpg', '', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;
		
				case 'niver':
					if (args.length == 0) return await kill.reply(chatId, mess.niverBirth(), id);
					if (Object.keys(functions.birthdays).includes(user)) return await kill.reply(chatId, mess.cannotChange(), id);
					functions.birthdays[user] = {
						"date": moment(args[0], 'DD/MM/YYYY').format('DD/MM'),
						"year": moment(args[0], 'DD/MM/YYYY').format('YYYY'),
						"last_check": "never"
					};
					fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
					await kill.reply(chatId, mess.niverAdded(), id);
				break;

				case 'gaming':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					await kill.sendFileFromUrl(chatId, `https://docs-jojo.herokuapp.com/api/gaming?text=${Sliced_Body}`, '', '', id);
				break;

				case 'thunder':
					if (args.length == 0 || arks.length >= 16) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.\n\nMax: 10 letras/letters.', id);
					try {
						const thunderth = await maker.textpro("https://textpro.me/create-thunder-text-effect-online-881.html", Sliced_Body);
						await kill.sendFileFromUrl(chatId, thunderth, 'textpro.jpg', '', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'light':
					if (args.length == 0 || arks.length >= 16) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.\n\nMax: 10 letras/letters.', id);
					try {
						const lightig = await maker.textpro("https://textpro.me/create-a-futuristic-technology-neon-light-text-effect-1006.html", Sliced_Body);
						await kill.sendFileFromUrl(chatId, lightig, 'textpro.jpg', '', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'wolf':
					if (args.length < 2 && !arks.includes('|')) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
					if (arg.split('|')[0].length >= 10 || arg.split('|')[1].length >= 10) return await kill.reply(chatId, 'Max: 10 letras/letters p/frase - phrase.', id);
					try {
						const wolfnat = await maker.textpro(tools('others').randVal(["https://textpro.me/create-wolf-logo-black-white-937.html", "https://textpro.me/create-wolf-logo-galaxy-online-936.html"]), arg.split('|'));
						await kill.sendFileFromUrl(chatId, wolfnat, 'textpro.jpg', '', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'neon':
					if (args.length == 0 || arks.length >= 16) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.\n\nMax: 10 letras/letters.', id);
					try {
						const neonaz = await maker.textpro("https://textpro.me/create-blackpink-logo-style-online-1001.html", Sliced_Body);
						await kill.sendFileFromUrl(chatId, neonaz, 'textpro.jpg', '', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'retro':
					if (args.length >= 4 && arks.includes('|')) {
						if (arg.split('|')[0].length >= 10 || arg.split('|')[1].length >= 10 || arg.split('|')[2].length >= 10) return await kill.reply(chatId, 'Max: 10 letras/letters p/frase - phrase.', id);
						try {
							const retrobat = await maker.textpro("https://textpro.me/80-s-retro-neon-text-effect-online-979.html", arg.split('|'));
							await kill.sendFileFromUrl(chatId, retrobat, 'textpro.jpg', '', id);
						} catch (error) {
							tools('others').reportConsole(cmd, error);
							await kill.reply(chatId, mess.fail(cmd, error, time), id);
						}
					} else await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 2 "|".', id);
				break;

				case 'porn':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const porn = await axios.get('https://meme-api.herokuapp.com/gimme/porn');
					await kill.sendFileFromUrl(chatId, `${porn.data.url}`, '', `${porn.data.title}`, id);
				break;

				case 'lesbian':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const lesb = await axios.get('https://meme-api.herokuapp.com/gimme/lesbians');
					await kill.sendFileFromUrl(chatId, `${lesb.data.url}`, '', `${lesb.data.title}`, id);
				break;

				case 'pgay':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const gay = await axios.get('https://meme-api.herokuapp.com/gimme/gayporn');
					await kill.sendFileFromUrl(chatId, `${gay.data.url}`, '', `${gay.data.title}`, id);
				break;

				case 'logo':
					if (args.length == 0 || arks.length >= 16) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.\n\nMax: 10 letras/letters.', id);
					try {
						const logoprop = await maker.textpro("https://textpro.me/create-blackpink-logo-style-online-1001.html", Sliced_Body);
						await kill.sendFileFromUrl(chatId, logoprop, 'textpro.jpg', '', id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'pornhub':
					if (args.length >= 2 && arks.includes('|')) {
						if (arg.split('|')[0].length >= 10 || arg.split('|')[1].length >= 10) return await kill.reply(chatId, 'Max: 10 letras/letters p/frase - phrase.', id);
						try {
							const pornhubcnc = await maker.textpro("https://textpro.me/pornhub-style-logo-online-generator-free-977.html", arg.split('|'));
							await kill.sendFileFromUrl(chatId, pornhubcnc, 'textpro.jpg', '', id);
						} catch (error) {
							tools('others').reportConsole(cmd, error);
							await kill.reply(chatId, mess.fail(cmd, error, time), id);
						}
					} else await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
				break;

				case 'meme':
					if (isType('image') && args.length >= 2 && arks.includes('|')) {
						const mediaData = await decryptMedia(encryptMedia);
						await kill.sendFileFromUrl(chatId, `https://api.memegen.link/images/custom/${encodeURIComponent(arg.split('|')[0])}/${encodeURIComponent(arg.split('|')[1])}.png?background=${await tools('cloud').upload(mediaData)}`, 'image.png', '', id).catch(async (error) => {
							tools('others').reportConsole(cmd, error);
							await kill.reply(chatId, mess.upfail() +'\n\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​'+mess.fail(cmd, error, time), id);
						});
					} else await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
				break;
		
				case 'quote':
					const quoSplit = arks.includes('|') ? arg.split('|').map(o => o.replace(/^ /g, '').replace(/ $/g, '')) : [0];
					if (quoSplit.length >= 4 && isType('image')) {
						const mediaData = await decryptMedia(encryptMedia);
						const quoteImageU = await tools('cloud').upload(mediaData);
						const quoteMaker = await axios.get(`https://web-series-quotes-api.deta.dev/pic/custom?text=${encodeURIComponent(quoSplit[4])}&image_url=${encodeURIComponent(quoteImageU)}&text_color=${encodeURIComponent(quoSplit[0])}&text_size=${encodeURIComponent(quoSplit[3])}&x=${encodeURIComponent(quoSplit[1])}&y=${encodeURIComponent(quoSplit[2])}`, {
							responseType: 'arraybuffer'
						});
						await kill.sendFile(chatId, tools('others').dataURI('image/png', Buffer.from(quoteMaker.data, 'binary')), 'image.png', '<3', id);
					} else return await kill.reply(chatId, mess.quoteCreation(), id);
				break;

				case 'ping':
					const timeStartCmd = moment.now();
					const rTime = seconds => `${Math.floor(seconds / (60*60))} horas | ${Math.floor(seconds % (60*60) / 60)} minutos | ${Math.floor(seconds % 60)} segundos - HH:MM:SS`;
					let myInfo = await kill.getMe();
					if (myInfo.phone == null) myInfo.phone = {};
					let loadMess = await kill.getAmountOfLoadedMessages();
					let allGroupsP = await kill.getAllGroups();
					let allChatId = await kill.getAllChatIds();
					let isPlugged = (sesConfig.Multi_Devices ? false : await kill.getIsPlugged()) ? 'Sim' : 'Não [?]';
					let waver = await kill.getWAVersion();
					let sesInfo = await kill.getSessionInfo();
					let hideInformation = isOwner && !isGroupMsg || isOwner && argl[0] == '-show' ? false : true;
					let finalPing = mess.stats(rTime(process.uptime()), rTime(os.uptime()), `${Math.floor(os.totalmem() / 1024 / 1024) - Math.floor(os.freemem() / 1024 / 1024)} MB / ${Math.floor(os.totalmem() / 1024 / 1024)} MB - [${Math.floor(os.freemem() / 1024 / 1024)} MB Livres]`, os, loadMess, allGroupsP, allChatId, procTime, waver, isPlugged, myInfo, sesConfig.Multi_Devices, sesInfo, (moment.duration(moment.now() - timeStartCmd).asSeconds()), hideInformation);
					await kill.reply(chatId, finalPing, id);
				break;

				case 'join':
					if (args.length == 0 || !/chat.whatsapp.com/gim.test(args[0]) && !/(https?:\/\/)?chat\.whatsapp\.com\/(?:invite\/)?([a-zA-Z0-9_-])+/gim.test(args[0]) && !args[0].includes('chat.whatsapp.com')) return await kill.reply(chatId, mess.nolink(), id);
					if (!/[0-9]/.test(config.Owner[0][0])) return await kill.reply(chatId, `Meu dono é anonimo ou ele não fez a configuração corretamente, não posso aceitar pedidos por agora.`, id);
					const Chat_Link = args[0];
					const tGr = await kill.getAllGroups();
					const check = await kill.inviteInfo(Chat_Link);
					if (tGr.length > config.Max_Groups) return await kill.reply(chatId, mess.cheio(tGr), id);
					if (check.groupMetadata.size < config.Min_Membros) return await kill.reply(chatId, mess.noreq(check.size), id);
					if (check.status == 200) {
						check.groupMetadata.descOwner = check.groupMetadata.descOwner == 'null' ? '55@c.us' : check.groupMetadata.descOwner;
						var sButid = 'Nothing here sir';
						if (sesConfig.Multi_Devices == false) {
							sButid = await kill.sendButtons(chatId, mess.enterGroupHeader(), [
								{
									"id": "1",
									"text": "✔️ Sim ✔️"
								},
								{
									"id": "2",
									"text": "✖️ Não ✖️"
								}
							], mess.enterGroupBody(pushname, sender, check), mess.enterGroupFooter());
						} else await kill.sendLinkWithAutoPreview(config.Owner[0], Chat_Link, `${mess.enterGroupHeader()}\n\n${mess.enterGroupBody(pushname, sender, check)}\n\n${mess.enterGroupFooter()}`);
						const JoibID = sButid;
						await kill.reply(chatId, mess.enterGroupOwner(), id);
						var joinfilt = msgw => tools('others').filterMsg(msgw, config.Owner[0], config.Owner[0], JoibID, /sim|yes|no|nao/gi);
						kill.awaitMessages(config.Owner[0], joinfilt, {
							max: 1,
							time: 3.6e+6,
							errors: ['time']
						}).then(async collected => {
							if (/sim/gi.test(removeAccents(Array.from(collected)[0][1].body))) {
								await kill.reply(chatId, mess.Owner_Accept(Array.from(collected)[0][1].body), id);
								await kill.joinGroupViaLink(Chat_Link);
							} else if (/nao/gi.test(removeAccents(Array.from(collected)[0][1].body))) {
								await kill.reply(chatId, mess.Owner_Refuse(Array.from(collected)[0][1].body), id);
							}
						}).catch(async collected => await kill.reply(chatId, mess.Owner_noAwnser(), id));
					} else await kill.reply(chatId, mess.nolink(), id);
				break;

				case 'placa':
					try {
						if (region !== 'pt' && !arks.includes('-force')) return await kill.reply(chatId, mess.onlyBrazil('"${prefix}Placa -force <Value>"'), id);
						var P_Scan = '';
						if (isType('image') || tools('others').isUrl(args[0])) {
							try {
								const tessReci = isType('image') ? await decryptMedia(encryptMedia) : args[0];
								P_Scan = await tesseract.recognize(tessReci);
							} catch (err) {
								tools('others').reportConsole(cmd, err);
								return await kill.reply(chatId, mess.fail(cmd, err, time), id);
							}
							if (P_Scan.length > 7) return await kill.reply(chatId, mess.maxDigitPhoto(), id);
							var BTDID = 'Nothing here sir';
							if (sesConfig.Multi_Devices == false) {
								BTDID = await kill.sendButtons(chatId, mess.buttonStop('Não'), [{
										"id": "1",
										"text": "👌 Sim 👍"
									},
									{
										"id": "2",
										"text": "⛔ Não 🚫"
									}
								], mess.buttonMiddle(), mess.scanPlate(P_Scan.result));
							} else await kill.reply(chatId, mess.scanPlate(P_Scan.result), id);
							const PlacaBID = BTDID;
							var isSameVa = msgw => tools('others').filterMsg(msgw, user, chatId, PlacaBID, /sim|yes|no|nao/gi);
							kill.awaitMessages(chatId, isSameVa, {
								max: 1,
								time: 120000,
								errors: ['time']
							}).then(async collected => {
								if (/sim/gi.test(removeAccents(Array.from(collected)[0][1].body))) {
									await tools('buscas').carros(P_Scan.result, kill, message);
								} else await kill.reply(chatId, mess.selectNO("${prefix}Placa AFK1648"), id);
							});
						} else {
							if (region !== 'pt' && args.length < 2 || args.length == 0) return await kill.reply(chatId, mess.searchCar(), id);
							let scanType = region == 'pt' ? args[0] : args[1];
							await tools('buscas').carros(scanType, kill, message);
						}
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'phcom':
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
					let thephComP = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.phub({
						username: arg.split('|')[0].replace(mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join(' '), ''),
						message: arg.split('|')[1],
						image: thephComP[0]
					}).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `pornhub.png`, '', id));
				break;

				case 'ytcom':
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
					let theYtComP = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.youtube({
						username: arg.split('|')[0].replace(mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join(' '), ''),
						content: arg.split('|')[1],
						avatar: theYtComP[0],
						dark: false
					}).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `youtube.png`, '', id));
				break;

				case 'enviar':
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
					try {
						const sendMess = async (idq, arg, typeChat, typeId) => {
							if (isType('image') || isType('audio') || isType('ptt') || isType('video') || isType('sticker') || isType('document') || isType('ptt')) {
								const mediaData = await decryptMedia(encryptMedia);
								if (isType('video') || isType('image')) {
									await kill.sendFile(idq, tools('others').dataURI(encryptMedia.mimetype, mediaData), 'file.' + encryptMedia.mimetype, `_Mensagem >_\n"${arg.split('|')[1]} "` + '\n\n_Quem enviou =_ ' + '\n*"' + typeName + '"*' + '\n\n_Como responder:_');
								} else {
									await kill.sendFile(idq, tools('others').dataURI(encryptMedia.mimetype, mediaData), 'file.' + encryptMedia.mimetype, '');
									await kill.sendText(idq, `[Transmissão de ${pushname} ]\n\n${arg.split('|')[1]}`);
								}
							} else await kill.sendText(idq, `_Mensagem >_\n"${arg.split('|')[1]} "` + '\n\n_Quem enviou =_ ' + '\n*"' + typeName + '"*' + '\n\n_Como responder:_');
							await kill.sendText(idq, `${prefix}enviar ${typeChat} ${typeId} | Coloque sua resposta aqui`);
							await kill.sendText(chatId, mess.maked());
						};
						if (argl[0] == '-gp') {
							await sendMess(`${args[1]}@g.us`, arg, typeChat, typeId);
						} else if (argl[0] == '-pv') {
							await sendMess(`${args[1]}@c.us`, arg, typeChat, typeId);
						} else await kill.reply(chatId, mess.enviar(), id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.noctt() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				case 'loli':
					await kill.sendFileFromUrl(chatId, `https://media.publit.io/file/Twintails/${tools('others').randomNumber(1, 145)}.jpg`, 'loli.jpg', mess.logomgs(), id);
				break;

				case 'hug':
					let hugPeo = await axios.get("https://nekos.life/api/v2/img/hug");
					if (hugPeo.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(hugPeo.data.url, cmd, kill, message);
					} else await mandarFig(kill, chatId, hugPeo.data.url, stickerConfig);
				break;

				case 'baguette':
					let filterBg = isActivated('nsfw') || isActivated('antiporn') ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT;
					const getBaguette = await duck.search('anime baguette girls', filterBg);
					await kill.sendFileFromUrl(chatId, tools('others').randVal(getBaguette.map(c => c.image)), `baguette.jpg`, '🥖', id);
				break;

				case 'dva':
					let filterDva = isActivated('nsfw') || isActivated('antiporn') ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT;
					const getDVA = await duck.search('dva overwatch', filterDva);
					await kill.sendFileFromUrl(chatId, tools('others').randVal(getDVA.map(c => c.image)), `dva.jpg`, '😍', id);
				break;

				case 'waifu':
					const waifu3 = await axios.get(`https://waifu.pics/api/sfw/waifu`);
					await kill.sendFileFromUrl(chatId, waifu3.data.url, '', 'hmmm...', id);
				break;

				case 'husb':
					let filterHusb = isActivated('nsfw') || isActivated('antiporn') ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT;
					const getHusb = await duck.search('husbando anime boys', filterHusb);
					await kill.sendFileFromUrl(chatId, tools('others').randVal(getHusb.map(c => c.image)), `husb.jpg`, '-.-', id);
				break;

				case 'iecchi':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const ecchi = await axios.get('http://api.nekos.fun:8080/api/' + tools('others').randVal(["gasm", "lewd", "spank", "feet", "lesbian"]));
					if (ecchi.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(ecchi.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, ecchi.data.url, stickerConfig);
				break;

				case 'tits':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const rtitsc = tools('others').randVal(["tits", "BestTits", "boobs", "BiggerThanYouThought", "smallboobs", "TinyTits", "SmallTitsHugeLoad", "amazingtits"]);
					const tits = await axios.get('https://meme-api.herokuapp.com/gimme/' + rtitsc);
					await kill.sendFileFromUrl(chatId, `${tits.data.url}`, '', `${tits.data.title}`, id);
				break;

				case 'milf':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const rmilfc = tools('others').randVal(["Bbwmilf", "milf"]);
					const milf1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + rmilfc);
					await kill.sendFileFromUrl(chatId, `${milf1.data.url}`, '', `${milf1.data.title}`, id);
				break;

				case 'bdsm':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const rbdsmc = tools('others').randVal(["BDSMPics", "bdsm", "TeenBDSM"]);
					const bdsm1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + rbdsmc);
					await kill.sendFileFromUrl(chatId, `${bdsm1.data.url}`, '', `${bdsm1.data.title}`, id);
				break;

				case 'ass':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const rassc = tools('others').randVal(["CuteLittleButts", "ass", "bigasses"]);
					const bowass = await axios.get('https://meme-api.herokuapp.com/gimme/' + rassc);
					await kill.sendFileFromUrl(chatId, `${bowass.data.url}`, '', `${bowass.data.title}`, id);
				break;

				case 'pussy':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const rpussyc = tools('others').randVal(["pussy", "ass", "LegalTeens"]);
					const bows1 = await axios.get('https://meme-api.herokuapp.com/gimme/' + rpussyc);
					await kill.sendFileFromUrl(chatId, `${bows1.data.url}`, '', `${bows1.data.title}`, id);
				break;

				case 'blowjob':
				case 'boquete':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					let blowJobs = await axios.get(`http://api.nekos.fun:8080/api/${tools('others').randVal(["bj", "blowjob"])}`);
					if (blowJobs.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(blowJobs.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, blowJobs.data.url, stickerConfig);
				break;

				case 'feet':
				case 'pezinho':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					let feetGet = await axios.get(`http://api.nekos.fun:8080/api/feet`);
					if (feetGet.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(feetGet.data.url, cmd, kill, message);
					} else await mandarFig(kill, chatId, feetGet.data.url, stickerConfig);
				break;

				case 'hard':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					let hardGet = await axios.get(`http://api.nekos.fun:8080/api/spank`);
					if (hardGet.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(hardGet.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, hardGet.data.url, stickerConfig);
				break;
		
				case 'lol':
					let lolChamp = shell.exec(`bash lib/functions/config.sh lol ${argl[0]}`, {
						silent: true
					});
					if (lolChamp.stdout == '') {
						await kill.reply(chatId, mess.fail(cmd, lolChamp.stderr, time), id);
						console.log(lolChamp.stderr);
					} else {
						if (region == 'en' || arks.includes('-orig')) return await kill.reply(chatId, lolChamp.stdout, id);
						const champt = (await translate(lolChamp.stdout, {
							to: region
						})).text;
						await kill.reply(chatId, champt, id);
					}
				break;

				case 'boobs':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					let getboobs = await axios.get(`http://api.nekos.fun:8080/api/boobs`);
					if (getboobs.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(getboobs.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, getboobs.data.url, stickerConfig);
				break;

				case 'lick':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					let getlick = await axios.get(`http://api.nekos.fun:8080/api/lick`);
					if (getlick.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(getlick.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, getlick.data.url, stickerConfig);
				break;

				case 'femdom':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const femdom = await axios.get('http://api.nekos.fun:8080/api/lesbian');
					if (femdom.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(femdom.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, femdom.data.url, stickerConfig);
				break;

				case 'futanari':
				case 'trap':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const Get_FUTA = await duck.search('anime boy cute futanari trap hentai', duck.SafetyLevels.OFF);
					await kill.sendFileFromUrl(chatId, tools('others').randVal(Get_FUTA.map(c => c.image)), '', '', id);
				break;

				case 'masturb':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const Get_Mastu = await duck.search('anime girls cute masturb', duck.SafetyLevels.OFF);
					await kill.sendFileFromUrl(chatId, tools('others').randVal(Get_Mastu.map(c => c.image)), '', '', id);
				break;

				case 'anal':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					let getanal = await axios.get(`http://api.nekos.fun:8080/api/cum`);
					if (getanal.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(getanal.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, getanal.data.url, stickerConfig);
				break;

				case 'randomloli':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const Get_LOLI = await duck.search('petite anime girl naked', duck.SafetyLevels.OFF);
					await kill.sendFileFromUrl(chatId, tools('others').randVal(Get_LOLI.map(c => c.image)), '', '', id);
				break;

				case 'nsfwicon':
				case 'face':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const icon = await axios.get('http://api.nekos.fun:8080/api/gasm');
					await kill.sendImageAsSticker(chatId, icon.data.image, stickerConfig);
				break;

				case 'truth':
					const memean = await axios.get('https://nekos.life/api/v2/img/gecg');
					await kill.sendFileFromUrl(chatId, memean.data.url, '', '', id);
				break;

				case 'icon':
					const avatarz = await axios.get('https://nekos.life/api/v2/img/avatar');
					await kill.sendImageAsSticker(chatId, avatarz.data.url, stickerConfig);
				break;

				case 'corno':
					let corno = tools('others').getRandLine(2, './lib/config/Utilidades/corno.txt');
					let corno2 = (mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : user)).replace('@c.us', '');
					await kill.sendTextWithMentions(chatId, `@${corno2} é ${lvpc}%...\n\n"${corno[0]}"\n\nE nas horas vagas ${100 - lvpc}%...\n\n"${corno[1]}" 😳.`);
				break;

				case 'gamemode':
					if (args.length == 0) return await kill.reply(chatId, mess.cors(), id);
					if (argl[0] == '0' || argl[0] == 's' || argl[0] == 'survival') {
						await kill.sendTextWithMentions(chatId, mess.mine(user) + 'survival.');
					} else if (argl[0] == '1' || argl[0] == 'c' || argl[0] == 'creative') {
						await kill.sendTextWithMentions(chatId, mess.mine(user) + 'creative.');
					} else if (argl[0] == '2' || argl[0] == 'a' || argl[0] == 'adventure') {
						await kill.sendTextWithMentions(chatId, mess.mine(user) + 'adventure.');
					} else if (argl[0] == '3' || argl[0] == 'spectator') {
						await kill.sendTextWithMentions(chatId, mess.mine(user) + 'espectador.');
					} else await kill.reply(chatId, mess.cors(), id);
				break;

				case 'ihentai':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					let ihentai = await axios.get(`http://api.nekos.fun:8080/api/${tools('others').randVal(["hentai", "pussy", "cum"])}`);
					if (ihentai.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(ihentai.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, ihentai.data.url, stickerConfig);
				break;

				case 'yuri':
					let filterYu = isActivated('nsfw') || isActivated('antiporn') ? duck.SafetyLevels.OFF : duck.SafetyLevels.STRICT;
					const getYuri = await duck.search('yuri anime kiss', filterYu);
					await kill.sendFileFromUrl(chatId, tools('others').randVal(getYuri.map(c => c.image)), `yuri.jpg`, 'Pro inferno com as Fujoshis ehehe!', id);
				break;

				case 'randomneko':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const randNekons = await axios.get(`http://api.nekos.fun:8080/api/${tools('others').randVal(["holo", "foxgirl", "animalears", "neko", "holoero", "nsfw_neko_gif"])}`);
					if (randNekons.data.image.endsWith('.gif')) {
						await tools('ffmpeg').resize(randNekons.data.image, cmd, kill, message);
					} else await mandarFig(kill, chatId, randNekons.data.url, stickerConfig);
				break;

				case 'randomwall':
					const walnime = await axios.get('https://nekos.life/api/v2/img/wallpaper');
					await kill.sendFileFromUrl(chatId, walnime.data.url, '', '', id);
				break;

				case 'valor':
					if (args.length !== 2) return await kill.reply(chatId, mess.moneyerr(), id);
					const money = await axios.get(`https://${encodeURIComponent(args[0])}.rate.sx/${encodeURIComponent(args[1])}`);
					if (/^[0-9+]/.test(money.data)) return await kill.reply(chatId, mess.moneyerr(), id);
					await kill.reply(chatId, `*${args[1]}* → *${Number(money.data).toFixed(2)}* ${args[0]}`, id);
				break;

				case 'dog':
					const list = await axios.get('https://shibe.online/api/shibes');
					await kill.sendFileFromUrl(chatId, list.data[0], '', '🐕', id);
				break;

				case 'look':
					let getLook = await axios.get(`https://nekos.life/api/v2/img/smug`);
					if (getLook.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getLook.data.url, cmd, kill, message);
					} else await mandarFig(kill, chatId, getLook.data.url, stickerConfig);
				break;

				case 'holo':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					const holo = await axios.get('http://api.nekos.fun:8080/api/holo');
					await kill.sendFileFromUrl(chatId, holo.data.image, '', '', id);
				break;

				case 'kisu':
					let getKisu = await axios.get(`https://nekos.life/api/v2/img/kiss`);
					if (getKisu.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getKisu.data.url, cmd, kill, message);
					} else await mandarFig(kill, chatId, getKisu.data.url, stickerConfig);
				break;

				case 'tapa':
					let getSlap = await axios.get(`https://nekos.life/api/v2/img/slap`);
					if (getSlap.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getSlap.data.url, cmd, kill, message);
					} else await mandarFig(kill, chatId, getSlap.data.url, stickerConfig);
				break;

				case 'gato':
				case 'cat':
					if (args.length !== 2 || isNaN(args[0]) || isNaN(args[1])) {
						const catu = await axios.get('https://nekos.life/api/v2/img/meow');
						await kill.sendFileFromUrl(chatId, catu.data.url, 'gato.jpg', mess.cats(), id);
					} else await kill.sendFileFromUrl(chatId, `https://placekitten.com/${args[0]}/${args[1]}`, 'neko.png', 'Nekooo', id);
				break;

				case 'pokemon':
					if (args.length == 0) return await kill.sendFileFromUrl(chatId, `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${tools('others').randomNumber(1, 898)}.png`, 'Pokemon.png', mess.nopoke(), id);
					const pokelang = region == 'es' ? 'spanish' : 'english';
					Pokemon.setLanguage(pokelang);
					const pokemae = await Pokemon.getPokemon(args[0]);
					if (pokemae == null) return await kill.reply(chatId, mess.noresult(), id);
					await kill.sendFileFromUrl(chatId, pokemae.sprites.front_default, 'pokemon.png', mess.pokemon(pokemae, `\n➸ ${pokemae.moves.join('\n➸ ')}`), id);
				break;

				case 'screenshot':
					if (Default_APIS.API_NoFlash !== APIS.API_NoFlash) {
						if (args.length == 0 || !tools('others').isUrl(args[0])) return await kill.reply(chatId, mess.nolink(), id);
						await kill.sendFileFromUrl(chatId, `https://api.apiflash.com/v1/urltoimage?access_key=${APIS.API_NoFlash}&url=${args[0]}`, 'ss.jpeg', mess.noporn(), id);
					} else return await kill.reply(chatId, mess.Command_Unusable(), id);
				break;

				case 'ship':
					const shipMent = mentionedJidList.length >= 1 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : (args.length >= 1 ? args[0] : botNumber));
					const mentShip = mentionedJidList.length >= 2 ? mentionedJidList[1] : (quotedMsgObj ? quotedMsgObj.sender.id : (args.length >= 2 && argl[0] !== argl[1] ? args[1] : user));
					const shipCasal = (new Array('noval', shipMent, mentShip)).map(u => '@'.concat(u.replace('@c.us', '').replace('@', '')));
					const allUsg = [botNumber, args[0], args[1], user, mentionedJidList[0], mentionedJidList[1]].filter(h => h !== null);
					for (let i of allUsg) {
						if (shipCasal[1] == shipCasal[2]) {
							shipCasal[1] = '@'.concat(i.replace('@c.us', '').replace('@', ''));
						}
					}
					await kill.sendTextWithMentions(chatId, mess.love(shipCasal, lvpc)).catch(async () => await kill.reply(chatId, mess.love(shipCasal, lvpc), id));
				break;

				/*Se quiser por mais pra zoar, abra o arquivo LGBT e adicione 1 por linha*/
				case 'gay':
				case 'lgbt':
					const twgui = tools('others').getRandLine(2, './lib/config/Utilidades/lgbt.txt');
					const theLgBtic = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					const arcoiris = await canvacord.Canvas.rainbow(theLgBtic[0]);
					await kill.sendFile(chatId, tools('others').dataURI('image/png', arcoiris), `gay.png`, mess.lgbt(lvpc, twgui[0], (100 - lvpc), twgui[1]), id);
				break;

				case 'chance':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					await kill.reply(chatId, mess.botmonkey(Sliced_Body, lvpc), id);
				break;

				case 'kiss':
					const getMeKiss = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : user);
					let getKissSt = async () => {
						let getKiss = await axios.get(`https://nekos.life/api/v2/img/kiss`);
						if (getKiss.data.url.endsWith('.gif')) {
							await tools('ffmpeg').resize(getKiss.data.url, cmd, kill, message);
						} else await mandarFig(kill, chatId, getKiss.data.url, stickerConfig);
						await kill.sendTextWithMentions(chatId, mess.kiss(user, getMeKiss));
					};
					if (married.all.includes(user) || married.all.includes(getMeKiss) && getMeKiss !== user) {
						let theMarry = Object.keys(married.persons).filter(p => married.persons[p].love == user || married.persons[p].request == user);
						let marriedPer = '';
						if (theMarry.length >= 1) {
							if (user == married.persons[theMarry[0]].request) {
								marriedPer = married.persons[theMarry[0]].love;
							} else if (user == married.persons[theMarry[0]].love) {
								marriedPer = married.persons[theMarry[0]].request;
							}
							if (marriedPer == getMeKiss) return await getKissSt();
							await kill.sendTextWithMentions(married.persons[theMarry[0]].place, mess.partCorno(marriedPer, sender, getMeKiss));
							await kill.sendTextWithMentions(chatId, mess.partCornoTwo(sender, marriedPer));
						} else await kill.reply(chatId, mess.notBetray(), id);
					} else await getKissSt();
				break;

				case 'slap':
					const getMeSlap = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : user);
					let getTapa = await axios.get(`https://nekos.life/api/v2/img/slap`);
					if (getTapa.data.url.endsWith('.gif')) {
						await tools('ffmpeg').resize(getTapa.data.url, cmd, kill, message);
					} else await mandarFig(kill, chatId, getTapa.data.url, stickerConfig);
					await kill.sendTextWithMentions(chatId, mess.tapa(user, getMeSlap));
				break;

				case 'getmeme':
					var thememer = region == 'pt' ? 'brasil' : (region == 'en' ? 'memes' : 'SpanishMeme');
					const response = await axios.get('https://meme-api.herokuapp.com/gimme/' + thememer);
					await kill.sendFileFromUrl(chatId, `${response.data.url}`, 'meme.jpg', `${response.data.title}`, id);
				break;

				case 'date':
				case 'data':
					if (moment.tz.names().includes(args[0])) return await kill.reply(chatId, mess.dateNowOn(args[0]), id);
					let timezonesw = moment.tz.names().map(tz => `"${tz}" = "${moment.tz(tz).format('llll')}"\n\n`).join('');
					await kill.reply(chatId, mess.allDatePlace()+timezonesw, id);
				break;

				case 'menu':
					const userMenIf = tools('gaming').getValue(user, chatId, null);
					if (sesConfig.Multi_Devices == false) {
						await kill.sendButtons(chatId, 'Atalhos →', [
							{
								"id": "1",
								"text": "/Menut"
							},
							{
								"id": "2",
								"text": "/Admins"
							},
							{
								"id": "3",
								"text": "/Legião"
							}
						], mess.menu(pushname, time, userMenIf.msg, userMenIf.xp, tools('gaming').LevelEXP(userMenIf.level), userMenIf.level, procTime, patente));
					} else await kill.reply(chatId, mess.menu(pushname, time, userMenIf.msg, userMenIf.xp, tools('gaming').LevelEXP(userMenIf.level), userMenIf.level, procTime, patente), id);
					//`Todos os comandos - All Commands\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​${allCommands.toString()}`
				break;
		
				// Menu "atualizado" feito para ser auto construído em forma de tabela, feito por Pedro Batistop
				case 'menut':
					let menuT = args.length == 0 || !commandslist.allMenus.includes(argl[0]) ? 'menu' : argl[0];
					if (args.length !== 0 && !tools('menu').getAllMenus().includes(menuT)) return await kill.reply(chatId, mess.noresult(), id);
					if (isGroupMsg && !isActivated('nsfw') && menuT == 'adult') return await kill.reply(chatId, mess.gpadulto(), id);
					let tableCMD = tools('menu').getMenu(menuT, isActivated('nsfw'), prefix);
					if (menuT == 'menu') {
						const usrInfo = tools('gaming').getValue(user, chatId, null);
						let stats = `ᐳ _Olá -_ *"${pushname}"*!\nᐳ _Dia →_ *${time}*\nᐳ _Mensagens →_ *${usrInfo.msg}*\nᐳ _XP →_ *${usrInfo.xp}* / *${tools('gaming').LevelEXP(usrInfo.level)}*\nᐳ _Level →_ *${usrInfo.level}*\nᐳ _Rubi →_ *${usrInfo.rubi}*\nᐳ _Dima →_ *${usrInfo.dima}*\nᐳ _Coin →_ *${usrInfo.coin}*\nᐳ _Guilda →_ *${usrInfo.guild}*\nᐳ _Patente →_ *${patente}*\nᐳ _Ping →_ *${procTime}* _segundos_`;
						let sup = tools('menu').getMenu('suporte', true, prefix);
						await kill.reply(chatId, tools('others').tablefy(stats) + '\n' + tools('others').tablefy(sup.menu, sup.name) + '\n' + tools('others').tablefy(tableCMD.menu, tableCMD.name), id);
					} else await kill.reply(chatId, tools('others').tablefy(tableCMD.menu, tableCMD.name), id);
				break;

				case 'stickers':
					await kill.reply(chatId, mess.stickers(), id);
				break;

				case 'otaku':
					await kill.reply(chatId, mess.anime(), id);
				break;

				case 'games':
					await kill.reply(chatId, mess.games(), id);
				break;
		
				case 'faket':
					if (args.length < 3 || argl[0] == '-help') return await kill.reply(chatId, mess.howFakeTweet(), id);
					const twitImg = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					const argSplited = arg.split('|').map(o => o.replace(/^ /g, '').replace(/ $/g, ''));
					const twFaker = await axios.get(`https://some-random-api.ml/canvas/tweet?avatar=${encodeURIComponent(twitImg[0]+' ')}&comment=${encodeURIComponent(argSplited[2]+' ')}&displayname=${encodeURIComponent(argSplited[1] + ' ')}&username=${encodeURIComponent(argSplited[0]+' ')}`, {
						responseType: 'arraybuffer'
					});
					await kill.sendFile(chatId, tools('others').dataURI('image/png', Buffer.from(twFaker.data, 'binary')), 'tweet.png', 'Twitter é uma armadilha! ~Entendam!~', id);
				break;

				case 'adult':
					if (isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
					await kill.reply(chatId, mess.adult(), id);
				break;

				case 'down':
					await kill.reply(chatId, mess.down(), id);
				break;

				case 'dados':
					await kill.reply(chatId, mess.dados(), id);
				break;

				case 'midia':
					await kill.reply(chatId, mess.midia(), id);
				break;

				case 'outros':
					await kill.reply(chatId, mess.outros(), id);
				break;

				case 'maker':
					await kill.reply(chatId, mess.maker(), id);
				break;

				case 'tudo':
					//await kill.reply(chatId, (mess.stickers() + '\n\n' + mess.anime() + '\n\n' + mess.games() + '\n\n' + mess.adult() + '\n\n' + mess.down() + '\n\n' + mess.dados() + '\n\n' + mess.midia() + '\n\n' + mess.outros() + '\n\n' + mess.maker()).replace(' ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​', ''), id);
					await kill.reply(chatId, allCommands.toString(), id); // Todos as cases da Íris
				break;

				/*LEMBRE-SE, REMOVER CRÈDITO È CRIME E PROIBIDO!*/
				case 'termos':
					await kill.sendFileFromUrl(chatId, 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/license.png', 'licenca.png', mess.everhost() + '\n\n' + mess.tos(), id);
					await kill.sendPtt(chatId, `https://www.myinstants.com/media/sounds/resident-evil-4-merchant-thank-you.mp3`, id);
				break;
				/*NÃO REMOVA ESSA PARTE!*/

				case 'mac':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'mac (ex: 70:B3:D5:03:62:A1).', id);
					const maclk = await axios.get(`https://api.macvendors.com/${encodeURIComponent(Sliced_Body)}`);
					if (maclk.data.includes('error')) return await kill.reply(chatId, mess.noresult(), id);
					await kill.reply(chatId, `📱 → ${maclk.data}.`, id).catch(async (err) => await kill.reply(chatId, mess.noresult(), id));
				break;

				case 'converter':
				case 'conv':
					if (args == 0 || arks.includes('-help')) return await kill.reply(chatId, mess.conv(), id);
					try {
						if (isNaN(args[1])) return await kill.reply(chatId, mess.onlynumber(), id);
						let Fisic_Convert = tools('convert').Calculate(argl[0], argl[1]);
						if (Fisic_Convert == false) {
							await kill.reply(chatId, mess.conv(), id);
						} else await kill.reply(chatId, `*${args[1]}* _(${Fisic_Convert.First}) =_ *${tools('others').toLargeNumber((Fisic_Convert.Result).toString())}* _(${Fisic_Convert.Second})._\n\n_Formula ->_ *"${Fisic_Convert.Form}"*`, id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.onlynumber() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				case 'scnpj':
					if (region !== 'pt') return await kill.reply(chatId, 'Brazil only/Brasil solamente!', id);
					if (args.length == 1) {
						const cnpj = await axios.get(`https://www.receitaws.com.br/v1/cnpj/${encodeURIComponent(Sliced_Body)}`);
						if (cnpj.data.status == 'ERROR') return await kill.reply(chatId, cnpj.data.message, id);
						await kill.reply(chatId, `✪ CNPJ: ${cnpj.data.cnpj}\n\n✪ Tipo: ${cnpj.data.tipo}\n\n✪ Nome: ${cnpj.data.nome}\n\n✪ Região: ${cnpj.data.uf}\n\n✪ Telefone: ${cnpj.data.telefone}\n\n✪ Situação: ${cnpj.data.situacao}\n\n✪ Bairro: ${cnpj.data.bairro}\n\n✪ Logradouro: ${cnpj.data.logradouro}\n\n✪ CEP: ${cnpj.data.cep}\n\n✪ Casa N°: ${cnpj.data.numero}\n\n✪ Municipio: ${cnpj.data.municipio}\n\n✪ Abertura: ${cnpj.data.abertura}\n\n✪ Fantasia: ${cnpj.data.fantasia}\n\n✪ Jurisdição: ${cnpj.data.natureza_juridica}`, id);
					} else await kill.reply(chatId, 'Especifique um CNPJ sem os traços e pontos.', id);
				break;

				case 'coins':
					await kill.reply(chatId, mess.coins(), id);
				break;

				case 'allid':
				case 'grupos':
					let allMgps = await kill.getAllGroups();
					await kill.reply(chatId, allMgps.map(i => `\n➸ ${i.name} =\n${i.id.replace(/@g.us/g,'')}\n${i.participantsCount} Users\n`).join(''), id);
				break;

				case 'help':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'motivo/razon/reason.', id);
					await kill.sendText(config.Owner[0], mess.advise(typeName, typeChat, user, Sliced_Body, typeId) + '\n\n' + mess.thanks()).catch(async (e) => await kill.sendText(config.Secure_Group, mess.advise(typeName, typeChat, user, Sliced_Body, typeId) + '\n\n' + mess.thanks()));
				break;

				case 'level':
				case 'nivel':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					var yourName = mentionedJidList.length !== 0 ? mentioned_name : (quotedMsgObj ? quotedMsgObj.sender.pushname : pushname);
					var wdfWho = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : user);
					const userBase = tools('gaming').getValue(wdfWho, chatId, null);
					var ppLink = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					let rankCard = await tools('canvas').ranking(ppLink[0], userBase.xp, tools('gaming').LevelEXP(userBase.level), userBase.level, Object.keys(nivel[chatId]).indexOf(wdfWho), 0, `${tools('gaming').getPatent(userBase.level)} - ${userBase.guild.toUpperCase()}`, yourName);
					await kill.sendFile(chatId, rankCard, `${wdfWho.replace('@c.us', '')}_card.png`, mess.Rank_Card(yourName, name, userBase.xp, userBase), id);
				break;

				case 'ranking':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					var rankingForm = false;
					var rankLimit = false;
					var board = '';
					if (["xp","level","msg","coin","dima","rubi","stone","gold","iron","wood"].includes(argl[0])) {
						rankingForm = argl[0];
					} else {
						rankingForm = 'xp';
						board = mess.specifyRank(rankingForm);
						rankLimit = isNaN(argl[0]) || argl[0] == null || Number(argl[0]) < 3 ? 10 : Number(args[0]);
					}
					rankLimit = rankLimit !== false ? rankLimit : (isNaN(argl[1]) || argl[1] == null || Number(argl[1]) < 3 ? 10 : Number(argl[1]));
					let rankingList = tools('others').sort(nivel[chatId], rankingForm);
					try {
						for (let i = 0; i < rankLimit && i < Object.keys(rankingList).length; i++) {
							if (Object.keys(rankingList)[i] !== null) {
								let aRandNe = await kill.getContact(Object.keys(rankingList)[i]);
								if (aRandNe == null) {
									delete nivel[chatId][Object.keys(rankingList)[i]] ; // Deleta os inválidos do ranking, impedindo de dar BO depois
									return fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(nivel, null, "\t"));
								}
								let The_RPerson = tools('gaming').getValue(Object.keys(rankingList)[i], chatId, null);
								board += `#️⃣${Number(i)+1} → *${aRandNe.pushname || 'wa.me/' + Object.keys(rankingList)[i].replace('@c.us', '')}*\n💰 → ${The_RPerson[rankingForm]} [${rankingForm.toUpperCase()}]\n⚔️ Patente → ${tools('gaming').getPatent(The_RPerson.level)}\n\n`;
							}
						}
						await kill.reply(chatId, board, id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.tenpeo() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				case 'marcar':
					await kill.sendReplyWithMentions(chatId, `@${user.replace('@c.us', '')}`, id);
				break;
		
				case 'value':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (!Object.keys(config).includes(args[0])) return await kill.reply(chatId, mess.valueChanger(), id);
					var newValue = false;
					if (args[0] == "Owner" || args[0] == "DDI" || args[0] == "Prefix") {
						if (!body.includes('[')) {
							await kill.reply(chatId, mess.Array_Needed(args), id);
							return await kill.reply(chatId, `${prefix}Exec config["${args[0]}"].push("Valor");fs.writeFileSync('./lib/config/Settings/config.json', JSON.stringify(config, null, "\\t"))`, id);
						}
						newValue = JSON.parse(body.slice(body.indexOf("["), body.indexOf("]")+1));
					} else if (args[1] == "true") {
						newValue = true;
					} else if (args[1] == "false") {
						newValue = false;
					} else if (!isNaN(args[1])) {
						newValue = Number(args[1]);
					} else if (typeof args[1] == 'string') {
						newValue = String(args[1]);
					} else if (args[1] !== null) {
						newValue = args[1];
					}
					if (config[args[0]] == newValue) return await kill.reply(chatId, mess.hasSameValue(), id);
					if (args[0] == "Owner") {
						newValue = newValue.map(p => !p.includes("@c.us") ? p+"@c.us" : p);
					}
					const newObj = {
						"key": args[0],
						"value": newValue,
						"old": config[args[0]],
						"idButton": "Nothing"
					};
					if (!sesConfig.Multi_Devices) {
						newObj.idButton = await kill.sendButtons(chatId, mess.buttonStop("Cancelar"), [
							{
								"id": "1",
								"text": "✔️ Sim ✔️"
							},
							{
								"id": "2",
								"text": "✖️ Não ✖️"
							}
						], mess.isThisKeyRight(newObj), mess.youHaveTSec());
					} else await kill.sendText(chatId, mess.isThisKeyRight(newObj));
					const ValueBID = newObj.idButton;
					var selectB = msgw => tools('others').filterMsg(msgw, user, chatId, ValueBID, /sim|yes|no|nao/gi);
					kill.awaitMessages(chatId, selectB, {
						max: 1,
						time: 30000,
						errors: ['time']
					}).then(async collected => {
						if (/sim|yes/gi.test(removeAccents(Array.from(collected)[0][1].body))) {
							config[newObj.key] = newObj.value;
							fs.writeFileSync('./lib/config/Settings/config.json', JSON.stringify(config, null, "\t"));
							await kill.reply(chatId, mess.newValKeys(newObj), id);
						} else if (/no|nao/gi.test(removeAccents(Array.from(collected)[0][1].body))) {
							await kill.reply(chatId, mess.youCanceled(), id);
						}
					}).catch(async collected => await kill.sendText(chatId, mess.Time_Ended()));
				break;

				case 'letra':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'name of song/nome da música/nombre de música.', id);
					try {
						const liric = await axios.get(`https://some-random-api.ml/lyrics?title=${encodeURIComponent(Sliced_Body)}`);
						await kill.sendFileFromUrl(chatId, liric.data.thumbnail.genius, '', `*🎸*\n\n${liric.data.title}\n\n*🎵*\n\n${liric.data.lyrics}`, id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.noresult() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				case 'reedit':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'subreddit name/nombre/nome.', id);
					try {
						const reed = await axios.get(`https://meme-api.herokuapp.com/gimme/${encodeURIComponent(Sliced_Body)}`);
						if (reed.data.nsfw && isGroupMsg && !isActivated('nsfw')) return await kill.reply(chatId, mess.gpadulto(), id);
						await kill.sendFileFromUrl(chatId, reed.data.url, '', reed.data.title, id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.noresult() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
					}
				break;

				/*Obrigado pela base Jon*/
				case 'wallhaven':
				case 'wallpaper':
					if (Default_APIS.API_WallHaven !== APIS.API_WallHaven) {
						if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'wallpaper name/nome/nombre.', id);
						try {
							const wpphe = await axios.get(`https://wallhaven.cc/api/v1/search?apikey=${APIS.API_WallHaven}&q=${encodeURIComponent(Sliced_Body)}`);
							await kill.sendFileFromUrl(chatId, tools('others').randVal(wpphe.data.data.map(w => w.path)), 'WallHaven.jpg', '<3', id);
						} catch (error) {
							tools('others').reportConsole(cmd, error);
							await kill.reply(chatId, mess.noresult() + '\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n' + mess.fail(cmd, error, time), id);
						}
					} else return await kill.reply(chatId, mess.Command_Unusable(), id);
				break;

				case 'decode':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'binary code/código binario.', id);
					const Decoded_Text = Sliced_Body.split(" ").map(x => String.fromCharCode(parseInt(x, 2)));
					await kill.reply(chatId, `${Sliced_Body}\n\n*→*\n\n${Decoded_Text.join("")}`, id);
				break;

				case 'encode':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.', id);
					const Encoded_Text = Sliced_Body.split('').map(str => str.charCodeAt(0).toString(2));
					await kill.reply(chatId, `${Sliced_Body}\n\n*→*\n\n${Encoded_Text.join(' ')}`, id);
				break;

				case 'covid':
					if (args.lenght == 0) return await kill.reply(chatId, mess.coviderr(), id);
					const covidnb = await axios.get(`https://coronavirus-19-api.herokuapp.com/countries/${encodeURIComponent(Sliced_Body)}`);
					if (covidnb.data == 'Country not found') return await kill.reply(chatId, mess.coviderr(), id);
					await kill.reply(chatId, mess.covidata(covidnb), id);
				break;

				case 'paises':
					await kill.reply(chatId, mess.covid(), id);
				break;

				case 'reverter':
				case 'rev':
					let fodVey = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.invert(fodVey[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `rev.png`, 'Ah não, sou daltônica!', id));
				break;

				case 'encurtar':
				case 'tinyurl':
					if (args.length == 0) return await kill.reply(chatId, mess.nolink(), id);
					const tinurl = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(args[0])}`);
					if (tinurl.data == 'Error') return await kill.reply(chatId, mess.cmdfailed(), id);
					await kill.reply(chatId, `${args[0]} → ${tinurl.data}`, id);
				break;

				case 'signo':
				case 'horoscopo':
					let signoSe = ["aries", "touro", "gemeos", "cancer", "leao", "virgem", "libra", "escorpiao", "sagitario", "capricornio", "aquario", "peixes"];
					if (!signoSe.includes(argl[0])) return await kill.reply(chatId, `❌ → ${args[0]} ← ❌!\n\n✔️ → ${signoSe.join(' --- ')}.`, id);
					let FMnews = shell.exec(`bash lib/functions/config.sh signo ${argl[0]}`, {
						silent: true
					});
					if (FMnews.stdout == '') {
						await kill.reply(chatId, mess.fail(cmd, FMnews.stderr, time), id);
						console.log(FMnews.stderr);
					} else await kill.reply(chatId, FMnews.stdout, id);
				break;

				case 'book':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'book name/nome do livro/nombre del libro.', id);
					const takeBook = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(Sliced_Body)}&langRestrict=${region}`);
					const getBook = await axios.get(`${takeBook.data.items[0].selfLink}`);
					await kill.sendFileFromUrl(chatId, `${getBook.data.volumeInfo.imageLinks.thumbnail}`, 'book.jpg', mess.book(getBook), id);
				break;

				/*As piadas VEM DE SERVIDOR e NÃO CONTROLAMOS elas.*/
				case 'piada':
					const piada = await axios.get('https://some-random-api.ml/joke');
					if (region == 'en' || arks.includes('-orig')) return await kill.reply(chatId, piada.data.joke, id);
					const Jokerb = (await translate(piada.data.joke, {
						to: region
					})).text;
					await kill.reply(chatId, Jokerb, id);
				break;

				case 'alarme':
					if (args.length == 0 || isNaN(args[0]) || !arks.includes('|')) return await kill.reply(chatId, mess.timealarm() + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
					await kill.reply(chatId, mess.alarmact(args), id);
					const AlarmOptions = [arg.split('|')[0], arg.split('|')[0]];
					setTimeout(() => kill.reply(chatId, `⏰ - ${AlarmOptions[1]}!`, id), Number(AlarmOptions[0]) * 60000);
				break;

				case 'hitler':
					let heilHitler = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.hitler(heilHitler[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `hitler.png`, '卍', id));
				break;

				case 'trash':
					let school = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.trash(school[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `trash.png`, '🚮', id));
				break;

				case 'shit':
					let bokupico = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.shit(bokupico[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `shit.png`, '💩💩💩', id));
				break;

				case 'blur':
					let lifeistrange = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.blur(lifeistrange[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `blur.png`, '💡', id));
				break;

				case 'rip':
					let narutof = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.rip(narutof[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `rip.png`, '☠️', id));
				break;

				case 'github':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Github Username.', id);
					const gitData = await axios.get(`https://api.github.com/users/${args[0]}`);
					const siteAdmin = gitData.data.site_admin == true ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const companY = (gitData.data.company == null) ? tools('others').noAwnsers() : gitData.data.company;
					const bloG = (gitData.data.blog == "") ? tools('others').noAwnsers() : gitData.data.blog;
					const emaiL = (gitData.data.email == null) ? tools('others').noAwnsers() : gitData.data.email;
					const tramPar = (gitData.data.hireable == null) ? tools('others').noAwnsers() : gitData.data.hireable;
					if (gitData.data.message == 'Not Found') return await kill.reply(chatId, mess.noresult(), id);
					await kill.sendFileFromUrl(chatId, `${gitData.data.avatar_url}`, 'avatar.png', mess.github(siteAdmin, companY, bloG, emaiL, tramPar, gitData), id);
				break;

				case 'roubar':
					if (isType('sticker')) {
						let infoStk = {};
						if (Object.keys(custom).includes(user) && !arks.includes('|')) {
							if (custom[user].pack !== false && custom[user].author !== false) {
								infoStk.pack = custom[user].pack;
								infoStk.author = custom[user].author;
							} else return await kill.reply(chatId, mess.argsbar() + 'use 1 "|".\n\nLeia "${prefix}MyMsg -help".', id);
						} else if (arks.includes('|')) {
							infoStk.pack = arg.split('|')[0];
							infoStk.author = arg.split('|')[1];
						} else return await kill.reply(chatId, mess.argsbar() + 'use 1 "|".\n\nLeia "${prefix}MyMsg -help".', id);
						const mediaData = await decryptMedia(encryptMedia);
						await kill.sendImageAsSticker(chatId, tools('others').dataURI(quotedMsgObj.mimetype, mediaData), infoStk).catch(async () => {
							await kill.reply(chatId, mess.gifail(), id);
						});
					} else await kill.reply(chatId, mess.onlyst() + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
				break;

				/*Não deixe seus usuários floodarem, caso contrario a bot pode desligar*/
				case 'sound':
				case 'bass':
					if (isType('audio') || isType('ptt') || isType('video')) {
						var formatBass = (isType('video')) ? 'mp4' : 'mp3';
						const mediaData = await decryptMedia(encryptMedia);
						await tools('ffmpeg').bass(mediaData, argl[0], argl[1], argl[2], argl[3], kill, message, formatBass);
					} else await kill.reply(chatId, mess.onlyaudio(), id);
				break;

				/*Não deixe seus usuários floodarem, caso contrario a bot pode desligar*/
				case 'nightcore':
					if (isType('audio') || isType('ptt') || isType('video')) {
						var formatNight = (isType('video')) ? 'mp4' : 'mp3';
						const mediaData = await decryptMedia(encryptMedia);
						await tools('ffmpeg').nightcore(mediaData, argl[0], kill, message, formatNight);
					} else await kill.reply(chatId, mess.onlyaudio(), id);
				break;

				/*Não deixe seus usuários floodarem, caso contrario a bot pode desligar*/
				case 'audio':
					if (isType('video')) {
						const mediaData = await decryptMedia(encryptMedia);
						await tools('ffmpeg').audio(mediaData, kill, message, encryptMedia.mimetype);
					} else await kill.reply(chatId, mess.onlyvideo(), id);
				break;

				case 'bew':
				case 'peb':
				case 'alpha':
				case 'gray':
					if (isType('video')) {
						const decryptGray = await decryptMedia(encryptMedia);
						await tools('ffmpeg').gray(decryptGray, kill, message);
					} else await kill.reply(chatId, mess.onlyvideo(), id);
				break;

				case 'mutevideo':
				case 'mutev':
					if (isType('video')) {
						const decryptMutev = await decryptMedia(encryptMedia);
						await tools('ffmpeg').mute(decryptMutev, kill, message);
					} else await kill.reply(chatId, mess.onlyvideo(), id);
				break;

				case 'vblur':
					if (isType('video')) {
						if (isNaN(Number(args[0])) && args.length != 0 || Number(args[0]) > 10 && args.length != 0) return await kill.reply(chatId, mess.VBlur_Usage(), id);
						const radius = args.length == 0 ? 20 : parseInt(Number(args[0]));
						const decryptVblur = await decryptMedia(encryptMedia);
						await tools('ffmpeg').blur(decryptVblur, kill, message, radius);
					} else await kill.reply(chatId, mess.onlyvideo(), id);
				break;

				/*Não, não possuo interesse em criar um painel que puxe dados pessoais de pessoas, pare de fod** gente inocente.*/
				case 'cpf':
					if (region !== 'pt') return await kill.reply(chatId, 'Brazil only/Brasil solamente!', id);
					if (args.length == 0) return await kill.reply(chatId, 'Insira um CPF', id);
					await tools('buscas').cpf(args[0], kill, message);
				break;

				case 'policia':
					await kill.reply(chatId, mess.policemenu(), id);
				break;

				case '01':
					if (mentionedJidList.length == 0 && !quotedMsgObj) return await kill.reply(chatId, mess.howtololi(), id);
					const addedLolicon = quotedMsgObj ? quotedMsgObj.sender.pushname : (mentionedJidList.length > 0 ? mentioned_name : pushname);
					if (tools('others').randVal(['Inocente', 'Culpado']) == 'Culpado') {
						fs.appendFileSync('./lib/config/Utilidades/lolicon.txt', `\n\n${addedLolicon} - ${lvpc} Years/Anos 🔒`);
					} else fs.appendFileSync('./lib/config/Utilidades/lolicon.txt', `\n\n${addedLolicon} - Innocent/inocente 🔓`);
					await kill.reply(chatId, mess.fbi(), id);
				break;

				case '02':
					if (tools('others').randVal(['Inocente', 'Culpado']) == 'Inocente') {
						fs.appendFileSync('./lib/config/Utilidades/entregados.txt', `\n\n${pushname} - Innocent/inocente 🔓`);
					} else fs.appendFileSync('./lib/config/Utilidades/entregados.txt', `\n\n${pushname} - ${lvpc} Years/Anos 🔒`);
					await kill.reply(chatId, mess.arrested(), id);
				break;

				case '03':
					if (mentionedJidList.length == 0 && !quotedMsgObj) return await kill.reply(chatId, mess.howtoshota(), id);
					var takeChild = quotedMsgObj ? quotedMsgObj.sender.pushname : (mentionedJidList.length > 0 ? mentioned_name : pushname);
					if (tools('others').randVal(['Inocente', 'Culpado']) == 'Culpado') {
						fs.appendFileSync('./lib/config/Utilidades/reversecon.txt', `\n\n${takeChild} - ${lvpc} Years/Anos 🔒`);
					} else fs.appendFileSync('./lib/config/Utilidades/reversecon.txt', `\n\n${takeChild} - Innocent/inocente 🔓`);
					await kill.reply(chatId, mess.cia(), id);
				break;

				case '04':
					if (mentionedJidList.length == 0 && !quotedMsgObj) return await kill.reply(chatId, mess.howtocrime(), id);
					var crimeNet = quotedMsgObj ? quotedMsgObj.sender.pushname : (mentionedJidList.length > 0 ? mentioned_name : pushname);
					if (tools('others').randVal(['Inocente', 'Culpado']) == 'Culpado') {
						fs.appendFileSync('./lib/config/Utilidades/crimereport.txt', `\n\n${crimeNet} (${arg.split('|')[1] || '🤢'}) - ${lvpc} Years/Anos 🔒`);
					} else fs.appendFileSync('./lib/config/Utilidades/crimereport.txt', `\n\n${crimeNet} (${arg.split('|')[1] || '🤢'}) - Innocent/inocente 🔓`);
					await kill.reply(chatId, mess.stars(), id);
				break;

				case '05':
					if (mentionedJidList.length == 0 && !quotedMsgObj) return await kill.reply(chatId, mess.howtolgbts(), id);
					var genderFuck = quotedMsgObj ? quotedMsgObj.sender.pushname : (mentionedJidList.length > 0 ? mentioned_name : pushname);
					if (tools('others').randVal(['Inocente', 'Culpado']) == 'Culpado') {
						fs.appendFileSync('./lib/config/Utilidades/gaysreport.txt', `\n\n${genderFuck} [${tools('others').getRandLine(1, './lib/config/Utilidades/lgbt.txt')[0]}] - ${lvpc} Years/Anos 🔒`);
					} else fs.appendFileSync('./lib/config/Utilidades/gaysreport.txt', `\n\n${genderFuck} [${tools('others').getRandLine(1, './lib/config/Utilidades/lgbt.txt')[0]}] - Innocent/inocente 🔓`);
					await kill.reply(chatId, mess.bsaa(), id);
				break;

				case 'fbi':
					const loliconList = fs.readFileSync('./lib/config/Utilidades/lolicon.txt').toString();
					await kill.reply(chatId, loliconList, id);
				break;

				case 'rpd':
					const peopleCrz = fs.readFileSync('./lib/config/Utilidades/entregados.txt').toString();
					await kill.reply(chatId, peopleCrz, id);
				break;

				case 'cia':
					const reversePedo = fs.readFileSync('./lib/config/Utilidades/reversecon.txt').toString();
					await kill.reply(chatId, reversePedo, id);
				break;

				case 'bsaa':
					const gaysArrest = fs.readFileSync('./lib/config/Utilidades/gaysreport.txt').toString();
					await kill.reply(chatId, gaysArrest, id);
				break;

				case 'stars':
					const aLotCrime = fs.readFileSync('./lib/config/Utilidades/crimereport.txt').toString();
					await kill.reply(chatId, aLotCrime, id);
				break;

				/*Adicione mais no arquivo "desafio.txt" e "verdade.txt", mas em inglês.*/
				case 'tord':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					if (args.length == 0) return await kill.reply(chatId, mess.tordare(), id);
					if (argl[0] == '-dare') {
						const getDare = tools('others').randVal(fs.readFileSync('./lib/config/Utilidades/desafio.txt').toString().split('\n'));
						if (region == 'en' || arks.includes('-orig')) return await kill.reply(chatId, getDare, id);
						const DareAie = (await translate(getDare, {
							to: region
						})).text;
						await kill.reply(chatId, DareAie, id);
					} else if (argl[0] == '-truth') {
						const getTruth = tools('others').randVal(fs.readFileSync('./lib/config/Utilidades/verdade.txt').toString().split('\n'));
						if (region == 'en' || arks.includes('-orig')) return await kill.reply(chatId, getTruth, id);
						const Tordaire = (await translate(getTruth, {
							to: region
						})).text;
						await kill.reply(chatId, Tordaire, id);
					} else if (argl[0] == '-r') {
						await kill.reply(chatId, 'OK! Vamos outra!\nVerdade ou Desafio? (-truth or -dare)?', id);
					} else await kill.reply(chatId, mess.tordare(), id);
				break;

				/*Adicione mais no arquivo "never.txt", mas em inglês.*/
				case 'nunca':
					if (region == 'en' || arks.includes('-orig')) return await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/never.txt')[0], id);
					const NuncaTras = (await translate(tools('others').getRandLine(1, './lib/config/Utilidades/never.txt')[0], {
						to: region
					})).text;
					await kill.reply(chatId, NuncaTras, id);
				break;

				/*Adicione mais no arquivo "cantadas.txt", mas em inglês.*/
				case 'cantada':
					if (region == 'en' || arks.includes('-orig')) return await kill.reply(chatId, tools('others').getRandLine(1, './lib/config/Utilidades/cantadas.txt')[0], id);
					const cantdat = (await translate(tools('others').getRandLine(1, './lib/config/Utilidades/cantadas.txt')[0], {
						to: region
					})).text;
					await kill.reply(chatId, cantdat, id);
				break;

				case 'sort':
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(chatId, mess.noargs() + 'palavras/words/números/numbers.' + '\n\n' + mess.argsbar(), id);
					await kill.reply(chatId, tools('others').randVal(arg.split('|')), id);
				break;

				case 'biblia':
				case 'bible':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'chapter name [ex: john 7:13]', id);
					let requestBible = region == 'pt' ? 'almeida' : (region == 'en' ? 'kjv' : 'almeida');
					const Bible_Line = await axios.get(`https://bible-api.com/${encodeURIComponent(Sliced_Body)}?translation=${requestBible}`);
					if (Object.keys(Bible_Line.data).includes('error')) return await kill.reply(chatId, mess.noresult(), id);
					if (region !== 'es' || arks.includes('-orig')) return await kill.reply(chatId, `📖 → ${Bible_Line.data.reference}\n\n⛪ → ${Bible_Line.data.text}`, id);
					const bibleDy = (await translate(`📖 → ${Bible_Line.data.reference}\n\n⛪ → ${Bible_Line.data.text}`, {
						to: region
					})).text;
					await kill.reply(chatId, bibleDy, id);
				break;

				case 'steal':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (mentionedJidList.length == 0 && !quotedMsgObj) return await kill.reply(chatId, mess.semmarcar(), id);
					if (tools('gaming').getLimit(user, chatId, false, 'steal')) return await kill.reply(chatId, mess.steal(), id);
					var theStealK = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : user);
					if (theStealK == user) return await kill.reply(chatId, mess.cmdfailed(), id);
					if (!Object.keys(nivel[chatId]).includes(theStealK)) return await kill.sendTextWithMentions(chatId, mess.notalvo(theStealK));
					const checkStealer = tools('gaming').getValue(user, chatId, null);
					const checkVictim = tools('gaming').getValue(theStealK, chatId, null);
					const arrTypesU = ['xp', 'coin', 'rubi', 'dima'];
					var typeSteal = tools('others').randVal(arrTypesU);
					const checkIfHave = (typeSteal) => {
						if (Number(config.Max_Steal) > Number(checkVictim[typeSteal])) {
							if (arrTypesU.length == 0) return false;
							typeSteal = tools('others').randVal(arrTypesU.filter(k => k !== typeSteal));
							arrTypesU.splice(typeSteal, 1);
							checkIfHave(typeSteal);
						} else return typeSteal;
					};
					if (!checkIfHave(typeSteal)) return await kill.sendTextWithMentions(chatId, mess.notalvo(theStealK));
					let stealedValue = parseInt((Number(checkVictim[typeSteal]) / Number(config.Steal_Reduce_Limit)));
					if (stealedValue <= 10 && Number(Number(checkVictim[typeSteal])) > 10) stealedValue = stealedValue + Number(config.Min_Steal);
					var maxSteali = tools('others').randomNumber(Number(config.Min_Steal), stealedValue);
					if (maxSteali > Number(config.Max_Steal)) maxSteali = tools('others').randomNumber(parseInt(maxSteali/Number(config.Steal_Reduce_Limit)), Number(config.Max_Steal));
					if (Number(checkVictim[typeSteal]) > maxSteali || maxSteali > Number(config.Max_Steal)) maxSteali = tools('others').randomNumber(Number(config.Min_Steal), Number(config.Max_Steal)) + Number(config.Iris_Coin);
					if (lvpc > 70) {
						if (checkStealer.guild.toUpperCase() == 'THIEVES') maxSteali = parseInt((tools('others').randomNumber(maxSteali, Number(config.Max_Steal)))); // Thieves ganham mais no roubo
						if (Number(checkVictim[typeSteal]) > maxSteali || maxSteali > Number(config.Max_Steal)) maxSteali = tools('others').randomNumber(Number(config.Min_Steal), Number(config.Max_Steal)) + Number(config.Iris_Coin);
						if (maxSteali > Number(checkVictim[typeSteal]) || Number(checkVictim[typeSteal]) == 0) {
							typeSteal = 'xp';
							maxSteali = Number(checkVictim[typeSteal]);
						}
						maxSteali = tools('others').Bonus_Value(maxSteali, user, chatId, 'win');
						await kill.sendTextWithMentions(chatId, mess.stealwkd(theStealK, maxSteali, typeSteal.toUpperCase()));
						tools('gaming').addValue(user, Number(maxSteali), chatId, typeSteal);
						tools('gaming').addValue(theStealK, Number(-maxSteali), chatId, typeSteal);
					} else {
						if (maxSteali > Number(checkStealer[typeSteal]) || Number(checkStealer[typeSteal]) == 0) {
							typeSteal = 'xp';
							maxSteali = Number(checkStealer[typeSteal]);
						}
						maxSteali = tools('others').Bonus_Value(maxSteali, user, chatId, 'lose');
						await kill.sendTextWithMentions(chatId, mess.stealfail(theStealK, maxSteali, typeSteal.toUpperCase()));
						tools('gaming').addValue(user, Number(-maxSteali), chatId, typeSteal);
						tools('gaming').addValue(theStealK, Number(maxSteali), chatId, typeSteal);
					}
					if (objconfig.noLimits == 0) return tools('gaming').addLimit(user, chatId, 'steal');
				break;

				case 'doar':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (objconfig.agiotas.includes(user)) return await kill.reply(chatId, mess.Agiotado(), id);
					if (args.length <= 2 || argl[0] == 'coin' || argl[0] == 'xp' || argl[0] == 'dima' || argl[0] == 'rubi') {
						const checkValue = tools('gaming').getValue(user, chatId, argl[0]);
						var sortFd = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : null);
						if (sortFd == null) return await kill.reply(chatId, mess.cmdfailed(), id);
						var theAbsVal = quotedMsgObj ? args[1] : (mentionedJidList.length !== 0 ? args[2] : args[2]);
						if (isNaN(theAbsVal) || !tools('others').isInt(theAbsVal) || Number(theAbsVal) > checkValue || theAbsVal < 1) return await kill.reply(chatId, mess.noxpalv(checkValue, argl[0]), id);
						tools('gaming').addValue(user, Number(-theAbsVal), chatId, argl[0]);
						tools('gaming').addValue(sortFd, Number(theAbsVal), chatId, argl[0]);
						await kill.sendTextWithMentions(chatId, mess.Donated_OK(theAbsVal, argc, sortFd));
					} else await kill.reply(chatId, mess.semmarcar() + `\n\nEx: ${prefix}doar <tipo> @user <value/valor> `, id);
				break;

				case 'bang':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					const kabangg = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : randomMember);
					await kill.sendMp4AsSticker(chatId, 'https://c.tenor.com/ubAsIAV_ikoAAAPo/anime-girl.mp4', null, stickMp4Config);
					await kill.sendTextWithMentions(chatId, mess.lolibang(user, kabangg, tools('others').getRandLine(1, './lib/config/Utilidades/armas.txt')[0]));
				break;

				case 'trends':
					var aFplaceOnEarth = args.length !== 0 ? args[0] : region == 'pt' ? 'brazil' : region == 'en' ? 'united-states' : 'spain';
					const trends = await trendings.info(aFplaceOnEarth);
					await kill.reply(chatId, mess.trendings(trends), id);
				break;

				/*Obrigado pela base Pedro Batistop*/
				case 'market':
					if (args.length == 0) return await kill.reply(chatId, mess.reMerchant(), id); /*Mude o MLB se desejar*/
					const getML = await axios.get(`https://api.mercadolibre.com/sites/${arg.split('|')[1] || 'MLB'}/search?q=${encodeURIComponent(arg.split('|')[1] || Sliced_Body)}&limit=1#json`);
					const isNewP = getML.data.results[0].condition == 'new' ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					const temLoja = getML.data.results[0].shipping.store_pick_up ? tools('others').yesAwnsers() : tools('others').noAwnsers();
					await kill.sendFileFromUrl(chatId, `${getML.data.results[0].thumbnail}`, 'produto.jpg', mess.theStore(getML, isNewP, temLoja), id);
				break;

				/*Sem XP, por que precisamos de jogos livres também*/
				case 'jokenpo':
					const bigThree = tools('others').randomNumber(1, 3);
					const jokenPedra = ['pedra', '✊', '✊🏻', '✊🏼', '✊🏽', '✊🏾', 'rock', 'piedra', '🪨'];
					const jokenLesb = ['tesoura', '✌️', '✌🏻', '✌🏼', '✌🏽', '✌🏾', '✌🏿', 'scissors', 'tijera', '✂️'];
					const jokenPaper = ['papel', '✋', '✋🏻', '✋🏼', '✋🏽', '✋🏾', '✋🏿', 'paper', '🤚', '🤚🏻', '🤚🏼', '🤚🏽', '🤚🏾', '🤚🏿'];
					if (!jokenPedra.includes(args[0]) && !jokenPaper.includes(args[0]) && !jokenLesb.includes(args[0])) return await kill.reply(chatId, mess.noargs() + 'pedra [✊🏻], papel [✋🏿] ou tesoura [✌️]', id);
					const needPlay = jokenPedra.includes(args[0]) ? 1 : jokenPaper.includes(args[0]) ? 2 : jokenLesb.includes(args[0]) ? 3 : false;
					const theMove = bigThree == 1 ? '✊🏻 - Pedra/Rock/Piedra' : bigThree == 2 ? '✋🏿 - Papel/Paper' : bigThree == 3 ? '✌️ - Tesoura/Tijera/Scissors' : 'Algo';
					if (needPlay == bigThree) {
						await kill.reply(chatId, mess.nowinjoken(theMove), id);
					} else if (needPlay == 2 && bigThree == 1 || needPlay == 3 && bigThree == 2 || needPlay == 1 && bigThree == 3) {
						await kill.reply(chatId, mess.winjoken(theMove, args), id);
					} else await kill.reply(chatId, mess.losejoken(theMove, args), id);
				break;

				case 'views':
					if (!quotedMsgObj) return await kill.reply(chatId, mess.nomark(), id);
					if (!quotedMsgObj.fromMe) return await kill.reply(chatId, mess.mymess(), id);
					const whoInpo = await kill.getMessageReaders(quotedMsgObj.id);
					if (whoInpo[0] == null) return kill.reply(chatId, mess.noviews(), id);
					await kill.reply(chatId, whoInpo.map(i => '👀 - Views - 👀\n'+`\n- ${i.pushname || '??? - Top secret name - ???'} - (wa.me/${i.id.replace('@c.us', '')})\n`).join(''), id).catch(async err => await kill.reply(chatId, `Verifique se você desativou a leitura caso use WhatsApp's modificados.\n\n`+mess.fail(cmd, err, time), id));
				break;

				case 'ctt':
					if (args.length == 0 || !arks.includes('|')) return await kill.reply(chatId, mess.noargs(), id);
					await kill.sendVCard(chatId, `BEGIN:VCARD\nVERSION:3.0\nFN;CHARSET=UTF-8:${arg.split('|')[1]}\nTEL;TYPE=CELL,VOICE:${arg.split('|')[0]}\nEND:VCARD`);
				break;

				case 'gerar2':
					let genpeo = shell.exec(`bash lib/functions/config.sh dados`, {
						silent: true
					});
					if (genpeo.stdout == '') {
						await kill.reply(chatId, mess.fail(cmd, genpeo.stderr, time), id);
						console.log(genpeo.stderr);
					} else await kill.sendFileFromUrl(chatId, 'https://thispersondoesnotexist.com/image', 'image.jpg', genpeo.stdout, id);
				break;

				case 'gerador':
					let fourDevs = (await _4devs.gerar(1, true, 'pessoa')).dados[0];
					let cardList = {
						'cvv': tools('others').randomArr(tools('others').newArray(100, 999, 0, 7)),
						'mouths': tools('others').randomArr(tools('others').newArray(1, 12, 0, 7)),
						'years': tools('others').randomArr(tools('others').newArray(Number(moment().add(1, 'years').format('YY')), Number(moment().add(8, 'years').format('YY')), 0, 7))
					};
					await kill.sendFileFromUrl(chatId, 'https://thispersondoesnotexist.com/image', 'image.jpg', `Nome -> ${fourDevs.nome}\n\nIdade -> ${fourDevs.idade}\n\nCPF -> ${fourDevs.cpf}\n\nRG -> ${fourDevs.rg}\n\nData de nascimento -> ${fourDevs.data_nasc}\n\nSexo -> ${fourDevs.sexo}\n\nSigno -> ${fourDevs.signo}\n\nMãe -> ${fourDevs.mae}\n\nPai -> ${fourDevs.pai}\n\nEmail -> ${fourDevs.email}\n\nSenha -> ${fourDevs.senha}\n\nCEP -> ${fourDevs.cep}\n\nEndereço -> ${fourDevs.endereco}\n\nNúmero -> ${fourDevs.numero}\n\nBairro -> ${fourDevs.bairro}\n\nCidade -> ${fourDevs.cidade}\n\nEstado -> ${fourDevs.estado}\n\nTelefone fixo -> ${fourDevs.telefone_fixo}\n\nCelular -> ${fourDevs.celular}\n\nAltura -> ${fourDevs.altura}\n\nSangue -> ${fourDevs.tipo_sanguineo}\n\nCor favorita -> ${fourDevs.cor}\n\nCartão de Crédito VISA ->\nCódigo -> "${creditCard.GenCC("Visa")}"\nValidade -> "${cardList.mouths[0]}/${cardList.years[0]}"\nCVV -> "#${cardList.cvv[0]}"\n\nCartão de Crédito MASTERCARD ->\nCódigo -> "${creditCard.GenCC()}"\nValidade -> "${cardList.mouths[1]}/${cardList.years[1]}"\nCVV -> "${cardList.cvv[1]}"\n\nCartão de Crédito AMEX ->\nCódigo -> "${creditCard.GenCC("Amex")}"\nValidade -> "${cardList.mouths[2]}/${cardList.years[2]}"\nCVV -> "${cardList.cvv[2]}"\n\nCartão de Crédito Discover ->\nCódigo -> "${creditCard.GenCC("Discover")}"\nValidade -> "${cardList.mouths[3]}/${cardList.years[3]}"\nCVV -> "${cardList.cvv[3]}"\n\nCartão de Crédito ENROUTE ->\nCódigo -> "${creditCard.GenCC("EnRoute")}"\nValidade -> "${cardList.mouths[4]}/${cardList.years[4]}"\nCVV -> "${cardList.cvv[4]}"\n\nCartão de Crédito JCB ->\nCódigo -> "${creditCard.GenCC("JCB")}"\nValidade -> "${cardList.mouths[5]}/${cardList.years[5]}"\nCVV -> "${cardList.cvv[5]}"\n\nCartão de Crédito VOYAGER ->\nCódigo -> "${creditCard.GenCC("Voyager")}"\nValidade -> "${cardList.mouths[6]}/${cardList.years[6]}"\nCVV -> "${cardList.cvv[6]}"`, id);
				break;

				case 'movie':
					if (Default_APIS !== APIS.API_TheMovieDB) {
						if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'movie Name/Nome de Filme.', id);
						const movieInfo = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIS.API_TheMovieDB}&query=${encodeURIComponent(Sliced_Body)}&language=${region}`);
						if (movieInfo.data.total_results == 0) return await kill.reply(chatId, mess.noresult(), id);
						const fotoFilme = movieInfo.data.results[0].backdrop_path == null ? config.Commands_Error_Photo : `https://image.tmdb.org/t/p/original${movieInfo.data.results[0].backdrop_path}`;
						await kill.sendFileFromUrl(chatId, fotoFilme, 'filme.jpg', mess.movies(region, movieInfo), id);
					} else return await kill.reply(chatId, mess.Command_Unusable(), id);
				break;

				case 'news':
					if (Default_APIS.API_NewsAPI !== APIS.API_NewsAPI) {
						if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Theme/Tema.', id);
						const theNews = await axios.get(`https://newsapi.org/v2/everything?q=${args[0]}&sortBy=publishedAt&language=${region}&apiKey=${APIS.API_NewsAPI}`);
						let newsSends = theNews.data.articles.map(d => `${d.publishedAt.split('T').join(' - ').split('Z')[0]}\n\n${d.title} - ${d.author} [${d.source.name}]\n\n${d.description}\n\n${d.url}\n\n${d.content}\n\n--------- * ---------\n\n`).join('');
						await kill.reply(chatId, newsSends, id);
					} else return await kill.reply(chatId, mess.Command_Unusable(), id);
				break;

				case 'tweet':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Twitter @.', id);
					const twitterMsg = await axios.get(`https://decapi.me/twitter/latest/${args[0]}`).catch(async (e) => {
						await kill.reply(chatId, 'Nada encontrado', id);
					});
					await kill.reply(chatId, `${args[0]} → "${twitterMsg.data}".`, id);
				break;

				case 'number':
					if (args.length == 0 || isNaN(args[0]) || isNaN(args[1])) return await kill.reply(chatId, mess.noargs() + `Min-Number Max-Number.\n\nEx: ${prefix}Number 1 10`, id);
					await kill.reply(chatId, `☘ - ${tools('others').randomNumber(args[0], args[1])} - ☘`, id);
				break;

				case 'deezer':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'name of song/nome da música/nombre de música.', id);
					try {
						const musicFind = (await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(Sliced_Body)}`)).data;
						if (musicFind.total == 0) return await kill.reply(chatId, mess.noresult(), id);
						await kill.sendFileFromUrl(chatId, musicFind.data[0].album.cover, 'cover.jpg', mess.musicdzr(musicFind.data[0]), id);
						await kill.sendAudio(chatId, musicFind.data[0].preview, id);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time) + '\n\n' + `Use ${prefix}Play.`, id);
					}
				break;

				case 'dark':
					let onDark = shell.exec(`bash lib/functions/config.sh onion ${encodeURIComponent(Sliced_Body)}`, {
						silent: true
					});
					if (onDark.stdout == '') {
						await kill.reply(chatId, mess.fail(cmd, onDark.stderr, time), id);
						console.log(onDark.stderr);
					} else await kill.reply(chatId, onDark.stdout, id);
				break;

				case 'drink':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Bebida/Drink.', id);
					const myDrink = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(Sliced_Body.replace('-orig', ''))}`);
					if (myDrink.data.drinks == null) return await kill.reply(chatId, mess.noresult(), id);
					let drinkDb = Object.fromEntries(Object.entries(myDrink.data.drinks[0]).filter(([key,val]) => val !== '' && val !== ' ' && val !== null));
					let ILength = Object.keys(drinkDb).filter(c => c.includes('Ingredient'));
					let moreInfo = '';
					for (let ing = 0; ing < ILength.length; ing++) {
						moreInfo += `Ingrediente ${Number(ing)+1} -> ${drinkDb[ILength[ing]] || 'Nenhum ingrediente'} [ ${drinkDb[Object.keys(drinkDb).filter(c => c.includes('Measure'))[ing]] || 'Sem proporção'}]\n\n`;
					}
					if (region == 'en' || arks.includes('-orig')) {
						moreInfo += drinkDb.strInstructions;
					} else {
						moreInfo += (await translate(drinkDb[Object.keys(drinkDb).filter(c => c.includes('Instructions'))[0]], {
							to: region
						})).text;
					}
					await kill.sendFileFromUrl(chatId, drinkDb.strDrinkThumb, 'drink.jpg', mess.drinkcmd(drinkDb, moreInfo), id);
				break;

				case 'meal':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Food/Comida.', id);
					const sanjiOP = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(Sliced_Body.replace('-orig', ''))}`);
					if (sanjiOP.data.meals == null) return await kill.reply(chatId, mess.noresult(), id);
					let mealDb = Object.fromEntries(Object.entries(sanjiOP.data.meals[0]).filter(([key,val]) => val !== '' && val !== ' ' && val !== null));
					let Melen = Object.keys(mealDb).filter(c => c.includes('Ingredient'));
					let mealInfo = '';
					for (let ing = 0; ing < Melen.length; ing++) {
						mealInfo += `Ingrediente ${Number(ing)+1} -> ${mealDb[Melen[ing]] || 'Nenhum ingrediente'} [ ${mealDb[Object.keys(mealDb).filter(c => c.includes('Measure'))[ing]] || 'Sem proporção'}]\n\n`;
					}
					if (region == 'en' || arks.includes('-orig')) {
						mealInfo += mealDb.strInstructions;
					} else {
						mealInfo += (await translate(mealDb[Object.keys(mealDb).filter(c => c.includes('Instructions'))[0]], {
							to: region
						})).text;
					}
					await kill.sendFileFromUrl(chatId, mealDb.strMealThumb, 'meal.jpg', mess.mealcmd(mealDb, mealInfo), id);
				break;
		
				case 'artist':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Banda/Artista.', id);
					const weAree = await axios.get(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${encodeURIComponent(Sliced_Body)}`);
					if (weAree.data.artists == null) return await kill.reply(chatId, mess.noresult(), id);
					let artcDb = Object.fromEntries(Object.entries(weAree.data.artists[0]).filter(([key,val]) => val !== '' && val !== ' ' && val !== null));
					let photoBand = Object.keys(artcDb).filter(c => c.includes('strArtist') && c !== 'strArtist');
					let artInfo = '';
					for (let ar = 0; ar < photoBand.length; ar++) {
						artInfo += `Arte #${Number(ar)+1} [${photoBand[ar]}] -> ${artcDb[photoBand[ar]]}\n\n`;
					}
					if (region == 'en') {
						artInfo += artcDb.strBiographyEN;
					} else if (region == 'es') {
						artInfo += artcDb.strBiographyES;
					} else artInfo += artcDb.strBiographyPT;
					await kill.sendFileFromUrl(chatId, artcDb.strArtistThumb, 'art.jpg', mess.artist_info(artcDb, artInfo), id);
				break;

				case 'mymsg':
					let helpMyM = mess.custom_infos();
					if (args.length == 0 || argl[0] == '-help') return await kill.reply(chatId, helpMyM, id);
					if (!Object.keys(custom).includes(user)) {
						custom[user] = {
							"msg": mess.custom_Message(),
							"author": false,
							"pack": false
						};
					}
					if (argl[0] == '-msg') {
						custom[user].msg = body.slice(cmd.length+6);
					} else if (argl[0] == '-sticker') {
						custom[user].author = arg.split('|')[0].replace('-sticker ', '');
						custom[user].pack = arg.split('|')[1];
					} else return await kill.reply(chatId, helpMyM, id);
					fs.writeFileSync('./lib/config/Gerais/custom.json', JSON.stringify(custom, null, "\t"));
					if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
				break;

				case 'jail':
					var theJailPictu = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.jail(theJailPictu[0], true).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `jail.png`, '', id));
				break;

				case 'beijo':
					if (mentionedJidList.length >= 1 || quotedMsgObj) {
						let kissxsis = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 2);
						await canvacord.Canvas.kiss(kissxsis[0], kissxsis[1]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `kiss.png`, '', id));
					} else await kill.reply(chatId, mess.semmarcar() + '\n2x.', id);
				break;

				case 'bed':
					if (mentionedJidList.length >= 1 || quotedMsgObj) {
						let kaguyaf = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 2);
						await canvacord.Canvas.bed(kaguyaf[0], kaguyaf[1]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `bed.png`, '', id));
					} else await kill.reply(chatId, mess.semmarcar() + '\n2x.', id);
				break;

				case 'clyde':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Message/Mensagem.', id);
					await canvacord.Canvas.clyde(Sliced_Body).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `clyde.png`, '', id));
				break;

				case 'spank':
					if (mentionedJidList.length >= 1 || quotedMsgObj) {
						let sailoree = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 2);
						await canvacord.Canvas.spank(sailoree[0], sailoree[1]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `spank.png`, '', id));
					} else await kill.reply(chatId, mess.semmarcar() + '\n2x.', id);
				break;

				case 'batslap':
					if (mentionedJidList.length >= 1 || quotedMsgObj) {
						let batLeite = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 2);
						await canvacord.Canvas.slap(batLeite[0], batLeite[1]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `spank.png`, '', id));
					} else await kill.reply(chatId, mess.semmarcar() + '\n2x.', id);
				break;

				case 'distract':
					if (mentionedJidList.length >= 1 || quotedMsgObj) {
						var theboyfriend = '';
						var theboyfriend2 = '';
						var theboyfriend3 = '';
						if (isType('image')) {
							const mediaData = await decryptMedia(encryptMedia);
							theboyfriend = await tools('cloud').upload(mediaData);
							theboyfriend2 = quotedMsgObj ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : (mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(user));
							theboyfriend3 = mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[1]) : config.Profile_Error_Photo;
						} else {
							if (mentionedJidList.length == 3) {
								theboyfriend = await kill.getProfilePicFromServer(mentionedJidList[0]);
								theboyfriend2 = await kill.getProfilePicFromServer(mentionedJidList[1]);
								theboyfriend3 = await kill.getProfilePicFromServer(mentionedJidList[2]);
							} else {
								theboyfriend = mentionedJidList.length !== 0 ? await kill.getProfilePicFromServer(mentionedJidList[0]) : await kill.getProfilePicFromServer(user);
								theboyfriend2 = quotedMsgObj ? await kill.getProfilePicFromServer(quotedMsgObj.sender.id) : config.Profile_Error_Photo;
								theboyfriend3 = await kill.getProfilePicFromServer(randomMember);
							}
							if (typeof theboyfriend == 'object' || !tools('others').isUrl(theboyfriend)) theboyfriend = config.Profile_Error_Photo;
							if (typeof theboyfriend2 == 'object' || !tools('others').isUrl(theboyfriend2)) theboyfriend2 = config.Profile_Error_Photo;
							if (typeof theboyfriend3 == 'object' || !tools('others').isUrl(theboyfriend3)) theboyfriend3 = config.Profile_Error_Photo;
						}
						await canvacord.Canvas.distracted(theboyfriend, theboyfriend2, theboyfriend3).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `distract.png`, '', id));
					} else await kill.reply(chatId, mess.semmarcar() + '\n3x.', id);
				break;

				case 'joke':
					let whysoserious = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.jokeOverHead(whysoserious[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `joke.png`, '', id));
				break;

				case 'mind':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Message/Mensagem.', id);
					await canvacord.Canvas.changemymind(Sliced_Body).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `mind.png`, '', id));
				break;

				case 'ohno':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Message/Mensagem.', id);
					await canvacord.Canvas.ohno(Sliced_Body).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `ohno.png`, '', id));
				break;

				case 'baby':
					let killthebaby = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.affect(killthebaby[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `baby.png`, '', id));
				break;

				case 'fuse':
					if (mentionedJidList.length >= 1 || quotedMsgObj) {
						let gogeta = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 2);
						await canvacord.Canvas.fuse(gogeta[0], gogeta[1]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `fuse.png`, '', id));
					} else await kill.reply(chatId, mess.semmarcar() + '\n2x.', id);
				break;

				case 'beauty':
					let linalis = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.beautiful(linalis[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `beautiful.png`, '', id));
				break;

				case 'pixel':
					let mine144p = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.pixelate(mine144p[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `pixelate.png`, '', id));
				break;

				case 'reward':
					let picapau = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.wanted(picapau[0]).then(async (buffer) => {
						await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `reward.png`, '', id);
					});
				break;

				case 'sharp':
					let fosfo = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					let sharplvl = mentionedJidList.length !== 0 ? args[1] : args.length >= 1 && !isNaN(args[0]) ? args[0] : 1;
					await canvacord.Canvas.sharpen(fosfo[0], Number(sharplvl)).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `sharp.png`, '', id));
				break;

				case 'burn':
					let makeItBun = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					let burnlvl = mentionedJidList.length !== 0 ? args[1] : args.length >= 1 && !isNaN(args[0]) ? args[0] : 1;
					await canvacord.Canvas.burn(makeItBun[0], Number(burnlvl)).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `burn.png`, '', id));
				break;

				case 'shold':
					let paganmin = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					let iStayOrGO = mentionedJidList.length !== 0 ? Number(args[1]) : args.length >= 1 && !isNaN(args[0]) ? Number(args[0]) : 100;
					await canvacord.Canvas.threshold(paganmin[0], Number(iStayOrGO)).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `threshold.png`, '', id));
				break;

				case 'opnion':
					var theLGBTopn = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await canvacord.Canvas.opinion(theLGBTopn[0], Sliced_Body.replace(mentionedJidList.map(x => `@${x.replace('@c.us', '')}`).join(' '), '')).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `opnion.png`, '', id));
				break;

				case 'surprise':
					const surpmother = fs.readFileSync('./lib/config/Utilidades/sounds.txt').toString().split('\n');
					try {
						await kill.sendFileFromUrl(chatId, `https://www.myinstants.com/media/sounds/${tools('others').randVal(surpmother)}`, 'audio.mp3', '', null, null, null, true, null, null);
					} catch (error) {
						await kill.sendPtt(chatId, 'https://www.myinstants.com/media/sounds/soviet-anthem-but-its-sung-by-a-loli-audiotrimmer.mp3');
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'casal':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					if (args.length == 0 || isNaN(args[0])) return await kill.reply(chatId, mess.casais(), id);
					var casaltop = `-----[ *❤️ TOP ${args[0]} CASAIS ❤️* ]----\n\n`;
					for (let i = 0; i < Number(args[0]); i++) {
						let csl1 = await kill.getContact(tools('others').randVal(groupMembersId));
						let csl2 = await kill.getContact(tools('others').randVal(groupMembersId));
						casaltop += `${i + 1} - (${csl1.pushname || 'wa.me/' + csl1.id.replace('@c.us', '')}) + (${csl2.pushname || 'wa.me/' + csl2.id.replace('@c.us', '')})\n\n`;
					}
					await kill.reply(chatId, casaltop, id);
				break;

				case 'top':
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					if (args.length <= 1 || !arks.includes('|') || isNaN(arg.split('|')[0])) return await kill.reply(chatId, mess.noargs() + 'Max. Users | TOP' + '\n\n' + mess.argsbar() + 'use 1 "|".', id);
					var umtoprps = `-----[ *# TOP ${arg.split('|')[0]} ${arg.split('|')[1]} #* ]----\n\n`;
					for (let i = 0; i < Number(arg.split('|')[0]); i++) {
						let top1 = await kill.getContact(tools('others').randVal(groupMembersId));
						umtoprps += `${i + 1} - (${top1.pushname || 'wa.me/' + top1.id.replace('@c.us', '')})\n\n`;
					}
					await kill.reply(chatId, umtoprps, id);
				break;

				case 'custom':
					if (args.length <= 1 || !arks.includes('|')) return await kill.reply(chatId, mess.noargs() + 'CMD | MSG | NO PREFIX? [ON/OFF] *[ADMINS]*' + '\n\n' + mess.argsbar() + 'use 2 "|".', id);
					let THE_CMD = removeAccents(arg.split('|')[0].replace(' ', '').toLowerCase());
					if (Object.keys(cmds).includes(chatId) && Object.keys(cmds[chatId]).includes(THE_CMD)) {
						if (isGroupAdmins || isModerator) {
							await kill.reply(chatId, mess.cmd_Update(THE_CMD, cmds, chatId), id);
							delete cmds[chatId][THE_CMD];
						} else return await kill.reply(chatId, mess.cmdExist(), id);
					}
					if (!Object.keys(cmds).includes(chatId)) {
						cmds[chatId] = {};
					}
					let Is_NoPrefix = false;
					if (arg.split('|').length >= 3) {
						if (isGroupAdmins || isModerator) {
							Is_NoPrefix = arg.split('|')[2].replace(' ', '').toLowerCase() == 'on' ? true : false;
						}
					}
					cmds[chatId][THE_CMD] = {
						"Admin_Set": Is_NoPrefix,
						"msg": arg.split('|')[1]
					};
					fs.writeFileSync('./lib/config/Gerais/cmds.json', JSON.stringify(cmds, null, "\t"));
					await kill.reply(chatId, mess.cmdAdded(arg), id);
				break;

				case 'run':
					if (args.length == 0) return await kill.reply(chatId, mess.onlyccmds(), id);
					if (Object.keys(cmds).includes(chatId) && Object.keys(cmds[chatId]).includes(argl[0])) {
						await kill.reply(chatId, cmds[chatId][argl[0]].msg, id);
					} else if (Object.keys(cmds.global).includes(argl[0])) {
						await kill.reply(chatId, cmds.global[argl[0]], id);
					} else await kill.reply(chatId, mess.cmdnotfound(argl[0]))	;
				break;

				case 'cmds':
					if (Object.keys(cmds).includes(chatId)) {
						await kill.reply(chatId, `Custom CMDS ↓\n\n➸ ${Object.keys(cmds[chatId]).join('\n➸ ')}`, id);
					} else await kill.reply(chatId, mess.noresult(), id);
				break;

				// Você pode jogar sozinho marcando a Íris de oponente, ela sabe jogar
				case 'tictac':
					if (args.length == 0 || argl[0] == '-help') return await kill.reply(chatId, mess.tictactoe(), id);
					const theplayer2 = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : botNumber);
					const argtt = argl;
					const resetGameNew = () => {
						tttSet[chatId] = {
							thePlayerGame: 0,
							thePlayerGame2: 0,
							thePlayerGameOld: 0,
							thePlayerGameOld2: 0,
							xjogadas: [],
							ojogadas: [],
							waitJogo: 0,
							timesPlayed: 0,
							tictacplays: ['a1','a2','a3','b1','b2','b3','c1','c2','c3'],
							tttboard: {
								a1: '-',
								a2: '-',
								a3: '-',
								b1: '-',
								b2: '-',
								b3: '-',
								c1: '-',
								c2: '-',
								c3: '-'
							},
							finalAwnser: 0,
							isValidGame: 0
						};
					};
					const tboards = async () => {
						delete tttSet[chatId].tttboard.undefined ; // Caso alguma jogada por como erro
						let anamazs = await canvacord.Canvas.tictactoe(tttSet[chatId].tttboard, {
							bg: '#000000',
							bar: '#FFFFFF'
						});
						return anamazs;
					};
					if (!Object.keys(tttSet).includes(chatId)) {
						resetGameNew();
					}
					if (argtt[0] == '-show') return await kill.sendImageAsSticker(chatId, await tboards(), stickerConfig);
					if (theplayer2 !== null) {
						tttSet[chatId].isValidGame = 1;
					}
					if (user == tttSet[chatId].thePlayerGameOld && argtt[0] == '-cancel' || user == tttSet[chatId].thePlayerGameOld2 && argtt[0] == '-cancel') {
						await kill.reply(chatId, mess.cancelgame(), id);
						return resetGameNew();
					}
					if (tttSet[chatId].thePlayerGame == 0 && tttSet[chatId].waitJogo == 0 && tttSet[chatId].isValidGame == 1 || user == tttSet[chatId].thePlayerGame && tttSet[chatId].waitJogo == 0 && tttSet[chatId].isValidGame == 1 || tttSet[chatId].thePlayerGame2 == user && tttSet[chatId].waitJogo == 0 && tttSet[chatId].isValidGame == 1) {
						if (!tttSet[chatId].tictacplays.includes(argtt[0])) return await kill.reply(chatId, mess.TTT_Invalid(tttSet, chatId), id);
						tttSet[chatId].waitJogo = 1;
						tttSet[chatId].thePlayerGame = tttSet[chatId].timesPlayed == 0 ? user : tttSet[chatId].thePlayerGameOld;
						tttSet[chatId].thePlayerGame2 = tttSet[chatId].timesPlayed == 0 ? theplayer2 : tttSet[chatId].thePlayerGameOld2;
						tttSet[chatId].thePlayerGameOld = tttSet[chatId].thePlayerGame;
						tttSet[chatId].thePlayerGameOld2 = tttSet[chatId].thePlayerGame2;
						if (user == tttSet[chatId].thePlayerGameOld) {
							tttSet[chatId].xjogadas.push(argtt[0]);
							tttSet[chatId].tttboard[argtt[0]] = 'X';
							tttSet[chatId].tictacplays = tttSet[chatId].tictacplays.filter(j => j !== argtt[0]);
						} else if (user == tttSet[chatId].thePlayerGameOld2) {
							tttSet[chatId].ojogadas.push(argtt[0]);
							tttSet[chatId].tttboard[argtt[0]] = 'O';
							tttSet[chatId].tictacplays = tttSet[chatId].tictacplays.filter(j => j !== argtt[0]);
						}
						if (tttSet[chatId].thePlayerGameOld2 == botNumber) {
							var model = ((new TicTacToe.Model(Object.values(tttSet[chatId].tttboard).join(''), 'O')).getRecommendation()).index;
							const irisJog = (Object.keys(tttSet[chatId].tttboard)[model] || tools('others').randVal(tttSet[chatId].tictacplays));
							tttSet[chatId].ojogadas.push(irisJog);
							tttSet[chatId].tttboard[irisJog] = 'O';
							tttSet[chatId].tictacplays = tttSet[chatId].tictacplays.filter(j => j !== irisJog);
							//await kill.sendTextWithMentions(chatId, `Estou fazendo minha jogada, vou mandar o tabuleiro assim que eu terminar @${tttSet[chatId].thePlayerGameOld.replace('@c.us', '')}.`)
							tttSet[chatId].thePlayerGame = tttSet[chatId].thePlayerGameOld;
							tttSet[chatId].thePlayerGame2 = 1;
						}
						await kill.sendImageAsSticker(chatId, await tboards(), stickerConfig);
						if (tttSet[chatId].thePlayerGameOld == user) {
							tttSet[chatId].thePlayerGame2 = tttSet[chatId].thePlayerGameOld2;
							tttSet[chatId].thePlayerGame = 1;
						} else if (tttSet[chatId].thePlayerGameOld2 == user) {
							tttSet[chatId].thePlayerGame = tttSet[chatId].thePlayerGameOld;
							tttSet[chatId].thePlayerGame2 = 1;
						}
						if (tttSet[chatId].thePlayerGameOld2 == botNumber) {
							tttSet[chatId].thePlayerGame = tttSet[chatId].thePlayerGameOld;
							tttSet[chatId].thePlayerGame2 = 1;
						} else if (tttSet[chatId].thePlayerGameOld == botNumber) {
							tttSet[chatId].thePlayerGame2 = tttSet[chatId].thePlayerGameOld2;
							tttSet[chatId].thePlayerGame = 1;
						}
						tttSet[chatId].timesPlayed = 1;
						tttSet[chatId].waitJogo = 0;
						var theVeredict = tools('gaming').verify(tttSet, chatId);
						let winnerN = theVeredict == 1 ? "thePlayerGameOld" : (theVeredict == 2 ? "thePlayerGameOld2" : (theVeredict == 3 ? "draw" : false));
						if (winnerN !== false) {
							if (winnerN == "draw") {
								await kill.sendText(chatId, mess.draw());
							} else await kill.sendTextWithMentions(chatId, mess.playerWin(tttSet[chatId][winnerN]));
							return resetGameNew();
						}
					} else if (tttSet[chatId].thePlayerGameOld !== 0) {
						await kill.sendTextWithMentions(chatId, mess.someoneplay(tttSet[chatId].thePlayerGameOld.replace('@c.us', ''), tttSet[chatId].thePlayerGameOld2.replace('@c.us', '')), id);
					} else await kill.reply(chatId, mess.tictactoe(), id);
				break;

				case 'detect':
					if (Default_APIS.Acr_Host !== APIS.Acr_Host && tools('others').isUrl(APIS.Acr_Host) && Default_APIS.Acr_Secret !== APIS.Acr_Secret && Default_APIS.Acr_Access !== APIS.Acr_Access) {
						if (isType('audio') || isType('ptt')) {
							const mediaData = await decryptMedia(encryptMedia);
							await tools('acrcloud').recognize(`./lib/media/audio/detect-${tools('others').randomString(10)}.mp3`, mediaData, kill, message);
						} else await kill.reply(chatId, mess.onlyaudio(), id);
					} else return await kill.reply(chatId, mess.Command_Unusable(), id);
				break;

				// Se forem inteligentes, podem gastar icoins para comprar XP e ganhar mais Icoin's
				case 'agiotar':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (!Win_Rewards.includes(argl[0])) return await kill.reply(chatId, mess.Agiotar_Usage(), id);
					if (objconfig.agiotas.includes(user)) return await kill.reply(chatId, mess.Agiotado(), id);
					if (args.length < 2 || !quotedMsgObj && mentionedJidList.length == 0) return await kill.reply(chatId, mess.semmarcar() + '\n\n' + mess.Agiotar_Usage(), id);
					const timeGain = mentionedJidList.length !== 0 ? args[3] : (quotedMsgObj ? args[2] : args[3]);
					const fakeGain = parseInt(mentionedJidList.length !== 0 ? args[2] : (quotedMsgObj ? args[1] : args[2]));
					if (isNaN(fakeGain)) return await kill.reply(chatId, mess.onlynumber() + '\n\n' + mess.Agiotar_Usage(), id);
					const Value_Exists = tools('gaming').getValue(user, chatId, argl[0]);
					if (isNaN(fakeGain) || !tools('others').isInt(fakeGain) || Number(fakeGain) > Value_Exists || fakeGain < 1) return await kill.reply(chatId, mess.maxAgiota(Value_Exists), id);
					const pobreAlma = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : user);
					if (pobreAlma == user) return await kill.reply(chatId, mess.cmdfailed() + '\n\n' + mess.Agiotar_Usage(), id);
					tools('gaming').addValue(pobreAlma, Number(fakeGain), chatId, argl[0]);
					tools('gaming').addValue(user, Number(-fakeGain), chatId, argl[0]);
					objconfig.agiotas.push(user, pobreAlma);
					await kill.sendTextWithMentions(chatId, mess.moneyagi(fakeGain, pobreAlma, timeGain));
					await tools('others').sleep(Number(timeGain * 60000));
					await kill.sendTextWithMentions(chatId, mess.backmoney(fakeGain, user, pobreAlma));
					tools('gaming').addValue(pobreAlma, Number(-fakeGain), chatId, argl[0]);
					tools('gaming').addValue(user, Number(fakeGain), chatId, argl[0]);
					objconfig.agiotas = objconfig.agiotas.filter(v => v !== pobreAlma && v !== user);
				break;

				case 'sepia':
					try {
						var sepiaUpl = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
						await canvacord.Canvas.invert(sepiaUpl[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `sepia.png`, '', id));
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'guild':
				case 'guilda':
					let The_Limiter = tools('gaming').getLimit(user, chatId, true);
					if (The_Limiter.guild.isLimit) return await kill.reply(chatId, mess.waitNewGuild(The_Limiter.guild), id);
					if (args.length == 0) return await kill.reply(chatId, mess.helpGuild(), id);
					if (functions.guild.includes(argc[0]) && tools('gaming').getValue(user, chatId, 'guild') !== argc[0]) {
						tools('gaming').changeGuild(user, chatId, argc[0]);
						await kill.reply(chatId, mess.newGuild(), id);
						if (objconfig.noLimits == 0) return tools('gaming').addLimit(user, chatId, 'guild');
					} else await kill.reply(chatId, mess.Guild_Unusable(), id);
				break;

				case 'spoiler':
					await kill.reply(chatId, mess.spoiler(), id);
				break;

				case 'myguild':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'Guild name', id);
					if (!isGroupMsg) return await kill.reply(chatId, mess.sogrupo(), id);
					try {
						var guildTit = `----- [ *GUILDA ${argc[0]}* ] -----\n\n`;
						let countS = 0;
						for (let p of Object.keys(nivel[chatId])) {
							if (nivel[chatId][p].guild == argc[0]) {
								countS++;
								let skybor = await kill.getContact(p);
								guildTit += `${countS} -> *[${skybor.pushname || 'wa.me/' + p.replace('@c.us', '')}]*\n\n`;
							}
						}
						await kill.sendText(chatId, guildTit);
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'ddd':
					if (region !== 'pt') return await kill.reply(chatId, 'Brazil only/Brasil solamente!', id);
					if (args.length == 0 || isNaN(args[0])) return await kill.reply(chatId, `Você esqueceu de inserir o DDD.`, id);
					const ddds = (await axios.get(`https://brasilapi.com.br/api/ddd/v1/${args[0]}`)).data;
					if (ddds.type == 'ddd_error' || ddds.name == 'DDD_NOT_FOUND') return await kill.reply(chatId, ddds.message, id);
					await kill.reply(chatId, `Lista de Cidades de ${ddds.state} com este DDD [${ddds.cities.length}] >\n → ${ddds.cities.join('\n\n→ ')}`, id);
				break;

				case 'newguild':
					if (args.length < 1) return await kill.reply(chatId, mess.noargs() + 'Guild.', id);
					if (functions.guild.includes(argc[0])) return await kill.reply(chatId, 'A guilda que você deseja criar já existe.', id);
					functions.guild.push(argc[0]);
					tools('gaming').changeGuild(user, chatId, argc[0]);
					fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
					await kill.reply(chatId, `Guilda ${argc[0]} criada com sucesso, chame alguém para entrar com ${prefix}Guild ${argc[0]}!`, id);
				break;

				case 'allguild':
					await kill.reply(chatId, `Guildas ↓\n\n${functions.guild.join('\n')}`, id);
				break;

				case 'jogo':
				case 'jogos':
				case 'game':
					if (Default_APIS.API_Rawg !== APIS.API_Rawg) {
						if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'nome do jogo/game name/nombre de juego', id);
						const gamesearch = await axios.get(`https://api.rawg.io/api/games?key=${APIS.API_Rawg}&search=${encodeURIComponent(arg)}&page_size=1`);
						let esrb = gamesearch.data.results[0].esrb_rating === null ? 'Not Found' : gamesearch.data.results[0].esrb_rating.name;
						let plataforms = '';
						for (let i = 0; i < gamesearch.data.results[0].platforms.length; i++) {
							plataforms += `${gamesearch.data.results[0].platforms[i].platform.name}, `;
						}
						plataforms += `${gamesearch.data.results[0].platforms[gamesearch.data.results[0].platforms.length - 1].platform.name}`;
						let whrtobuy = '';
						for (let i = 0; i < gamesearch.data.results[0].stores.length; i++) {
							whrtobuy += `${gamesearch.data.results[0].stores[i].store.name}, `;
						}
						whrtobuy += `${gamesearch.data.results[0].stores[gamesearch.data.results[0].stores.length - 1].store.name}`;
						if (gamesearch.data.results[0].genres.length === 0) {
							await kill.sendFile(chatId, gamesearch.data.results[0].background_image, 'game.png', mess.gameinfo(gamesearch.data.results[0].name, 'Not Found', plataforms, whrtobuy, gamesearch.data.results[0].playtime, gamesearch.data.results[0].released, gamesearch.data.results[0].rating, gamesearch.data.results[0].rating_top, esrb), id);
						} else {
							let genres = '';
							for (let i = 0; i < gamesearch.data.results[0].genres.length; i++) {
								genres += `${gamesearch.data.results[0].genres[i].name}, `;
							}
							genres += `${gamesearch.data.results[0].genres[gamesearch.data.results[0].genres.length - 1].name}`;
							await kill.sendFile(chatId, gamesearch.data.results[0].background_image, 'game.png', mess.gameinfo(gamesearch.data.results[0].name, genres, plataforms, whrtobuy, gamesearch.data.results[0].playtime, gamesearch.data.results[0].released, gamesearch.data.results[0].rating, gamesearch.data.results[0].rating_top, esrb), id);
						}
					} else return await kill.reply(chatId, mess.Command_Unusable(), id);
				break;

				case '8d':
					if (isType('audio') || isType('ptt') || isType('video')) {
						var format = (isType('video')) ? 'mp4' : 'mp3';
						const mediaData = await decryptMedia(encryptMedia);
						await tools('ffmpeg').octasound(mediaData, argl[0], kill, message, format);
					} else await kill.reply(chatId, mess.onlyaudio(), id);
				break;

				/*Feito por Pedro Batistop*/
				case 'petpet':
				case 'patpat':
				case 'pat':
				case 'pet':
					const petPet = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					let animatedGif = await petPetGif(petPet[0]);
					await kill.sendImageAsSticker(chatId, animatedGif, stickerConfig);
				break;

				case 'stt':
				case 'watson':
					if (Default_APIS.Watson_Model !== APIS.Watson_Model && Default_APIS.API_IBM_Watson !== APIS.API_IBM_Watson && Default_APIS.Watson_Host !== APIS.Watson_Host && tools('others').isUrl(APIS.Watson_Host)) {
						if (isType('audio') || isType('ptt')) {
							const BkMesa = quotedMsgObj ? quotedMsgObj : message;
							if (BkMesa.duration > 60) return await kill.reply(chatId, mess.watsonmsg(), id);
							const watsonst = `./lib/media/audio/stt-${tools('others').randomString(10)}.ogg`;
							const mediaData = await decryptMedia(encryptMedia);
							fs.writeFile(watsonst, mediaData, async (err) => {
								if (err) return console.error(err);
								const speechToText = new SpeechToTextV1({
									authenticator: new IamAuthenticator({
										apikey: APIS.API_IBM_Watson
									}),
									serviceUrl: APIS.Watson_Host,
									disableSslVerification: true
								});
								const recognizeStream = await speechToText.recognizeUsingWebSocket({
									objectMode: false,
									contentType: 'audio/ogg',
									model: APIS.Watson_Model
								});
								fs.createReadStream(watsonst).pipe(recognizeStream);
								recognizeStream.setEncoding('utf8');
								recognizeStream.on('data', async function(data, event) {
									await kill.reply(chatId, `🎙️ -> ${data}`, id);
								});
								recognizeStream.on('error', async function(error, event) {
									tools('others').reportConsole(cmd, error);
									await kill.reply(chatId, mess.fail(cmd, error, time), id);
								});
								recognizeStream.on('close', async function(event) {});
							});
							await kill.reply(chatId, mess.nobgms(), id);
							tools('others').clearFile(watsonst, 10000, false);
						} else await kill.reply(chatId, mess.onlyaudio(), id);
					} else return await kill.reply(chatId, mess.Command_Unusable(), id);
				break;

				/*case 'time':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					const getlimit = tools('gaming').getLimit(user, 'games');
					if (getlimit !== undefined) {
						const whenminutes = Math.floor((Date.now() - getlimit) / 60000);
						const whenseconds = Math.floor(((Date.now() - getlimit) % 60000) / 1000) + 1;
						const timeremainminutes = Math.abs(Math.floor((Number(config.Wait_to_Play)) - ((Date.now() - getlimit) / 60000)));
						const timeremainseconds = Math.abs(Math.floor(Number(config.Wait_to_Play) - (((Date.now() - getlimit) % 60000) / 1000)));
						if (whenminutes < Number(config.Wait_to_Play)) {
							await kill.reply(chatId, `⏱️ - Espere *${timeremainminutes} minutos* & *${timeremainseconds} segundos* para apostar novamente.\n\n🎮 - Apostou por último *${whenminutes} minutos* & *${whenseconds} segundos* atrás.`, id);
						} else await kill.reply(chatId, `⏱️ - Você pode apostar desde *${timeremainminutes} minutos* & *${timeremainseconds} segundos* atrás.\n\n🎮 - Apostou por último *"${whenminutes} minutos* & *${whenseconds} segundos"* atrás.`, id);
					} else await kill.reply(chatId, 'Você não jogou ainda?', id);
				break*/

				case 'mix':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					Mix_Waiting[chatId] = Mix_Waiting[chatId] == null ? 0 : Mix_Waiting[chatId];
					if (Mix_Waiting[chatId] >= 3 && argl[0] !== '-placar') return await kill.reply(chatId, `Já temos 3 jogos ou mais esperando resposta, acerte eles antes de ir em outro.`, id);
					if (argl[0] == '-new' || argl[0] == null) {
						const Standart_Mix = fs.existsSync(`./lib/config/Utilidades/${argl[1]}.txt`) ? argl[1] : tools('others').randVal(fileFor);
						if (isGroupMsg && !isActivated('nsfw') && Standart_Mix == 'porn') return await kill.reply(chatId, mess.gpadulto(), id);
						const File_Mix = tools('others').getRandLine(1, `./lib/config/Utilidades/${Standart_Mix}.txt`)[0];
						const Dica_Mix = tools('others').randomNumber(2, (File_Mix.length / 2));
						await kill.reply(chatId, `❗ - ${Standart_Mix.toUpperCase()}"\n\n❓ - "${tools('others').randomArr(File_Mix.split('').sort()).toString()}"\n\n🎁 - Começa com "${File_Mix.slice(0, Dica_Mix).toUpperCase()}"\n\n🕗 - 10 minutos para acertar...`, id);
						Mix_Waiting[chatId]++;
						const Mix_Filter = msgw => msgw.from == chatId && (new RegExp(`${File_Mix}`, 'gim')).test(removeAccents(msgw.body));
						kill.awaitMessages(chatId, Mix_Filter, {
							max: 1,
							time: 600000,
							errors: ['time']
						}).then(async mbdx => {
							const m_bdy = Array.from(mbdx)[0][1];
							Mix_Waiting[chatId]--;
							placar[m_bdy.sender.id] = placar[m_bdy.sender.id] == null ? 1 : placar[m_bdy.sender.id]++;
							const winType = tools('others').randVal(Win_Rewards);
							var winChos = tools('others').randomNumber(config.Prize_Value_Min, config.Prize_Value_Max);
							if (randEven.eventOnline && randEven.eventType == winType) {
								winChos = parseInt(tools('others').randomNumber(winChos, winChos*randEven.events[randEven.eventIndex].multiplier)); /* Efeito de evento aleatório */
							}
							winChos = (winChos + (File_Mix.length * 5) + (Number(placar[m_bdy.sender.id]) * 10));
							const Final_Values = tools('others').Bonus_Value(winChos, m_bdy.sender.id, m_bdy.chatId, 'win');
							tools('gaming').addValue(m_bdy.sender.id, Final_Values, m_bdy.chatId, winType);
							await kill.sendReplyWithMentions(chatId, mess.Mix_Wins(m_bdy.sender, File_Mix, Final_Values, winType), m_bdy.id);
						}).catch(async m => {
							Mix_Waiting[chatId]--;
							await kill.reply(chatId, mess.Mix_Time(File_Mix), id);
						});
					} else if (argl[0] == '-placar') {
						if (Object.keys(placar).length == 0) return await kill.reply(chatId, mess.No_Winners(), id);
						const Winners_Mix = (Object.keys(placar)).map(scr => '@'+scr.replace('@c.us', '')+' = '+placar[scr]+' Points\n\n').join('');
						await kill.sendReplyWithMentions(chatId, Winners_Mix, id);
					} else await kill.reply(chatId, `Para criar um novo jogo use "${prefix}Mix -new <tipo>".\nPara obter o placar use "${prefix}Mix -placar".`, id);
				break;

				case '2d':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs()+'Anime character', id);
					const charac = await axios.get(`https://www.animecharactersdatabase.com/api_series_characters.php?character_q=${encodeURIComponent(Sliced_Body)}`);
					if (charac.data == '-1') return await kill.reply(chatId, mess.noresult(), id);
					if (region == 'en' || arks.includes('-orig')) return await kill.sendFileFromUrl(chatId, `${charac.data.search_results[0].character_image}`, 'char.jpg', `${charac.data.search_results[0].name} - ${charac.data.search_results[0].gender}\n\n${charac.data.search_results[0].anime_name}\n\n${charac.data.search_results[0].desc}`);
					const Girls2DBest = (await translate(charac.data.search_results[0].desc, {
						to: region
					})).text;
					await kill.sendFileFromUrl(chatId, `${charac.data.search_results[0].character_image}`, 'char.jpg', `${charac.data.search_results[0].name} - ${charac.data.search_results[0].gender}\n\n${charac.data.search_results[0].anime_name}\n\n${Girls2DBest}`);
				break;

				case 'forca':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (!Object.keys(gameconfig).includes(chatId)) {
						gameconfig[chatId] = {
							lives: 6,
							dicas: 0,
							forcw: 0,
							hint: 0,
							wordVsb: 0,
							wordOct: 0,
							word: 0,
							whoplay: chatId,
							gameFile: 0,
							forcFile: 0
						};
					}
					gameconfig[chatId].forcFile = gameconfig[chatId].forcFile == 0 ? tools('others').randVal(fileFor) : gameconfig[chatId].forcFile;
					let resetForca = () => {
						gameconfig[chatId].forcw = 0;
						gameconfig[chatId].wordVsb = 0;
						gameconfig[chatId].wordOct = 0;
						gameconfig[chatId].whoplay = 0;
						gameconfig[chatId].lives = 0;
						gameconfig[chatId].forcFile = 0;
					};
					if (gameconfig[chatId].forcw == 0 || argl[0] == '-new') {
						gameconfig[chatId].forcw = tools('others').getRandLine(1, `./lib/config/Utilidades/${gameconfig[chatId].forcFile}.txt`)[0];
						gameconfig[chatId].wordVsb = gameconfig[chatId].forcw.replace(/[a-zA-Z]/g, '_ ').split(' ');
						gameconfig[chatId].wordOct = gameconfig[chatId].forcw.split('');
						gameconfig[chatId].whoplay = chatId;
						await kill.reply(chatId, `❗ - ${gameconfig[chatId].forcFile.toUpperCase()}\n\n❓ - "${gameconfig[chatId].wordVsb.join(' ')}"`, id);
					} else if (argl.length >= 2 && argl[0] == '-r') {
						if (gameconfig[chatId].wordVsb.includes(argl[1].split('')[0])) return await kill.reply(chatId, 'Já possui esta letra.' + '\n\n' + gameconfig[chatId].wordVsb.join(' '), id);
						let awnserFind = 0;
						for (let i = 0; i < gameconfig[chatId].wordVsb.length; i++) {
							if (gameconfig[chatId].wordOct[i] == argl[1][0]) {
								gameconfig[chatId].wordVsb[i] = gameconfig[chatId].wordOct[i];
								awnserFind = 1;
							}
						}
						if (awnserFind == 1) {
							await kill.reply(chatId, 'Letra encontrada! > ' + gameconfig[chatId].wordVsb.join(' '), id);
							if (gameconfig[chatId].wordVsb.filter((a => a == '_')).length == 0) {
								await kill.reply(chatId, 'A palavra era -> "' + gameconfig[chatId].wordVsb.join(' ') + '", você venceu!' , id);
								resetForca();
							}
						} else {
							gameconfig[chatId].lives -= 1;
							if (gameconfig[chatId].lives == 5) {
								await mandarFig(kill, chatId, 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/1.png', stickerConfig);
							} else if (gameconfig[chatId].lives == 4) {
								await mandarFig(kill, chatId, 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/2.png', stickerConfig);
							} else if (gameconfig[chatId].lives == 3) {
								await mandarFig(kill, chatId, 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/3.png', stickerConfig);
							} else if (gameconfig[chatId].lives == 2) {
								await mandarFig(kill, chatId, 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/4.png', stickerConfig);
							} else if (gameconfig[chatId].lives == 1) {
								await mandarFig(kill, chatId, 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/5.png', stickerConfig);
							} else if (gameconfig[chatId].lives == 0) {
								await kill.sendFileFromUrl(chatId, 'https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Assets/6.jpg', 'lose.jpg', mess.You_Lose(argl, gameconfig, chatId), id);
								return resetForca();
							}
							await kill.reply(chatId, mess.Letter_Inexist(argl, gameconfig, chatId), id);
						}
					} else if (argl[0] == '-dica') {
						if (gameconfig[chatId].dicas !== 0) return await kill.reply(chatId, mess.max_ForDic()+`"${gameconfig[chatId].wordVsb.join(' ')}"`, id);
						gameconfig[chatId].dicas = 1;
						let getDica = () => {
							let randNbr = tools('others').randomNumber(1, gameconfig[chatId].wordVsb.length);
							if (gameconfig[chatId].wordVsb[randNbr] !== '_') {
								randNbr = gameconfig[chatId].wordVsb.indexOf('_');
							}
							gameconfig[chatId].wordVsb[randNbr] = gameconfig[chatId].wordOct[randNbr];
						};
						if (gameconfig[chatId].wordVsb.length < 6) {
							getDica();
						} else {
							getDica();
							getDica();
						}
						await kill.reply(chatId, mess.max_ForLetter() + gameconfig[chatId].wordVsb.join(' '), id);
					} else if (argl.length >= 2 && argl[0] == '-allin') {
						if (removeAccents(argl[1]) == gameconfig[chatId].forcw) {
							await kill.reply(chatId, mess.Correct_Word(gameconfig, chatId), id);
						} else await kill.reply(chatId, mess.Lose_All(gameconfig, chatId), id);
					} else return kill.reply(chatId, `❗ - ${gameconfig[chatId].forcFile.toUpperCase()}\n\n❓ - "${gameconfig[chatId].wordVsb.join(' ')}"`, id);
				break;

				case 'shop':
				case 'forge':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (args.length < 1 || argl[0] == '-help' || argl[0] == '-show' || argl[0] == '-menu') {
						let what_menush = cmd == 'shop' ? mess.shopping() : mess.forgeItem();
						return await kill.reply(chatId, what_menush, id);
					}
					if (args[0] == '3' || args[0] == '4' || args[0] == '5') {
						let mention_Type = 'none';
						if (mentionedJidList.length !== 0) {
							mention_Type = 'mentionedJidList';
						} else if (quotedMsgObj) {
							mention_Type = 'quotedMsg';
						}
						let pforj = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : user);
						await tools('shop').items(kill, message, args, user, chatId, pforj, mention_Type);
					} else await tools('shop').items(kill, message, args, user, chatId, false, 'none');
				break;

				case 'fipe':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'código tabela FIPE.', id);
					let fipe = (await axios.get(`https://brasilapi.com.br/api/fipe/preco/v1/${args[0]}`)).data[0];
					await kill.reply(chatId, `🚗 ${fipe.marca} - ${fipe.modelo}\n\n📅 ${fipe.anoModelo}\n\n💸 ${fipe.valor}\n\n⛽ ${fipe.combustivel} [${fipe.siglaCombustivel}]`, id);
				break;

				case 'feriados':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'ANO.', id);
					let ferias = (await axios.get(`https://brasilapi.com.br/api/feriados/v1/${args[0]}`)).data;
					await kill.reply(chatId, ferias.map(res => `*"${res.name}"* [${res.date} / ${res.type}]`).join('\n\n'), id);
				break;

				case 'loteria':
				case 'lotery':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (!Object.keys(lotery).includes(chatId)) {
						lotery[chatId] = {	
							"hasLast": false,
							"users": [],
							"lastUserPart": 0,
							"prize": {
								"coin": 0,
								"xp": 0,
								"rubi": 0,
								"dima": 0
							},
							"lastprize": {
								"coin": 0,
								"xp": 0,
								"rubi": 0,
								"dima": 0
							},
							"isStarted": false,
							"time": 0,
							"win": 0,
							"winner": 0,
							"lastTime": 0
						};
					}
					if (argl[0] == '-buy') {
						if (lotery[chatId].users.includes(user)) return await kill.reply(chatId, mess.Already_In(), id);
						const loter_tick = tools('gaming').getValue(user, chatId, null);
						if (Number(shopconf.Ticket_Price) > loter_tick.coin) return await kill.reply(chatId, mess.Lotter_On(loter_tick), id);
						lotery[chatId].users.push(user);
						lotery[chatId].prize.coin += Math.abs(parseInt(loter_tick.coin / Number(config.Max_Divider_Win)) + tools('others').randomNumber(10, 100));
						lotery[chatId].prize.xp += Math.abs(parseInt(loter_tick.xp / Number(config.Max_Divider_Win)) + tools('others').randomNumber(10, 100));
						lotery[chatId].prize.rubi += Math.abs(parseInt(loter_tick.rubi / Number(config.Max_Divider_Win)) + tools('others').randomNumber(10, 100));
						lotery[chatId].prize.dima += Math.abs(parseInt(loter_tick.dima / Number(config.Max_Divider_Win)) + tools('others').randomNumber(10, 100));
						tools('gaming').addValue(user, Number(-shopconf.Ticket_Price), chatId, 'coin');
						if (lotery[chatId].prize.xp > Number(config.Max_Lotery)) {
							lotery[chatId].prize.xp = Number(config.Max_Lotery);
						}
						if (lotery[chatId].prize.coin > Number(config.Max_Lotery)) {
							lotery[chatId].prize.coin = Number(config.Max_Lotery);
						}
						if (lotery[chatId].prize.rubi > Number(config.Max_Lotery)) {
							lotery[chatId].prize.rubi = Number(config.Max_Lotery);
						}
						if (lotery[chatId].prize.dima > Number(config.Max_Lotery)) {
							lotery[chatId].prize.dima = Number(config.Max_Lotery);
						}
						if (lotery[chatId].hasLast) {
							const winner_contact = await kill.getContact(lotery[chatId].winner);
							let winner_name = winner_contact.pushname ? `${winner_contact.pushname} - [ https://wa.me/${lotery[chatId].winner.replace('@c.us', '')} ]` : `https://wa.me/${lotery[chatId].winner.replace('@c.us', '')}`;
							await kill.sendTextWithMentions(chatId, mess.Lotter_Buy(lotery, chatId)+mess.Lotter_Old(lotery, chatId, winner_name));
						} else await kill.reply(chatId, mess.Lotter_Buy(lotery, chatId), id);
						if (!lotery[chatId].isStarted) {
							lotery[chatId].isStarted = true;
							lotery[chatId].time = moment().add(shopconf.Lotery_Time, 'minutes').unix();
							await tools('others').sleep(shopconf.Lotery_Time * 60000);
							lotery[chatId].win = tools('others').randVal(['xp', 'coin', 'rubi', 'dima']);
							lotery[chatId].winner = tools('others').randVal(lotery[chatId].users);
							lotery[chatId].prize[lotery[chatId].win] = tools('others').Bonus_Value(Number(lotery[chatId].prize[lotery[chatId].win]), user, chatId, 'win');
							tools('gaming').addValue(lotery[chatId].winner, Number(lotery[chatId].prize[lotery[chatId].win]), chatId, lotery[chatId].win);
							await kill.sendTextWithMentions(chatId, mess.Lotter_Win(lotery, chatId));
							lotery[chatId].lastTime = Number(moment().unix());
							lotery[chatId].lastUserPart = lotery[chatId].users.length;
							lotery[chatId].lastprize = {
								"coin": lotery[chatId].prize.coin,
								"xp": lotery[chatId].prize.xp,
								"rubi": lotery[chatId].prize.rubi,
								"dima": lotery[chatId].prize.dima
							};
							lotery[chatId].users = [];
							lotery[chatId].prize = {
								"coin": 0,
								"xp": 0,
								"rubi": 0,
								"dima": 0
							};
							lotery[chatId].isStarted = false;
							lotery[chatId].hasLast = true;
						}
					} else if (argl[0] == '-time') {
						if (lotery[chatId].isStarted) {
							await kill.reply(chatId, mess.Lotter_Timming(lotery, chatId), id);
						} else return await kill.reply(chatId, mess.Lotter_Offline(), id);
					} else await kill.reply(chatId, mess.noargs() + '-buy | -time', id);
				break;

				case 'daily':
				case 'diario':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (tools('gaming').getLimit(user, chatId, false, 'reward')) return await kill.reply(chatId, mess.Daily_Reward(), id);
					let winType = await tools('others').randVal(Win_Rewards);
					if (!Object.keys(reward).includes(user)) {
						reward[user] = {
							"rewards": 1,
							"dayWin": time,
							"prevWin": winType,
							"lastDate": time,
							"mouth": moment().format('YYYY-MM')
						};
					} else {
						if (moment(reward[user].mouth, "YYYY-MM").daysInMonth() !== moment().daysInMonth() || reward[user].rewards >= moment(reward[user].mouth, "YYYY-MM").daysInMonth()) {
							reward[user].mouth = moment().format('YYYY-MM');
							reward[user].rewards = 0;
						}
						reward[user].rewards++;
						reward[user].lastDate = reward[user].dayWin;
						reward[user].dayWin = time;
						reward[user].prevWin = winType;
					}
					fs.writeFileSync('./lib/config/Gerais/rewards.json', JSON.stringify(reward, null, "\t"));
					var dailyReward = tools('others').randomNumber(config.Daily_Reward, config.Daily_Reward * reward[user].rewards);
					var dailyIcoin = tools('others').randomNumber(config.Iris_Coin, config.Iris_Coin * reward[user].rewards);
					if (randEven.eventOnline && randEven.eventType == winType) {
						dailyReward = parseInt(tools('others').randomNumber(dailyReward*randEven.events[randEven.eventIndex].multiplier)); /* Efeito de evento aleatorio */
					}
					if (randEven.eventOnline && randEven.eventType == 'coin') {
						dailyIcoin = parseInt(tools('others').randomNumber(dailyIcoin*randEven.events[randEven.eventIndex].multiplier)); /* Efeito de evento aleatorio */
					}
					dailyIcoin = tools('others').Bonus_Value(dailyIcoin, user, chatId, 'win');
					dailyReward = tools('others').Bonus_Value(dailyReward, user, chatId, 'win');
					tools('gaming').addValue(user, Number(dailyReward), chatId, winType);
					tools('gaming').addValue(user, Number(dailyIcoin), chatId, 'coin');
					await kill.reply(chatId, mess.Daily_Receive(dailyReward, winType, dailyIcoin, reward, sender), id);
					tools('gaming').addLimit(user, chatId, 'reward');
				break;

				case 'genshin':
					if (args.length == 0) return await kill.reply(chatId, mess.Genshin(), id);
					let stanLang = region == 'en' ? 'English' : (region == 'pt' ? 'Portuguese' : 'Spanish');
					if (argl[0] == '-sets') {
						let charList = await axios.get('https://raw.githubusercontent.com/KillovSky/Iris_Files/main/Genshin/sets.txt');
						if (!charList.data.toLowerCase().includes(argl[1]) || argl[1] == '-help') return await kill.reply(chatId, mess.Dont_Have()+`${charList.data}`, id);
						let charToSend = argl[1] == 'keqing' ? 'keqing.png' : argl[1]+'.jpg';
						await kill.sendFileFromUrl(chatId, `https://github.com/KillovSky/Iris_Files/raw/main/Genshin/${charToSend}`, charToSend, mess.Best_Set(argc), id);
					} else if (argl[0] == '-char') {
						let impact = await genshin.characters(body.slice(cmd.length+7), {
							resultLanguage: stanLang
						});
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.sendFileFromUrl(chatId, (impact.images.card || impact.images.portrait || impact.images.cover1), 'card.png', mess.Gen_Char(impact), id);
					} else if (argl[0] == '-weapon') {
						let impact = await genshin.weapons(body.slice(cmd.length+9), {
							resultLanguage: stanLang
						});
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.sendFileFromUrl(chatId, impact.images.image, 'image.png', mess.Gen_Weapon(impact), id);
					} else if (argl[0] == '-obj') {
						let impact = await genshin.materials(body.slice(cmd.length+6), {
							resultLanguage: stanLang
						});
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.sendFileFromUrl(chatId, (impact.images.redirect || impact.images.fandom), 'image.png', mess.Gen_Object(impact), id);
					} else if (argl[0] == '-art') {
						let impact = await genshin.artifacts(body.slice(cmd.length+6), {
							resultLanguage: stanLang
						});
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.sendFileFromUrl(chatId, impact.images.flower, 'image.png', mess.Gen_Artifact(impact), id);
					} else if (argl[0] == '-boss') {
						let impact = await genshin.enemies(body.slice(cmd.length+7), {
							resultLanguage: stanLang
						});
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.reply(chatId, mess.Gen_Boss(impact), id);
					} else if (argl[0] == '-food') {
						let impact = await genshin.foods(body.slice(cmd.length+7), {
							resultLanguage: stanLang
						});
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.reply(chatId, mess.Gen_Food(impact), id);
					} else if (argl[0] == '-dom') {
						let impact = await genshin.domains(body.slice(cmd.length+6), {
							resultLanguage: stanLang
						});
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.reply(chatId, mess.Gen_Dom(impact), id);
					} else if (argl[0] == '-talent') {
						let impact = await genshin.talents(body.slice(cmd.length+9), {
							resultLanguage: stanLang
						});
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.reply(chatId, mess.Gen_Talent(impact), id);
					} else if (argl[0] == '-cos') {
						let impact = await genshin.constellations(body.slice(cmd.length+6), {
							resultLanguage: stanLang
						});
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.sendFileFromUrl(chatId, impact.images.c1, 'image.png', mess.Gen_Cos(impact), id);
					} else if (argl[0] == '-ment') {
						let impact = await genshin.elements(body.slice(cmd.length+7));
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.sendFileFromUrl(chatId, (impact.images.base64 || impact.images.wikia), 'image.png', mess.Gen_Element(impact), id);
					} else if (argl[0] == '-type') {
						let impact = await genshin.weaponmaterialtypes(body.slice(cmd.length+7));
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.reply(chatId, mess.Gen_Type(impact), id);
					} else if (argl[0] == '-tal') {
						let impact = await genshin.talentmaterialtypes(body.slice(cmd.length+6));
						if (impact == null) return await kill.reply(chatId, mess.noresult(), id);
						await kill.reply(chatId, mess.Gen_TalMaterial(impact), id);
					} else return await kill.reply(chatId, mess.Genshin(), id);
				break;

				case 'chess':
					if (args.length == 0 || args[0] == '-help' || !Object.keys(chessGame).includes(chatId) && argl[0] !== '-new') return await kill.sendFileFromUrl(chatId, 'https://i.imgur.com/vIo4IAW.png', 'chess.png', mess.Chess(), id);
					const chessglayer = mentionedJidList.length !== 0 ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : botNumber);
					var chessglate = new chessImageGenerator({
						size: 800,
						style: 'alpha'
					});
					if (argl[0] == '-fen') return await kill.reply(chatId, chessGame[chatId].fen, id);
					if (argl[0] == '-new') {
						if (args[2] == null) return await kill.reply(chatId, mess.Chess_Insert(chessg), id);
						chessg = new chess.Chess();
						chessGame[chatId] = {
							'fen': chessg.fen(),
							'b': user,
							'w': chessglayer
						};
						let moved = (chessg.move(args[2]) == null ? 'Error' : 'Not Error');
						if (moved !== 'Not Error') return await kill.reply(chatId, mess.Chess_Insert(chessg), id);
						chessGame[chatId].fen = chessg.fen();
						chessg = new chess.Chess(chessGame[chatId].fen);
					} else if (argl[0] == '-play') {
						if (chessGame[chatId] == null) return await kill.reply(chatId, mess.Chess_Create(), id);
						if (chessGame[chatId].w !== user && chessGame[chatId].b !== user) return await kill.reply(chatId, mess.Chess_NotPlayer(), id);
						chessg = new chess.Chess(chessGame[chatId].fen);
						let moved = (chessg.move(args[1]) == null ? 'Error' : 'Not Error');
						if (moved !== 'Not Error') return await kill.reply(chatId, mess.Chess_Insert(chessg), id);
						chessGame[chatId].fen = chessg.fen();
						chessg = new chess.Chess(chessGame[chatId].fen);
					} else if (argl[0] == '-show') {
						chessg = new chess.Chess(chessGame[chatId].fen);
						return await getGame(chessglate, chessGame, chatId, kill, stickerConfig, true, mess, id);
					} else if (argl[0] == '-moves') return await kill.reply(chatId, mess.Chess_Insert(chessg), id);
					chessg = new chess.Chess(chessGame[chatId].fen);
					if (chessGame[chatId][chessGame[chatId].fen.split(' ')[1]] == botNumber) {
						var chessMoves = chessg.moves().filter(h => h.includes('#'));
						if (chessMoves.length == 0) {
							chessMoves = chessg.moves().filter(h => h.includes('x'));
						} // Prioridade de captura e xeque-mate
						chessMoves = chessMoves.length == 0 ? chessg.moves() : chessMoves;
						var chessJog = tools('others').randVal(chessMoves);
						chessg.move(chessJog);
						chessGame[chatId].fen = chessg.fen();
						chessg = new chess.Chess(chessGame[chatId].fen);
					}
					await getGame(chessglate, chessGame, chatId, kill, stickerConfig, false, mess, id);
					if (chessGame[chatId] !== null) {
						if (chessg.game_over()) {
							if (chessg.in_draw()) return await kill.reply(chatId, mess.Chess_Draw(), id);
							if (chessg.in_stalemate()) return await kill.reply(chatId, mess.Chess_Stale(), id);
							if (chessg.insufficient_material()) return await kill.reply(chatId, mess.Chess_Insufficient(), id);
							if (chessg.in_checkmate()) return await kill.reply(chatId, mess.Chess_CheckMate(), id);
							if (chessg.in_check()) return await kill.reply(chatId, mess.Chess_Check(), id);
							await kill.reply(chatId, mess.Chess_End(), id);
						}
					}
				break;
		
				case 'speed':
					if (isType('audio') || isType('ptt') || isType('video')) {
						const decryptSpeed = await decryptMedia(encryptMedia);
						const formatSpeed = isType('video') ? 'mp4' : 'mp3';
						await tools('ffmpeg').speed(decryptSpeed, kill, message, Number(args[0]), formatSpeed);
					} else await kill.reply(chatId, mess.onlyAdeo(), id);
				break;
		
				case 'reverse':
					if (isType('audio') || isType('ptt') || isType('video')) {
						const decryptReverse = await decryptMedia(encryptMedia);
						const formatReverse = isType('video') ? 'mp4' : 'mp3';
						await tools('ffmpeg').reverse(decryptReverse, kill, message, args, formatReverse);
					} else await kill.reply(chatId, mess.onlyAdeo(), id);
				break;
		
				case 'correios':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs()+'Código dos correios', id);
					let rasID = await axios.post('https://webservice.correios.com.br/service/rest/rastro/rastroMobile', `<rastroObjeto><usuario>MobileXect</usuario><tipo>L</tipo><resultado>T</resultado><objetos>${args[0]}</objetos><lingua>101</lingua></rastroObjeto>`, {
						headers: {
							'Content-Type': 'text/xml'
						}
					});
					if (rasID.data.objeto[0].categoria.includes('ERRO:')) return await kill.reply(chatId, mess.noresult(), id);
					await kill.reply(chatId, `Produto #${rasID.data.objeto[0].numero} - "${rasID.data.objeto[0].sigla}\n\nNome -> ${rasID.data.objeto[0].nome}\n\nCategoria -> ${rasID.data.objeto[0].categoria}\n\nQuantidade -> ${rasID.data.quantidade}\n\n----------------\n\n` + rasID.data.objeto[0].evento.map(a => `Movimento no dia -> ${a.data} - ${a.hora}\n\nLocalização no dia -> ${a.unidade.local} - ${a.unidade.cidade} - ${a.unidade.uf}\n\nDescrição -> ${a.descricao} - ${a.detalhe || 'Sem mais detalhes'}\n\nInformações da Unidade:\n\nTipo -> ${a.unidade.tipounidade}\n\nEndereço -> ${a.unidade.endereco.logradouro} - N° ${a.unidade.endereco.numero} - ${a.unidade.endereco.bairro} - ${a.unidade.endereco.localidade} - ${a.unidade.endereco.uf}\n\nCódigo da unidade recebedora -> #${a.unidade.codigo}\n\nSTO da Unidade -> #${a.unidade.sto}`).join(`\n ​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​​\n------------------\n*### AS INFORMAÇÕES ABAIXO SÃO DE ANTES DO DIA ${rasID.data.objeto[0].evento[0].data} - ${rasID.data.objeto[0].evento[0].hora} ###*\n------------------\n\n`), id);
				break;

				case '21':
					if (args.length == 0 || argl[0] == '-help') return await kill.reply(chatId, mess.Start_BlackJack(), id);
					if (isGroupMsg) {
						if (!Object.keys(bjConfig).includes(chatId)) {
							resetDeck(chatId);
						}
						if (argl[0] == '-start' && bjConfig[chatId].isPlaying == false) {
							bjConfig[chatId].players.push(user);
							await kill.reply(chatId, mess.BlackJack_Begin(), id) ;
							bjConfig[chatId].startedAt = moment().add(2, 'minutes').unix();
							await tools('others').sleep(120000);
							if (bjConfig[chatId].players.length < 2) {
								await kill.reply(chatId, mess.BlackJack_NoPlayers(), id);
								return resetDeck(chatId);
							} else {
								await kill.reply(chatId, mess.BlackJack_Started(), id);
								bjConfig[chatId].isPlaying = true;
								await tools('others').sleep(120000);
								if (bjConfig[chatId].validPlayers.length < 2) {
									await kill.reply(chatId, mess.BlackJack_NoPlayers(), id);
									return resetDeck(chatId);
								} else {
									bjConfig[chatId].atualPlayer = bjConfig[chatId].validPlayers[0];
									await kill.sendTextWithMentions(chatId, mess.BlackJack_First(bjConfig, chatId));
									await tools('others').sleep(120000);
									checkPlayed(chatId, kill, mess, resetDeck);
								}
							}
						} else if (argl[0] == '-stop' && bjConfig[chatId].validPlayers.includes(bjConfig[chatId].atualPlayer) && bjConfig[chatId].atualPlayer == user) {
							bjConfig[chatId].haveDeck.push(user);
							let userVal = tools('blackjack').getValue(bjConfig[chatId], user);
							if (userVal > 21) {
								await kill.sendTextWithMentions(chatId, mess.BlackJack_ExitLose(sender));
							} else if (userVal == 21) {
								await kill.sendTextWithMentions(chatId, mess.BlackJack_ExitWin(sender));
								return resetDeck(chatId);
							} else await kill.sendTextWithMentions(chatId, mess.BlackJack_ExitNone(sender));
							bjConfig[chatId].validPlayers = bjConfig[chatId].validPlayers.filter(f => f !== bjConfig[chatId].atualPlayer);
							if (bjConfig[chatId].validPlayers.length < 2) {
								await kill.sendTextWithMentions(chatId, mess.BlackJack_EndPlayers(bjConfig, chatId));
								return resetDeck(chatId);
							}
						} else if (argl[0] == '-drop' && bjConfig[chatId].validPlayers.includes(bjConfig[chatId].atualPlayer) && bjConfig[chatId].atualPlayer == user) {
							if (!bjConfig[chatId].deck[user].includes(args[1])) return await kill.reply(chatId, mess.BlackJack_NoDrop(), id);
							if (bjConfig[chatId].deck[user].length <= 1) return await kill.reply(chatId, mess.BlackJack_OneDrop(), id);
							bjConfig[chatId].haveDeck.push(user);
							const Played_Card = argc[1];
							bjConfig[chatId].deck[user] = bjConfig[chatId].deck[user].filter(h => h !== Played_Card);
							await mandarFig(kill, chatId, `https://github.com/KillovSky/Iris_Files/raw/main/Cards/${Played_Card}.png`, stickerConfig);
							await kill.sendTextWithMentions(chatId, mess.BlackJack_Droped(sender, args, bjConfig, chatId));
						} else if (argl[0] == '-get' && bjConfig[chatId].validPlayers.includes(bjConfig[chatId].atualPlayer) && bjConfig[chatId].atualPlayer == user) {
							bjConfig[chatId].haveDeck.push(user);
							var newCard = '5C';
							newCard = tools('blackjack').randomDeck()[0];
							if (bjConfig[chatId].deck[user].includes(newCard)) {
								newCard = tools('blackjack').randomDeck()[0];
								if (bjConfig[chatId].deck[user].includes(newCard)) {
									newCard = tools('blackjack').randomDeck()[0];
								}
							}
							bjConfig[chatId].deck[user].push(newCard);
							let checkWin = tools('blackjack').getValue(bjConfig[chatId], user);
							if (checkWin > 21) {
								await mandarFig(kill, chatId, `https://github.com/KillovSky/Iris_Files/raw/main/Cards/${newCard}.png`, stickerConfig);
								await kill.reply(chatId, mess.BlackJack_Bypass(newCard), id);
								bjConfig[chatId].validPlayers = bjConfig[chatId].validPlayers.filter(f => f !== bjConfig[chatId].atualPlayer);
								if (bjConfig[chatId].validPlayers.length < 2) {
									await kill.sendTextWithMentions(chatId, mess.BlackJack_EndPlayers(bjConfig, chatId));
									return resetDeck(chatId);
								}
							} else if (checkWin == 21) {
								await mandarFig(kill, chatId, `https://github.com/KillovSky/Iris_Files/raw/main/Cards/${newCard}.png`, stickerConfig);
								await kill.sendTextWithMentions(chatId, mess.BlackJack_Winner(bjConfig, chatId));
								return resetDeck(chatId);
							} else {
								await mandarFig(kill, chatId, `https://github.com/KillovSky/Iris_Files/raw/main/Cards/${newCard}.png`, stickerConfig);
								await kill.sendText(user, mess.BlackJack_Deck(bjConfig, chatId, sender));
								await kill.sendTextWithMentions(chatId, mess.BlackJack_Receive(bjConfig, chatId));
							}
						} else if (argl[0] == '-pass' && bjConfig[chatId].validPlayers.includes(bjConfig[chatId].atualPlayer) && bjConfig[chatId].atualPlayer == user) {
							bjConfig[chatId].haveDeck.push(user);
							await kill.sendTextWithMentions(chatId, mess.BlackJack_Pass(bjConfig, chatId));
						} else if (argl[0] == '-join' && bjConfig[chatId].isPlaying == false) {
							bjConfig[chatId].players.push(user);
							await kill.reply(chatId, mess.BlackJack_Invited(bjConfig, chatId), id);
						} else await kill.reply(chatId, mess.Not_Your_Turn(), id);
					} else if (!isGroupMsg) {
						let playerExist = Object.keys(bjConfig).map(j => j).map(g => bjConfig[g].players.includes(user)).indexOf(true);
						if (playerExist == -1) return await kill.reply(chatId, mess.Not_Player(), id);
						let lugarJ = Object.keys(bjConfig)[playerExist];
						if (argl[0] == '-mydeck' && bjConfig[lugarJ].isPlaying == true && bjConfig[lugarJ].players.includes(user) && !Object.keys(bjConfig[lugarJ].deck).includes(user)) {
							bjConfig[lugarJ].validPlayers.push(user);
							bjConfig[lugarJ].deck[user] = tools('blackjack').randomDeck();
							await kill.reply(chatId, mess.BlackJack_Cards(bjConfig, lugarJ, sender), id);
						} else if (!bjConfig[lugarJ].players.includes(user)) {
							await kill.reply(chatId, mess.TimeOut_Game(), id);
						} else await kill.reply(chatId, mess.IsReally_Here(), id);
					}
				break;

				case 'couple':
					const theCouple = tools('others').randomNumber(1, 113);
					await kill.sendFileFromUrl(chatId, `https://github.com/KillovSky/Iris_Files/raw/main/Couple/${theCouple}.1.jpg`, 'couple.jpg', 'Você completa...', id);
					await kill.sendFileFromUrl(chatId, `https://github.com/KillovSky/Iris_Files/raw/main/Couple/${theCouple}.2.jpg`, 'couple.jpg', '...meu coração.', id);
				break;

				// Feito por mim com ajuda de Pedro B.
				case 'nocmd':
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						if (!['on', 'off', 'disable', 'enable', 'show'].includes(argl[0])) return await kill.reply(chatId, mess.disCMD(), id);
						if (!allCommands.includes(argl[1]) || Object.keys(cmds.global).includes(argl[1]) || blockcmd.no.includes(argl[1])) return await kill.reply(chatId, mess.disCMD_Refuse(), id);
						if (!Object.keys(blockcmd.yes).includes(chatId)) {
							blockcmd.yes[chatId] = [];
						}
						const Command_Disable = argl[1];
						if (argl[0] == 'off') {
							if (blockcmd.yes[chatId].includes(Command_Disable)) return await kill.reply(chatId, mess.jadisabled(), id);
							blockcmd.yes[chatId].push(Command_Disable);
							await kill.reply(chatId, mess.disabled(), id);
							fs.writeFileSync('./lib/config/Gerais/disable.json', JSON.stringify(blockcmd, null, "\t"));
						} else if (argl[0] == 'on') {
							if (!blockcmd.yes[chatId].includes(Command_Disable)) return await kill.reply(chatId, mess.jaenabled(), id);
							blockcmd.yes[chatId] = blockcmd.yes[chatId].filter(d => d !== Command_Disable);
							await kill.reply(chatId, mess.enabled(), id);
							fs.writeFileSync('./lib/config/Gerais/disable.json', JSON.stringify(blockcmd, null, "\t"));
						} else if (argl[0] == 'disable') {
							if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
							if (blockcmd.global.includes(Command_Disable)) return await kill.reply(chatId, mess.jadisabled(), id);
							blockcmd.global.push(Command_Disable);
							fs.writeFileSync('./lib/config/Gerais/disable.json', JSON.stringify(blockcmd, null, "\t"));
						} else if (argl[0] == 'enable') {
							if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
							if (!blockcmd.global.includes(Command_Disable)) return await kill.reply(chatId, mess.jaenabled(), id);
							blockcmd.global = blockcmd.global.filter(d => d !== Command_Disable);
							await kill.reply(chatId, mess.enabled(), id);
							fs.writeFileSync('./lib/config/Gerais/disable.json', JSON.stringify(blockcmd, null, "\t"));
						} else if (argl[0] == 'show') {
							if (blockcmd.yes[chatId].length !== 0) return await kill.reply(chatId, mess.disCMD_Nothing(), id);
							await kill.reply(chatId, mess.disCMD_List(blockcmd, chatId), id);
						} else await kill.reply(chatId, mess.disCMD(), id);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;

				case 'afk':
					if (args.length == 0 || argl[0] == '-help') return await kill.reply(chatId, mess.AFK_Usage(), id);
					if (argl[0] == 'on') {
						if (args.length <= 1) {
							if (Object.keys(afk).includes(user)) {
								afk[user].enabled = true;
							} else await kill.reply(chatId, mess.AFK_Usage(), id);
						} else {
							afk[user] = {
								"name": (pushname || user),
								"enabled": true,
								"message": body.slice(cmd.length+4)
							};
							fs.writeFileSync('./lib/config/Gerais/AFK.json', JSON.stringify(afk, null, "\t"));
							await kill.reply(chatId, mess.enabled(), id);
						}
					} else if (argl[0] == 'off') {
						if (!Object.keys(afk).includes(user)) return await kill.reply(chatId, mess.AFK_NotExist(), id);
						afk[user].enabled = false;
						fs.writeFileSync('./lib/config/Gerais/AFK.json', JSON.stringify(afk, null, "\t"));
						await kill.reply(chatId, mess.disabled(), id);
					} else await kill.reply(chatId, mess.AFK_Usage(), id);
				break;
		
				case 'event':
					await kill.reply(chatId, randEven.description, id);
				break;

				case 'nostatus':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					let deleteSts = await kill.deleteAllStatus();
					if (deleteSts) {
						if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
					} else await kill.reply(chatId, mess.Del_Status(), id);
				break;

				case 'banner':
					if (isType('image')) {
						const mediaData = await decryptMedia(encryptMedia);
						await kill.sendBanner(chatId, tools('others').dataURI('image/png', mediaData));
					} else await kill.reply(chatId, mess.onlyimg(), id);
				break;

				case 'sendmoji':
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'discord emoji-ID.', id);
					await kill.sendEmoji(chatId, args[0]).catch(async (e) => {
						await kill.reply(chatId, mess.Emoji_Disc(), id);
					});
				break;

				case 'ocr':
					if (!isType('image') && tools('others').isUrl(args[0])) return await kill.reply(chatId, mess.onlyimg(), id);
					try {
						var typeScanning = isType('image') ? await decryptMedia(encryptMedia) : args[0];
						const OCR_Scanned = await tesseract.recognize(typeScanning);
						await kill.reply(from, mess.sucessOCR(OCR_Scanned), id);
					} catch (err) {
						tools('others').reportConsole(cmd, err);
						await kill.reply(chatId, mess.failOCR(err.message), id);
					}
				break;

				// Agradecimentos ao "DUCK DEV - patulinomods" por me lembrar da construção desde comando
				case 'pin':
					if (!isOwner) return await kill.reply(chatId, mess.sodono(), id);
					if (argl[0] == 'on') {
						if (args.length <= 1) {
							let pinWork = await kill.pinChat(chatId, true);
							if (pinWork == true) {
								await kill.reply(chatId, mess.PinLocal_Work(), id);
							} else await kill.reply(chatId, mess.PinLocal_Fail(mess.Pin_Chat(), pinWork), id);
						} else {
							let pinWork = await kill.pinChat(argl[1], true);
							if (pinWork == true) {
								await kill.reply(chatId, mess.PinID_Work(argl), id);
							} else await kill.reply(chatId, mess.PinID_Fail(argl, pinWork), id);
						}
					} else if (argl[0] == 'off') {
						if (args.length <= 1) {
							let pinWork = await kill.pinChat(chatId, false);
							if (pinWork == true) {
								await kill.reply(chatId, mess.NoPinLocal_Work(), id);
							} else await kill.reply(chatId, mess.NoPinLocal_Fail(mess.Pin_Chat(), pinWork), id);
						} else {
							let pinWork = await kill.pinChat(argl[1], false);
							if (pinWork == true) {
								await kill.reply(chatId, mess.NoPinID_Work(argl), id);
							} else await kill.reply(chatId, mess.NoPinID_Fail(argl, pinWork), id);
						}
					} else await kill.reply(chatId, mess.Pin_Chat(), id);
				break;
		
				case 'newchar':
					if (!args.includes("-name") || !args.includes("-gender") || !args.includes("-class") || !args.includes("-race") || argl[0] == '-help') return await kill.reply(chatId, mess.Char_Usage(), id);
					if (!rpgJson.gender.includes(argl[argl.indexOf('-gender')+1])) return await kill.reply(chatId, mess.Char_GenInexist(), id);
					if (!rpgJson.classes.includes(argl[argl.indexOf('-class')+1])) return await kill.reply(chatId, mess.Char_ClassInexist(), id);
					if (!rpgJson.races.includes(argl[argl.indexOf('-race')+1])) return await kill.reply(chatId, mess.Char_RaceInexist(), id);
					let Char_Done = false;
					if (!Object.keys(CharInfo).includes(chatId)) {
						CharInfo[chatId] = {};
					}
					if (!Object.keys(CharInfo[chatId]).includes(user)) {
						var skillG = tools('others').randVal(rpgJson.base.all);
						var weapoRar = tools('others').randVal(rpgJson.items.sword.types);
						var weaponName = tools('others').randVal(rpgJson.items.sword.names[weapoRar]);
						var skillT = tools('others').randVal(rpgJson.skills[skillG].list);
						var actual_Place = tools('others').randVal(rpgJson.places.list);
						var Secondary_Place = tools('others').randVal(rpgJson.places[actual_Place].list);
						CharInfo[chatId][user] = {
							"name": argl[argl.indexOf('-name')+1],
							"gender": argl[argl.indexOf('-gender')+1],
							"class": argl[argl.indexOf('-class')+1],
							"race": argl[argl.indexOf('-race')+1],
							"f_place": actual_Place,
							"s_place": Secondary_Place,
							"skill": skillT,
							"skill_type": skillG,
							"weapon": weaponName,
							"weapon_rar": weapoRar,
							"weapon_from": rpgJson.items.sword.desc[weapoRar][weaponName].from,
							"enemy": false,
							"vit": Number(rpgJson.base.vit) + Number(rpgJson.effect[argl[argl.indexOf('-class')+1]].vit),
							"dex": Number(rpgJson.base.dex) + Number(rpgJson.effect[argl[argl.indexOf('-class')+1]].dex),
							"int": Number(rpgJson.base.int) + Number(rpgJson.effect[argl[argl.indexOf('-class')+1]].int),
							"per": Number(rpgJson.base.per) + Number(rpgJson.effect[argl[argl.indexOf('-class')+1]].per),
							"car": Number(rpgJson.base.car) + Number(rpgJson.effect[argl[argl.indexOf('-class')+1]].car),
							"str": Number(rpgJson.base.str) + Number(rpgJson.effect[argl[argl.indexOf('-class')+1]].str)
						};
						fs.writeFileSync('./lib/config/Gerais/characters.json', JSON.stringify(CharInfo, null, "\t"));
						Char_Done = CharInfo[chatId][user];
					} else {
						Char_Done = CharInfo[chatId][user];
					}
					await kill.sendFileFromUrl(chatId, rpgJson.places[Char_Done.f_place][Char_Done.s_place].image, 'rpg.jpg', mess.Char_Info(Char_Done, rpgJson), id);
				break;
		
				case 'mychar':
					if (!Object.keys(CharInfo).includes(chatId)) {
						CharInfo[chatId] = {};
					}
					if (!Object.keys(CharInfo[chatId]).includes(user)) return await kill.reply(chatId, mess.Char_First(), id);
					let Char_Get = CharInfo[chatId][user];
					await kill.sendFileFromUrl(chatId, rpgJson.places[Char_Get.f_place][Char_Get.s_place].image, 'rpg.jpg', mess.Char_Info(Char_Get, rpgJson), id);
				break;
		
				case 'fight':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (!args.includes("-attack") && !args.includes("-show") && !args.includes("-run") && !args.includes("-cure") || argl[0] =="-help") return await kill.reply(chatId, mess.Fight_Usage(), id); // Para lembrete futuro = "-item" ou "-magia" | && !args.includes("-item") && !args.includes("-magia")
					if (!Object.keys(CharInfo).includes(chatId)) {
						CharInfo[chatId] = {};
					}
					if (!Object.keys(Fights).includes(chatId)) {
						Fights[chatId] = {};
					}
					if (!Object.keys(CharInfo[chatId]).includes(user)) return await kill.reply(chatId, mess.Char_First(), id);
					let Char_Boss = CharInfo[chatId][user];
					var The_Boss = Fights[chatId][user];
					if (!Object.keys(Fights[chatId]).includes(user)) {
						var choise_boss = tools('others').randVal(rpgJson.places[Char_Boss.f_place][Char_Boss.s_place].bosses);
						The_Boss = rpgJson.places[Char_Boss.f_place][Char_Boss.s_place].enemy[choise_boss];
						CharInfo[chatId][user].enemy = choise_boss;
						Fights[chatId][user] = The_Boss;
						fs.writeFileSync('./lib/config/Gerais/characters.json', JSON.stringify(CharInfo, null, "\t"));
						fs.writeFileSync('./lib/config/Gerais/fights.json', JSON.stringify(Fights, null, "\t"));
					}
					if (argl.includes("-show")) {
						await kill.sendFileFromUrl(chatId, The_Boss.image, 'rpg.jpg', mess.Fight_Opponent(Char_Boss, The_Boss, rpgJson), id);
					} else if (argl.includes("-attack")) {
						let userLl_Power = tools('gaming').getValue(user, chatId, null); // Ataque mínimo conforme LVL
						let attack_power = tools('others').randomNumber(userLl_Power.level, Number(Char_Boss.str));
						let npc_act = tools('others').randVal(['fight', 'run', 'pass', 'cure']);
						if (npc_act == 'run') {
							if (The_Boss.stats.vit >= 20) {
								npc_act = tools('others').randVal(['fight', 'pass', 'cure']); // So foge se a vida tiver abaixo de 20
							}
						}
						if (npc_act == 'pass') {
							if (The_Boss.stats.vit <= 70) {
								npc_act = tools('others').randVal(['fight', 'pass', 'cure']); // So zomba do player se a vida tiver acima de 70
							}
						}
						let is_Fighter = mess.Fight_Damage(attack_power, Char_Boss);
						if (npc_act == 'fight') {
							let boss_pow = tools('others').randomNumber(1, Number(The_Boss.stats.str));
							The_Boss.stats.vit = Number(The_Boss.stats.vit) - attack_power;
							Char_Boss.vit = Number(Char_Boss.vit) - boss_pow;
							is_Fighter += mess.Fight_Back(Char_Boss, boss_pow);
						} else if (npc_act == 'run') {
							await kill.reply(chatId, mess.Fight_BossRun(), id);
						} else if (npc_act == 'pass') {
							await kill.reply(chatId, mess.Fight_BossHaHa(), id);
						} else if (npc_act == 'cure') {
							let cure_level = tools('others').randomNumber(1, (Number(Char_Boss.vit) / 2) + 10);
							The_Boss.stats.vit = Number(The_Boss.stats.vit) + cure_level;
							await kill.reply(chatId, mess.Fight_BossCure(cure_level), id);
						}
						await kill.sendText(chatId, mess.Fight_Result(is_Fighter, The_Boss, rpgJson, Char_Boss));
						if (The_Boss.stats.vit <= 0) {
							await kill.reply(chatId, mess.Fight_Win(), id);
							delete Fights[chatId][user];
						}
						if (Char_Boss.vit <= 0) {
							await kill.reply(chatId, mess.Fight_Lose(), id);
							delete Fights[chatId][user];
							delete CharInfo[chatId][user];
						}
						fs.writeFileSync('./lib/config/Gerais/characters.json', JSON.stringify(CharInfo, null, "\t"));
						fs.writeFileSync('./lib/config/Gerais/fights.json', JSON.stringify(Fights, null, "\t"));
					} else if (argl.includes("-run")) {
						delete Fights[chatId][user];
						await kill.reply(chatId, mess.Fight_Run(), id);
						fs.writeFileSync('./lib/config/Gerais/fights.json', JSON.stringify(Fights, null, "\t"));
					} else if (argl.includes('-cure')) {
						let Game_Level_C = tools('gaming').getValue(user, chatId, null);
						let The_Cure = tools('others').randomNumber(Game_Level_C.level, (Number(Char_Boss.vit) / 2) + 10); // Cura baseada no LVL
						Char_Boss.vit = Number(Char_Boss.vit) + The_Cure;
						await kill.reply(chatId, mess.Fight_Cure(The_Cure), id);
						fs.writeFileSync('./lib/config/Gerais/characters.json', JSON.stringify(CharInfo, null, "\t"));
						fs.writeFileSync('./lib/config/Gerais/fights.json', JSON.stringify(Fights, null, "\t"));
					} else return await kill.reply(chatId, mess.Fight_Usage(), id);
				break;
		
				case 'casar':
					if (argl[0] == '-help' || args.length == 0) return await kill.reply(chatId, mess.Casar_Usage(), id);
					if (!quotedMsgObj && mentionedJidList.length == 0) return await kill.reply(chatId, mess.semmarcar(), id);
					const happyToYou = mentionedJidList ? mentionedJidList[0] : (quotedMsgObj ? quotedMsgObj.sender.id : false);
					const timeToEnd = mentionedJidList.length >= 1 ? argl[0] : (quotedMsgObj ? argl[1] : argl[0]);
					if (happyToYou == false || isNaN(timeToEnd) || Number(timeToEnd) > 60000) return await kill.reply(chatId, mess.Casar_Usage(), id);
					if (married.all.includes(user)) {
						await kill.reply(chatId, mess.Casar_Married(), id);
					} else if (married.all.includes(happyToYou)) {
						await kill.reply(chatId, mess.Casar_Casada(), id);
					} else if (marryOngoing.includes(user)) {
						await kill.reply(chatId, mess.Casar_Waiting(), id);
					} else if (user == happyToYou) {
						await kill.reply(chatId, mess.Casar_Narcis(), id);
					} else if (happyToYou == botNumber) {
						if (isOwner) return await kill.reply(chatId, mess.Casar_LoveYou(), id);
						await kill.sendTextWithMentions(chatId, mess.Casar_NoLoveYou());
					} else {
						const Loving_Name = mentionedJidList.length !== 0 ? mentioned_name : (quotedMsgObj ? quotedMsgObj.sender.pushname : pushname);
						const votoCasa = arks.includes('|') ? arg.split('|')[1] : mess.Casar_StockVotes();
						marryOngoing.push(user, happyToYou);
						var The_Button = 'Nada Aqui';
						if (sesConfig.Multi_Devices == true) {
							await kill.sendTextWithMentions(chatId, mess.Casar_StockVotes(votoCasa, happyToYou));
						} else {
							await kill.sendTextWithMentions(chatId, mess.Casar_VotesButton(happyToYou));
							The_Button = await kill.sendButtons(chatId, `"${votoCasa}"`, [
								{
									"id": "1",
									"text": `😍 ${tools('others').yesAwnsers()} ❤️`
								},
								{
									"id": "2",
									"text": `${tools('others').noAwnsers()}, ECA! 🤮`
								},
								{
									"id": "3",
									"text": "🏳️‍🌈 ${mess.Iam_Gay()} 🏳️‍🌈"
								}
							], mess.Casar_VotePartT(), mess.Choice_Bete('sim', 'nao', 'gay', '5'));
						}
						const MarryBID = The_Button;
						var isCorrect = msgw => tools('others').filterMsg(msgw, happyToYou, chatId, MarryBID, /sim|si|yes|no|not|nao|gay/gi);
						kill.awaitMessages(chatId, isCorrect, {
							max: 1,
							time: 300000,
							errors: ['time']
						}).then(async col => {
							if (/sim|si|yes/gi.test(removeAccents(Array.from(col)[0][1].body))) {
								await kill.sendTextWithMentions(chatId, mess.Casar_Accept(happyToYou, col, timeToEnd, sender));
								married.all.push(user, happyToYou);
								married.persons[user] = {
									'place': chatId,
									'love': happyToYou,
									'request': user,
									'love_name': Loving_Name,
									'request_name': pushname,
									'startedAt': moment().unix(),
									'finishAt': moment().add(timeToEnd, 'minutes').unix(),
								};
								fs.writeFileSync('./lib/config/Gerais/marry.json', JSON.stringify(married, null, "\t"));
							} else if (/no|not|nao|gay/gi.test(removeAccents(Array.from(col)[0][1].body))) {
								await kill.sendTextWithMentions(chatId, mess.Casar_Refuse(sender, col));
							}
						}).catch(async collected => {
							await kill.sendTextWithMentions(chatId, mess.Casar_Timeout(sender));
						});
						marryOngoing = marryOngoing.filter(k => k !== user && k !== happyToYou);
					}
				break;
		
				case 'marry':
					if (Object.keys(married.persons).length >= 1) {
						let coupleCa = Object.keys(married.persons).map(i => mess.Marry_Couple(married, i)).join('');
						await kill.sendTextWithMentions(chatId, coupleCa);
					} else await kill.reply(chatId, mess.Marry_Nothing(), id);
				break;
		
				case 'divorcio':
				case 'divorce':
				case 'acordo':
					if (onDivorce.includes(user)) return await kill.reply(chatId, mess.Divorce_Wait(), id);
					if (argl[0] == '-help' || args.length == 0) return await kill.reply(chatId, mess.Divorce_Usage(), id);
					const isTrat = Object.keys(married.persons).filter(p => married.persons[p].love == user || married.persons[p].request == user);
					if (isTrat.length >= 1) {
						var devilWork = '';
						if (user == married.persons[isTrat[0]].request) {
							devilWork = married.persons[isTrat[0]].love;
						} else if (user == married.persons[isTrat[0]].love) {
							devilWork = married.persons[isTrat[0]].request;
						}
						onDivorce.push(user, devilWork);
						var orcID = 'Nothing here sir';
						if (sesConfig.Multi_Devices == true) {
							await kill.sendTextWithMentions(chatId, mess.Divorce_Start(sender, devilWork, Sliced_Body));
						} else {
							await kill.sendTextWithMentions(chatId, `@${devilWork.replace('@c.us', '')}`);
							orcID = await kill.sendButtons(chatId, mess.Divorce_Button(Sliced_Body), [
								{
									"id": "1",
									"text": `✔️ ${tools('others').yesAwnsers()} ✔️`
								},
								{
									"id": "2",
									"text": `✖️ ${tools('others').noAwnsers()} ✖️`
								},
								{
									"id": "2",
									"text": `✖️ Alterar/Cancelar ✖️`
								}
							], mess.Divorce_Request(), mess.Choice_Bete('sim', 'nao', 'cancelar', '5'));
						}
						const DivoBID = orcID;
						const BadLifes = devilWork;
						var willAccept = msgw => tools('others').filterMsg(msgw, BadLifes, chatId, DivoBID, /sim|si|yes|no|not|nao|cancelar|alterar/gi);
						kill.awaitMessages(chatId, willAccept, {
							max: 1,
							time: 300000,
							errors: ['time']
						}).then(async col => {
							if (/sim|si|yes/gi.test(removeAccents(Array.from(col)[0][1].body))) {
								await kill.sendTextWithMentions(chatId, mess.Divorce_Accept(BadLifes, col));
							} else if (/cancelar|alterar/gi.test(removeAccents(Array.from(col)[0][1].body))) {
								return await kill.sendTextWithMentions(chatId, mess.Divorce_Cancel(sender, col));
							} else if (/no|not|nao/gi.test(removeAccents(Array.from(col)[0][1].body))) {
								await kill.sendTextWithMentions(chatId, mess.Divorce_Refuse(sender, col));
								let maridUsr = tools('gaming').getValue(user, chatId, null);
								let EsposUsr = tools('gaming').getValue(BadLifes, chatId, null);
								let finalValuSep = {};
								Object.keys(maridUsr).filter(k => k !== 'guild').map(key => finalValuSep[key] = Number(parseInt(maridUsr[key] + EsposUsr[key]) / 2));
								tools('gaming').resetValue(user, chatId);
								tools('gaming').resetValue(BadLifes, chatId);
								Object.keys(maridUsr).filter(k => k !== 'guild' && k !== 'level' && k !== 'msg').map(val => {
									if (finalValuSep[val] !== 0) {
										tools('gaming').addValue(user, parseInt(finalValuSep[val]), chatId, val);
										tools('gaming').addValue(BadLifes, parseInt(finalValuSep[val]), chatId, val);
									}
								});
								married.all = married.all.filter(i => i !== user && i !== married.persons[isTrat[0]].love && i !== married.persons[isTrat[0]].request);
								delete married.persons[isTrat[0]];
								fs.writeFileSync('./lib/config/Gerais/marry.json', JSON.stringify(married, null, "\t"));
							}
						}).catch(async collected => {
							await kill.sendTextWithMentions(chatId, mess.Divorce_Timeout(BadLifes, sender));
						});
						onDivorce = onDivorce.filter(k => k !== user && k !== BadLifes);
					} else if (married.all.includes(user)) {
						married.all = married.all.filter(i => i !== user);
						fs.writeFileSync('./lib/config/Gerais/marry.json', JSON.stringify(married, null, "\t"));
						await kill.reply(chatId, mess.Divorce_Wait(), id);
					} else return await kill.reply(chatId, mess.Divorce_Inexist(), id);
				break;
		
				case 'morrepraga':
				case 'morre':
				case 'praga':
				case 'dieplague':
				case 'die':
				case 'plague':
					let plagueRE4 = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').morrepraga(plagueRE4[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `praga.png`, ``, id));
				break;

				case 'invert':
					let hirakoBC = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').invert(hirakoBC[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `invert.png`, ``, id));
				break;

				case 'drake':
					let xDrakeOP = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 2);
					await tools('canvas').drake(xDrakeOP[0], xDrakeOP[1]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `drake.png`, ``, id));
				break;

				case 'bolso1':
					let bolso1 = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').bolso1(bolso1[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `bolso1.png`, '', id));
				break;

				case 'bolso2':
					let bolso2 = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').bolso2(bolso2[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `bolso2.png`, '', id));
				break;

				case 'bolso3':
					let bolso3 = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').bolso3(bolso3[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `bolso3.png`, '', id));
				break;

				case 'bob':
				case 'esponja':
				case 'sponge':
					let spongebobo = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').sponge(spongebobo[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `bolso3.png`, '', id));
				break;

				case 'briggs':
					let briggs = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').briggs(briggs[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `briggs.png`, '', id));
				break;

				case 'ednaldo':
				case 'bandeira':
					let flag = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').ednaldoBandeira(flag[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `ednaldoEuTeAmo.png`, '', id));
				break;

				case 'edit':
					if (args.length == 0) return await kill.reply(chatId, tools('others').tablefy(mess.Edit_Usage(), 'Definição'), id);
					var position = 'centre';
					if (/at|attention|att/.test(arks)) {
						position = 'attention';
					} else if (/ent|entropy/.test(arks)) {
						position = 'entropy';
					} else if (/top|t/.test(arks)) {
						position = 'top';
					} else if (/right|r/.test(arks)) {
						position = 'right';
					} else if (/bottom|b/.test(arks)) {
						position = 'bottom';
					} else if (/centre|c/.test(arks)) {
						position = 'centre';
					} else {
						position = 'centre';
					}
					const Final_POS = position;
					const mediaData_edit = await decryptMedia(encryptMedia);
					if (arks.includes('fit') || args[0].includes(':')) {
						await tools('canvas').imgEditor(mediaData_edit, args[0].includes(':') ? args[0].split(':')[0] : 0, args[0].includes(':') ? args[0].split(':')[1] : 0, arks.includes('fit') ? true : false).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `scale-to-fit.png`, '', id));
					} else {
						const image = await sharp(mediaData_edit);
						image.metadata().then(metadata => {
							var width = metadata.width < metadata.height ? metadata.width : metadata.height;
							var height = metadata.width < metadata.height ? metadata.width : metadata.height;
							image.resize(width, height+2, {
								fit: sharp.fit.cover,
								position: Final_POS
							})
							.toFormat('png')
							.toBuffer()
							.then(async (resizedImageBuffer) => await kill.sendImage(chatId, tools('others').dataURI('image/png', resizedImageBuffer), 'sharpimage.png', '', id));
						});
					}
				break;

				case 'ednaldotv':
				case 'tv':
				case 'televisao':
					let tv = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').ednaldoTV(tv[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `ednaldoEuTeAmo.png`, '', id));
				break;

				case 'mark':
					let markinho = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').markSuckerberg(markinho[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `markinho.png`, '', id));
				break;

				case 'paper':
					let passpaper = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').paper(passpaper[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `passingpaper.png`, '', id));
				break;

				case 'pepe':
					let peped = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').pepe(peped[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `pepe.png`, '', id));
				break;

				case 'shot':
					let shot = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').shotTV(shot[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `shotTV.png`, '', id));
				break;

				case 'romero':
					let romero = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').romero(romero[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `romero.png`, '', id));
				break;

				case 'wolverine':
					let garraGato = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').wolverine(garraGato[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `wolve.png`, ``, id));
				break;

				case 'bolsonaro':
					let bolsonAro13 = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 2);
					await tools('canvas').bolsonero(bolsonAro13[0], bolsonAro13[1]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `bolsonaro.png`, ``, id));
				break;

				case 'medal':
					try {
						const getMedal = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 2);
						await tools('canvas').medal(getMedal[0], getMedal[1]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `medal.png`, '', id));
					} catch (error) {
						tools('others').reportConsole(cmd, error);
						await kill.reply(chatId, mess.fail(cmd, error, time), id);
					}
				break;

				case 'jooj':
					let terraForm = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').jooj(terraForm[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `jooj.png`, ``, id));
				break;

				case 'ojjo':
					let ojjoImage = await tools('profile').getProfilePic(kill, isType('image'), encryptMedia, quotedMsgObj, quotedMsgObj, mentionedJidList, sender, botNumber, groupMembersId, 1);
					await tools('canvas').ojjo(ojjoImage[0]).then(async (buffer) => await kill.sendFile(chatId, tools('others').dataURI('image/png', buffer), `ojjo.png`, ``, id));
				break;
		
				case 'react':
					//if (!sesConfig.Multi_Devices) return await kill.reply(chatId, `A função de reagir somente funciona com o WhatsApp em 'Múltiplos Dispositivos'.`, id);
					if (args.length == 0) return await kill.reply(chatId, mess.noargs() + 'emoji.', id);
					if (isGroupMsg && isGroupAdmins || isGroupMsg && isOwner || isGroupMsg && Can_Run_CMD(cmd)) {
						let Get_Mojis = extmoji(args[0]);
						if (Get_Mojis.length == 0) return await kill.reply(chatId, mess.noargs() + 'emoji.', id);
						let Message_ReID = quotedMsgObj ? quotedMsgObj.id : id;
						await kill.react(Message_ReID, Get_Mojis[0].name);
					} else if (isGroupMsg) {
						await kill.reply(chatId, mess.soademiro(), id);
					} else await kill.reply(chatId, mess.sogrupo(), id);
				break;
		
				case 'whois':
					await animeCharacter.getRandomChar(async (chr) => {
						await kill.sendFileFromUrl(chatId, chr.image, 'Char.jpg', mess.Charada_Quiz(chr), id);
						let nameChar_ID = chr.name.includes(',') ? chr.name.split(',') : chr.name.split(' ');
						let Quiz_Filter = msgw => msgw.from == chatId && (new RegExp(`${nameChar_ID.at(-1).toLowerCase().replace(' ', '')}`, 'gim')).test(removeAccents(msgw.body));
						kill.awaitMessages(chatId, Quiz_Filter, {
							max: 1,
							time: 600000,
							errors: ['time']
						}).then(async cbodyx => await kill.sendReplyWithMentions(chatId, mess.Charada_Wins(cbodyx, nameChar_ID, chr), Array.from(cbodyx)[0][1].id)).catch(async m => await kill.reply(chatId, mess.timeEndedDP(), id));
					});
				break;
		
				case 'mw':
					var FBI_Data = await axios.get(`https://api.fbi.gov/wanted/v1/list?page=${tools('others').randomNumber(1, 49)}`).then(d => JSON.parse(JSON.stringify(d.data)));
					FBI_Data = tools('others').randVal(FBI_Data.items);
					await kill.sendFileFromUrl(chatId, FBI_Data.images[0].original, 'fbi.jpg', mess.FBI_Search(FBI_Data), id).catch(async (err) => await kill.sendText(chatId, mess.FBI_Search(FBI_Data)));
				break;
		
				case 'minerar':
					if (args.length == 0 || argl[0] == '-help') return await kill.reply(chatId, mess.noargs() + 'nome de picareta.', id);
					await tools('mining').miner(kill, message, chatId, user, 'new', argl[0]);
				break;
		
				case 'exist':
				case 'exists':
					if (args.length == 0 || argl[0] == '-help') return await kill.reply(chatId, mess.noargs() + 'número WhatsApp.', id);
					let check_nw = args[0].replace(/->/g, '').replace(/@/g, '').replace(/c.us/g, '').replace(/-/g, '').replace(/\+/g,'').replace(/ /g, '').split('').join('').replace(/\n/g, ' ').split(' ').filter(o => !isNaN(o) && o !== '' && o);
					let check_number_wa = await kill.checkNumberStatus(`${check_nw}@c.us`);
					if (check_number_wa.numberExists) {
						await kill.reply(chatId, mess.ExistOK_Number(check_number_wa), id);
					} else return await kill.reply(chatId, mess.ExistNO_Number(check_nw), id);
				break;
		
				case 'register':
					if (args.length <= 1 || !arks.includes('|') || argl[0] == '-help') return await kill.reply(chatId, `Para se registrar digite o comando, seu nome e data de nascimento em formato "Dia/Mês/Ano [DD/MM/YYYY]" (para o sistema de aniversario e idade) separados por '|', após isso te mandarei os detalhes do seu registro.\nExemplo -> "${prefix}Register Silver | 31/12/1980"`, id);
					if (Object.keys(register).includes(user)) return await kill.reply(chatId, `Você já está registrado, sua ID é "${register[user].id}".`, id);
					if (moment(arg.split('|')[1].replace(' ', ''), 'DD/MM/YYYY').toString('') == 'Invalid date') return await kill.reply(chatId, `Sua data de nascimento é invalida, ajuste corretamente.`, id);
					register[user] = {
						"name": arg.split('|')[0],
						"niver": moment(arg.split('|')[1].replace(' ', ''), 'DD/MM/YYYY').format('DD/MM/YYYY'),
						"age": (moment().format('YYYY')-moment(arg.split('|')[1].replace(' ', ''), 'DD/MM/YYYY').format('YYYY')),
						"id": Object.keys(register).length + 1
					};
					if (Object.keys(functions.birthdays).includes(user)) {
						register[user].niver = functions.birthdays[user].date + '/' + functions.birthdays[user].year;
						register[user].age = (moment().format('YYYY')-moment(register[user].niver, 'DD/MM/YYYY').format('YYYY'));
					}
					var My_Res_BTID = 'Nothing';
					if (sesConfig.Multi_Devices == true) {
						await kill.sendText(chatId, `✔️ → Ok, as informações abaixo estão corretas? Caso não esteja digite não, se estiver digite sim em no máximo, uma hora!\n\n📚 → Seu nome é "${register[user].name}" e...\n\n🏥 → Você nasceu em "${register[user].niver}" e...\n\n👶 → Você possui aproximadamente "${register[user].age}" anos de idade?`);
					} else {
						My_Res_BTID = await kill.sendButtons(chatId, `✔️ → Ok, as informações abaixo estão corretas? Caso não esteja digite não, se estiver digite sim em no máximo, uma hora!\n\n`, [
							{
								"id": "1",
								"text": `✔️ ${tools('others').yesAwnsers()} ✔️`
							},
							{
								"id": "2",
								"text": "✖️ ${tools('others').noAwnsers()} ✖️"
							}
						], `📚 → Seu nome é "${register[user].name}" e...\n\n🏥 → Você nasceu em "${register[user].niver}" e...\n\n👶 → Você possui aproximadamente "${moment().format('YYYY')-moment(register[user].niver).format('YYYY')}" anos de idade?`, mess.Choice_Bete('sim', 'nao', 'cancelar', '60'));
					}
					const RegiBID = My_Res_BTID;
					let Filter_Regis = msgw => tools('others').filterMsg(msgw, user, chatId, RegiBID, /sim|si|yes|no|not|nao|cancelar/gi);
					kill.awaitMessages(chatId, Filter_Regis, {
						max: 1,
						time: 3600000,
						errors: ['time']
					}).then(async (c) => {
						if (/sim|si|yes/gim.test(removeAccents(Array.from(c)[0][1].body))) {
							if (!Object.keys(functions.birthdays).includes(user)) {
								functions.birthdays[user] = {
									"date": moment(register[user].niver, 'DD/MM/YYYY').format('DD/MM'),
									"year": moment(register[user].niver, 'DD/MM/YYYY').format('YYYY'),
									"last_check": "never"
								};
								fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
							}
							fs.writeFileSync("./lib/config/Gerais/register.json", JSON.stringify(register, null, "\t"));
							await kill.reply(chatId, `Obrigada por se registrar, você agora tem maiores benefícios e pode receber 'presentes' no seu aniversario, sua ID de membro da minha rede é "#${register[user].id}".`, id);
						} else if (/no|not|nao|cancelar/gim.test(removeAccents(Array.from(c)[0][1].body))) await kill.reply(chatId, `Ok, é só corrigir a informação incorreta e usar novamente o comando.`, id);
					}).catch(async (c) => await kill.reply(chatId, `O tempo de registro expirou, tente novamente depois.`, id));
				break;
		
				case 'bank':
					if (!isActivated('rank')) return await kill.reply(chatId, mess.needxpon(), id);
					if (argl[0] !== '-check' && argl[0] !== '-help' && tools('gaming').getLimit(user, chatId, false, 'steal')) return await kill.reply(chatId, mess.Bank_Wait(), id);
					if (/-get|-put/gim.test(argl[0]) && !isNaN(argl[1]) && Win_Rewards.includes(argl[2]) || argl[0] == '-check') {
						if (argl[0] == '-put') {
							const has_bank = tools('gaming').getValue(user, chatId, argl[2]);
							if (Number(argl[1]) > has_bank || Number(argl[1]) < 1) return await kill.reply(chatId, mess.Bank_Need(argl[2], argl[1], has_bank), id);
							if (!Object.keys(bank).includes(user)) {
								bank[user] = {
									"coin": 0,
									"dima": 0,
									"rubi": 0,
									"stone": 0,
									"gold": 0,
									"iron": 0,
									"wood": 0
								};
							}
							bank[user][argl[2]] += Number(argl[1]);
							tools('gaming').addValue(user, Number(-argl[1]), chatId, argl[2]);
							fs.writeFileSync('./lib/config/Gerais/bank.json', JSON.stringify(bank, null, "\t"));
							if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
						} else if (argl[0] == '-get') {
							if (Object.keys(bank).includes(user)) {
								if (Number(argl[1]) > bank[user][argl[2]]) return await kill.reply(chatId, mess.Bank_Need(argl[2], argl[1], bank[user][argl[2]]), id);
								bank[user][argl[1]] -= Number(argl[2]);
								tools('gaming').addValue(user, Number(argl[1]), chatId, argl[2]);
								if (config.Finish_Message) await kill.reply(chatId, mess.maked(), id);
							} else return await kill.reply(chatId, mess.Bank_Unavailable(), id);
						} else if (argl[0] == '-check') {
							if (Object.keys(bank).includes(user)) {
								await kill.reply(chatId, mess.Bank_Account(user, bank[user]), id);
							} else return await kill.reply(chatId, mess.Bank_Unavailable(), id);
						} else await kill.reply(chatId, mess.whatTheFuck(), id);
						if (objconfig.noLimits == 0) return tools('gaming').addLimit(user, chatId, 'bank');
					} else await kill.reply(chatId, mess.Bank_Usage(), id);
				break;
				
				/*case 'path':
					//if (!isOwner) return await kill.reply(from, mess.sodono(), id);
					if (args.length == 0) return await kill.reply(from, mess.noargs() + 'palavras/words/números/numbers.', id);
					const cmdw3 = shell.exec(`bash -c 'tree -J --dirsfirst -x -L 1 "${arg}"'`, {
						silent: true
					});
					var outPath = JSON.parse(cmdw3.stdout);
					var formatedTxt = '';
					for (let i of outPath[0].contents) {
						if (i.type == 'directory') {
							formatedTxt += `📂 ${i.name}\n`;
						} else if (i.type == 'file') {
							formatedTxt += `📄 ${i.name}\n`;
						}
					}
					await kill.reply(from, tools('others').tablefy(`_${outPath[0].name}_\n${outPath[1].directories} 📂; ${outPath[1].files} 📄`, '*Path*')+'\n'+tools('others').tablefy(formatedTxt), id);
				break;*/

				/*Para usar a base remova o "; /*" e o "* /" e bote um nome dentro das aspas da case e em seguida sua mensagem dentro das aspas na frente do chatId */
				/*case 'Nome do comando sem espaços':
					await kill.reply(chatId, 'Sua mensagem', id);
				break*/

				// Se você fizer uma case ou inserir comandos com o custom que possua números, troque '[a-zA-Z]' por '[a-zA-Z0-9]+'
				default:
					if (isCmd && /[a-zA-Z]/.test(cmd)) {
						if (Object.keys(cmds).includes(chatId) && Object.keys(cmds[chatId]).includes(cmd)) {
							await kill.reply(chatId, cmds[chatId][cmd].msg, id);
						} else if (Object.keys(cmds.global).includes(cmd)) {
							await kill.reply(chatId, cmds.global[cmd], id);
						} else {
							let cmdprew = shell.exec(`bash -c "grep -i '${cmd.slice(0, 3)}' lib/config/Utilidades/Comandos_Automate.txt | shuf -n 1"`, {
								silent: true
							});
							if (cmdprew.stdout !== '') {
								if (sesConfig.Multi_Devices == true) return await kill.reply(chatId, mess.previewcmd() + ' → ' + `${prefix}${cmdprew}`, id);
								await kill.sendButtons(chatId, `${cmd} →`, [
									{
										"id": "1",
										"text": prefix + cmdprew
									}
								], mess.previewcmd());
							} else await kill.reply(chatId, mess.nocmd(cmd), id);
						}
					}
				break;
				
			}

			// Sistema que roda múltiplos comandos de uma vez
			if (!config.Multitasking || !isOwner && i >= config.Max_Commands) {
				break;
			}
			
		}
		
	} catch (error) {
		console.log(tools('others').color('[FALHA GERAL]', 'red'), error);
		await kill.sendTextWithMentions(Fail_From, Mesing.fail(Fail_CMD, error, (new Date().toLocaleString()))+`@${config.Owner[0].replace('@c.us', '')}`, true);
	}

};