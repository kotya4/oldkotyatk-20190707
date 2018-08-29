from aiogram import Bot, types
from aiogram.dispatcher import Dispatcher
from aiogram.utils import executor

bot = Bot(token='646357441:AAGOwonTs3T9fZfN8KxCE22FMxtA-bWYhPI')
dp = Dispatcher(bot)

@dp.message_handler(commands=['start', 'help'])
async def send_welcome(message: types.Message):
    await message.reply("Hi!\nI'm EchoBot!\nPowered by aiogram.")

if __name__ == '__main__':
    executor.start_polling(dp)
