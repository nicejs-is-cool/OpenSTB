import { AppendMessage, printMsg, UserToHTML } from "./dom";
import * as stb from 'strollbox'
import { Message, User } from "./classes";

export class MessageFactory {
    constructor(
        public content: string,
        public date: number,
        public user: stb.User,
        public html: boolean
    ) {}
    static Create(content: string, nick: string, color: string) {
        return new MessageFactory(content, Date.now(), {
            nick,
            color,
            home: 'local',
            inroom: 'amogus',
            system: true,
            html: true
        }, true);
    }
}

export function SendSystemMessage(content: string) {
    /*printMsg({
        content,
        date: Date.now(),
        user: {
            nick: '[OpenSTB]',
            color: 'lime',
            home: 'local',
            inroom: 'your mothers house',
            system: true,
            html: true
        },
        html: true
    })*/
    AppendMessage(new Message(
        content,
        new Date(),
        new User('[OpenSTB]', 'lime', 'local', 'your mothers house', true)
    ));
}

export function UserAnnouncement(user: stb.User, action: string) {
    //return SendSystemMessage(`${UserToHTML(user).outerHTML} <em>${action}</em>`);
    /*return printMsg(
        MessageFactory.Create(`${UserToHTML(user).outerHTML} <em>${action}</em>`, "~", "green")
    )*/
    const spanEl = document.createElement('span');
    const usernameEl = UserToHTML(user)
    const emEl = document.createElement('em');
    emEl.innerText = ` ${action}`
    spanEl.appendChild(usernameEl);
    spanEl.appendChild(emEl);
    
    AppendMessage(
        new Message(
            //`${UserToHTML(user).outerHTML} <em>${action}</em>`,
            spanEl,
            new Date(),
            new User('~', 'green', 'local', 'here', true)
        )
    )
}

export function UserJoin(user: stb.User) {
    return UserAnnouncement(user, "joined the strollbox");
}

export function UserLeft(user: stb.User) {
    return UserAnnouncement(user, "left the strollbox");
}
