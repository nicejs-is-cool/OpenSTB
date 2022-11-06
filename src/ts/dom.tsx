import * as stb from 'strollbox'
import he from 'he';
import eventl from './eventl';
import { User, type Message } from './classes';
import { ParentProps } from 'solid-js';

//#region Elements
const stb_scroll = document.getElementById('stb_scroll') as HTMLDivElement
if (!stb_scroll) throw 'scroll element not found';
export const Scroll = stb_scroll;

const stb_form = document.getElementById('stb_form') as HTMLFormElement
if (!stb_form) throw 'form element not found';
export const Form = stb_form;

const stb_input = document.getElementById('stb_input') as HTMLTextAreaElement
if (!stb_input) throw 'input element not found';
export const Input = stb_input;

const stb_userlist = document.getElementById('stb_infos_users') as HTMLTextAreaElement
if (!stb_userlist) throw 'infos users element not found';
export const UserList = stb_userlist;

const stb_roomlist = document.getElementById('stb_infos_rooms');
if (!stb_roomlist) throw 'rooms element not found';
export const RoomList = stb_roomlist;

//#endregion

export const Settings = new Map<string, any>([
  ["strictness", 1]
]);
/**
 * @deprecated Use {@link AppendMessage} instead
 */
export function printMsg(data: stb.Message) {
    if (!stb_scroll) throw new Error('scroll element not found')
    if (!data || typeof data.content !== 'string' || data.content.trim() == '') return;
    if (data.user.nick == null) return;
    if (!data.user.home) return;
    //if ((data.user.home !== 'local' && blocked.includes(data.home))) return;
    if (typeof data.user.nick != "string") return;

    //var cmd = getCmd(data.content);
    /*if (cmd) {
      if (cmd.cmd === 'exe') data.content = '<div class="stb_exe"><button title="' + warnTxt + '" onclick="' + exeScript + '" data-exe="' + btoa(cmd.val) + '">/exe</button>' + he.encode(cmd.val) + '</div>';
    } else if (!data.html) {
      data.content = twemoji.parse(md2html(data.content)).innerHTML;
    }*/

    var span = document.createElement('span');
    span.innerHTML = data.content;
    span.classList.add('stb_msg');
    if (data.id) span.id = data.id; else span.classList.add('stb_sysmsg');

    var tbh = document.createElement('span');
    tbh.className = 'stb_h';
    tbh.innerText = hourString(data.date);

    var div = document.createElement('div');
    data.user.nick = data.user.nick || '\u25CF';
    div.className = 'stb_line ui_group';
    div.appendChild(tbh);
    let el = UserToHTML(data.user)
    if (el) div.appendChild(el);
    div.appendChild(span);
    stb_scroll.appendChild(div);

    //try { PPing(data, div); } catch (e) { console.error(e); }

    if (getScrollPos() > 90) scrollDown();
    return div;
}
/**
 * @deprecated Use {@link UserToHTML} instead
 */
export function printNick(data: stb.User) {
  if (data.nick === undefined) data.nick = '\u25CF';
  if (data.color === undefined) data.color = 'white';
  if (!data.html) data.nick = he.encode(data.nick || '');
  if (he.decode(data.nick || "") === "") data.nick = '\u25CF';
  if (typeof data.nick !== "string") return;

  var span = document.createElement('span');
  /*if (data.home) if (blocked.includes(data.home)) {
    var blockSpan = document.createElement('span');
    blockSpan.style.float = 'left';
    blockSpan.style.marginRight = '4px';
    blockSpan.style.marginTop = "1px";
    blockSpan.innerHTML = "\u274C";
    span.appendChild(blockSpan);
  }*/

  span.classList.add("stb_nick");
  span.innerHTML += data.nick;
  span.style.color = data.color;

  //return twemoji.parse(span);
  return span;
}

/**
 * Converts a trollbox user object to html
 * @param user Strollbox user object
 * @returns HTML Span Element
 */
export function UserToHTML(user: stb.User) {
  if (!user.nick && Settings.get('strictness') >= 1) throw new Error('Nick property missing');
  if (!user.color && Settings.get('strictness') >= 2) throw new Error('Color property missing');
  if (!user.color) user.color = "white";
  if (typeof user.nick !== "string" && Settings.get('strictness') >= 1) throw new Error('Wrong datatype on nick');

  const span = document.createElement('span');

  span.classList.add('stb_nick');
  if (user.html)
    span.innerHTML = user.nick; else; span.innerText = user.nick;
  span.style.color = user.color;
  return span;
}

/**
 * Converts a trollbox user class to html
 * @param user User class instance
 */
export function UserInstanceToHTML(user: User) {
  if (!user.nick && Settings.get('strictness') >= 1) throw new Error('Nick property missing');
  if (!user.color && Settings.get('strictness') >= 2) throw new Error('Color property missing');
  if (!user.color) user.color = "white";
  if (typeof user.nick !== "string" && Settings.get('strictness') >= 1) throw new Error('Wrong datatype on nick');

  const span = document.createElement('span');

  span.classList.add('stb_nick');
  span.appendChild(user.toHTML());
  span.style.color = user.color;
  return span;
}

