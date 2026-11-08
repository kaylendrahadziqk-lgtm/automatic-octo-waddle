export class AudioManager{
 constructor(){this.volume=.35;this.music=.3;this.tick=0;this.note=0;}
 async start(){if(!this.ctx){const Audio=window.AudioContext||window.webkitAudioContext;this.ctx=new Audio();this.master=this.ctx.createGain();this.master.connect(this.ctx.destination);this.master.gain.value=this.volume;}await this.ctx.resume();}
 setVolume(v){this.volume=v;if(this.master)this.master.gain.setTargetAtTime(v,this.ctx.currentTime,.05);}
 tone(freq,duration=.15,volume=.08,type='sine',end=null){if(!this.ctx||this.ctx.state!=='running')return;const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);if(end)o.frequency.exponentialRampToValueAtTime(end,t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0002,volume),t+.015);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.master);o.start();o.stop(t+duration+.02);o.onended=()=>{o.disconnect();g.disconnect();};}
 sound(kind){const s={step:[130,.06,.04,'triangle',75],jump:[260,.3,.1,'sine',700],land:[95,.15,.1,'triangle',40],ui:[650,.08,.07,'sine'],interact:[520,.3,.1,'sine',1040]};this.tone(...(s[kind]||s.ui));}
 update(dt){if(!this.ctx)return;this.tick-=dt;if(this.tick<=0){const notes=[261.63,329.63,392,493.88,440,392,329.63,293.66];this.tone(notes[this.note++%notes.length],2.8,.06*this.music);if(this.note%4===0)this.tone(130.81,3.5,.08*this.music);this.tick=.85;}}
 dispose(){this.ctx?.close();}
}
