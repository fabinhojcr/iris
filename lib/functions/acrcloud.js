"use strict";
const acrcloud = require("acrcloud");
const fs = require("fs");
const {
	mylang
} = require('../lang');
const {
	tools
} = require('./index');

// JSON's
const APIS = JSON.parse(fs.readFileSync('./lib/config/Settings/APIS.json'));
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

// Configuração ACR
let acr = new acrcloud({
	host: APIS.Acr_Host,
	access_key: APIS.Acr_Access,
	access_secret: APIS.Acr_Secret
});

exports.recognize = async (name, media, kill, message) => {
	try {
		fs.writeFile(name, media, async (err) => {
			if (err && config.Show_Error == true) {
				await kill.reply(message.from, 'Houve um erro de download da música.' + mylang(region).fail('DETECT', err, (new Date().toString())), message.id);
				tools('others').reportConsole('DETECT', err);
				tools('others').clearFile(name);
			}
			const resp = await acr.identify(fs.readFileSync(name));
			if (resp.status.code == 1001 || resp.metadata.music.length == 0) return await kill.reply(message.from, mylang(region).noresult(), message.id);
			if (resp.status.code == 3003 || resp.status.code == 3015) return await kill.reply(message.from, mylang(region).invalidKey(), message.id);
			if (resp.status.code == 3000) return await kill.reply(message.from, mylang(region).serverError(), message.id);
			await kill.reply(message.from, mylang(region).detectmsc(resp, resp.metadata.music[0].artists.map(a => a.name)), message.id);
			return tools('others').clearFile(name);
		});
	} catch (error) {
		if (config.Show_Error == true) {
			tools('others').reportConsole('DETECT', error);
			await kill.reply(message.from, mylang(region).fail('DETECT', error, (new Date().toString())), message.id);
		}
		return tools('others').clearFile(name);
	}
};