declare module 'strollbox' {
    export interface Message {
        content: string;
        date: number;
        html: boolean;
        user: User;
        id?: string;
    }
    export interface User {
        home: string;
        nick: string;
        system: boolean;
        color: string;
        inroom: string;
        html?: boolean;
    }
    export interface UserIdMap {
        [key: string]: User;
    }
    export interface ConnectData {
        home: string;
    }
    export interface Room {
        name: string;
        locked: boolean;
        users: UserIdMap;
    }
    export interface RoomNameMap {
        [key: string]: Room;
    }
    export interface UserJoinRoom {
        name: string;
        locked: boolean;
        user: User;
    }
    export interface ServerToClientEvents {
        message: (o: Message) => void;
        "update users": (o: UserIdMap) => void;
        typing: (o: UserIdMap) => void;
        "connect data": (o: ConnectData) => void;
        "update rooms": (o: RoomNameMap) => void;
        "user joined": (o: User) => void;
        "user left": (o: User) => void;
        "user join room": (o: UserJoinRoom) => void;
        "join room resp": (error: boolean, status: "SUCCESS" | string) => void;
    }
    export interface ClientToServerEvents {
        typing: (typing: boolean) => void;
        message: (msg: string) => void;
        "user joined": (nickname: string, color: string) => void;
        "join room": (name: string, password?: string) => void;
    }
    
}