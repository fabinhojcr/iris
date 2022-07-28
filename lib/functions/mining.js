"use strict";
const fs = require('fs');
const moment = require('moment-timezone');
const {
	tools
} = require('./index');
/*const {
	mylang
} = require('../lang');*/

exports.miner = async (kill, message, chatId, person, type_act, what_pick) => {
	
	// JSON's
	const Miner = JSON.parse(fs.readFileSync('./lib/config/Settings/mining.json'));
	const mine = JSON.parse(fs.readFileSync('./lib/config/Gerais/mine.json'));
	const leveling = JSON.parse(fs.readFileSync('./lib/config/Gerais/level.json'));
	const pickaxes = JSON.parse(fs.readFileSync('./lib/config/Gerais/pickaxes.json'));
	const bonus_earn = JSON.parse(fs.readFileSync('./lib/config/Gerais/bonus.json'));
	const inventory = JSON.parse(fs.readFileSync('./lib/config/Gerais/inventory.json'));

	// Verifica o tipo de função que o user deseja fazer
	if (!Object.keys(mine).includes(person) && type_act == 'new') {

		// Verifica se a pessoa possui uma área de mineração
		if (!bonus_earn.Miner.includes(person)) return await kill.reply(chatId, `Você precisa comprar uma área para minerar pela loja antes de começar.`, message.id);

		// Verifica se tem picaretas
		if (Object.keys(inventory).includes(person)) {

			// Verifica se o user tem a picareta que quer usar
			if (Object.keys(inventory[person].pickaxe).includes(what_pick) && pickaxes.pickaxes.types.includes(what_pick)) {

				// Caso haja, vai criar uma sessão de mineração para ele
				mine[person] = {
					"active": true,
					"startedAt": moment.now(),
					"finish_at": Number((moment().add(Miner.Mining_Time, 'hours').unix().toString().padEnd(moment.now().toString().length, '0'))),
					"pickaxe": {
						"name": what_pick,
						"durability": inventory[person].pickaxe[what_pick].durability,
						"power": inventory[person].pickaxe[what_pick].power,
						"desc": inventory[person].pickaxe[what_pick][region],
						"image": inventory[person].pickaxe[what_pick].image
					}
				};

				// Já faz os ganhos que ela receberá após x tempo
				let Max_Mining_Val = parseInt((Number(Miner.Min_Mining_Win) * Number(mine[person].pickaxe.power)) * Number(Miner.Mining_Rate_Win));
				let Initial_Value = tools('others').randomNumber(Number(Miner.Min_Mining_Win), Max_Mining_Val);

				// Taxas de mineração
				let Mining_Tax = {
					"dima": parseInt((Initial_Value / Number(Miner.Diamond_Rarity))),
					"rubi": parseInt((Initial_Value / Number(Miner.Rubi_Rarity))),
					"iron": parseInt((Initial_Value / Number(Miner.Iron_Rarity))),
					"gold": parseInt((Initial_Value / Number(Miner.Gold_Rarity))),
					"stone": parseInt((Initial_Value / Number(Miner.Stone_Rarity)))
				};

				// Adiciona o valor máximo na Obj
				let All_Winning = Mining_Tax.dima + Mining_Tax.rubi + Mining_Tax.iron + Mining_Tax.stone + Mining_Tax.gold;

				// Checa se tem o valor mínimo
				if (All_Winning < Miner.Min_Mining_Win) {
					let need_value = Miner.Min_Mining_Win - All_Winning;
					let More_Gain = tools('others').randVal(Object.keys(Mining_Tax));
					Mining_Tax[More_Gain] += parseInt(need_value);
				}

				// Checa se passou do valor
				if (All_Winning > Miner.Max_Mining_Val) {
					let need_value = (All_Winning - Miner.Max_Mining_Val) + 5;
					let More_Gain = tools('others').randVal(Object.keys(Mining_Tax));
					Mining_Tax[More_Gain] -= parseInt(need_value);
				}

				// Adiciona ganhos de XP na mineração e valor total de ganhos
				Mining_Tax.xp = Initial_Value;
				Mining_Tax.Wins = Mining_Tax.dima + Mining_Tax.rubi + Mining_Tax.iron + Mining_Tax.stone;
				mine[person].gain = Mining_Tax;

				// Salva no JSON
				fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine, null, "\t"));

				// Avisa que começou a minerar
				await kill.sendFileFromUrl(message.from, `https://user-images.githubusercontent.com/55511420/173255899-c7ed69e8-4738-45c8-8fcf-4f913d789b3b.png`, 'pickaxe.png', `✔️ Você começou a minerar, abaixo estão seus detalhes! ✔️\n\n⛏️ Taxa de ganhos por Hora [Picareta ${mine[person].pickaxe.name.toUpperCase()}] → ${(Number(Miner.Mining_Rate_Win) * Number(mine[person].pickaxe.power))}%\n\n💣 Capacidade de usos → ${mine[person].pickaxe.durability} usos restantes\n\n⏰ Começou as → ${moment(mine[person].startedAt).format('HH:mm:SS - DD/MM/YYYY')}\n\n⌛ Terminará as → ${moment(mine[person].finish_at).format('HH:mm:SS - DD/MM/YYYY')}\n\n💰 Expectativa de Ganhos de Minério [Todo] → ${Miner.Min_Mining_Win} +- ${Max_Mining_Val}\n\n🆙 Ganhos de XP → ${Initial_Value}\n\n⚠️ → Volte quando o tempo acabar, só darei os prêmios se você estiver online.`, message.id);

			} else await kill.reply(message.from, `Você não possui a picareta que quer utilizar, compre uma na loja ou verifique se digitou corretamente!`, message.id);

		} else await kill.reply(message.from, `Você não possui picaretas, primeiro compre uma na loja.`, message.id);

	} else if (Object.keys(mine).includes(person) && type_act == 'check') {

		// Checa se a data em unix atual é maior ou igual a data em unix salva e se mineração esta ativa
		if (mine[person].active == true && moment.now() >= mine[person].finish_at && bonus_earn.Miner.includes(person)) {

			// Desativa a mineração para evitar flood e tira uma da durabilidade
			mine[person].active = false;
			inventory[person].pickaxe[mine[person].pickaxe.name].durability -= 1;
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine, null, "\t"));

			// Avisa a pessoa que a mineração acabou
			await kill.reply(message.from, `✔️ → Sua mineração terminou, seus ganhos são:\n\n♦️ - ${mine[person].gain.rubi} Rubis\n\n💎 - ${mine[person].gain.dima} Diamantes\n\n🪨 - ${mine[person].gain.stone} Pedras\n\n🔶 - ${mine[person].gain.gold} Ouro\n\n⛏️ - ${mine[person].gain.iron} Ferro\n\n🆙 - ${mine[person].gain.xp} XP\n\nPara voltar a minerar, use o comando de criar uma mineração novamente.`, message.id);

			// Envia os ganhos, ganha no grupo em que for ativo na hora de resgatar os ganhos
			leveling[chatId][person].dima += mine[person].gain.dima;
			leveling[chatId][person].rubi += mine[person].gain.rubi;
			leveling[chatId][person].iron += mine[person].gain.iron;
			leveling[chatId][person].stone += mine[person].gain.stone;
			leveling[chatId][person].gold += mine[person].gain.gold;
			leveling[chatId][person].xp += mine[person].gain.xp;

			// Deleta a pessoa do mine.json
			delete mine[person];

			// Salva no JSON
			fs.writeFileSync('./lib/config/Gerais/mine.json', JSON.stringify(mine, null, "\t"));
			fs.writeFileSync('./lib/config/Gerais/inventory.json', JSON.stringify(inventory, null, "\t"));
			fs.writeFileSync('./lib/config/Gerais/level.json', JSON.stringify(leveling, null, "\t"));
			
		}
		
	} else if (Object.keys(mine).includes(person) && type_act == 'new') return await kill.reply(message.from, `Você já está minerando!`, message.id);

};