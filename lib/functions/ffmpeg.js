"use strict";
const fs = require('fs');
const axios = require('axios');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const {
	tools
} = require('./index');
const {
	mylang
} = require('../lang');

/* JSON */
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

exports.octasound = async (mediaData, apu, kill, message, format) => {
	let onFile = `./lib/media/audio/8D-${tools('others').randomString(10)}.${format}`;
	let offFile = `./lib/media/audio/8D-${tools('others').randomString(10)}.${format}`;
	fs.writeFile(onFile, mediaData, async (err) => {
		if (err && config.Show_Error == true) return console.error(err);
		const octasounder = ffmpeg(onFile);
		octasounder.audioFilter(`apulsator=hz=${apu || 0.200}`);
		octasounder.format(format);
		octasounder.save(offFile);
		octasounder.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('8D', error, (new Date()).toLocaleString()), message.id);
			tools('others').reportConsole('8D', error);
		});
		octasounder.on('end', async () => {
			await kill.sendFile(message.from, offFile, `audio.${format}`, '', message.id);
			tools('others').clearFile(onFile);
			tools('others').clearFile(offFile);
		});
	});
};

exports.bass = async (mediaData, g, type, width, f, kill, message, format) => {
	let onFile = `./lib/media/audio/BASS-${tools('others').randomString(10)}.${format}`;
	let offFile = `./lib/media/audio/BASS-${tools('others').randomString(10)}.${format}`;
	fs.writeFile(onFile, mediaData, async (err) => {
		if (err && config.Show_Error == true) return console.error(err);
		const basser = ffmpeg(onFile);
		basser.audioFilter(`equalizer=f=${f || 40}:width_type=${type || 'h'}:width=${width || 50}:g=${g || 3}`);
		basser.format(format);
		basser.save(offFile);
		basser.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('BASS', error, (new Date()).toLocaleString()), message.id);
			tools('others').reportConsole('BASS', error);
		});
		basser.on('end', async () => {
			await kill.sendFile(message.from, offFile, `bass.${format}`, '', message.id);
			tools('others').clearFile(onFile);
			tools('others').clearFile(offFile);
		});
	});
};

exports.nightcore = async (mediaData, night, kill, message, format) => {
	let onFile = `./lib/media/audio/NIGHTCORE-${tools('others').randomString(10)}.${format}`;
	let offFile = `./lib/media/audio/NIGHTCORE-${tools('others').randomString(10)}.${format}`;
	fs.writeFile(onFile, mediaData, async (err) => {
		if (err && config.Show_Error == true) return console.error(err);
		const nightcorer = ffmpeg(onFile);
		nightcorer.audioFilter(`asetrate=${night || 44100*1.25}`);
		nightcorer.format(format);
		nightcorer.save(offFile);
		nightcorer.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('NIGHTCORE', error, (new Date()).toLocaleString()), message.id);
			tools('others').reportConsole('NIGHTCORE', error);
		});
		nightcorer.on('end', async () => {
			await kill.sendFile(message.from, offFile, `NIGHTCORE.${format}`, '', message.id);
			tools('others').clearFile(onFile);
			tools('others').clearFile(offFile);
		});
	});
};

exports.audio = async (mediaData, kill, message, mimetype) => {
	let onFile = `./lib/media/audio/AUDIO-${tools('others').randomString(10)}.${mimetype.replace(/.+\//, '')}`;
	let offFile = `./lib/media/audio/AUDIO-${tools('others').randomString(10)}.mp3`;
	fs.writeFile(onFile, mediaData, async (err) => {
		if (err && config.Show_Error == true) return console.error(err);
		const audior = ffmpeg(onFile);
		audior.noVideo();
		audior.format('mp3');
		audior.save(offFile);
		audior.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('AUDIO', error, (new Date()).toLocaleString()), message.id);
			tools('others').reportConsole('AUDIO', error);
		});
		audior.on('end', async () => {
			await kill.sendFile(message.from, offFile, 'audio.mp3', '', message.id);
			tools('others').clearFile(onFile);
			tools('others').clearFile(offFile);
		});
	});
};

exports.reverse = async (decryptedMedia, kill, message, args, format) => {
	let bEntry = `./lib/media/video/REVERSE-${tools('others').randomString(10)}.${format}`;
	let bSaid = `./lib/media/video/REVERSE-${tools('others').randomString(10)}.${format}`;
	fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err && config.Show_Error == true) return console.error(err);
		var mediaReverse = ffmpeg(bEntry);
		if (args.includes('-video') && format == 'mp4') {
			mediaReverse.videoFilter('reverse');
		} else if (args.includes('-audio')) {
			mediaReverse.audioFilter('areverse');
		} else if (format == 'mp4') {
			mediaReverse.videoFilter('reverse');
		} else {
			mediaReverse.audioFilter('areverse');
		}
		mediaReverse.format(format);
		mediaReverse.save(bSaid);
		mediaReverse.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date()).toLocaleString()), message.id);
			tools('others').reportConsole('reverse', error);
		});
		mediaReverse.on('end', async () => {
			await kill.sendFile(message.from, bSaid, `reverse.${format}`, '', message.id);
			tools('others').clearFile(bSaid);
			tools('others').clearFile(bEntry);
		});
	});
};

