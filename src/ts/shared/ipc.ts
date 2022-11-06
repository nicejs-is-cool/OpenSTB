import msgpack from 'msgpack-lite'

export enum Message {
    event = 0x0000,
    print_message = 0x0001
}

export type MessageKeys = "event" | "print_message"

export class IPCMessageClient<T> {
    constructor(
        public msgType: MessageKeys,
        public replyId: number,
        public data: T
    ) {}
    static Packer(t: IPCMessageClient<any>) {
        return msgpack.encode([ Message[t.msgType], t.replyId, t.data ]);
    }
    static Unpacker<T>(t: any): IPCMessageClient<T> {
        let [ msgType, replyId, data ] = msgpack.decode(t);
        return new IPCMessageClient(msgType, replyId, data);
    }
}

export class IPCMessageServer<T> {
    constructor(
        public msgType: MessageKeys,
        public replyId: number,
        public data: T,
        public error: boolean
    ) {}
    static Packer(t: IPCMessageServer<any>) {
        return msgpack.encode([ Message[t.msgType], t.replyId, t.data, t.error ]);
    }
    static Unpacker<T>(t: any): IPCMessageServer<T> {
        let [ msgType, replyId, data, error ] = msgpack.decode(t);
        return new IPCMessageServer(msgType, replyId, data, error);
    }
}

export const codec = msgpack.createCodec();
codec.addExtPacker(0x20, IPCMessageClient, IPCMessageClient.Packer)
codec.addExtUnpacker(0x20, IPCMessageClient.Unpacker)
//@ts-ignore
codec.addExtPacker(0x21, Date, [Number, msgpack.encode])

export class IPCError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = 'IPCError';
    }
}

export class IPCEventMessage {
    public args: any[];
    constructor(
        public event: string,
        ...args: any[]
    ) {
        this.args = args;
    }
    static Packer(t: IPCEventMessage) {
        return msgpack.encode([t.event, ...t.args]);
    }
    static Unpacker(t: any): IPCEventMessage {
        let [ event, ...args ] = msgpack.decode(t);
        return new IPCEventMessage(event, ...args);
    }
}

codec.addExtPacker(0x22, IPCEventMessage, IPCEventMessage.Packer);
codec.addExtUnpacker(0x22, IPCEventMessage.Unpacker);
