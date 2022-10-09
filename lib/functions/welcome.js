"use strict";
const fs = require('fs');
const {
	tools
} = require('./index');
const {
	mylang
} = require('../lang');

/* Utilidades */
var Open_Blacklist = 0;
var Open_Fake = 0;
var Open_Welcome = {
	"time": 0,
	"person": []
};
var Open_Goodbye = {
	"time": 0,
	"person": []
};
var irisNumber = false;

exports.welcomer = async (kill, events) => {

	// JSON'S
	const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'));
	const customMsg = JSON.parse(fs.readFileSync('./lib/config/Gerais/greetings.json'));
	const canvacord = JSON.parse(fs.readFileSync('./lib/config/Gerais/canvas.json'));
	const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

	try {

		// Configurações
		irisNumber = irisNumber == false ? (await kill.getHostNumber()) + '@c.us' : irisNumber;
		const isIris = events.who == irisNumber;
		const isBlacklist = functions.blacklist.includes(events.chat) && functions.antinumbers.some(uz => events.who.startsWith(uz)) && !functions.whitelist.includes(events.who); // functions.blacklist.includes(events.chat) && functions.antinumbers.includes(events.who)
		const isFake = functions.fake.includes(events.chat) && !config.DDI.some(i => events.who.startsWith(i)) && !functions.whitelist.includes(events.who);
		const isWelcome = functions.welcome.includes(events.chat);
		const isGoodbye = functions.goodbye.includes(events.chat);
		const personInfo = await kill.getContact(events.who);
		const groupInfo = await kill.getChatById(events.chat);
		let pushname = personInfo.pushname || personInfo.verifiedName || personInfo.formattedName || 'Censored by Government';

		// Sistema global do Welcome/Goodbye/Antifake/Blacklist/etc
		// Tudo em 1, achei melhor ir em 'else if' do que vários 'if' separados
		if (events.action == 'add' && isBlacklist && !isIris) {
			if (Open_Blacklist < Date.now()) {
				if (config.Show_Functions == true) {
					console.log(tools('others').color('[BLACKLIST]', 'red'), tools('others').color(`${pushname} - (${events.who.replace('@c.us', '')}) foi banido do ${groupInfo.name || 'UM GRUPO'} por ter sido colocado na blacklist...`, 'yellow'));
				}
				Open_Blacklist = Date.now() + (Number(config.Blacklist_Sleep) * 60000);
				await kill.sendText(events.chat, mylang(region).entrace());
				await kill.removeParticipant(events.chat, events.who);
				if (config.Auto_Block) return await kill.contactBlock(events.who);
			} else await kill.removeParticipant(events.chat, events.who);
		} else if (events.action == 'add' && isFake && !isIris) {
			if (Open_Fake < Date.now()) {
				if (config.Show_Functions == true) {
					console.log(tools('others').color('[FAKE]', 'red'), tools('others').color(`${pushname} - (${events.who.replace('@c.us', '')}) foi banido do ${groupInfo.name} por usar número falso ou ser de fora do país...`, 'yellow'));
				}
				Open_Fake = Date.now() + (Number(config.Fake_Sleep) * 60000);
				await kill.sendTextWithMentions(events.chat, mylang(region).nofake(events));
				await kill.removeParticipant(events.chat, events.who);
				if (config.Auto_Block) return await kill.contactBlock(events.who);
			} else await kill.removeParticipant(events.chat, events.who);
		} else if (events.action == 'add' && isWelcome && !isIris) {
			if (Open_Welcome.time < Date.now()) {
				if (config.Show_Functions == true) {
					console.log(tools('others').color('[ENTROU]', 'red'), tools('others').color(`${pushname} - (${events.who.replace('@c.us', '')}) entrou no grupo ${groupInfo.name}...`, 'yellow'));
				}
				Open_Welcome.time = Date.now() + (Number(config.Welcome_Sleep) * 60000);
				if (!Object.keys(customMsg).includes(events.chat)) {
					customMsg[events.chat] = {}; // Não salva, apenas temporário
				}
				if (!Object.keys(customMsg[events.chat]).includes('welcome')) {
					const profile = await tools('profile').getProfilePic(kill, false, false, false, false, [events.who, events.chat], events.who, irisNumber, groupInfo.groupMetadata.participants, 1);
					try {
						const welcomeimg = await tools('canvas').welcome(pushname, events.who.slice(6, 10), groupInfo.name, groupInfo.groupMetadata.participants.length, profile[0], events.action, canvacord);
						await kill.sendFile(events.chat, welcomeimg, 'welcome.png', mylang(region).welcome(pushname, groupInfo.name));
					} catch (err) {
						await kill.sendTextWithMentions(events.chat, mylang(region).welcome(`@${events.who}`, groupInfo.name));
						if (config.Show_Error == true) {
							console.log(err.message);
						}
					}
					if (config.Canvas_Audio) {
						await kill.sendPtt(events.chat, canvacord.Sound_Welcome);
					}
					if (Open_Welcome.person.length > 0) {
						await kill.sendTextWithMentions(events.chat, mylang(region).After_Welcome(groupInfo.name, Open_Welcome.person));
						Open_Welcome.person = [];
					}
				} else if (customMsg[events.chat].welcome.message.includes('userm')) {
					await kill.sendTextWithMentions(events.chat, customMsg[events.chat].welcome.message.replace('{userm}', `@${events.who.replace('@c.us', '')}`));
				} else await kill.sendText(events.chat, customMsg[events.chat].welcome.message);
			} else {
				Open_Welcome.person.push(events.who.replace('@c.us', ''));
			}
		} else if (events.action == 'remove' && isGoodbye && !isIris) {
			if (Open_Goodbye.time < Date.now()) {
				if (config.Show_Functions == true) {
					console.log(tools('others').color('[SAIU/BAN]', 'red'), tools('others').color(`${pushname} - (${events.who.replace('@c.us', '')}) saiu ou foi banido do grupo ${groupInfo.name}...`, 'yellow'));
				}
				Open_Goodbye.time = Date.now() + (Number(config.Welcome_Sleep) * 60000);
				if (!Object.keys(customMsg).includes(events.chat)) {
					customMsg[events.chat] = {}; // Não salva, apenas temporário
				}
				if (!Object.keys(customMsg[events.chat]).includes('goodbye')) {
					const profolo = await tools('profile').getProfilePic(kill, false, false, false, false, [events.who, events.chat], events.who, irisNumber, groupInfo.groupMetadata.participants, 1);
					try {
						const goodbyeimg = await tools('canvas').welcome(pushname, events.who.slice(6, 10), groupInfo.name, groupInfo.groupMetadata.participants.length, profolo[0], events.action, canvacord);
						await kill.sendFile(events.chat, goodbyeimg, 'goodbye.png', mylang(region).bye(pushname));
					} catch (err) {
						await kill.sendTextWithMentions(events.chat, mylang(region).bye(`@${events.who}`));
						if (config.Show_Error == true) {
							console.log(err.message);
						}
					}
					if (config.Canvas_Audio) {
						await kill.sendPtt(events.chat, canvacord.Sound_Welcome);
					}
					if (Open_Goodbye.person.length > 0) {
						await kill.sendTextWithMentions(events.chat, mylang(region).After_Goodbye(Open_Goodbye.person));
						Open_Goodbye.person = [];
					}
				} else if (customMsg[events.chat].goodbye.message.includes('userm')) {
					await kill.sendTextWithMentions(events.chat, customMsg[events.chat].goodbye.message.replace('{userm}', `@${events.who.replace('@c.us', '')}`));
				} else await kill.sendText(events.chat, customMsg[events.chat].goodbye.message);
			} else {
				Open_Goodbye.person.push(events.who.replace('@c.us', ''));
			}
		}
	} catch (err) {
		Open_Blacklist = 0;
		Open_Fake = 0;
		Open_Welcome = {
			"time": 0,
			"person": []
		};
		Open_Goodbye = {
			"time": 0,
			"person": []
		};
		if (config.Show_Error == true) {
			console.log(err);
		}
	}
};