"use strict";
const fs = require('fs');
const {
	decryptMedia
} = require('@open-wa/wa-decrypt');
const {
	tools
} = require('./index');
/*const {
	mylang
} = require('../lang');*/

exports.nodeletion = async (kill, msgs) => {

	// JSON'S
	const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'));
	const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

	try {

		// Configurações
		let from = msgs.from || false;
		let notifyName = msgs.notifyName || false;
		let type = msgs.type || false;
		let mimetype = msgs.mimetype || false;
		let filename = msgs.filename || false;
		let body = msgs.body || false;
		let t = msgs.t || Date.now();
		let author = msgs.author || false;
		let size = msgs.size || false;
		let caption = msgs.caption || false;
		let comment = msgs.comment || false;
		let text = msgs.text || false;
		let isGif = msgs.isGif || false;
		let lat = msgs.lat || false;
		let lng = msgs.lng || false;
		let firstFrameLength = msgs.firstFrameLength || false;
		let duration = msgs.duration || false;
		let width = msgs.width || false;
		let height = msgs.height || false;
		let vcardFormattedName = msgs.vcardFormattedName || false;

		// Função que converte tempo de unix em data
		let timeNow = tsmap => new Date(Number(tsmap.toString().padEnd(Date.now().toString().length, '0'))).toLocaleString();

		// Ignora grupos que não tem o Anti-delete online
		if (!functions.nodelete.includes(msgs.from)) return;

		// Avisa que uma mensagem foi deletada
		if (config.Show_Functions == true) {
			console.log(tools('others').color('> [ANTI-DELETE]', 'crimson'), tools('others').color(`Reenviei um/a ${type || 'mensagem'} apagada por "${notifyName || '?'}"...`, 'yellow'));
		}

		// Sistema de anti-delete baseado em switch com type message
		if (type !== null) {

			switch (type) {

				case 'audio':
				case 'ptt':
					let media_audio = await decryptMedia(msgs);
					await kill.sendAudio(from, `data:${mimetype.split(';')[0] || 'audio/mpeg'};base64,${media_audio.toString('base64')}`);
					await kill.sendTextWithMentions(from, `🚮 "@${author.replace('@c.us', '')}" deletou um/a '${type}'!\n\n🦛 Tamanho → "${size / 1000} KB's"\n\n📺 Formato → "${mimetype}"\n\n⏲️ Duração → "${duration || 'N/A'}s"\n\n📅 Em → "${timeNow(t)}"`);
				break;

				case 'vcard':
					if (body.length > 1000) return await kill.sendTextWithMentions(from, `🚮 @${author.replace('@c.us', '')} deletou um/a '${type}', todavia, ele aparenta ter muitos caracteres dentro, não reenviarei por segurança!`);
					vcardFormattedName = vcardFormattedName || '?';
					await kill.sendVCard(from, body, vcardFormattedName);
					await kill.sendTextWithMentions(from, `🚮 "@${author.replace('@c.us', '')}" deletou um/a '${type}''!\n\n📓 Nome do contato → "${vcardFormattedName}"\n\n📅 Em → "${timeNow(t)}"`);
				break;

				case 'document':
					let doc_name = filename || caption || t || 'doc_deleted';
					if (doc_name > 1000) return await kill.sendTextWithMentions(from, `🚮 @${author.replace('@c.us', '')} deletou um/a '${type}', todavia, ele aparenta ter muitos caracteres no nome, não reenviarei por segurança!`);
					let media_doc = await decryptMedia(msgs);
					await kill.sendFile(from, `data:${mimetype || 'application/octet-stream'};base64,${media_doc.toString('base64')}`, doc_name, `🚮 "${author.replace('@c.us', '')}" deletou um/a '${type}'!\n\n🦛 Tamanho → "${size / 1000}" KB's\n\n📺 Formato → "${mimetype}"\n\n📄 Nome → "${doc_name}"\n\n📅 Em → "${timeNow(t)}"`);
				break;

				case 'video':
					mimetype = mimetype || 'video/mp4';
					type = isGif == true ? 'GIF' : type;
					let video_name = (caption || t || 'Video_Deleted') + '.' + mimetype.split('/')[0];
					let func_send = isGif == true ? 'sendVideoAsGif' : 'sendFile';
					let media_video = await decryptMedia(msgs);
					await kill[func_send](from, `data:${mimetype};base64,${media_video.toString('base64')}`, video_name, `🚮 "${author.replace('@c.us', '')}" deletou um '${type}'!\n\n🦛 Tamanho → "${(size / 1000) || 'N/A'}" KB's\n\n📺 Formato → "${mimetype}"\n\n📐 Largura → "${width || 'N/A'}px"\n\n📏 Altura → "${height || 'N/A'}px"\n\n⏲️ Duração → "${duration || 'N/A'}s"\n\n❓ Descrição → "${caption || text || 'N/A'}"\n\n📅 Em → "${timeNow(t)}"`);
				break;

				case 'image':
					let media_image = await decryptMedia(msgs);
					await kill.sendImage(from, `data:${mimetype};base64,${media_image.toString('base64')}`, 'image.jpg', `🚮 "${author.replace('@c.us', '')}" deletou um/a '${type}'!\n\n🦛 Tamanho → "${(size / 1000) || 'N/A'}" KB's\n\n📺 Formato → "${mimetype}"\n\n📐 Largura → "${width || 'N/A'}px"\n\n📏 Altura → "${height || 'N/A'}px"\n\n❓ Descrição → "${caption || text || 'N/A'}"\n\n📅 Em → "${timeNow(t)}"`);
				break;
				
				case 'sticker':
					let media_stickera = await decryptMedia(msgs);
					await kill.sendImageAsSticker(from, media_stickera, {
						author: config.Sticker_Author.replace("DONTEDITUSR - DONTEDITGPN", notifyName),
						pack: config.Sticker_Pack,
						keepScale: true,
						circle: false
					});
					await kill.sendTextWithMentions(from, `🚮 "@${author.replace('@c.us', '')}" deletou um '${type}'!\n\n🦛 Tamanho [1° Frame] → "${(firstFrameLength / 1000) || 'N/A'}" KB's\n\n📺 Formato → "${mimetype}"\n\n📐 Largura → "${width || 'N/A'}px"\n\n📏 Altura → "${height || 'N/A'}px"\n\n📅 Em → "${timeNow(t)}"`);
				break;

				case 'chat':
					await kill.sendTextWithMentions(from, `🚮 "@${author.replace('@c.us', '')}" deletou um/a '${type}'!\n\nDescrição → "${body || caption || text || 'N/A'}"\n\n📅 Em → "${timeNow(t)}"`);
				break;

				case 'location':
					if (!isNaN(lat) && !isNaN(lng)) {
						await kill.sendLocation(from, lat, lng, `🚮 "${author.replace('@c.us', '')}" deletou um/a '${type}'!\n\n🌐 Latitude → "${width || 'N/A'}px"\n\n📶 Longitude → "${height || 'N/A'}px"\n\n❓ Descrição → "${comment || text || 'N/A'}"\n\n📅 Em → "${timeNow(t)}"`);
					} else {
						body = body || 'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAIAAABMXPacAAABNElEQVR4nOzRMQ0AIBDAQPJhQAL+lSLjBnoKmnTPuSvO6IDfNQBrANYArAFYA7AGYA3AGoA1AGsA1gCsAVgDsAZgDcAagDUAawDWAKwBWAOwBmANwBqANQBrANYArAFYA7AGYA3AGoA1AGsA1gCsAVgDsAZgDcAagDUAawDWAKwBWAOwBmANwBqANQBrANYArAFYA7AGYA3AGoA1AGsA1gCsAVgDsAZgDcAagDUAawDWAKwBWAOwBmANwBqANQBrANYArAFYA7AGYA3AGoA1AGsA1gCsAVgDsAZgDcAagDUAawDWAKwBWAOwBmANwBqANQBrANYArAFYA7AGYA3AGoA1AGsA1gCsAVgDsAZgDcAagDUAawDWAKwBWAOwBmANwBqANQBrANYArAFYA7AGYC8AAP//2eoBJXhOb/sAAAAASUVORK5CYII=';
						await kill.sendImage(from, `data:image/png;base64,${body.toString('base64')}`, 'image.jpg', `🚮 "${author.replace('@c.us', '')}" deletou um/a '${type}', todavia, ela parece ser invalida para reenviar.`);
					}
				break;
				
			}
			
		}
		
	} catch (err) {
		if (config.Show_Error == true) {
			tools('others').reportConsole('ANTI-DELETE', err);
		}
	}

};