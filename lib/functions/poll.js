"use strict";
const fs = require('fs');
const {
	mylang
} = require('../lang');
const {
	tools
} = require('./index');

// JSON's
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

/* -----------------------------------------------------------------------
 * A parte das votações [Eleições] - A famosa urna eletrônica do Zap-Zap
 * ---------------------------------------------------------------------- */

exports.create = async (kill, message, file, typepos, poll) => {
	let max_Votat = !isNaN(poll[1]) ? poll[1] : config.Max_Votes;
	let pollcreate = {
		id: message.from,
		title: poll[0],
		candis: {},
		voters: [],
		creator: message.author,
		typepoll: typepos,
		maxVotes: parseInt(Number(max_Votat))
	};
	if (typepos !== 'nada') {
		pollcreate.candis['N/A'] = 0;
	}
	fs.writeFileSync(file, JSON.stringify(pollcreate, null, "\t"));
	await kill.sendText(message.from, mylang(region).startvote(poll[0].toUpperCase()) + `\n\n🏆 - Max. de Votos: "${pollcreate.maxVotes}"\n\n🎯 - Receberá: ${typepos.toUpperCase()}.`);
};

exports.vote = async (kill, message, vote, file, groupAdmins) => {
	if (!fs.existsSync(file)) return await kill.reply(message.from, mylang(region).noPolls(), message.id);
	let poll = JSON.parse(fs.readFileSync(file));
	if (Object.keys(poll.candis) == '') return await kill.reply(message.from, mylang(region).nocand(), message.id);
	if (poll.voters.includes(message.author)) return await kill.reply(message.from, mylang(region).polliv(), message.id);
	if (Number(vote) > Object.keys(poll.candis).length || Object.keys(poll.candis)[vote] == null) return await kill.sendText(message.from, mylang(region).wrongcand(vote));
	poll.voters.push(message.author);
	poll.candis[Object.keys(poll.candis)[vote]]++;
	fs.writeFileSync(file, JSON.stringify(poll, null, "\t"));
	let votes = `📥 - Votou em "${poll.typepoll !== 'nada' ? '@' : ''}${Object.keys(poll.candis)[vote]}"\n\n🗳️ - Em "${poll.title.toUpperCase()}"\n`;
	let hasWinner = false;
	for (let i in Object.keys(poll.candis)) {
		if (poll.candis[Object.keys(poll.candis)[i]] >= poll.maxVotes) {
			votes += `\n🥇 - ${poll.typepoll !== 'nada' ? '@'+Object.keys(poll.candis)[i] : Object.keys(poll.candis)[i].toUpperCase()} VENCEU POR "${poll.candis[Object.keys(poll.candis)[i]]}" VOTOS!\n\n🛑 - ${mylang(region).finishedVote()} - 🛑\n`;
			hasWinner = Object.keys(poll.candis)[i];
		} else {
			votes += `\n🎁 [${i}] -> "${poll.typepoll !== 'nada' ? '@'+Object.keys(poll.candis)[i] : Object.keys(poll.candis)[i].toUpperCase()}" = "${poll.candis[Object.keys(poll.candis)[i]]}" Votos.\n`;
		}
	}
	if (poll.typepoll !== 'nada') {
		await kill.sendTextWithMentions(message.from, votes);
	} else await kill.sendText(message.from, votes);
	if (hasWinner !== false) {
		if (poll.typepoll == 'kick') {
			await kill.removeParticipant(message.from, hasWinner+'@c.us');
		} else if (poll.typepoll == 'promote') {
			if (!groupAdmins.includes(hasWinner)) {
				await kill.promoteParticipant(message.from, hasWinner+'@c.us');
			}
		} else if (poll.typepoll == 'demote') {
			if (groupAdmins.includes(hasWinner)) {
				await kill.demoteParticipant(message.from, hasWinner+'@c.us');
			}
		}
		/*else if (poll.typepoll == 'vip') {
			Special_Poll = 'vip'; // Não finalizado
		} else if (poll.typepoll == 'mod') {
			Special_Poll = 'mod';
		}*/
		tools('others').clearFile(file, 1000);
	}
};

exports.add = async (kill, message, cand, file, isadm) => {
	if (!fs.existsSync(file)) return await kill.sendText(message.from, mylang(region).noPolls());
	let poll = JSON.parse(fs.readFileSync(file));
	if (poll.typepoll !== 'nada' && message.mentionedJidList.length == 0 && poll.typepoll !== 'nada' && !message.quotedMsg) return await kill.reply(message.from, `Esta é uma votação especial, marque a pessoa [uma por vez] ou a mensagem dela, dessa forma poderei inserir!`, message.id);
	if (Object.keys(poll.candis).includes(cand.toLowerCase())) return await kill.sendText(message.from, mylang(region).candInvalid(cand));
	if (!isadm && message.sender.id !== poll.creator) return await kill.sendTextWithMentions(message.from, mylang(region).noNewPoll(poll));
	poll.candis[cand] = 0;
	fs.writeFileSync(file, JSON.stringify(poll, null, "\t"));
	if (poll.typepoll !== 'nada') {
		await kill.sendReplyWithMentions(message.from, mylang(region).addcand('@'+cand), message.id);
	} else await kill.sendText(message.from, mylang(region).addcand(cand));
};

exports.get = async (kill, message, file) => {
	if (!fs.existsSync(file)) return await kill.sendText(message.from, mylang(region).noPolls());
	let poll = JSON.parse(fs.readFileSync(file));
	let urna = `🗳️ - "${poll.title.toUpperCase()}"\n\n`;
	if (Object.keys(poll.candis).length == 0) {
		urna += mylang(region).nocand();
	} else {
		for (let i = 0; i < Object.keys(poll.candis).length; i++) {
			urna += `🎁 #${i} -> "${poll.typepoll !== 'nada' ? '@' : ''}${Object.keys(poll.candis)[i]}" = "${poll.candis[Object.keys(poll.candis)[i]]}" Votos.\n`;
		}
	}
	if (poll.typepoll !== 'nada') {
		await kill.sendReplyWithMentions(message.from, urna + '\n' + mylang(region).howvote(), message.id);
	} else await kill.sendText(message.from, urna + '\n' + mylang(region).howvote());
};