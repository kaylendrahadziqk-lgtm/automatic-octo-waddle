import * as T from 'three';
export const STORY_DURATION=108;
export const STORY_BEATS=[
 {at:0,speaker:'',text:'Sore itu, sebuah rumah kecil bersiap menyambut anggota keluarga baru.',eye:[6,3.5,4.5],look:[0,1,9.5]},
 {at:8,speaker:'Nazwa',text:'Assalamu’alaikum… akhirnya sampai juga. Selamat datang di rumah, Miko.',eye:[0,2.7,5.5],look:[-2,2,8]},
 {at:18,speaker:'Raina',text:'Pelan-pelan taruh di sini. Biar dia lihat-lihat dulu.',eye:[0,2.7,5.7],look:[2.5,1.9,8]},
 {at:27,speaker:'Raina',text:'Kayaknya masih takut.',eye:[2.2,1.1,7.5],look:[0,.9,10]},
 {at:34,speaker:'Nazwa',text:'Tempat baru, bau baru… kita juga baru kenal. Tunggu aja.',eye:[-4,2.5,5.5],look:[0,1,8.5]},
 {at:45,speaker:'',text:'Sesuatu bergerak di karpet. Rasa penasaran Miko akhirnya mengalahkan rasa takutnya.',eye:[-6,1.3,7],look:[-3,.6,4]},
 {at:54,speaker:'Raina',text:'Baru datang, mainannya sudah disembunyikan.',eye:[-4,1.6,6],look:[-2,.7,2]},
 {at:62,speaker:'Nazwa',text:'Berarti nanti kita sering cari barang di bawah sofa.',eye:[2,2.4,6],look:[-2,1.1,4]},
 {at:71,speaker:'Nazwa',text:'Airnya di dapur. Tempat tidur Miko juga sudah siap.',eye:[11,3.4,11],look:[7,.7,7]},
 {at:79,speaker:'Raina',text:'Kotak pasirnya di tempat tenang, jauh dari makanannya. Kita belajar kebiasaan dia pelan-pelan, ya.',eye:[8,2.5,12],look:[6,.6,9]},
 {at:90,speaker:'Nazwa',text:'Iya. Kita belum pernah pelihara kucing, tapi kita belajar bareng.',eye:[-.5,2.5,5.6],look:[-2,1.6,8]},
 {at:99,speaker:'Raina',text:'Ayo, Miko. Masih banyak yang belum kamu lihat.',eye:[4,3,12],look:[0,.8,8.5]}
];
export class IntroStory {
 constructor(game){this.game=game;this.time=0;this.beat=-1;this.duration=STORY_DURATION;this.active=false;this.paused=false;
 const el=document.createElement('section');el.id='story';el.className='hidden';el.innerHTML='<div class="cinema-top"><span>MIKO · RUMAH BARU</span><div><button id="story-pause">Jeda</button><button id="story-skip">Lewati cerita →</button></div></div><div class="chapter-title"><span>BAB PERTAMA</span><h2>Rumah baru untuk Miko</h2><p>Nazwa, Raina, dan sebuah pertemuan kecil.</p></div><div class="subtitle" role="status" aria-live="polite"><strong id="speaker"></strong><p id="dialogue"></p></div><div class="story-progress"><i></i></div>';document.querySelector('#ui').append(el);this.el=el;el.querySelector('#story-skip').onclick=()=>this.finish();el.querySelector('#story-pause').onclick=()=>this.togglePause();
 }
 start(){document.querySelector('#toast').classList.remove('visible');this.game.world.carrier.visible=true;this.game.cat.root.rotation.y=0;this.time=0;this.beat=-1;this.active=true;this.paused=false;this.game.mode='story';this.game.input.clear();this.game.ui.show('story');this.el.classList.remove('hidden');this.el.querySelector('#story-pause').textContent='Jeda';this.update(0);}
 togglePause(){this.paused=!this.paused;this.el.querySelector('#story-pause').textContent=this.paused?'Lanjutkan':'Jeda';}
 update(dt){if(!this.active||this.paused)return;this.time=Math.min(this.duration,this.time+dt);const t=this.time,g=this.game;let index=STORY_BEATS.findLastIndex(b=>t>=b.at);const beat=STORY_BEATS[index];if(index!==this.beat){this.beat=index;this.el.querySelector('#speaker').textContent=beat.speaker||'Rumah baru untuk Miko';this.el.querySelector('#dialogue').textContent=beat.text;g.world.speaker=beat.speaker;}
 const progress=(t-beat.at)/((STORY_BEATS[index+1]?.at||this.duration)-beat.at);const eye=new T.Vector3(...beat.eye);eye.x+=Math.sin(progress*Math.PI)*.35;eye.y+=progress*.12;g.graphics.camera.position.copy(eye);g.graphics.camera.lookAt(new T.Vector3(...beat.look));
 let p=new T.Vector3(0,0,10.4),speed=0;
 if(t>26&&t<45){const f=T.MathUtils.smoothstep(t,26,45);p.lerp(new T.Vector3(0,0,7.6),f);speed=1;}
 else if(t>=45&&t<70){const f=T.MathUtils.smoothstep(t,45,57);p.set(-3*f,Math.sin(Math.min(1,(t-45)/8)*Math.PI)*.6,7.6-4*f);speed=t<57?3:0;g.cat.root.rotation.y=.5;const ball=g.world.interactables.find(a=>a.type==='toy').object;ball.position.set(t>54?-1.6:-2.5,.2,t>54?3-Math.min(t-54,3)*.5:3);}
 else if(t>=70&&t<90){p.set(6,0,9);g.cat.root.rotation.y=2.4;}
 else if(t>=90){p.set(-1.3,0,8.8);g.cat.root.rotation.y=-.6;}
 g.cat.root.position.copy(p);g.cat.update(dt,speed,true,0,false);this.el.querySelector('.chapter-title').classList.toggle('visible',t<7);this.el.querySelector('.story-progress i').style.width=`${t/this.duration*100}%`;if(t>=this.duration)this.finish();
 }
 finish(){if(!this.active)return;this.active=false;this.el.classList.add('hidden');this.game.world.speaker=null;try{localStorage.setItem('miko-intro-seen','1');}catch{}this.game.beginPlay();this.game.ui.toast('Rumah baru, teman baru. Dekati Nazwa atau Raina, lalu tekan E.');}
}
