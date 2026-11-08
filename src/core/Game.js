import {Renderer} from './Renderer.js';
import {PhysicsWorld} from '../physics/PhysicsWorld.js';
import {Shelter} from '../world/Shelter.js';
import {RobotDog} from '../character/RobotDog.js';
import {Movement} from '../character/Movement.js';
import {InputManager} from '../controls/InputManager.js';
import {ThirdPersonCamera} from '../camera/ThirdPersonCamera.js';
import {AudioManager} from '../audio/AudioManager.js';
import {InteractionSystem} from '../interaction/InteractionSystem.js';
import {disposeAssets} from '../world/Props.js';
export class Game{
 constructor(ui){this.ui=ui;this.mode='menu';this.time=0;this.accumulator=0;this.last=performance.now();this.fps=60;this.frames=0;this.measure=0;this.audio=new AudioManager();}
 async init(){this.graphics=new Renderer(document.querySelector('#game'));document.querySelector('#load-status').textContent='Calibrating paws & physics…';this.physics=await new PhysicsWorld().init();this.world=new Shelter(this.graphics.scene,this.physics);this.dog=new RobotDog(this.graphics.scene);this.movement=new Movement(this.physics,this.dog,this.audio);this.input=new InputManager(document.querySelector('#game'));this.camera=new ThirdPersonCamera(this.graphics.camera,this.world.obstacles);this.interactions=new InteractionSystem(this.world,this.movement,this.audio,this.ui);this.ui.bind(this);this.applySettings();this.dog.root.position.set(0,0,12);this.graphics.scene.updateMatrixWorld(true);this.ui.ready();this.visibility=()=>{if(document.hidden&&this.mode==='play')this.pause();this.last=performance.now();};document.addEventListener('visibilitychange',this.visibility);this.frame=()=>{this.tick();this.raf=requestAnimationFrame(this.frame);};this.frame();}
 applySettings(key){const s=this.ui.settings;if(!key||key==='quality')this.graphics.apply(s.quality);this.camera.sensitivity=s.sensitivity;if(!key||key==='distance')this.camera.distance=s.distance;this.audio.setVolume(s.volume);this.audio.music=s.music;}
 play(){this.mode='play';this.input.clear();this.ui.show('play');this.audio.start().catch(()=>this.ui.toast('Audio unavailable. You can still explore.'));this.last=performance.now();}
 pause(){if(this.mode!=='play')return;this.mode='paused';this.input.clear();this.ui.pause();}
 resume(){this.mode='play';this.input.clear();this.ui.show('play');this.last=performance.now();}
 menu(){this.mode='menu';this.input.clear();this.ui.show('menu');}
 tick(){const now=performance.now(),dt=Math.min((now-this.last)/1000,.05);this.last=now;this.time+=dt;if(this.input.consume('Escape')){if(this.mode==='play')this.pause();else if(this.mode==='paused')this.resume();else this.ui.closeModal();}if(this.mode==='play'){this.accumulator=Math.min(this.accumulator+dt,.1);while(this.accumulator>=1/60){this.movement.update(1/60,this.input,this.camera.yaw);this.interactions.update(1/60,this.input);this.accumulator-=1/60;}this.world.update(dt,this.time);this.audio.update(dt);}else if(this.mode==='menu'){this.dog.update(dt,0,true,0);this.world.update(dt,this.time);}
 if(this.mode==='paused')this.input.clear();this.camera.update(dt,this.dog.root.position,this.input);if(this.mode==='menu'){// A close companion portrait with the room stretching behind it.
 const p=this.dog.root.position;this.graphics.camera.position.set(p.x+3.7,p.y+2.8,p.z-5.5);this.graphics.camera.lookAt(p.x+2.1,p.y+.8,p.z);}
 this.graphics.render();this.frames++;this.measure+=(now-this.measureLast||16.67)/1000;this.measureLast=now;if(this.measure>1){this.fps=this.frames/this.measure;this.ui.update(this,this.fps);this.frames=0;this.measure=0;if(this.mode==='play')this.graphics.adapt(this.fps);}}
 dispose(){cancelAnimationFrame(this.raf);document.removeEventListener('visibilitychange',this.visibility);this.input.dispose();this.audio.dispose();this.physics.dispose();this.graphics.scene.traverse(o=>{if(o.material?.map)o.material.map.dispose();});this.world.batched.forEach(g=>g.dispose());disposeAssets();this.graphics.dispose();}
}
