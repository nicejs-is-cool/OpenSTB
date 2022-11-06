import msgpack from 'msgpack-lite'
import { IPCMessageClient, codec, IPCError, IPCMessageServer, IPCEventMessage } from '../shared/ipc'
import events from './eventloop';

const awaitingIds = new Map<number, [Function, Function]>();

export function send<T>(msg: IPCMessageClient<any>): Promise<T> {
    return new Promise((resolve, reject) => {
        const buf = msgpack.encode(msg, { codec });
        self.postMessage(buf);
        awaitingIds.set(msg.replyId, [resolve, reject]);
    })
}

export function receive(rawmsg: any) {
    const ipcm: IPCMessageServer<any> = msgpack.decode(rawmsg, { codec });
    if (ipcm.msgType === "event") {
        let eventm: IPCEventMessage = ipcm.data;
        events.emit(eventm.event, ...eventm.args);
        return;
    }
    if (!awaitingIds.has(ipcm.replyId)) throw new IPCError('Unknown reply ID received: ' + ipcm.replyId);
    let prom = awaitingIds.get(ipcm.replyId);
    if (!prom) throw new IPCError('what the fu-');
    if (ipcm.error) return prom[1](ipcm.data);
    prom[0](ipcm.data);
}

self.addEventListener('message', ev => receive(ev.data));