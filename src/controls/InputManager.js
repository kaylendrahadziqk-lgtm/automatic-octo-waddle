export class InputManager{
 constructor(canvas){this.keys=new Set();this.pressed=new Set();this.drag=false;this.dx=0;this.dy=0;this.wheel=0;this.abort=new AbortController();const on=(el,type,fn,opts={})=>el.addEventListener(type,fn,{...opts,signal:this.abort.signal});on(window,'keydown',e=>{if(['Space','ArrowUp','ArrowDown'].includes(e.code)&&e.target===document.body)e.preventDefault();if(!this.keys.has(e.code))this.pressed.add(e.code);this.keys.add(e.code);});on(window,'keyup',e=>this.keys.delete(e.code));on(window,'blur',()=>this.clear());on(canvas,'pointerdown',e=>{this.drag=true;canvas.setPointerCapture(e.pointerId);});on(canvas,'pointerup',()=>this.drag=false);on(canvas,'pointercancel',()=>this.drag=false);on(canvas,'pointermove',e=>{if(this.drag){this.dx+=e.movementX;this.dy+=e.movementY;}});on(canvas,'wheel',e=>{e.preventDefault();this.wheel+=e.deltaY;},{passive:false});on(canvas,'contextmenu',e=>e.preventDefault());}
 consume(key){const p=this.pressed.has(key);this.pressed.delete(key);return p;}
 clear(){this.keys.clear();this.pressed.clear();this.drag=false;this.dx=this.dy=this.wheel=0;}
 dispose(){this.abort.abort();}
}
