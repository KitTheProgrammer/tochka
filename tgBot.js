const { Telegraf } = require('telegraf')

const bot = new Telegraf('')

bot.start((ctx) => {
    ctx.reply('Привет, я телеграм-бот точки, рад познакомиться)')
    console.log(ctx.message.chat.id)
})
bot.help((ctx) => ctx.reply('К сожалению я пока не много умею, но точно смогу сказать когда кто то изменил планы)'))

bot.launch()

module.exports = bot
