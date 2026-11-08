import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
const geometries=new Map(), materials=new Map();
export function mat(color,metalness=0,roughness=.65,emissive=false){const key=[color,metalness,roughness,emissive].join();if(!materials.has(key))materials.set(key,new T.MeshStandardMaterial({color,metalness,roughness,...(emissive?{emissive:color,emissiveIntensity:1.4}:{})}));return materials.get(key);}
export function mesh(parent,geometry,material,pos=[0,0,0],scale=[1,1,1]){const m=new T.Mesh(geometry,material);m.position.set(...pos);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function geo(key,make){if(!geometries.has(key))geometries.set(key,make());return geometries.get(key);}
export function box(p,size,pos,color,r=.1){return mesh(p,geo('b'+size+','+r,()=>new RoundedBoxGeometry(...size,2,r)),typeof color==='object'?color:mat(color),pos);}
export function sphere(p,size,pos,color){return mesh(p,geo('sphere',()=>new T.SphereGeometry(1,20,12)),typeof color==='object'?color:mat(color),pos,size);}
export function cyl(p,r,h,pos,color){return mesh(p,geo('c'+r+','+h,()=>new T.CylinderGeometry(r,r,h,24)),typeof color==='object'?color:mat(color),pos);}
export function ring(p,r,t,pos,color){return mesh(p,geo('t'+r+','+t,()=>new T.TorusGeometry(r,t,8,40)),typeof color==='object'?color:mat(color),pos);}
export function label(p,text,pos,width=5,color='#254944',bg=null){const c=document.createElement('canvas');c.width=1024;c.height=160;const x=c.getContext('2d');if(bg){x.fillStyle=bg;x.fillRect(0,0,1024,160);}x.fillStyle=color;x.font='600 70px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(text,512,80);const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(width,width*160/1024),new T.MeshBasicMaterial({map,transparent:!bg,side:T.DoubleSide}));m.position.set(...pos);p.add(m);return m;}
export function plant(p,x,z,s=1){const g=new T.Group();g.position.set(x,0,z);g.scale.setScalar(s);p.add(g);cyl(g,.48,.65,[0,.33,0],'#e8b69e');cyl(g,.43,.04,[0,.67,0],'#6c5745');for(let i=0;i<7;i++){const a=i*2.4;const leaf=sphere(g,[.22,.7,.14],[Math.sin(a)*.32,1.1+(i%3)*.16,Math.cos(a)*.32],i%2?'#608c67':'#375f4b');leaf.rotation.set(Math.cos(a)*.45,0,Math.sin(a)*.45);}return g;}
export function disposeAssets(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}
