import RAPIER from '@dimforge/rapier3d-compat';
export class PhysicsWorld{
 async init(){await RAPIER.init();this.world=new RAPIER.World({x:0,y:-22,z:0});this.world.timestep=1/60;this.controller=this.world.createCharacterController(.025);this.controller.enableAutostep(.28,.2,true);this.controller.enableSnapToGround(.25);this.controller.setMaxSlopeClimbAngle(Math.PI/3);this.controller.setMinSlopeSlideAngle(Math.PI/3);return this;}
 box(size,pos,rotation=null){let d=RAPIER.ColliderDesc.cuboid(...size.map(n=>n/2)).setTranslation(...pos).setFriction(.8);if(rotation)d.setRotation(rotation);return this.world.createCollider(d);}
 player(pos){this.body=this.world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(...pos));this.collider=this.world.createCollider(RAPIER.ColliderDesc.capsule(.38,.38),this.body);return this.body;}
 move(delta){this.controller.computeColliderMovement(this.collider,delta);const d=this.controller.computedMovement(),p=this.body.translation();this.body.setNextKinematicTranslation({x:p.x+d.x,y:p.y+d.y,z:p.z+d.z});this.world.step();return this.controller.computedGrounded();}
 dispose(){this.world.free();}
}
