# OpenSTB
Open-source client side rewrite of sustrollbox licensed under GPL 2.0.
### Building
```bash
$ pnpm install
$ pnpm build
```
### Using it
To actually use it you need to dump the strollbox client-side files, and replace `duck.js` with `bundle.js`.  
Why is it so overcomplicated? ~~Ask @amogsus~~ solid frontend is still in its very early stages lol.
### Commands
There's no commands right now, lol.
### Roadmap
- [x] Receiving messages
- [x] Input and sending messages
- [ ] Rewrite janken's functions (partially done)
- [ ] Switch to JSX. (partially done)
- [x] User list
- [ ] Rooms list (partially done)
- [ ] Username select
- [ ] Run socket.io and most of the client-side logic on a worker
- [ ] Showdown.js support
- [ ] twemoji
- [ ] Typing
- [ ] Display of who's typing
- [ ] Room password popup
- [ ] rmtb-like Popups
- [x] User joining/leaving messages
- [x] DuckConverter (convert stb's messages to internal format)
- [x] Users/Rooms buttons
- [x] Event loop
- [ ] Rewrite janken's CSS in SCSS
- [x] Drop `he` dependency.
