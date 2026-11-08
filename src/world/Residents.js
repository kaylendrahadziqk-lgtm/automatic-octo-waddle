import * as T from 'three';
import {sphere,mesh,mat,box} from './Props.js';
export class Resident {
 constructor(parent,name,x,z,scarf,dress){this.name=name;this.root=new T.Group();this.root.position.set(x,0,z);parent.add(this.root);this.time=0;const fabric=mat(scarf,0,1),cloth=mat(dress,0,.95),skin=mat('#c99473',0,.82),dark=mat('#383029',0,.8);
 // Full-length loose dress; sleeves and a continuous head/neck/chest covering.
 const points=[new T.Vector2(.68,0),new T.Vector2(.64,.3),new T.Vector2(.53,1),new T.Vector2(.43,1.7),new T.Vector2(.5,2.25),new T.Vector2(.35,2.45),new T.Vector2(0,2.5)];mesh(this.root,new T.LatheGeometry(points,32),cloth,[0,.12,0]);
 for(const side of [-1,1])sphere(this.root,[.19,.12,.32],[side*.25,.12,-.12],dark);
 sphere(this.root,[.51,.52,.34],[0,2.64,.01],fabric);sphere(this.root,[.52,.62,.25],[0,2.12,-.12],fabric);
 this.head=new T.Group();this.head.position.set(0,2.82,0);this.root.add(this.head);sphere(this.head,[.43,.52,.36],[0,0,.015],fabric);sphere(this.head,[.305,.365,.15],[0,-.035,-.25],skin);
 for(const side of [-1,1]){sphere(this.head,[.052,.032,.025],[side*.12,.025,-.39],dark);sphere(this.head,[.012,.012,.008],[side*.12-.009,.035,-.413],'#f5e5d6');const brow=sphere(this.head,[.08,.013,.012],[side*.12,.1,-.38],dark);brow.rotation.z=side*.1;}
 sphere(this.head,[.035,.06,.035],[0,-.07,-.416],skin);sphere(this.head,[.068,.015,.013],[0,-.17,-.397],'#92584d');
 // Gathered fabric drapes around face, with no exposed hair or neck.
 for(const side of [-1,1]){const fold=sphere(this.head,[.06,.4,.08],[side*.32,-.02,-.2],fabric);fold.rotation.z=side*.13;}
 this.arms=[];for(const side of [-1,1]){const arm=new T.Group();arm.position.set(side*.43,2.23,0);this.root.add(arm);sphere(arm,[.19,.52,.2],[side*.075,-.36,0],cloth);sphere(arm,[.105,.16,.085],[side*.12,-.88,-.02],skin);this.arms.push(arm);}
 for(let i=0;i<5;i++){const seam=box(this.root,[.017,1.3,.016],[-.32+i*.16,.91,-.46],mat(dress,0,1),.006);seam.rotation.z=(i-2)*.03;}
 }
 update(dt,speaking=false){this.time+=dt;this.head.rotation.y=Math.sin(this.time*.8)*.07;this.head.rotation.x=Math.sin(this.time*1.8)*.025;this.arms.forEach((a,i)=>{a.rotation.z=T.MathUtils.damp(a.rotation.z,speaking?(i===0?.24:-.18):Math.sin(this.time+i)*.025,4,dt);a.rotation.x=T.MathUtils.damp(a.rotation.x,speaking?-.28:0,4,dt);});}
}
