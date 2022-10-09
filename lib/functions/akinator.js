"use strict";
const fs = require('fs');
const {
	Aki
} = require('aki-api');
const {
	tools
} = require('./index');
const {
	mylang
} = require('../lang');

// Configuração
let Has_Started = false;
let Counting = 0;
let Game_Aki = false;
let User_Playing = false;

// Cria uma exports 
exports.play = async (
	kill,
	message,
	scene = '',
	moving = 'none'
) => {
	
	// JSON's
	const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

	// Try - Catch para caso de erro em algo
	try {
		
		// Adverte para esperar
		if (message.author !== User_Playing && Has_Started == true) return await kill.reply(message.from, mylang(region).Not_You_Play(), message.id);

		// Define o player
		User_Playing = message.author;

		// Corrige o scene
		if (scene == '' || scene == null) {
			scene = 'check';
		} else if (scene == 4) {
			scene = 'win';
		} else if (scene == 3) {
			scene = 'undo';
		} else if (scene == 2) {
			scene = 'step';
		} else if (scene == 1) {
			scene = 'create';
		} else {
			scene = 'check';
		}

		// Caso tente usar uma função mas ainda não tenha começado a jogar
		if (Has_Started == false) {
			scene = 'create';
		}

		// Envia o fim de jogo
		if (Has_Started == true && Game_Aki !== false) {
			if (Game_Aki.progress >= Number(config.Akinator_Win) || Game_Aki.currentStep >= 80) {
				scene = 'win';
			}
		}

		// Switch para facilitar o acesso aos sistemas [achei melhor que um if]
		switch (scene) {

			// Caso for para fazer a jogada
			case 'step':
				if (!moving.match(/^[0-4]+$/)) return await kill.reply(message.from, mylang(region).akiresp(), message.id);
				await Game_Aki.step(moving);
				Counting++;
				await kill.reply(message.from, mylang(region).akistart(Game_Aki), message.id);
			break;

			// Caso precise desfazer a jogada
			case 'undo':
				if (isNaN(moving) || moving == 'help' || moving > Counting) return await kill.reply(message.from, mylang(region).whatCandit(Counting), message.id);
				for (let i = 0; i < Number(moving); i++) {
					await Game_Aki.back();
				}
				Counting = Counting - moving;
				await kill.reply(message.from, mylang(region).akistart(Game_Aki), message.id);
			break;

			// Caso seja preciso criar a sessão de jogo
			case 'create':
				if (Has_Started == true) return await kill.reply(message.from, `Para criar um jogo, primeiro é necessário declarar o fim de jogo.`, message.id);
				Game_Aki = new Aki({
					region
				});
				await Game_Aki.start();
				Counting = 0;
				Has_Started = true;
				await kill.reply(message.from, mylang(region).akistart(Game_Aki), message.id);
			break;

			// Caso seja a hora de finalizar
			case 'win':
				await Game_Aki.win();
				Counting = 0;
				Has_Started = 0;
				await kill.sendFileFromUrl(message.from, `${Game_Aki.answers[0].absolute_picture_path}`, 'foto.png', mylang(region).akiwon(Game_Aki, Game_Aki.answers), message.id);
			break;

			// Caso a função seja algo diferente
			default:
				await kill.reply(message.from, mylang(region).akistart(Game_Aki), message.id);
			break;
			
		}
		
	} catch (error) {
		if (config.Show_Error == true) {
			tools('others').reportConsole('AKI', error);
			await kill.reply(message.from, mylang(region).akifail() + mylang(region).fail('AKINATOR', error, (new Date()).toLocaleString()), message.id);
		}
		Has_Started = false;
		Counting = 0;
		Game_Aki = false;
	}

};