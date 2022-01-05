class Conversation {
  constructor(ctx) {
    this.chatId = ctx.message.chatId
    this.userName = ctx.message.chat.first_name
    this.chatType = ctx.message.chat.type
  }
}

module.exports = Conversation
