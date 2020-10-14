const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';

/*Save session in json file and use it for auto login
=================================================*/
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}
const client = new Client({
    session: sessionData
});
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});
client.on('ready', () => {
    console.log('Client is ready!');
});

let keys = [];
let map = new Map();

client.on('message', async message => {
    let chat = await message.getChat();
        keys.push(chat.id['user']);
        if (keys[chat.id['user'] == undefined]) {
            keys.forEach(key => {
                map.set(key, 100);
            });
        }
        console.log(chat.id['user']);
        console.log(map.get(chat.id['user']));
        switch (map.get(chat.id['user'])) {
            case 101:
                map.set(chat.id['user'], 102);
                client.sendMessage(message.from, 'Hi ' + message.body + '. Choose from the following options\n\n 1. Buy Cashew(Kaju) 799/Kg' +
                    '\n 2. Buy Special Cashew(Kaju) 849/Kg\n 3. Buy Walnut(Akhrot) 1349/Kg\n 4. Buy Almonds(Badam) 749/Kg\n 5. Buy Dates(Khajoor) 499/Kg' +
                    '\n 6. Buy Cashew(Kaju) 800/Kg\n 7. Buy Salted Pista 999/Kg\n 8. Buy Plain Pista 1399/Kg\n 9. Talk to our Executive');
                break;
            case 102:
                if (message.body === '9'){
                    map.set(chat.id['user'], 100);
                    client.sendMessage(message.from, 'Our Executive will get in touch shortly.\nThank you for your time.');
                }
                else {
                    map.set(chat.id['user'], 103);
                    client.sendMessage(message.from, 'Please enter quantity.\n Available quantities are 250g,500g and 1Kg');
                }
                break;
            case 103:
                map.set(chat.id['user'], 100);
                client.sendMessage(message.from, 'Thank you for your time. We will be in touch.');
                break;
            default:
                map.set(chat.id['user'], 101);
                client.sendMessage(message.from, 'Welcome to Alpha Group.I\'m Jimmy bot.');
                client.sendMessage(message.from, 'What shall we call you?');
        }
    });
client.initialize();