export class Message {
    constructor(
        public content: string | HTMLElement,
        public date: Date,
        public user: User,
        public id?: string
    ) {
        if (typeof this.content === "string") this.content = this.content.trim()
    }
    toHTML() {
        if (this.content instanceof HTMLElement) return this.content;
        return document.createTextNode(this.content);
    }
}
export class User {
    constructor(
        public nick: string | HTMLElement,
        public color: string,
        public home: string,
        public room: string,
        public system: boolean
    ) {}
    toHTML() {
        if (this.nick instanceof HTMLElement) return this.nick;
        return document.createTextNode(this.nick);
    }
}