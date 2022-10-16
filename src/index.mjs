import Telegram from 'node-telegram-bot-api';
import axios from 'axios';
import getRandomElement from './getRandomElement.mjs';
import { TELEGRAM_API_KEY, axiosConfig } from './api.mjs';
import { exec } from "child_process";

const bot = new Telegram(TELEGRAM_API_KEY, { polling: true });

const phrases = ["Ух ты!", "Вот это да!", "Невероятно!", "Кто бы мог подумать!", "Аче!", "И такое бывает!", "Замечательно!"];

bot.on('voice', (message) => {
    const stream = bot.getFileStream(message.voice.file_id);

    let chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));

    stream.on('end', async () => {
        const phrase = getRandomElement(phrases);

        const response = await axios({
            data: Buffer.concat(chunks),
            ...axiosConfig
        });

        const result = response.data.result;

        const words = result.toLowerCase().split(' ');

        const condition1 = (words.includes("выключи")
            || words.includes("выключишь"))
            && (words.includes("пк")
                || words.includes("компьютер")
                || words.includes("комп"));

        const shutdownSeconds = words.includes("секунд")
            ? words[(words.indexOf("секунд") - 1)]
            : "";

        const shutdownMinutes = words.includes("минут")
            || words.includes("минуты")
            || words.includes("минуту")
            ? words[(words.indexOf("минут") - 1)
            || (words.indexOf("минуту") - 1)
            || (words.indexOf("минуты") - 1)]
            : "";

        const isShutdownNow = words.includes("сейчас")
            || words.includes("секунду")
            || result.toLowerCase().includes("прямо сейчас");

        const isCancelShuttingDown = words.includes("отмени")
            || words.includes("отмена")
            || words.includes("отменить")
            || words.includes("стоп")
            || words.includes("передумал")
            || words.includes("не");

        const isHibernate = words.includes("спящий")
            || result.toLowerCase().includes("спящий режим")
            || words.includes("сон");

        if (condition1) {
            if (shutdownSeconds) {
                bot.sendMessage(message.chat.id, `Выключу компьютер через ${shutdownSeconds} секунд`)
                exec(`shutdown /s /t ${shutdownSeconds}`);
            } else if (shutdownMinutes) {
                if (+shutdownMinutes === 1) {
                    sendMessage(message.chat.id, `Выключу компьютер через 1 минуту`);
                    exec(`shutdown /s /t 60`)
                } else {
                    bot.sendMessage(message.chat.id, `Выключу компьютер через ${shutdownMinutes} минут`);
                    exec(`shutdown /s /t ${+shutdownMinutes * 60}`)
                }
            } else if (isShutdownNow) {
                bot.sendMessage(message.chat.id, "Выключаю компьютер сейчас")
                exec("shutdown /s /t 0");
            } else {
                bot.sendMessage(message.chat.id, "Скоро выключу компьютер")
                exec("shutdown /s");
            }
        } else if (isCancelShuttingDown) {
            bot.sendMessage(message.chat.id, "Как скажешь")
            exec("shutdown /a");
        } else if (isHibernate) {
            bot.sendMessage(message.chat.id, "Отдыхайте")
            exec("shutdown /h");
        } else (
            bot.sendMessage(message.chat.id, `${phrase} ${result}`)
        )
    })
});