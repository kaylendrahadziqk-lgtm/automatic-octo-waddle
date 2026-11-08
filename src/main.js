import '@fontsource/outfit/latin-500.css';
import '@fontsource/outfit/latin-700.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-600.css';
import '../style.css';
import {UI} from './ui/UI.js';
import {Game} from './core/Game.js';
const ui=new UI();const game=new Game(ui);game.init().then(()=>{if(import.meta.env.DEV||new URLSearchParams(location.search).has('test'))window.__game=game;}).catch(error=>{console.error(error);document.querySelector('#loading').innerHTML='<h2>We couldn’t wake up the sanctuary.</h2><p>Please use a current Chrome or Edge browser with hardware acceleration and WebGL2 enabled.</p><button onclick="location.reload()">Try again</button>';});
if(import.meta.hot)import.meta.hot.dispose(()=>game.dispose());
