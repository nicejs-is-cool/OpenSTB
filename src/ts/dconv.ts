import * as stb from 'strollbox'
import { Message, User } from './classes'
import eventl from './eventl';
export function MessageConverter(msg: stb.Message) {
    let htmlMsg;
    let htmlNick;
    if (msg.html) {
        const cumshitandfard = document.createElement('span');
        cumshitandfard.innerHTML = msg.content;
        htmlMsg = cumshitandfard;
    }
    if (msg.user.html) {
        const cumshitandfard = document.createElement('span');
        cumshitandfard.innerHTML = msg.user.nick;
        htmlNick = cumshitandfard;
    }
    const user = new User(
        msg.user.html ? (htmlNick ?? "") : msg.user.nick,
        msg.user.color, msg.user.home, msg.user.inroom, msg.user.system);
    const msgc = new Message(
        msg.html ? (htmlMsg ?? "") : msg.content,
        new Date(msg.date), user, msg.id);
    //console.log(msgc);
    return msgc;
}

eventl.on('ConvertMessage', msg => {
    eventl.emit('PrintMessage', MessageConverter(msg));
})