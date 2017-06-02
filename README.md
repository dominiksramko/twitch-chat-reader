# Twitch Chat Reader
Reads Twitch chat using text-to-speech [service](https://responsivevoice.org).

## How to build

1. Clone the repository.
2. Run `npm install` within the directory.

## Setup
1. Go to `dev` folder.
2. Create a self-signed certificate using: `openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -days 365`
3. Put your passphrase into `server.js`

## Development
1. Run `npm run start` to run the https server.
2. Run `gulp watch` to watch changes in the `src` folder.
3. Add following code into your bookmarks: `javascript:void((function(){var e=document.createElement('script');e.setAttribute('type','text/javascript');e.setAttribute('charset','UTF-8');e.setAttribute('src','https://localhost:3000/tcr.js');document.body.appendChild(e)})());`
4. Open a Twitch stream.
5. Click on the `TCR` bookmark.
6. Open the gear icon to adjust settings.
