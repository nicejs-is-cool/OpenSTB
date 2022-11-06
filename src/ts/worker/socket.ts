//import { io } from '../socket.io-client'
import io from 'socket.io-client'
import { Socket } from 'socket.io-client';
import * as stb from 'strollbox'
//import io from '../socket.io-client';

const socket: Socket<stb.ServerToClientEvents, stb.ClientToServerEvents> = io();

export default socket;