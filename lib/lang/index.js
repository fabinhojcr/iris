function mylang(lang) {
	try {
		//return exports[lang] = require(`./${lang}`)
		return exports.pt = require('./pt')
	} catch (error) {
		console.log('Linguagem não encontrada ou erros, usarei a padrão "PT-BR", detalhes abaixo!\n[LANGUAGE]', error.message)
		return exports.pt = require('./pt')
	}
}

module.exports = {
	mylang
}