import TelegramApi from 'node-telegram-bot-api'
import { gameOptions, againGameOptions } from './board-options.js'
const token = '5670266050:AAGKeOjV1SIreNChQblETkwhh0IpoaAx4VI'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `guess the number that the bot guessed`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, `guess !`, gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'First run and greeting'},
        {command: '/info', description: 'Info about bot'},
        {command: '/game', description: 'Start game'},
    ])

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id
        
        if (text === '/start') {
            await bot.sendMessage(chatId, `Welcome, ${msg.from.first_name}`)
            return bot.sendSticker(chatId, 'https://tlgrm.eu/_/stickers/e29/025/e290254d-785a-31f6-a186-6c7abcbeea08/6.webp')
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Ur name is ${msg.from.first_name}`)
        }

        if (text === '/game') {
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, "I don't understand you, please try again")

    })
    
    bot.on('callback_query', msg => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
            return startGame(chatId)
        }

        if (+data === chats[chatId]) {
            return bot.sendMessage(chatId, `Congrats you are guess the number, ${data}`, againGameOptions)
        } else {
            return bot.sendMessage(chatId, `Opps, wrong number, bot guessed ${chats[chatId]}`, againGameOptions)
        }
    })
}

start()