export namespace stbe {
  export function MessageContent(props: ParentProps<{ id?: string, system: boolean}>) {
    return <span
      id={props.id}
      class={props.system ? "stb_msg stb_sysmsg" : "stb_msg"}
    >{props.children}</span>
  }
  export function MessageTime(props: ParentProps<{ date: Date }>) {
    return <span class="stb_h">{ DateToString(props.date) }</span>
  }
  export function Line(props: ParentProps) {
    return <div class="stb_line ui_group">{props.children}</div>
  }
}

export function AppendMessage(message: Message) {
  // checks
  if (!message.content) throw new Error('Cannot append empty message!');
  if (!message.date && Settings.get('strictness') >= 2) throw new Error('Date undefined!');
  if (!message.date) message.date = new Date();
  if (!message.user) throw new Error('No user');
  if (!message.user.nick) throw new Error('Cannot append message with no nick!');
  if (typeof message.user.nick !== "string") throw new Error('nick has the wrong datatype!');

  // actual messsage content element
  /*const span = document.createElement('span');
  span.appendChild(message.toHTML());
  span.classList.add('stb_msg');


  if (message.id) span.id = message.id;
  if (message.user.system) span.classList.add('stb_sysmsg');

  // date on the left
  const time = document.createElement('span');
  time.classList.add('stb_h');
  time.appendChild(
    document.createTextNode(DateToString(message.date))
  );

  // the line containing this message
  const line = document.createElement('div');
  const userElement = UserInstanceToHTML(message.user);

  line.classList.add('stb_line', 'ui_group');

  line.appendChild(time);
  line.appendChild(userElement);
  line.appendChild(span);*/

  const line = <stbe.Line>
    <stbe.MessageTime date={message.date}/>
    {UserInstanceToHTML(message.user)}
    <stbe.MessageContent id={message.id} system={message.user.system}>{message.toHTML()}</stbe.MessageContent>
  </stbe.Line>

  Scroll.appendChild(line as Node);

  if (getScrollPos() > 90) eventl.emit('AutoScroll');

  return line;
}

export function getScrollPos() {
  var scrollTop = stb_scroll.scrollTop + stb_scroll.offsetHeight;
  var documentHeight = stb_scroll.scrollHeight;
  var scrollPercent = Math.floor((scrollTop / documentHeight) * 100);
  return scrollPercent;
}
export function scrollDown() {
  setTimeout(function () { stb_scroll.scrollTop = stb_scroll.scrollHeight; }, 200)
}
/**
 * @deprecated Use {@link DateToString} instead
 */
export function hourString(dtn: number) {
  var dt = new Date(dtn);
  var h = dt.getHours().toString().padStart(2, '0');
  var m = dt.getMinutes().toString().padStart(2, '0');
  return h + ':' + m;
}
export function DateToString(date: Date) {
  var hours = date.getHours().toString().padStart(2, '0');
  var minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`
}
export function GetInput(): string {
  return Input.value;
}
export function ClearInput(): string {
  return Input.value = "";
}
export function InputFunction(t: Event) {
  const text = GetInput();
  ClearInput();
  t.preventDefault();
  eventl.emit('SendMessage', text);
}
export function TextSubmitFunction(t: KeyboardEvent) {
  if (t.keyCode === 13 && !t.shiftKey) {
    InputFunction(t);
  }
}
export function StartListeningForInput() {
  Form.addEventListener('submit', InputFunction);
  Input.addEventListener('keydown', TextSubmitFunction)
}

eventl.on('PrintMessage', msg => {
  AppendMessage(msg);
})

eventl.on('AutoScroll', () => {
  scrollDown();
})

export function UpdateUsers(users: stb.UserIdMap) {
  UserList.innerHTML = ""; // clear it
  for (let [id, user] of Object.entries(users)) {
    const el = UserToHTML(user);
    UserList.appendChild(el);
  }
}

eventl.on('UpdateUsers', users => {
  UpdateUsers(users);
})

export function SwitchToUsersTab() {
  RoomList.style.display = 'none';
  UserList.style.display = '';
}

export function SwitchToRoomsTab() {
  RoomList.style.display = '';
  UserList.style.display = 'none'
}

export function InitUserRoomSwitcher() {
  document.getElementById('stb_infos_users_btn')?.addEventListener('click', event => {
    SwitchToUsersTab();
  })
  document.getElementById('stb_infos_rooms_btn')?.addEventListener('click', event => {
    SwitchToRoomsTab();
  })
}

export function UpdateRooms(users: stb.RoomNameMap, inRoom: string) {
  RoomList.innerHTML = "";
  for (const [name, room] of Object.entries(users)) {
    /*const el = document.createElement('span');
    el.innerText = `#${room.name}`;*/
    const fc = () => eventl.emit('JoinRoom', name, null);
    if (name === inRoom) {
      RoomList.appendChild((
        <b onclick={fc}>{room.locked ? '🔓 ': ''}#{room.name}</b>
      ) as Node);
      continue
    };
    RoomList.appendChild((
      <span onclick={fc}>{room.locked ? '🔓 ' : ''}#{room.name}</span>
    ) as Node);
  }
}

eventl.on('UpdateRooms', (rooms, inRoom) => UpdateRooms(rooms, inRoom));