import {Renderer} from './Renderer.js';
import {PhysicsWorld} from '../physics/PhysicsWorld.js';
import {Home} from '../world/Home.js';
import {IntroStory} from '../story/IntroStory.js';
import {Cat} from '../character/Cat.js';
import {Movement} from '../character/Movement.js';
import {InputManager} from '../controls/InputManager.js';
import {ThirdPersonCamera} from '../camera/ThirdPersonCamera.js';
import {AudioManager} from '../audio/AudioManager.js';
import {InteractionSystem} from '../interaction/InteractionSystem.js';
import {disposeAssets} from '../world/Props.js';
export class Game{
 constructor(ui){this.ui=ui;this.mode='menu';this.time=0;this.accumulator=0;this.last=performance.now();this.fps=60;this.frames=0;this.measure=0;this.audio=new AudioManager();}
 async init(){this.graphics=new Renderer(document.querySelector('#game'));document.querySelector('#load-status').textContent='Menyiapkan rumah dan langkah kecil Miko…';this.physics=await new PhysicsWorld().init();this.world=new Home(this.graphics.scene,this.physics);this.cat=new Cat(this.graphics.scene);this.movement=new Movement(this.physics,this.cat,this.audio);this.input=new InputManager(document.querySelector('#game'));this.camera=new ThirdPersonCamera(this.graphics.camera,this.world.obstacles);this.interactions=new InteractionSystem(this.world,this.movement,this.audio,this.ui);this.story=new IntroStory(this);this.ui.bind(this);this.applySettings();this.cat.root.position.set(0,0,7.2);this.graphics.scene.updateMatrixWorld(true);this.ui.ready();this.visibility=()=>{if(document.hidden&&this.mode==='play')this.pause();if(document.hidden&&this.mode==='story'&&!this.story.paused)this.story.togglePause();this.last=performance.now();};document.addEventListener('visibilitychange',this.visibility);this.frame=()=>{this.tick();this.raf=requestAnimationFrame(this.frame);};this.frame();}
 applySettings(key){const s=this.ui.settings;if(!key||key==='quality')this.graphics.apply(s.quality);this.camera.sensitivity=s.sensitivity;if(!key||key==='distance')this.camera.distance=s.distance;this.audio.setVolume(s.volume);this.audio.music=s.music;}
 play(){this.audio.start().catch(()=>this.ui.toast('Audio tidak tersedia. Kamu tetap bisa bermain.'));let seen=false;try{seen=localStorage.getItem('miko-intro-seen')==='1';}catch{}if(seen)this.beginPlay();else this.story.start();}
 beginPlay(){this.world.carrier.visible=false;this.mode='play';this.input.clear();this.movement.body.setTranslation({x:0,y:.8,z:8.5},true);this.movement.velocity.set(0,0,0);this.movement.vy=0;this.movement.rest=false;this.cat.root.position.set(0,0,8.5);this.cat.root.rotation.y=0;this.camera.ready=false;this.camera.target.set(0,1,8.5);this.ui.show('play');this.last=performance.now();}
 pause(){if(this.mode!=='play')return;this.mode='paused';this.input.clear();this.ui.pause();}
 resume(){this.mode='play';this.input.clear();this.ui.show('play');this.last=performance.now();}
 menu(){this.cat.root.position.set(0,0,7.2);this.cat.root.rotation.y=0;this.mode='menu';this.input.clear();this.ui.show('menu');}
 tick(){const now=performance.now(),rawDt=Math.max(0,(now-this.last)/1000),dt=Math.min(rawDt,.05);this.last=now;this.time+=dt;if(this.input.consume('Escape')){if(this.mode==='story')this.story.togglePause();else if(this.mode==='play')this.pause();else if(this.mode==='paused')this.resume();else this.ui.closeModal();}if(this.mode==='play'){this.accumulator=Math.min(this.accumulator+dt,.1);while(this.accumulator>=1/60){this.movement.update(1/60,this.input,this.camera.yaw);this.interactions.update(1/60,this.input);this.accumulator-=1/60;}this.world.update(dt,this.time);this.audio.update(dt);}else if(this.mode==='story'){if(!this.story.paused){this.world.update(dt,this.time);this.audio.update(dt);}this.story.update(rawDt);}else if(this.mode==='menu'){this.cat.update(dt,0,true,0);this.world.update(dt,this.time);}
 if(this.mode==='paused')this.input.clear();if(this.mode!=='story')this.camera.update(dt,this.cat.root.position,this.input);if(this.mode==='menu'){// A close companion portrait with the room stretching behind it.
 const p=this.cat.root.position;this.graphics.camera.position.set(p.x+3.8,p.y+3,p.z-5.2);this.graphics.camera.lookAt(p.x+1.8,p.y+1.1,p.z);}
 this.graphics.render();this.frames++;this.measure+=(now-this.measureLast||16.67)/1000;this.measureLast=now;if(this.measure>1){this.fps=this.frames/this.measure;this.ui.update(this,this.fps);this.frames=0;this.measure=0;if(this.mode==='play')this.graphics.adapt(this.fps);}}
 dispose(){cancelAnimationFrame(this.raf);document.removeEventListener('visibilitychange',this.visibility);this.input.dispose();this.audio.dispose();this.physics.dispose();this.graphics.scene.traverse(o=>{if(o.material?.map)o.material.map.dispose();});this.world.extraMaterials?.forEach(m=>{m.map?.dispose();m.dispose();});this.world.batched.forEach(g=>g.dispose());disposeAssets();this.graphics.dispose();}
}
