import * as T from 'three';
import {sphere,mesh,mat} from '../world/Props.js';
export class Cat {
 constructor(scene){
  this.root=new T.Group();this.root.scale.setScalar(.85);scene.add(this.root);this.rig=new T.Group();this.root.add(this.rig);this.time=0;this.legs=[];
  const fur=mat('#cc9459',0,.95),cream=mat('#f5e5cd',0,1),stripe=mat('#865531',0,1),pink=mat('#ca8d87',0,.8),iris=mat('#99b878',.05,.3),black=mat('#18201b',0,.3);
  sphere(this.rig,[.39,.39,.68],[0,.86,.05],fur);sphere(this.rig,[.29,.3,.48],[0,.74,-.05],cream);
  for(const side of [-1,1])for(let i=0;i<3;i++){const patch=sphere(this.rig,[.025,.22,.055],[side*.37,.94,-.18+i*.22],stripe);patch.rotation.x=-.25;}
  this.head=new T.Group();this.head.position.set(0,1.16,-.55);this.rig.add(this.head);
  sphere(this.head,[.44,.39,.37],[0,.04,0],fur);sphere(this.head,[.31,.24,.24],[0,-.1,-.18],cream);
  this.ears=[];
  for(const side of [-1,1]){
   const ear=new T.Group();ear.position.set(side*.29,.3,0);ear.rotation.z=-side*.17;this.head.add(ear);
   const shape=new T.Shape();shape.moveTo(-.18,0);shape.quadraticCurveTo(-.13,.2,0,.39);shape.quadraticCurveTo(.13,.2,.18,0);shape.closePath();
   mesh(ear,new T.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.04,bevelThickness:.04}),fur,[0,0,-.05]);
   const inner=new T.Shape();inner.moveTo(-.11,.04);inner.lineTo(0,.3);inner.lineTo(.11,.04);inner.closePath();mesh(ear,new T.ShapeGeometry(inner),new T.MeshStandardMaterial({color:'#d9a09b',roughness:1,side:T.DoubleSide}),[0,0,-.095]);this.ears.push(ear);
  }
  this.eyes=[];
  for(const side of [-1,1]){
   const eye=new T.Group();eye.position.set(side*.19,.08,-.315);this.head.add(eye);sphere(eye,[.115,.13,.052],[0,0,0],cream);sphere(eye,[.092,.11,.035],[0,0,-.035],iris);sphere(eye,[.027,.09,.02],[0,0,-.064],black);sphere(eye,[.025,.028,.012],[-.025,.04,-.082],'#ffffff');this.eyes.push(eye);
   sphere(this.head,[.14,.095,.105],[side*.105,-.13,-.31],cream);
   for(let j=0;j<3;j++){const points=[new T.Vector3(side*.14,-.12,-.36),new T.Vector3(side*.35,-.1+(j-1)*.055,-.38),new T.Vector3(side*.58,-.08+(j-1)*.095,-.32)];mesh(this.head,new T.TubeGeometry(new T.CatmullRomCurve3(points),8,.006,3,false),cream);}
  }
  sphere(this.head,[.055,.037,.035],[0,-.1,-.418],pink);sphere(this.head,[.014,.035,.01],[0,-.15,-.407],stripe);
  for(let i=-1;i<=1;i++){const mark=sphere(this.head,[.035,.13,.018],[i*.12,.28,-.24],stripe);mark.rotation.z=i*.35;}
  for(const x of [-.26,.26])for(const z of [-.4,.45]){const leg=new T.Group();leg.position.set(x,.83,z);this.rig.add(leg);sphere(leg,[.14,.29,.15],[0,-.2,0],fur);const shin=new T.Group();shin.position.y=-.4;leg.add(shin);sphere(shin,[.1,.18,.11],[0,-.13,0],fur);sphere(shin,[.15,.105,.21],[0,-.31,-.065],cream);this.legs.push({leg,shin,phase:x*z>0?0:Math.PI});}
  this.tail=new T.Group();this.tail.position.set(0,.95,.62);this.rig.add(this.tail);this.tailLinks=[];let parent=this.tail;
  for(let i=0;i<8;i++){const link=new T.Group();link.position.set(0,i? .18:0,i?.04:0);link.rotation.x=.19;parent.add(link);sphere(link,[.095-i*.006,.15,.095-i*.006],[0,.08,0],i%3===0?stripe:fur);this.tailLinks.push(link);parent=link;}
  const collar=mesh(this.rig,new T.TorusGeometry(.255,.035,8,32),mat('#64827b',0,.8),[0,1.01,-.42]);collar.rotation.x=Math.PI/2;
  sphere(this.rig,[.07,.08,.025],[0,.88,-.65],mat('#cda355',.6,.35));
  const c=document.createElement('canvas');c.width=c.height=64;const ctx=c.getContext('2d'),gradient=ctx.createRadialGradient(32,32,4,32,32,32);gradient.addColorStop(0,'rgba(40,27,17,.3)');gradient.addColorStop(1,'rgba(40,27,17,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);
  this.shadow=new T.Mesh(new T.PlaneGeometry(1.7,2.1),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false}));this.shadow.rotation.x=-Math.PI/2;scene.add(this.shadow);
 }
 update(dt,speed,grounded,vy,rest=false){this.time+=dt;const t=this.time,amount=Math.min(speed/5,1);for(const {leg,shin,phase} of this.legs){leg.rotation.x=T.MathUtils.damp(leg.rotation.x,grounded?Math.sin(t*(speed>6?15:10)+phase)*amount*.65:-.35,12,dt);shin.rotation.x=grounded?Math.max(0,-Math.sin(t*10+phase))*.32*amount:.55;}
 this.rig.position.y=T.MathUtils.damp(this.rig.position.y,rest?-.28:Math.sin(t*3)*.012+Math.sin(t*20)*amount*.025,8,dt);this.head.rotation.y=Math.sin(t*.8)*.09*(1-amount);this.head.rotation.x=rest?.15:Math.sin(t*1.5)*.035;this.tail.rotation.z=Math.sin(t*2)*.22;this.tailLinks.forEach((l,i)=>l.rotation.x=.15+Math.sin(t*2-i*.35)*.055);this.ears.forEach((e,i)=>e.rotation.x=Math.sin(t*2+i)*.06);this.eyes.forEach(e=>e.scale.y=rest?.1:t%5>4.8?.07:1);this.shadow.position.set(this.root.position.x,.018,this.root.position.z);this.shadow.material.opacity=Math.max(.15,1-this.root.position.y*.3);}
}
