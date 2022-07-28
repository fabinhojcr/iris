"use strict";
const fs = require('fs');
const {
	tools
} = require('./index');
const {
	mylang
} = require('../lang');

// Variáveis para controle de algumas atividades externas
var runOnlyOneTime = false;
var Advise_Only_One = false;
var check_Startup_Msg = true;
var Able_To_Check = false;

// JSON's | Utilidades
const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'));
const aEvents = JSON.parse(fs.readFileSync('./lib/config/Gerais/events.json'));
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));
global.region = config.Language;

// Arruma a falta de '@c.us' no Owner
if (config.Owner.some(nb => !nb.endsWith('@c.us'))) {
	config.Owner = config.Owner.map(o => !o.includes("@c.us") ? o + "@c.us" : o);
	fs.writeFileSync('./lib/config/Settings/config.json', JSON.stringify(config, null, "\t"));
}

// Atualiza os comandos no arquivo de comandos a cada inicialização
if (config.Update_CMDS_On_Boot == true) {
	require('shelljs').exec(`bash lib/functions/config.sh cmds`, {
		silent: true
	});
}

// 'Desativa' o evento aleatório para casos de reinicialização da Íris
if (aEvents.eventOnline) {
	aEvents.eventOnline = false;
	aEvents.description = 'Nenhum';
	aEvents.lastTime = aEvents.startedAt;
	aEvents.lastType = aEvents.typeEvent;
	aEvents.lastName = aEvents.eventName;
	aEvents.lastIndex = aEvents.eventIndex;
	aEvents.groups = [];
	fs.writeFileSync('./lib/config/Gerais/events.json', JSON.stringify(aEvents, null, "\t"));
}

