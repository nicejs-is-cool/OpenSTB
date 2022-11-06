import io, { Socket } from 'socket.io-client';
import * as stb from 'strollbox'
import * as dom from './dom';
import * as util from './util'
import eventl from './eventl'
import * as dconv from './dconv';
import '../scss/dialog.scss'
//import { render } from "solid-js/web";

const socket: Socket<stb.ServerToClientEvents, stb.ClientToServerEvents> = io();

export const _Socket = socket;
export const DOM = dom;
export const Util = util;
export const DataConverter = dconv;
export const Events = eventl;
export let selfUser: stb.User;

//util.sendSystemMessage('Hello world!')
socket.on('connect', () => {
    socket.emit('user joined', 'OpenSTB user', 'lime');
    util.SendSystemMessage('Connected.');
})

socket.on('user joined', util.UserJoin)

socket.on('user left', util.UserLeft)

socket.on('message', message => {
    //dom.printMsg(message);
    //console.log(message);
    eventl.emit('ConvertMessage', message);
})

eventl.on('SendMessage', message => {
    socket.send(message);
})

dom.StartListeningForInput();

socket.on('update users', users => {
    eventl.emit('UpdateUsers', users);
    selfUser = users[socket.id];
})

socket.on('update rooms', rooms => {
    eventl.emit('UpdateRooms', rooms, selfUser.inroom);
})

dom.InitUserRoomSwitcher();

eventl.on('JoinRoom', (name, pass) => {
    socket.emit('join room', name, pass);
})