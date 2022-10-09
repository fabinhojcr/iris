"use strict";
const fs = require("fs");
const {
	tools
} = require('./index');
const {
	decryptMedia
} = require('@open-wa/wa-decrypt');

/* JSON's */
const config = JSON.parse(fs.readFileSync('./lib/config/Settings/config.json'));

// Função para obter a foto do participante e caso der erro obter de alguém aleatório
exports.getProfilePic = async (kill, hasImage, encryptMedia, quotedMsg, quotedMsgObj, mentionedJidList, user, botNumber, groupMembersId, limit) => {

	/* Corrige os valores */
	quotedMsg = Object.keys(quotedMsg).length !== 0 ? quotedMsg : false;
	quotedMsgObj = Object.keys(quotedMsgObj).length !== 0 ? quotedMsgObj : false;
	mentionedJidList = mentionedJidList.length !== 0 ? mentionedJidList : false;
	groupMembersId = groupMembersId.length !== 0 ? groupMembersId : false;

	// Try para dar bypass em qualquer possível erro
	try {
	
		// Função que pega uma foto de alguém aleatório e checa se deu bom, limite de 10, ajustável, só mudar o 10 pra algum valor acima de 2
		const Max_Checks = 10;
		const get_Random_Pic = async () => {
			var Final_Image = 'Not an image';
			for (let i = 0; i < Max_Checks; i++) {
				if (typeof Final_Image == 'object' || !tools('others').isUrl(Final_Image) || /error|ERROR/gim.test(Final_Image.toLowerCase()) || Final_Image == 'Not an image') {
					Final_Image = await kill.getProfilePicFromServer(tools('others').randVal(groupMembersId));
				} else return;
			}
			if (Final_Image == 'Not an image') {
				Final_Image = 'https://thispersondoesnotexist.com/image';
			}
			return Final_Image;
		};
	
		// Define as variáveis padrões
		let [check1, check2, check3, photo] = ['', '', '', false];

		// Caso tenha uma imagem
		if (hasImage) {
			let mediaData = await decryptMedia(encryptMedia);
			photo = await tools('cloud').upload(mediaData);
		}

		// Primeira foto de perfil | QuotedMsg, Mentioned, Sender
		if (quotedMsg) {
			check1 = quotedMsgObj.sender.id;
		} else if (mentionedJidList.length !== 0) {
			check1 = mentionedJidList[0];
		} else {
			check1 = user;
		}

		// Segunda foto de perfil | QuotedMsg, Mentioned, BotNumber
		if (quotedMsg && check1 !== quotedMsgObj.sender.id) {
			check2 = quotedMsgObj.sender.id;
		} else if (mentionedJidList.length !== 0 && check1 !== mentionedJidList[0]) {
			check2 = mentionedJidList[0];
		} else if (mentionedJidList.length > 1 && check1 == mentionedJidList[0]) {
			check2 = mentionedJidList[1];
		} else if (mentionedJidList.length > 2 && check1 == mentionedJidList[1]) {
			check2 = mentionedJidList[2];
		} else if (mentionedJidList.length > 3 && check1 == mentionedJidList[2]) {
			check2 = mentionedJidList[3];
		} else if (check1 !== user) {
			check2 = user;
		} else {
			check2 = botNumber;
		}

		// Terceira foto de perfil | QuotedMsg, Mentioned, RandomMember
		if (quotedMsg && check1 !== quotedMsgObj.sender.id && check2 !== quotedMsgObj.sender.id) {
			check3 = quotedMsgObj.sender.id;
		} else if (mentionedJidList.length !== 0 && check1 !== mentionedJidList[0] && check2 !== mentionedJidList[0]) {
			check3 = mentionedJidList[0];
		} else if (mentionedJidList.length > 1 && check1 == mentionedJidList[0] && check2 == mentionedJidList[0]) {
			check3 = mentionedJidList[1];
		} else if (mentionedJidList.length > 2 && check1 == mentionedJidList[1] && check2 == mentionedJidList[1]) {
			check3 = mentionedJidList[2];
		} else if (mentionedJidList.length > 3 && check1 == mentionedJidList[2] && check2 == mentionedJidList[2]) {
			check3 = mentionedJidList[3];
		} else if (check2 !== botNumber) {
			check3 = botNumber;
		} else if (check1 !== user && check2 !== user) {
			check3 = user;
		} else {
			check3 = tools('others').randVal(groupMembersId);
		}
	
		// Baixa as imagens
		check1 = await kill.getProfilePicFromServer(check1);
		check2 = await kill.getProfilePicFromServer(check2);
		check3 = await kill.getProfilePicFromServer(check3);

		// Checa se as imagens são validas
		if (typeof check1 == 'object' || !tools('others').isUrl(check1) || /error|ERROR/gim.test(check1.toLowerCase())) {
			check1 = await get_Random_Pic();
		}
		if (typeof check2 == 'object' || !tools('others').isUrl(check2) || /error|ERROR/gim.test(check2.toLowerCase())) {
			check2 = await get_Random_Pic();
		}
		if (typeof check3 == 'object' || !tools('others').isUrl(check3) || /error|ERROR/gim.test(check3.toLowerCase())) {
			check3 = await get_Random_Pic();
		}

		// Object com todas as imagens
		let All_Photo_Profile = {
			"use_image": hasImage,
			"image": photo,
			"first": check1,
			"second": check2,
			"three": check3
		};

		// Object com todos os valores, formata automaticamente com o "melhor valor" baseado no limite requisitado pelo comando
		if (limit > 0 && limit < 4) {
			if (All_Photo_Profile.use_image) {
				All_Photo_Profile.recommended = [All_Photo_Profile.image, All_Photo_Profile.first, All_Photo_Profile.second, All_Photo_Profile.three];
			} else {
				All_Photo_Profile.recommended = [All_Photo_Profile.first, All_Photo_Profile.second, All_Photo_Profile.three];
			}
		} else if (limit >= 4) {
			if (All_Photo_Profile.use_image) {
				All_Photo_Profile.recommended = [All_Photo_Profile.image, All_Photo_Profile.first, All_Photo_Profile.second, All_Photo_Profile.three];
			} else {
				All_Photo_Profile.recommended = [All_Photo_Profile.first, All_Photo_Profile.second, All_Photo_Profile.three];
			}
			for (let i = 0; i < limit; i++) {
				if (All_Photo_Profile.recommended.length < limit) {
					All_Photo_Profile.recommended.push('https://thispersondoesnotexist.com/image'); // Só completa a array
				} else return;
			}
		}
	
		// Remove qualquer valor que não seja URL
		All_Photo_Profile.recommended = All_Photo_Profile.recommended.filter(j => tools('others').isUrl(j));

		// Retorna tudo que encontrar
		return All_Photo_Profile.recommended;
	
	} catch (error) {
		if (config.Show_Error) {
			tools('others').reportConsole('CANVAS', error);
		}
		return [
			'https://thispersondoesnotexist.com/image',
			'https://thispersondoesnotexist.com/image',
			'https://thispersondoesnotexist.com/image',
			'https://thispersondoesnotexist.com/image'
		]; // Ainda tenta ao menos ser usável
	}

};