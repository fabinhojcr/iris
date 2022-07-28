"use strict";
const fs = require('fs');
const {
	tools
} = require('./index');
const {
	mylang
} = require('../lang');

exports.items = async (kill, message, args, user, chatId, mention, mention_type) => {

	// JSON's
	const mining = JSON.parse(fs.readFileSync('./lib/config/Settings/mining.json'));
	const shop_settings = JSON.parse(fs.readFileSync('./lib/config/Settings/shop.json'));
	const pickaxes = JSON.parse(fs.readFileSync('./lib/config/Gerais/pickaxes.json'));
	const functions = JSON.parse(fs.readFileSync('./lib/config/Gerais/functions.json'));
	const bonus_win = JSON.parse(fs.readFileSync('./lib/config/Gerais/bonus.json'));
	const inventory = JSON.parse(fs.readFileSync('./lib/config/Gerais/inventory.json'));

	// Configurações
	const cmder = args[0].toLowerCase();

	// Começo da switch com os sistemas
	switch (cmder) {

		case '1':
			if (args.length <= 1) return await kill.reply(chatId, `Insira o nome de sua guilda!`, message.id);
			let Has_Quantity = 1;
			if (args[2] !== null) {
				if (!isNaN(args[2])) {
					Has_Quantity = Math.abs(Number(args[2]));
				}
			}
			let Price_Item = Number(shop_settings.Guild_Rate_Price) * Has_Quantity;
			let checkGMV = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			if (Price_Item > checkGMV) return await kill.reply(chatId, `Você não possui ${Price_Item} I'coins para comprar esse recurso.`, message.id);
			let Guild_Name_G = args[1].toUpperCase();
			if (!functions.guild.includes(Guild_Name_G)) return await kill.reply(chatId, `Essa guilda não parece existir, verifique se digitou certinho.`, message.id);
			if (Object.keys(bonus_win.Win_Rate_Guild).includes(Guild_Name_G)) {
				bonus_win.Win_Rate_Guild[Guild_Name_G] += Has_Quantity;
			} else {
				bonus_win.Win_Rate_Guild[Guild_Name_G] = Has_Quantity;
			}
			fs.writeFileSync('./lib/config/Gerais/bonus.json', JSON.stringify(bonus_win, null, "\t"));
			await kill.reply(chatId, `Sua Guilda agora tem mais ${bonus_win.Win_Rate_Guild[Guild_Name_G]}% do valor total adicionado aos ganhos totais.`, message.id);
			tools('gaming').addValue(user, Number(-Price_Item), chatId, 'coin');
		break;

		case '2':
			let checkStl = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			let Has_Quantity2 = 1;
			if (args[1] !== null) {
				if (!isNaN(args[1])) {
					Has_Quantity2 = Math.abs(Number(args[1]));
				}
			}
			let Price_Item2 = Number(shop_settings.Stop_Loss_Price) * Has_Quantity2;
			if (Price_Item2 > checkStl) return await kill.reply(chatId, `Você não possui ${Price_Item2} I'coins para comprar esse recurso.`, message.id);
			if (Object.keys(bonus_win.Stop_Loss).includes(user)) {
				bonus_win.Stop_Loss[user] += Has_Quantity2;
			} else {
				bonus_win.Stop_Loss[user] = Has_Quantity2;
			}
			fs.writeFileSync('./lib/config/Gerais/bonus.json', JSON.stringify(bonus_win, null, "\t"));
			await kill.reply(chatId, `Sua taxa de percas reduziu em mais ${bonus_win.Stop_Loss[user]}%, agora você perderá menos XP.`, message.id);
			tools('gaming').addValue(user, Number(-Price_Item2), chatId, 'coin');
		break;

		case '3':
			let checkLaV = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			if (Number(shop_settings.Lose_All_Price) > checkLaV) return await kill.reply(chatId, `Você não possui ${shop_settings.Lose_All_Price} I'coins para comprar esse recurso.`, message.id);
			tools("gaming").resetValue(mention, chatId);
			await kill.sendTextWithMentions(chatId, `Que pena @${mention.replace('@c.us', '')}, parece que você perdeu tudo, junte o suficiente para se vingar haha.`, message.id);
			tools('gaming').addValue(user, Number(-shop_settings.Lose_All_Price), chatId, 'coin');
		break;

		case '4':
			let checkILr = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			let ar_corr = mention_type == 'mentionedJidList' ? args[2] : args[1];
			let Has_Quantity4 = 1;
			if (ar_corr !== null) {
				if (!isNaN(ar_corr)) {
					Has_Quantity4 = Math.abs(Number(ar_corr));
				}
			}
			let Price_Item4 = Number(shop_settings.Lose_Rate_Price) * Has_Quantity4;
			if (Price_Item4 > checkILr) return await kill.reply(chatId, `Você não possui ${Price_Item4} I'coins para comprar esse recurso.`, message.id);
			if (Object.keys(bonus_win.Friend_Loss).includes(mention)) {
				bonus_win.Friend_Loss[mention] += Has_Quantity4;
			} else {
				bonus_win.Friend_Loss[mention] = Has_Quantity4;
			}
			fs.writeFileSync('./lib/config/Gerais/bonus.json', JSON.stringify(bonus_win, null, "\t"));
			await kill.sendTextWithMentions(chatId, `Parece que você acabou de perder ${bonus_win.Friend_Loss[mention]}% de todos os seus futuros lucros em jogos, caro @${mention.replace('@c.us', '')}.\nJunte o suficiente para se vingar haha.`, message.id);
			tools('gaming').addValue(user, Number(-Price_Item4), chatId, 'coin');
		break;

		case '5':
			let checkICW = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			let ar_crtd = mention_type == 'mentionedJidList' ? args[2] : args[1];
			let Has_Quantity5 = 1;
			if (ar_crtd !== null) {
				if (!isNaN(ar_crtd)) {
					Has_Quantity5 = Math.abs(Number(ar_crtd));
				}
			}
			let Price_Item5 = Number(shop_settings.Win_Rate_Price) * Has_Quantity5;
			if (Price_Item5 > checkICW) return await kill.reply(chatId, `Você não possui ${Price_Item5} I'coins para comprar esse recurso.`, message.id);
			if (Object.keys(bonus_win.Win_Rate).includes(mention)) {
				bonus_win.Win_Rate[mention] += Has_Quantity5;
			} else {
				bonus_win.Win_Rate[mention] = Has_Quantity5;
			}
			fs.writeFileSync('./lib/config/Gerais/bonus.json', JSON.stringify(bonus_win, null, "\t"));
			await kill.sendReplyWithMentions(chatId, `Excelente, @${mention.replace('@c.us', '')} acaba de ganhar ${bonus_win.Win_Rate[mention]}% de lucro a mais em todas as suas jogadas.`, message.id);
			tools('gaming').addValue(user, Number(-Price_Item5), chatId, 'coin');
		break;

		case '6':
			let checkICM = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			if (Number(shop_settings.Mine_Price) > checkICM) return await kill.reply(chatId, `Você não possui ${shop_settings.Mine_Price} I'coins para comprar a área de mineração.`, message.id);
			if (bonus_win.Miner.includes(user)) return await kill.reply(chatId, `Você já possui uma área de mineração.`, message.id);
			bonus_win.Miner.push(user);
			fs.writeFileSync('./lib/config/Gerais/bonus.json', JSON.stringify(bonus_win, null, "\t"));
			await kill.reply(chatId, 'Você comprou uma área para minerar, compre ou faça uma picareta e divirta-se!', message.id);
			tools('gaming').addValue(user, Number(-shop_settings.Mine_Price), chatId, 'coin');
		break;

		case '7':
			let checkICV = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			if (Number(shop_settings.Vip_Price) > checkICV) return await kill.reply(chatId, `Você não possui ${shop_settings.Vip_Price} I'coins para comprar o VIP.`, message.id);
			if (!Object.keys(functions.vips).includes(chatId)) {
				functions.vips[chatId] = {};
			}
			functions.vips[chatId][user] = false;
			fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
			await kill.reply(chatId, 'Parabéns por entrar nos VIP"s!', message.id);
			tools('gaming').addValue(user, Number(-shop_settings.Vip_Price), chatId, 'coin');
		break;

		case '8':
			let checkIco = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			let Has_Quantity8 = 1;
			if (args[1] !== null) {
				if (!isNaN(args[1])) {
					Has_Quantity8 = Math.abs(Number(args[1]));
				}
			}
			let Price_Item8 = Number(shop_settings.NOBG_Value) * Has_Quantity8;
			if (Price_Item8 > checkIco) return await kill.reply(chatId, `Você não possui ${Price_Item8} I'coins para comprar ${Has_Quantity8} ficha.`, message.id);
			if (Object.keys(functions.NoBG).includes(user)) {
				functions.NoBG[user] += Has_Quantity8;
			} else {
				functions.NoBG[user] = Has_Quantity8;
			}
			fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
			await kill.reply(chatId, `Você comprou ${Has_Quantity8} fichas para usar no comando "NoBg".`, message.id);
			tools('gaming').addValue(user, Number(-Price_Item8), chatId, 'coin');
		break;

		case '9':
			let checkIcN = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			if (Number(shop_settings.Surprise_Price) > checkIcN) return await kill.reply(chatId, `Você não possui ${shop_settings.Surprise_Price} I'coins para comprar a surpresa.`, message.id);
			let sorted = tools('others').randVal(['xp', 'coin', 'vip', 'nobg', 'mine', 'rubi', 'iron', 'gold', 'wood', 'stone', 'dima', 'nada']);
			sorted = sorted == 'nada' ? tools('others').randVal(['xp', 'coin', 'vip', 'nobg', 'mine', 'rubi', 'iron', 'gold', 'wood', 'stone', 'dima', 'nada']) : sorted; // Só ganha nada se tiver muito azar
			if (sorted == 'xp' || sorted == 'coin' || sorted == 'rubi' || sorted == 'dima' || sorted == 'wood' || sorted == 'stone' || sorted == 'iron' || sorted == 'gold') {
				tools('gaming').addValue(user, Number(shop_settings.Surprise_Win), chatId, sorted);
				await kill.reply(chatId, `Parabéns, você ganhou ${shop_settings.Surprise_Win} ${sorted.toUpperCase()}!`, message.id);
			} else if (sorted == 'vip') {
				if (!Object.keys(functions.vips).includes(chatId)) {
					functions.vips[chatId] = {};
				}
				if (Object.keys(functions.vips[chatId]).includes(user)) {
					tools('gaming').addValue(user, Number(shop_settings.Vip_Price), chatId, 'coin');
					await kill.reply(chatId, `Você ganhou VIP, mas como você já tinha, você adquiriu ${shop_settings.Vip_Price} I'coins!`, message.id);
				} else {
					functions.vips[chatId][user] = false;
					fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions));
					await kill.reply(chatId, `Parabéns, você ganhou acesso VIP!`, message.id);
				}
			} else if (sorted == 'nobg') {
				if (Object.keys(functions.NoBG).includes(user)) {
					functions.NoBG[user] += 1;
				} else {
					functions.NoBG[user] = 1;
				}
				fs.writeFileSync('./lib/config/Gerais/functions.json', JSON.stringify(functions, null, "\t"));
				await kill.reply(chatId, `Parabéns, você ganhou uma ficha para usar no comando "NOBG"!`, message.id);
			} else await kill.reply(chatId, `Looserr! Você não ganhou nada dessa vez!`, message.id);
			tools('gaming').addValue(user, Number(-shop_settings.Surprise_Price), chatId, 'coin');
		break;

		case '10':
		case '11':
		case '12':
		case '13':
		case '14':
		case '15':
		case '16':
			const type_buiyng = {
				"10": "xp",
				"11": "dima",
				"12": "rubi",
				"13": "iron",
				"14": "gold",
				"15": "wood",
				"16": "stone"
			};
			let checkIcoin = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			let Has_Quantity10 = 1;
			if (args[1] !== null) {
				if (!isNaN(args[1])) {
					Has_Quantity10 = Math.abs(Number(args[1]));
				}
			}
			let Price_Item10 = Number(shop_settings.Packs_Price[type_buiyng[cmder]]) * Has_Quantity10;
			let Price_Value10 = Number(shop_settings.Packs_Value[type_buiyng[cmder]]) * Has_Quantity10;
			if (Price_Item10 > checkIcoin) return await kill.reply(chatId, mylang(region).noMoney('I-COINS', checkIcoin, Price_Value10), message.id);
			tools('gaming').addValue(user, Number(Price_Value10), chatId, type_buiyng[cmder]);
			tools('gaming').addValue(user, Number(-Price_Item10), chatId, 'coin');
			await kill.reply(chatId, `Prontinho, você comprou ${Price_Value10} ${type_buiyng[cmder].toUpperCase()} por ${Price_Item10} I'Coins!`, message.id);
		break;

		case '17':
		case '18':
		case '19':
		case '20':
		case '21':
		case '22':
			const type_cambio = {
				"17": "rubi",
				"18": "dima",
				"19": "stone",
				"20": "gold",
				"21": "iron",
				"22": "wood"
			};
			let trocaMiner = parseInt(tools('gaming').getValue(user, chatId, type_cambio[cmder]));
			let Has_Quantity17 = 1;
			if (args[1] !== null) {
				if (!isNaN(args[1])) {
					Has_Quantity17 = Math.abs(Number(args[1]));
				}
			}
			let Price_Item17 = Number(shop_settings.Change_Req[type_cambio[cmder]]) * Has_Quantity17;
			let Price_Value17 = Number(shop_settings.Change_Value[type_cambio[cmder]]) * Has_Quantity17;
			if (Price_Item17 > trocaMiner) return await kill.reply(chatId, mylang(region).noMoney(type_cambio[cmder], trocaMiner, Price_Item17), message.id);
			tools('gaming').addValue(user, Number(Price_Value17), chatId, 'coin');
			tools('gaming').addValue(user, Number(-Price_Item17), chatId, type_cambio[cmder]);
			await kill.reply(chatId, `Prontinho, você trocou ${Price_Item17} ${type_cambio[cmder].toUpperCase()} por ${Price_Value17} I'Coins!`, message.id);
		break;

		case 's1':
		case 's2':
		case 's3':
		case 's4':
		case 's5':
		case 's6':
			let W_PAXE = cmder == 's1' ? 'stone' : (cmder == 's2' ? 'iron' : (cmder == 's3' ? 'wood' : (cmder == 's4' ? 'gold' : (cmder == 's5' ? 'dima' : 'rubi'))));
			if (!bonus_win.Miner.includes(user)) return await kill.reply(chatId, `Você não possui uma área de mineração, compre na loja!`, message.id);
			let has_Reqs = parseInt(tools('gaming').getValue(user, chatId, 'coin'));
			if (Number(shop_settings.Pickaxe_Shopping[W_PAXE]) > has_Reqs) return await kill.reply(chatId, mylang(region).noMoney(has_Reqs, shop_settings.Pickaxe_Shopping[W_PAXE]), message.id);
			if (Object.keys(inventory).includes(user)) {
				if (Object.keys(inventory[user].pickaxe).includes(W_PAXE)) {
					await kill.reply(chatId, 'Você já tem essa picareta, a durabilidade dela será aumentada usando os valores padrões.', message.id);
					inventory[user].pickaxe[W_PAXE].durability += pickaxes.pickaxes[W_PAXE].durability;
				} else {
					inventory[user].pickaxe[W_PAXE] = {
						"desc": pickaxes.pickaxes[W_PAXE][region],
						"power": pickaxes.pickaxes[W_PAXE].power,
						"durability": pickaxes.pickaxes[W_PAXE].durability,
						"image": pickaxes.pickaxes[W_PAXE].image
					};
				}
			} else {
				inventory[user] = {
					"pickaxe": {
						[W_PAXE]: {
							"desc": pickaxes.pickaxes[W_PAXE][region],
							"power": pickaxes.pickaxes[W_PAXE].power,
							"durability": pickaxes.pickaxes[W_PAXE].durability,
							"image": pickaxes.pickaxes[W_PAXE].image
						}
					}
				};
			}
			fs.writeFileSync('./lib/config/Gerais/inventory.json', JSON.stringify(inventory, null, "\t"));
			tools('gaming').addValue(user, Number(-shop_settings.Pickaxe_Shopping[W_PAXE]), chatId, 'coin');
			await kill.sendFileFromUrl(chatId, pickaxes.pickaxes[W_PAXE].image, 'pickaxe.png', `✔️ → Você comprou uma picareta de ${W_PAXE.toUpperCase()}! ← ✔️\n\n⚠️ → Picaretas compradas vem com valores predefinidos.\n\n⛏️ Taxa de ganhos por hora → ${(Number(mining.Mining_Rate_Win) * Number(pickaxes.pickaxes[W_PAXE].power))}%\n\n💣 Capacidade de usos → ${inventory[user].pickaxe[W_PAXE].durability} usos restantes\n\n📓 Descrição → ${pickaxes.pickaxes[W_PAXE][region]}\n\n💷 Valor → ${shop_settings.Pickaxe_Shopping[W_PAXE]} I'coins.`, message.id);
		break;

		case 'f1':
		case 'f2':
		case 'f3':
		case 'f4':
		case 'f5':
		case 'f6':
			if (!bonus_win.Miner.includes(user)) return await kill.reply(chatId, `Você não possui uma área de mineração, compre na loja!`, message.id);
			const F_PAXE = cmder == 'f1' ? 'stone' : (cmder == 'f2' ? 'rubi' : (cmder == 'f3' ? 'dima' : (cmder == 'f4' ? 'gold' : (cmder == 'f5' ? 'iron' : 'wood'))));
			const Check_Reqs = tools('gaming').getValue(user, chatId, null);
			const Check_Wood = F_PAXE == 'wood' ? (Number(shop_settings.Pickaxe_Build.Wood_Base[F_PAXE]) + Number(shop_settings.Pickaxe_Build[F_PAXE])) : Number(shop_settings.Pickaxe_Build.Wood_Base[F_PAXE]);
			const Type_Needing = Number(shop_settings.Pickaxe_Build[F_PAXE]) > Check_Reqs[F_PAXE] ? [F_PAXE, Check_Reqs[F_PAXE], Number(shop_settings.Pickaxe_Build[F_PAXE])] : (Check_Wood > Check_Reqs.wood ? ['wood', Check_Reqs.wood, Check_Wood] : 'pass');
			if (Type_Needing !== 'pass') return await kill.reply(chatId, mylang(region).noMoney(Type_Needing[0], Type_Needing[1], Type_Needing[2]), message.id);
			const Pickaxe_Resistance = Math.abs(tools('others').randomNumber(Check_Reqs.level, Number(pickaxes.pickaxes[F_PAXE].durability))); /* Baseado em LVL + Sorte */
			if (Object.keys(inventory).includes(user)) {
				if (Object.keys(inventory[user].pickaxe).includes(F_PAXE)) {
					await kill.reply(chatId, 'Você já tem essa picareta, a durabilidade dela será aumentada ~ilimitadamente~ de acordo com seu nível e sorte.', message.id);
					inventory[user].pickaxe[F_PAXE].durability += Pickaxe_Resistance;
				} else {
					inventory[user].pickaxe[F_PAXE] = {
						"desc": pickaxes.pickaxes[F_PAXE][region],
						"power": pickaxes.pickaxes[F_PAXE].power,
						"durability": Pickaxe_Resistance,
						"image": pickaxes.pickaxes[F_PAXE].image
					};
				}
			} else {
				inventory[user] = {
					"pickaxe": {
						[F_PAXE]: {
							"desc": pickaxes.pickaxes[F_PAXE][region],
							"power": pickaxes.pickaxes[F_PAXE].power,
							"durability": Pickaxe_Resistance,
							"image": pickaxes.pickaxes[F_PAXE].image
						}
					}
				};
			}
			fs.writeFileSync('./lib/config/Gerais/inventory.json', JSON.stringify(inventory, null, "\t"));
			tools('gaming').addValue(user, Number(-Check_Wood), chatId, 'wood');
			tools('gaming').addValue(user, Number(-shop_settings.Pickaxe_Build[F_PAXE]), chatId, F_PAXE);
			await kill.sendFileFromUrl(chatId, pickaxes.pickaxes[F_PAXE].image, 'pickaxe.png', `✔️ → Você fabricou uma picareta de ${F_PAXE.toUpperCase()}! ← ✔️\n\n⚠️ → A resistência varia conforme seu nível!\n\n⛏️ Taxa de ganhos por hora → ${(Number(mining.Mining_Rate_Win) * Number(pickaxes.pickaxes[F_PAXE].power))}%\n\n💣 Capacidade de usos → ${inventory[user].pickaxe[F_PAXE].durability} usos restantes\n\n📓 Descrição → ${pickaxes.pickaxes[F_PAXE][region]}\n\n💷 Foi usado → "${shop_settings.Pickaxe_Build[F_PAXE]} ${F_PAXE.toUpperCase()}" + "${Check_Wood} WOOD".`, message.id);
		break;

		default:
			let Type_Menu = cmder.includes('s') || cmder.includes('f') ? mylang(region).forgeItem() : mylang(region).shopping();
			await kill.reply(message.from, `Você está tentando usar uma opção que ainda não tenho, reveja a lista abaixo novamente, estarei no aguardo!\n\n${Type_Menu}`, message.id);
		break;
		
	}

};