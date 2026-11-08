import * as T from 'three';
import {BaseWorld} from './BaseWorld.js';
import {box,sphere,cyl,ring,plant,mesh,mat,label} from './Props.js';
import {Resident} from './Residents.js';
function texture(kind){const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');let seed=9;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};ctx.fillStyle=kind==='wood'?'#aa8058':'#d1c3a9';ctx.fillRect(0,0,512,512);if(kind==='wood'){for(let i=0;i<1500;i++){ctx.strokeStyle=`rgba(${rnd()>.5?'63,32,13':'236,210,161'},${rnd()*.14})`;ctx.beginPath();const y=rnd()*512;ctx.moveTo(0,y);ctx.bezierCurveTo(160,y+rnd()*8,350,y-rnd()*8,512,y);ctx.stroke();}for(let x=0;x<512;x+=128){ctx.fillStyle='#5b432b44';ctx.fillRect(x,0,2,512);}}else for(let i=0;i<512;i+=3){ctx.fillStyle=i%2?'#ffffff18':'#342e2518';ctx.fillRect(i,0,1,512);ctx.fillRect(0,i,512,1);}const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.wrapS=tex.wrapT=T.RepeatWrapping;tex.repeat.set(kind==='wood'?5:3,kind==='wood'?5:3);return tex;}
export class Home extends BaseWorld {
 build(){const g=this.group;this.zones=[{name:'Ruang tamu',sub:'Rumah baru. Teman baru.',x:0,z:5},{name:'Sudut bermain',sub:'Satu lompatan kecil lagi.',x:-8,z:0},{name:'Tempat tidur',sub:'Mimpi yang paling hangat.',x:8,z:7},{name:'Taman dalam',sub:'Cahaya sore di antara dedaunan.',x:7,z:-6},{name:'Dapur',sub:'Mangkuk kecil, perhatian besar.',x:-8,z:-8},{name:'Ruang baca',sub:'Tempat tenang untuk penasaran.',x:0,z:-9}];
 const wood=new T.MeshStandardMaterial({map:texture('wood'),roughness:.56,color:'#d9bc96'}),linen=new T.MeshStandardMaterial({map:texture('fabric'),roughness:1,color:'#e1d5be'});this.extraMaterials=[wood,linen];
 this.solid([28,.5,28],[0,-.25,0],wood);this.solid([.25,6,28],[-14,3,0],'#d7c9b1');this.solid([.25,6,28],[14,3,0],'#e4d7c2');this.solid([28,6,.25],[0,3,14],'#e4d7c2');
 // Tall glazed windows with actual gaps in the wall for sunlight.
 this.solid([28,1,.25],[0,.5,-14],'#e8dcc6');this.solid([28,.8,.25],[0,5.6,-14],'#e8dcc6');
 for(let x=-14;x<=14;x+=7){this.solid([.3,5,.35],[x,3,-14],'#c5ad88');}
 for(const x of [-10.5,-3.5,3.5,10.5]){box(g,[6.65,4.1,.07],[x,3.05,-14.2],new T.MeshStandardMaterial({color:'#b6d2c7',transparent:true,opacity:.15,roughness:.15,metalness:.2}));box(g,[.08,4.1,.18],[x,3.05,-13.85],'#b3946d');box(g,[6.8,.1,.18],[x,3.05,-13.85],'#b3946d');for(const side of [-1,1]){for(let j=0;j<4;j++){const curtain=cyl(g,.12,4.8,[x+side*(2.8+j*.12),3.05,-13.5],linen);curtain.scale.z=.6;}}}
 const ceiling=box(g,[28,.15,28],[0,6.15,0],'#e8dcc6');ceiling.castShadow=false;this.obstacles.push(ceiling);
 for(const z of [-13.7,13.7])box(g,[27.8,.15,.12],[0,.15,z],'#ac916a');for(const x of [-13.7,13.7])box(g,[.12,.15,28],[x,.15,0],'#ac916a');
 // Living room: woven rug, upholstered sofa, low oak table, books.
 box(g,[9,.055,7],[0,.045,4],linen,.025);for(const z of [.6,7.4])for(let i=0;i<60;i++)box(g,[.025,.015,.22],[-4.4+i*.15,.063,z],'#b7a487',.006);
 this.solid([6,.65,2],[0,.55,1],'#6d8172',.25);this.solid([6,1.5,.42],[0,1.2,.15],'#6d8172',.2);for(const x of [-2.9,2.9])this.solid([.4,1.1,2],[x,.9,1],'#627867',.18);
 for(const x of [-1.8,0,1.8])box(g,[1.7,.22,1.65],[x,.99,1.1],linen,.1);for(const [x,c] of [[-2,'#b7805e'],[2,'#d0b479']]){const pillow=box(g,[.8,.8,.22],[x,1.49,.7],c,.11);pillow.rotation.z=x*.06;}
 this.solid([3,.17,1.5],[0,.65,4.5],wood,.12);for(const x of [-1.2,1.2])for(const z of [4,5])this.solid([.12,.6,.12],[x,.3,z],'#7d5837');box(g,[.6,.09,.8],[-.6,.8,4.4],'#a56d52',.03);box(g,[.65,.06,.85],[-.6,.87,4.4],'#d3bc91',.02);cyl(g,.18,.3,[.6,.92,4.4],'#eee4d2');
 // Entrance and open pet carrier.
 this.solid([3,4,.2],[0,2,13.8],'#778e7e');box(g,[.07,.5,.07],[1.1,2,13.6],mat('#b68c52',.7,.3));
 const litter=box(g,[2,.3,1.7],[12,.18,3],'#9b9d89',.12);box(g,[1.7,.06,1.4],[12,.36,3],'#c7b99b',.025);
 this.carrier=new T.Group();g.add(this.carrier);this.carrier.position.set(0,0,10.5);box(this.carrier,[1.8,.12,2],[0,.12,0],'#a2ac96',.08);box(this.carrier,[1.8,.12,2],[0,1.6,0],'#a2ac96',.08);for(const s of [-1,1])box(this.carrier,[.12,1.5,2],[s*.85,.85,0],'#a2ac96',.06);box(this.carrier,[1.8,1.5,.12],[0,.85,1],'#a2ac96',.08);box(this.carrier,[1.5,.1,1.7],[0,.24,0],linen,.04);const handle=ring(this.carrier,.25,.055,[0,1.7,0],'#7a846f');
 // Kitchen.
 this.solid([7,1.6,1.4],[-9, .8,-11.5],'#7b8871',.06);box(g,[7.2,.14,1.6],[-9,1.66,-11.5],'#e4ddcb',.05);for(let i=0;i<5;i++){box(g,[1.25,1.3,.07],[-11.7+i*1.35,.85,-10.76],'#929d87',.03);box(g,[.32,.035,.07],[-11.7+i*1.35,1.33,-10.69],mat('#ac8957',.6,.4));}cyl(g,.4,.08,[-9,1.78,-11.5],mat('#82928e',.6,.25));plant(g,-12,-9,.8);
 for(const [i,x] of [[0,-9],[1,-7]]){const bowl=cyl(g,.48,.22,[x,.13,-8],'#e7d9bd');ring(g,.4,.055,[x,.26,-8],'#b79663').rotation.x=Math.PI/2;cyl(g,.35,.025,[x,.245,-8],i===0?'#705541':mat('#8cb8b2',.2,.1));if(i===0)for(let j=0;j<8;j++)sphere(g,[.06,.05,.06],[x+Math.sin(j*2)*.23,.29,-8+Math.cos(j*2)*.23],'#ab7950');this.activity('feed',i===0?'Makan bersama Miko':'Minum air',x,-8,bowl);}
 // Beds, cardboard box, baskets, scratching tree and climbable ramp.
 const bed=box(g,[2.7,.35,2.1],[8,.2,7],linen,.17);ring(g,.95,.17,[8,.4,7],'#bb9d7c').rotation.x=Math.PI/2;this.activity('rest','Tidur di tempat yang hangat',8,7,bed);
 const cardboard=new T.Group();g.add(cardboard);cardboard.position.set(6,0,9);box(cardboard,[1.8,.06,1.8],[0,.04,0],'#b98f5c');for(const x of [-.88,.88])box(cardboard,[.04,.8,1.8],[x,.4,0],'#c29b68');for(const z of [-.88,.88])box(cardboard,[1.8,.8,.04],[0,.4,z],'#c29b68');
 this.solid([2,.22,4],[-8,.58,-1],'#b79b73',.08,new T.Euler(.25,0,0));this.solid([2,1.2,2],[-8,.6,-4],'#8c9a80',.12);
 for(const [x,z,h] of [[-11,2,2.1],[-11,-1,3]]){this.solid([1.8,.15,1.8],[x,.08,z],'#bca786');cyl(g,.18,h,[x,h/2,z],linen);this.physics.box([.4,h,.4],[x,h/2,z]);this.solid([1.8,.18,1.8],[x,h,z],linen,.08);}
 const ball=sphere(g,[.28,.28,.28],[-6,.3,3],mat('#b87955',0,.9));this.activity('toy','Mainkan bola benang',-6,3,ball);for(let i=0;i<5;i++){const r=ring(ball,.94,.035,[0,0,0],'#e4bd8f');r.rotation.set(i*.7,i*.9,0);}
 for(const [i,x,z,y] of [[0,-8,-4,1.8],[1,7,-5,.8],[2,2,-10,.8]]){const toy=sphere(g,[.16,.23,.12],[x,y,z],'#d8b15f');this.animated.push(toy);this.activity('beacon','Temukan mainan tersembunyi',x,z,toy);this.interactables.at(-1).height=y;}
 // Bookshelf and a keepsake photo.
 for(const x of [-2.6,2.6])this.solid([.18,3.8,1],[x,1.9,-12],'#90704b');for(const y of [.25,1.3,2.4,3.6])box(g,[5.3,.12,1],[0,y,-12],wood,.03);for(let row=0;row<3;row++)for(let j=0;j<13;j++)box(g,[.2,.65+(j%3)*.12,.6],[-2.3+j*.36,.64+row*1.12,-12],['#777f6d','#a77960','#d1b994','#677e82'][j%4],.02);
 const photo=box(g,[.7,.85,.08],[1,1.86,-11.65],'#b7905b',.02);box(g,[.55,.66,.02],[1,1.86,-11.59],'#e2cfac',.01);this.activity('discover','Lihat foto keluarga',1,-10,photo);
 for(const [x,z,s] of [[12,-11,2],[10,-7,1.6],[5,-11,1.4],[-12,9,1.5],[12,11,1.5]])plant(g,x,z,s);
 for(const x of [6,10]){this.solid([1.2,.6,1.2],[x,.3,-6],'#b8aa87',.18);plant(g,x,-6,1.25);}
 // Framed artwork and warm lamps.
 for(const x of [-6,6]){box(g,[2,2,.09],[x,3.3,13.75],'#b18c5e',.03);box(g,[1.8,1.8,.03],[x,3.3,13.67],'#f1e6cf',.01);sphere(g,[.55,.55,.015],[x,3.4,13.63],x<0?'#9caa87':'#c9986d');}
 cyl(g,.1,3.8,[5,1.9,1],'#7b6041');cyl(g,.55,.12,[5,.06,1],'#7b6041');mesh(g,new T.CylinderGeometry(.35,.62,.65,32),linen,[5,3.6,1]);sphere(g,[.16,.16,.16],[5,3.4,1],mat('#ffcb7e',0,.6,true));
 const lamp=new T.PointLight('#ffc480',15,9,2);lamp.position.set(5,3.3,1);g.add(lamp);
 this.residents=[new Resident(g,'Nazwa',-2.5,8,'#c6a69b','#857d69'),new Resident(g,'Raina',2.8,8,'#839c92','#c4b69a')];
 for(const person of this.residents){this.animated.push(person.root);person.root.traverse(o=>{if(o.isMesh)this.obstacles.push(o);});this.activity('greet',`Sapa ${person.name}`,person.root.position.x,person.root.position.z,person.root);this.interactables.at(-1).resident=person.name;this.physics.box([1.1,3.4,1.1],[person.root.position.x,1.7,person.root.position.z]);}
 // Keep carrier and box separate for cinematic actions.
 this.animated.push(this.carrier,cardboard);this.cardboard=cardboard;
 }
 update(dt,time){super.update(dt,time);for(const r of this.residents){r.root.rotation.set(0,0,0);r.update(dt,this.speaker===r.name);}this.carrier.rotation.set(0,0,0);this.cardboard.rotation.set(0,0,0);}
}
