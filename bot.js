const Discord = require('discord.js');
let config = require('./config.json');
const bot = new Discord.Client();
let token = config.token;
let prefix = config.prefix;

const guildId = '822489046629482566';
const orderChanel = '822489046819012692';
const clientCh = '822489046819012693';
const adminCh = '823561400374394952';
const readyCh = '823594245737938974';
const line = '======================================='


bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  load();
});










bot.on('messageReactionAdd', async (ctx, user) => {
	let a = ctx.message.content.split('\n')[0];
	if(ctx.message.channel.id !== clientCh || a == line){
		return;
	}
	let orderId = ctx.message.content.split(' ')[1];
	orderId = orderId.split("#")[1];
	bot.users.cache.get(user.id).send('Заказ #'+ orderId+' закреплен за вами \n\n' + 'Отправьте мне сообщение " + *Номер заказа* ", когда будете готовы отдать заказ \n Для отмены " Отмена *Номер заказа*"' +`\n`+ line);
	let msg = await bot.channels.cache.get(adminCh).messages.fetch(orderId);
	msg.edit('<@!' + user.id +'>!'+ `\n`+ msg.content);
	ctx.message.delete();
})



bot.on('message', async (ctx) => {
	if (ctx.channel.type == 'dm'){
		dm(ctx);
		return;
	}
	if(ctx.channel.id !== orderChanel){
		return;
	}
	let qwe = await bot.channels.cache.get(adminCh).send(ctx.content + `\n`+ " <@!" +ctx.author.id + ">" + ' \n' + line );
	bot.channels.cache.get(clientCh).send('Заказ #' + qwe.id +' \n\n' +ctx.content + ' \n\n' + line);
	ctx.delete();
})
async function load() {
	bot.channels.cache.get(clientCh).send('\n\n' + line +'\n' + line +'\n' + line +'\n' + line +'\n' + line +'\n' + '               Заказы выше более недействительны');
}



async function dm(ctx) {
	if(ctx.content.startsWith('+')){
		let orderId = ctx.content.split('+')[1];
		orderId = orderId.split(' ');
		orderId = orderId[orderId.length - 1];
		if(orderId.startsWith('#')){
			orderId = orderId.split('#')[1];
		}
		let msg;
		try{
			msg = await bot.channels.cache.get(adminCh).messages.fetch(orderId);
		} catch{
			ctx.reply('Номер заказа не найден');
			return;
		}
		let a = `<@!${ctx.author.id}>`;
		if(!Number.isInteger(+orderId) || !msg.content.startsWith(a)){
			ctx.reply('Номер заказа не найден');
			return;
		}
		bot.channels.cache.get(readyCh).send('Заказ #' + orderId + ' готов'+' \n\n' +msg.content);
		ctx.reply('В ближайшее время с вами свяжется диллер');
		return;
	}
	if(ctx.content.toLowerCase().startsWith('отмена')){
		let orderId = ctx.content.toLowerCase().split('отмена')[1];
		orderId = orderId.split(' ');
		orderId = orderId[orderId.length - 1];
		console.log(orderId);
		if(orderId.startsWith('#')){
			orderId = orderId.split('#')[1];
		}
		console.log(orderId);
		let msg;
		try{
			msg = await bot.channels.cache.get(adminCh).messages.fetch(orderId);
		} catch{
			ctx.reply('Номер заказа не найден');
			return;
		}
		let a = `<@!${ctx.author.id}>`;
		if(!Number.isInteger(+orderId) || !msg.content.startsWith(a)){
			ctx.reply('Номер заказа не найден');
			return;
		}
		let newMsg = msg.content.split(a +'!')[1];
		let newMsgCont = newMsg.split('\n');
		newMsgCont = newMsgCont[newMsgCont.length - 3]
		bot.channels.cache.get(clientCh).send('Заказ #' + orderId +' \n\n' +newMsgCont + ' \n\n' + line);
		msg.edit(newMsg);
		
	}
}

bot.login(token);