exports.listener = (kill) => {

	/* Caso não seja valida */
	if (kill == null) return;

	/* Try Catch para evitar erros */
	try {

		// Caso use múltiplas Íris, impede de fazer tudo de novo
		if (!runOnlyOneTime) {
			runOnlyOneTime = true;
			
			// Limpa o console antes de começar
			console.clear();

			// Exibe a barra de inicialização
			console.log(tools('others').color('\n-------------------------------\n', 'crimson'));

			// Roda as funções de transmissão, backup e outros
			try {
				tools('works').checkUpdate();
				tools('works').safeBoot();
				tools('works').transmission();
				tools('works').backup();
			} catch (error) {
				tools('others').reportConsole('[POS-WORKS] ', error);
			}

			// Exibe a mensagem de inicialização
			tools('others').sleep(2000).then(() => {
				console.log(tools('others').color('[BOOT]', 'crimson'), tools('others').color('Estamos quase lá, envie uma mensagem para iniciar a sessão...\n', 'gold')); // Espera a mensagem do Backup
				check_Startup_Msg = 'ok'; // Permite receber comandos
			});

			if (config.Popup) {
				tools('others').notify('Íris', mylang(config.Language).started((new Date()).getHours()), './lib/media/img/Hello.png');
			}
			
		}

		// Forçar recarregamento caso obtenha erros
		kill.onStateChanged(state => {

			// Conflito, aparece quando tem varias sessões conectadas ao mesmo tempo
			if (state == 'CONFLICT' || state == 'UNLAUNCHED') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('Outra sessão do WhatsApp Web foi aberta no meu número...', 'lime'));
			}

			// Avisa que possui uma versão desatualizada do WhatsApp Web
			if (state == 'DEPRECATED_VERSION') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('A sessão do WhatsApp possui uma atualização pendente...', 'lime'));
			}

			// Avisa que houve desconexão da sessão entre o PC e o Telefone
			if (state == 'DISCONNECTED') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('Houve uma desconexão, verifique o telefone...', 'lime'));
			}

			// Avisa que está recarregando uma sessão
			if (state == 'OPENING') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('Recarregando a sessão do WhatsApp...', 'lime'));
			}

			// Avisa que está conectando na sessão
			if (state == 'PAIRING') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('Conectando na sessão do WhatsApp...', 'lime'));
			}

			// Avisa que tem um proxy bloqueando
			if (state == 'PROXYBLOCK') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('Fui bloqueada por um proxy, configure ele na "sessions.json"...', 'lime'));
			}

			// Avisa de um conflito entre o navegador e user-agent, também aparece ao ser banido
			if (state == 'SMB_TOS_BLOCK' || state == 'TOS_BLOCK') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('A sessão foi bloqueada, estarei me desligando para TENTAR evitar um BAN...', 'lime'));
				console.log(tools('others').color(`[KILLOVSKY]`, 'red'), tools('others').color('Evite ligar a Íris por uns dias ou pode acabar sendo banido, se já não tiver sido...', 'lime'));
				process.exit(1);
			}

			// Avisa que está sincronizando
			if (state == 'SYNCING') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('Sincronizando a sessão do WhatsApp...', 'lime'));
			}

			// Avisa que aconteceu um timeout da sessão
			if (state == 'TIMEOUT') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('A sessão sofreu um timeout, recarregando...', 'lime'));
			}

			// Avisa que a sessão pode ter desconectado
			if (state == 'UNPAIRED' || state == 'UNPAIRED_IDLE') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('Houve desconexão ou demora ao escanear o QR Code, verifique o telefone e me reinicie...', 'lime'));
			}

			// Avisa que a sessão pode ter desconectado
			if (state == 'CONNECTED') {
				console.log(tools('others').color(`[${state.toUpperCase()}]`, 'red'), tools('others').color('A sessão foi conectada e está pronta para utilização...', 'lime'));
			}

			// Recarrega a sessão, alguns valores abaixo podem causar desligamento, são eles:
			// [timeout, proxyblock, unpaired, unpaired_idle e disconnected]
			if (['CONFLICT', 'DISCONNECTED', 'PROXYBLOCK', 'TIMEOUT', 'UNLAUNCHED', 'UNPAIRED', 'UNPAIRED_IDLE'].includes(state)) {
				kill.forceRefocus();
			}
			
		});

		// Parte principal responsável pelos comandos, além da limpeza de cache
		let IrisCMD = config.Bot_Commands ? 'onAnyMessage' : 'onMessage';
		kill[IrisCMD](message => {

			// Avisa que começou
			if (check_Startup_Msg == 'ok') {
				console.log(tools('others').color('[START - OK]', 'magenta'), tools('others').color(`A sessão foi iniciada, carregando módulos e arquivos...você poderá usar em alguns instantes!\n\n-------------------------------\n`, 'lime'));
				check_Startup_Msg = 'pass';
			}

			// Só funciona a mensagem caso já tenha sido iniciado tudo
			if (check_Startup_Msg == 'pass') {

				// Limpa o cache das mensagens - se configurado
				if (config.Clear_Cache) {
					kill.getAmountOfLoadedMessages().then(value => {
						if (value >= config.Max_Msg_Cache) {
							kill.cutMsgCache();
							kill.cutChatCache();
						}
					});
				}

				// Executa em modo perfomance ou segurança
				if (config.Perfomance_Mode == false) {

					// Sistema de firewall's
					tools('firewall').runAll(kill, message).then(res => {

						// Envia a mensagem pras cases/etc
						if (res == true) {
							tools('config').kconfig(kill, message);
						}
						
					});
					
				} else {
					tools('config').kconfig(kill, message); // Cases
					tools('firewall').runAll(kill, message); // Firewall
				}

				// Avisa que já recebeu ao menos 1 mensagem
				Advise_Only_One = true;
				
			}
			
		});

		// Welcome inicia
		kill.onGlobalParticipantsChanged(events => tools('welcome').welcomer(kill, events)).catch(error => tools('others').reportConsole('WELCOME', error));

		// Bloqueia na call
		kill.onIncomingCall(async (callData) => {
			if (config.Block_Calls && !config.Owner.includes(callData.peerJid)) {
				await kill.autoReject(mylang(config.Language).blockcalls());
				await kill.contactBlock(callData.peerJid);
				console.log(tools('others').color('[CALL]', 'red'), tools('others').color(`${callData.peerJid.replace('@c.us', '')} foi bloqueado por me ligar...`, 'yellow'));
			}
		});

		// Funções para caso seja adicionada em um grupo
		kill.onAddedToGroup(async (chat) => {
			const lmtgru = await kill.getAllGroups();
			let VIPS_NUM = ['no_try', 'no_persons'];
			let PAR_NUM = chat.groupMetadata.participants.map(iusr => iusr.id._serialized);
			if (Object.keys(functions.vips).includes(chat.id)) {
				VIPS_NUM = Object.keys(functions.vips[chat.id]);
			}
			if (PAR_NUM.includes(config.Owner[0]) || PAR_NUM.some(v => VIPS_NUM.includes(v))) {
				await kill.sendText(chat.id, mylang(config.Language).novogrupo()); // Permite a BOT ficar se o dono ou algum VIP estiver dentro do grupo
			} else if (chat.groupMetadata.participants.length < config.Min_Membros || lmtgru.length > config.Max_Groups) {
				await kill.sendText(chat.id, mylang(config.Language).noreq(chat.groupMetadata.participants.length, lmtgru.length));
				await kill.deleteChat(chat.id);
				await kill.leaveGroup(chat.id);
			} else await kill.sendText(chat.id, mylang(config.Language).novogrupo());
			console.log(tools('others').color('[NOVO]', 'red'), tools('others').color(`Fui adicionada ao grupo ${chat.contact.name} e eles tem ${chat.groupMetadata.participants.length} membros.`, 'yellow'));
		});

		// Para mensagens deletadas
		kill.onMessageDeleted(msgs => tools('deletions').nodeletion(kill, msgs));

		// Funções que só rodam uma vez, precisa de uma mensagem para ativar o sistema, para que não ocorra erros graves
		let isTIME_pos = () => {

			if (Advise_Only_One) {

				// Avisa que iniciou aos grupos - se configurado, se quiser avisar todos ate no pv, remova o ".filter(group => group.includes('@g.us'))"
				if (config.StartUP_MSGs_Groups) {
					(async () => {
						const groupAdvisedID = [];
						var All_Group_ID = (await kill.getAllChatIds()).filter(g => g.includes('@g.us'));
						All_Group_ID = [...new Set(All_Group_ID)];
						for (let gpID of All_Group_ID) {
							if (!groupAdvisedID.includes(gpID)) {
								groupAdvisedID.push(gpID);
								await kill.sendText(gpID, mylang(region).startOK());
							}
						}
					})();
				}

				// Auto Recarregamento da Config.js sem reiniciar, para casos de edições em tempo real, use com cautela e ative a require la em baixo se usar
				if (config.Auto_Update) {
					try {
						tools('reload').watchFile('config.js');
					} catch (error) {
						tools('others').reportConsole('WATCHFILE', error);
					}
				}
				// tools('reload').watchFile('Nome_Do_Arquivo.js')
				// Exemplos Utilizáveis (insira na try):
				// Functions: tools('reload').watchFile('others.js')
				// Lang: tools('reload').watchFile('pt.js')

				// Define que terminou tudo e pode iniciar o sistema de segurança
				Able_To_Check = true;

			} else tools('others').sleep(3000).then(() => isTIME_pos());
		};
		isTIME_pos();

		// Verifica se está conectada certo a cada 10 minutos, caso não, ela força o recarregamento
		let Time_Recharge = async () => {
			if (Able_To_Check) {
				let YouRe_OK = await kill.healthCheck();
				if (YouRe_OK.state !== 'CONNECTED' || YouRe_OK.wapiInjected == false || YouRe_OK.tryingToReachPhone == true || YouRe_OK.retryingIn !== 0 || YouRe_OK.queuedMessages !== 0 || YouRe_OK.isPhoneDisconnected == true || YouRe_OK.isHere == false || YouRe_OK.online == false) {
					console.log(tools('others').color('[LAGS?]', 'red'), tools('others').color(`Notei que posso estar travada, estou atualizando o estado de conexão, pode 'demorar'...`, 'yellow'));
					let Should_Work = await kill.forceUpdateConnectionState();
					await tools('others').sleep(10000); // 10 segundos para a função acima estabilizar
					if (Should_Work !== 'CONNECTED') {
						await kill.forceRefocus();
					}
					let Im_OK = await kill.healthCheck();
					if (Im_OK.state !== 'CONNECTED' || Im_OK.wapiInjected == false || Im_OK.tryingToReachPhone == true || Im_OK.retryingIn !== 0 || Im_OK.queuedMessages !== 0 || Im_OK.isPhoneDisconnected == true || Im_OK.isHere == false || Im_OK.online == false) {
						console.log(tools('others').color('[SLOW]', 'red'), tools('others').color(`Atualizar o estado não funcionou, vou forçar o recarregamento...`, 'yellow'));
						await kill.refresh();
						await tools('others').sleep(10000); // 10 segundos para a função acima terminar (provavelmente é suficiente)
						let Really_Fine = await kill.healthCheck();
						if (Really_Fine.state !== 'CONNECTED' || Really_Fine.wapiInjected == false || Really_Fine.tryingToReachPhone == true || Really_Fine.retryingIn !== 0 || Really_Fine.queuedMessages !== 0 || Really_Fine.isPhoneDisconnected == true || Really_Fine.isHere == false || Really_Fine.online == false) {
							console.log(tools('others').color('[SESSION ERROR]', 'red'), tools('others').color(`A sessão não está funcionando bem, reinicie manualmente para sua própria segurança!`, 'yellow'));
						} else {
							console.log(tools('others').color('[FINE]', 'red'), tools('others').color(`As atualizações aparentemente deram certo, não detectei erros por aqui...`, 'yellow'));
						}
					} else {
						console.log(tools('others').color('[FINE]', 'red'), tools('others').color(`As atualizações aparentemente deram certo, não detectei erros por aqui...`, 'yellow'));
					}
				} else {
					console.log(tools('others').color('[SECURITY]', 'red'), tools('others').color(`Não detectei erros na conexão...obrigada por me manter saudável 💖`, 'yellow'));
				}
				await tools('others').sleep(Number(config.Check_Connection) * 60000);
				Time_Recharge();
			} else {
				await tools('others').sleep(3000);
				Time_Recharge();
			}
		};
		Time_Recharge();

		// Caso der algum erro grave
		kill.getPage().on('error', async (err) => {
			console.log(tools('others').color('[PAGE]', 'crimson'), tools('others').color(`Ocorreu um erro grave, por favor me reinicie, vou me desligar antecipadamente! [PM2 pode me reiniciar]`, 'yellow'));
			try {
				await kill.sendText(config.Owner[0], `⚠️ - Ocorreu um erro grave na minha sessão, por favor me reinicie, estarei me desligando, irei reiniciar sozinha caso você tenha usado 'PM2'!\n\n${err.message}`);
				await kill.sendText(config.Secure_Group, `*⚠️ - Ocorreu um erro gravíssimo na minha sessão, por favor avisem alguém que pode me reiniciar, estarei me desligando, caso meu host tenha usado 'PM2', poderei reiniciar automaticamente!*\n\n${err.message}`);
			} catch (error) {
				// Do Nothing
			}
			process.exit();
		});

	} catch (error) {
		console.error(error);
	}

};