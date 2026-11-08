import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {box,sphere,cyl,ring,plant,label,mat} from './Props.js';
export class Shelter{
 constructor(scene,physics){this.group=new T.Group();scene.add(this.group);this.physics=physics;this.obstacles=[];this.interactables=[];this.animated=[];this.zones=[{name:'Main lobby',sub:'A little hello. A big adventure.',x:0,z:12,color:'#cdbb91'},{name:'Playground',sub:'Made for happy circuits.',x:-10,z:1,color:'#85baa8'},{name:'Resting garden',sub:'Even good bots need a nap.',x:11,z:10,color:'#a6b5c9'},{name:'Training studio',sub:'Small steps. Brilliant tricks.',x:10,z:-5,color:'#dca577'},{name:'Recharge café',sub:'Fuel for the next adventure.',x:-11,z:12,color:'#d1a192'},{name:'Discovery grove',sub:'Follow your curiosity.',x:0,z:-12,color:'#9cba8f'}];this.build();this.batch();}
 batch(){this.group.updateMatrixWorld(true);const dynamic=new Set([...this.animated,...this.interactables.map(a=>a.object)]);const groups=new Map(),remove=[];this.group.traverse(o=>{if(!o.isMesh)return;let n=o;while(n&&n!==this.group){if(dynamic.has(n))return;n=n.parent;}const key=o.material.uuid+o.castShadow;if(!groups.has(key))groups.set(key,{material:o.material,castShadow:o.castShadow,geometries:[]});const geom=(o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone()).applyMatrix4(o.matrixWorld);groups.get(key).geometries.push(geom);remove.push(o);});for(const o of remove)o.removeFromParent();this.batched=[];for(const {material,castShadow,geometries} of groups.values()){const geo=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());if(!geo)continue;this.batched.push(geo);const m=new T.Mesh(geo,material);m.castShadow=castShadow;m.receiveShadow=true;this.group.add(m);}}
 solid(size,pos,color,r=.1,rotation=null){const m=box(this.group,size,pos,color,r);if(rotation)m.rotation.copy(rotation);this.physics.box(size,pos,rotation?m.quaternion:null);this.obstacles.push(m);return m;}
 activity(type,name,x,z,obj){this.interactables.push({type,name,position:new T.Vector3(x,0,z),object:obj,cooldown:0});}
 build(){const g=this.group;this.solid([40,.5,40],[0,-.25,0],'#e7dfcb');
 const ceiling=box(g,[40,.15,40],[0,7.45,0],'#f1eada');ceiling.castShadow=false;
 // Architectural shell, framed clerestory windows, timber beams.
 this.solid([40,7,.4],[0,3.5,-20],'#efe7d6');this.solid([.4,7,40],[-20,3.5,0],'#e9e1cf');this.solid([.4,7,40],[20,3.5,0],'#e9e1cf');this.solid([40,7,.4],[0,3.5,20],'#efe7d6');
 for(const x of [-15,-5,5,15]){box(g,[7,3,.08],[x,4.5,-19.76],mat('#b7d8ce',.2,.18,true));for(const dx of [-3.6,0,3.6])box(g,[.12,3.2,.16],[x+dx,4.5,-19.65],'#d8c9a9');box(g,[7.4,.14,.18],[x,3,-19.6],'#d8c9a9');}
 for(const x of [-19,0,19]){box(g,[.3,.4,40],[x,7,0],'#b69774');}for(const z of [-19,-7,7,19]){box(g,[40,.4,.3],[0,7,z],'#b69774');for(const x of [-19,19])this.solid([.4,7,.4],[x,3.5,z],'#c3ad87');}
 for(let i=-18;i<=18;i+=3){box(g,[.018,.006,39],[i,.006,0],'#d3cbb8',0);box(g,[39,.006,.018],[0,.006,i],'#d3cbb8',0);}
 for(const z of this.zones){const rug=box(g,[z.x===0?10:12,.055,9],[z.x,.035,z.z],z.color,.45);rug.receiveShadow=true;const text=label(g,z.name.toUpperCase(),[z.x,.072,z.z+3.1],4.6,'#ffffff');text.rotation.x=-Math.PI/2;}
 label(g,'PAWTEK  /  SANCTUARY',[0,5.8,-19.7],12);label(g,'A softer place for future friends.',[0,4.9,-19.7],7);
 // Entry portal and welcome console.
 this.solid([4,3.6,.3],[0,1.8,19.7],'#466e62',.3);label(g,'WELCOME HOME',[0,2.9,19.48],3,'#e9dfbf').rotation.y=Math.PI;
 this.solid([3.5,1.1,1.15],[-4, .55,15.5],'#d8b994',.25);box(g,[3.7,.15,1.35],[-4,1.18,15.5],'#f5edde');box(g,[1.1,.65,.1],[-4,1.6,15.5],'#31524d');label(g,'PIP · UNIT 07',[-4,1.6,15.43],.95,'#a9efc8').rotation.y=Math.PI;
 // Beds inside bespoke gabled cabins.
 for(let i=0;i<3;i++){const x=7+i*4,z=11.3;const c=['#789b9e','#bfa2a0','#bba679'][i];this.solid([.2,2.2,3],[x-1.4,1.1,z],c);this.solid([.2,2.2,3],[x+1.4,1.1,z],c);this.solid([3,2.2,.2],[x,1.1,z+1.5],c);for(const side of [-1,1]){const roof=this.solid([1.85,.2,3.4],[x+side*.75,2.55,z],c,.06,new T.Euler(0,0,side*-.48));}const bed=box(g,[2.3,.25,2.1],[x,.15,z],'#ece4d8',.12);box(g,[1.9,.15,1.7],[x,.32,z],'#a5b9b6',.07);label(g,['01 · CLOUD','02 · DREAM','03 · DOZE'][i],[x,1.85,z-1.55],2,'#fff6de');this.activity('rest','Curl up & rest',x,z,bed);}
 // Cafe, with clearly separate food and water dishes.
 this.solid([7,1.3,1],[-12,.65,17],'#b28e7a',.12);box(g,[7.2,.12,1.3],[-12,1.35,17],'#f4e6cb');label(g,'RECHARGE CAFÉ',[-12,2.3,18.9],6).rotation.y=Math.PI;
 for(let i=0;i<3;i++){const x=-15+i*3;const bowl=cyl(g,.62,.28,[x,.16,11.5],'#f5e8d1');const r=ring(g,.52,.09,[x,.3,11.5],'#d9b77b');r.rotation.x=Math.PI/2;cyl(g,.46,.03,[x,.29,11.5],i===1?mat('#68b8c4',.5,.1):'#485955');if(i!==1)for(let j=0;j<9;j++)sphere(g,[.08,.06,.08],[x+Math.sin(j*2)*.3,.34,11.5+Math.cos(j*2)*.3],'#d5ad6a');this.activity('feed',i===1?'Sip cooling water':'Recharge energy',x,11.5,bowl);}
 // Playground ball, tunnel, stepping pods and low perimeter fence.
 const ball=sphere(g,[.55,.55,.55],[-10,.58,0],mat('#eb956d',.2,.3));ring(ball,.91,.07,[0,0,0],'#ffe6ad');this.activity('toy','Play with the orbit ball',-10,0,ball);
 for(let i=0;i<5;i++){const z=-3+i*.6;const tube=ring(g,1.3,.18,[-15,1.35,z],'#dfb86d');for(const side of [-1,1])this.solid([.3,1.3,.6],[-15+side*1.3,.65,z],'#dfb86d');this.solid([2.5,.25,.6],[-15,2.65,z],'#dfb86d');}
 for(let i=0;i<5;i++){const x=-10+i*1.25,z=-4.1;const h=.2+(i%3)*.18;this.solid([.95,h,1],[x,h/2,z],i%2?'#d7c195':'#91aa91',.15);}
 for(let i=0;i<10;i++){const z=-5+i*1.1;this.solid([.12,.9,.13],[-18,.45,z],'#ecdcbb',.04);}for(const y of [.3,.7])this.solid([.12,.1,10],[-18,y,0],'#ecdcbb',.02);
 // Ramp and platform, all physically climbable.
 this.solid([3,.22,5],[9,.65,-5],'#c59468',.06,new T.Euler(.25,0,0));this.solid([3,1.4,2.5],[9,.7,-8.5],'#b38560',.12);for(const x of [7.5,10.5]){this.solid([.1,.8,2.5],[x,1.8,-8.5],'#e8d7b5');}
 for(const [i,x,z] of [[0,5,-3],[1,9,-8.5],[2,14,-4]]){const y=i===1?2.1:.8;const beacon=ring(g,.48,.09,[x,y,z],mat('#ffdc8e',.3,.3,true));this.animated.push(beacon);this.activity('beacon','Collect training beacon',x,z,beacon);this.interactables.at(-1).height=y;}
 // Discovery nook: tree-like botanic sculptures and a hidden memory core.
 for(const [x,z] of [[-8,-13],[8,-14],[-4,-17],[14,-14],[-15,-14]]){plant(g,x,z,1.8);this.physics.box([1.1,1.1,1.1],[x,.55,z]);for(const j of [-1,1])sphere(g,[1.1,1,.9],[x+j*.6,3,z],'#7c9e79');cyl(g,.18,2.3,[x,1.7,z],'#ad9870');}
 this.solid([5,.6,2],[0,.3,-14],'#c6be9f',.3);const core=sphere(g,[.35,.45,.35],[0,1,-14],mat('#bce8bd',.4,.2,true));this.animated.push(core);this.activity('discover','Discover a memory',0,-14,core);
 // Lamps, planters, cushions and wall art finish the space.
 for(const x of [-10,10])for(const z of [-10,8]){cyl(g,.035,1,[x,6.3,z],'#5d6559');const shade=cyl(g,.6,.25,[x,5.7,z],'#f1db9b');cyl(g,.5,.035,[x,5.55,z],mat('#fff4c6',0,.5,true));}
 for(const [x,z] of [[-18,17],[18,17],[-18,7],[18,-6],[3,17],[-4,-9]])plant(g,x,z,1.2);
 for(let i=0;i<5;i++){const cushion=box(g,[1.2,.3,1.2],[5+i*2.2,.18,4.8],['#bf8e77','#e4c18c','#90b2aa'][i%3],.15);cushion.rotation.y=i*.4;}
 for(const x of [-19.7,19.7])for(const z of [-12,0,12]){const panel=box(g,[.08,2.4,2],[x,3.3,z],'#d3b686');sphere(g,[.06,.65,.65],[x+(x<0?.08:-.08),3.4,z],'#8aa99b');}
 }
 zone(pos){return this.zones.reduce((a,b)=>Math.hypot(pos.x-a.x,pos.z-a.z)<Math.hypot(pos.x-b.x,pos.z-b.z)?a:b);}
 update(dt,time){this.animated.forEach((o,i)=>{if(o.visible){o.rotation.y+=dt*.7;o.rotation.z=Math.sin(time+i)*.15;}});for(const a of this.interactables){a.cooldown=Math.max(0,a.cooldown-dt);if(a.type==='toy'&&a.playTime>0){a.playTime-=dt;a.object.position.y=.6+Math.abs(Math.sin(a.playTime*5))*1.4;a.object.position.x=a.position.x+Math.sin(a.playTime*2)*1.3;a.object.rotation.x+=dt*5;}else if(a.type==='toy'){a.object.position.set(a.position.x,.58,a.position.z);}}}
}
