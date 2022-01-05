const { Telegraf } = require('telegraf')

const bot = new Telegraf('')

bot.start((ctx) => {
    ctx.reply('Привет, я телеграм-бот точки, рад познакомиться)')
    console.log(ctx)
})

bot.help((ctx) => ctx.reply(`Привет${(ctx.message.first_name) ? `, ${ctx.message.first_name}` : ''}!`))

bot.stop((ctx) => {
    ctx.leaveChat()
})

bot.launch()

module.exports = bot