exports.gray = async (decryptedMedia, kill, message) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`;
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`;
	fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err && config.Show_Error == true) return console.error(err);
		const grayer = ffmpeg(bEntry);
		grayer.videoFilter(`format=gray`);
		grayer.format('mp4');
		grayer.save(bSaid);
		grayer.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date()).toLocaleString()), message.id);
			tools('others').reportConsole('reverse', error);
		});
		grayer.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'gray.mp4', '', message.id);
			tools('others').clearFile(bSaid);
			tools('others').clearFile(bEntry);
		});
	});
};

exports.square = async (decryptedMedia, kill, message) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`;
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`;
	fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err && config.Show_Error == true) return console.error(err);
		const squarer = ffmpeg(bEntry);
		squarer.videoFilter(`crop=in_h:in_h`);
		squarer.format('mp4');
		squarer.save(bSaid);
		squarer.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date()).toLocaleString()), message.id);
			tools('others').reportConsole('reverse', error);
		});
		squarer.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'square.mp4', '', message.id);
			tools('others').clearFile(bSaid);
			tools('others').clearFile(bEntry);
		});
	});
};

exports.mute = async (decryptedMedia, kill, message) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`;
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`;
	fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err && config.Show_Error == true) return console.error(err);
		const muter = ffmpeg(bEntry);
		muter.audioFilter(`volume=0`);
		muter.format('mp4');
		muter.save(bSaid);
		muter.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('mute', error, (new Date()).toLocaleString()), message.id);
			tools('others').reportConsole('mute', error);
		});
		muter.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'mute.mp4', '', message.id);
			tools('others').clearFile(bSaid);
			tools('others').clearFile(bEntry);
		});
	});
};

exports.blur = async (decryptedMedia, kill, message, radius) => {
	let bEntry = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`;
	let bSaid = `./lib/media/audio/REVERSE-${tools('others').randomString(10)}.mp4`;
	fs.writeFile(bEntry, decryptedMedia, async (err) => {
		if (err && config.Show_Error == true) return console.error(err);
		const bluer = ffmpeg(bEntry);
		bluer.videoFilter(`avgblur=sizeX=${radius}`);
		bluer.format('mp4');
		bluer.save(bSaid);
		bluer.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('reverse', error, (new Date()).toLocaleString()), message.id);
			tools('others').reportConsole('reverse', error);
		});
		bluer.on('end', async () => {
			await kill.sendFile(message.from, bSaid, 'blur.mp4', '', message.id);
			tools('others').clearFile(bSaid);
			tools('others').clearFile(bEntry);
		});
	});
};

exports.resize = async (link, command, kill, message) => {
	let bEntry = `./lib/media/img/${command}-${tools('others').randomString(20)}.gif`;
	let bSaid = `./lib/media/img/${command}-${tools('others').randomString(20)}.mp4`;
	await axios.get(link, {
		responseType: 'arraybuffer'
	}).then(async (response) => {
		fs.writeFile(bEntry, Buffer.from(response.data, 'binary'), async (err) => {
			if (err && config.Show_Error == true) return console.error(err);
			const resizer = ffmpeg(bEntry);
			resizer.outputOptions(['-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-vf', "scale=trunc(iw/2)*2:trunc(ih/2)*2"]);
			resizer.save(bSaid);
			resizer.on('error', async function(error, stdout, stderr) {
				await kill.reply(message.from, mylang(region).fail(command, error, (new Date().toLocaleString())), message.id);
				tools('others').reportConsole('8D', error);
			});
			resizer.on('end', async () => {
				await tools('others').sleep(2000);
				await kill.sendFile(message.from, bSaid, 'video.mp4', '', message.id);
				tools('others').clearFile(bSaid);
				tools('others').clearFile(bEntry);
			});
		});
	});
};

exports.speed = async (mediaData, kill, message, speed, format) => {
	let bEntry = `./lib/media/video/REVERSE-${tools('others').randomString(10)}.${format}`;
	let bSaid = `./lib/media/video/REVERSE-${tools('others').randomString(10)}.${format}`;
	fs.writeFile(bEntry, mediaData, async (err) => {
		if (err && config.Show_Error == true) return console.error(err);
		const mediaSpeed = ffmpeg(bEntry);
		if (format == 'mp3') {
			mediaSpeed.audioFilters(`atempo=${speed}`);
		}
		if (format == 'mp4') {
			mediaSpeed.videoFilters(`setpts=${1/speed}*PTS`).audioFilters(`atempo=${speed}`);
		}
		mediaSpeed.format(format);
		mediaSpeed.save(bSaid);
		mediaSpeed.on('error', async function(error, stdout, stderr) {
			await kill.reply(message.from, mylang(region).fail('speed', error, (new Date()).toLocaleString()), message.id);
			tools('others').reportConsole('speed', error);
		});
		mediaSpeed.on('end', async () => {
			await kill.sendFile(message.from, bSaid, `speed.${format}`, '', message.id);
			tools('others').clearFile(bSaid);
			tools('others').clearFile(bEntry);
		});
	});
};