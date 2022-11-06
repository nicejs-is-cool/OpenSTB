//import socket from "./socket";
import * as stb from 'strollbox';
import { io, Socket } from 'socket.io-client'

const socket: Socket<stb.ServerToClientEvents, stb.ClientToServerEvents> = io();

socket.on("connect", () => {    
    socket.emit('user joined', "cum", "green");
})

