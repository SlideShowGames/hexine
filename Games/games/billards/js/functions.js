function rand(min, max) {
    return Math.random() * (max - min) + min;
}

var g = 0.08;
var oldTime = 0;
var newTime = 0;
var friction = 0.00270;
var dt;

function heading(v){
	var a = Math.atan2(v.y, v.x);
	return a;
}

var e = 0.800;
var prevPos, curPos, angleZ, angleX, dif;
var xAxis = new THREE.Vector3(1,0,0);
var zAxis = new THREE.Vector3(0,0,1);
var yAxis = new THREE.Vector3(0,1,0);
function move3(balls){
dt = clock.getDelta();
	if(oldTime < clock.getElapsedTime()){
		oldTime = clock.getElapsedTime() + gameUpdate;
		
		//log2(balls.mesh[0].position.x + " z:" + balls.mesh[0].position.z);
		
	
		for(var k=0; k<16; k++){
	

			collide2(k);
			
			balls.mesh[k].xVel *= 0.99;
			balls.mesh[k].zVel *= 0.99;
			
			prevPos = new THREE.Vector3().copy(balls.mesh[k].position);
			
			balls.mesh[k].position.y += balls.mesh[k].yVel * dt;
			balls.mesh[k].position.x += balls.mesh[k].xVel * dt;
			balls.mesh[k].position.z += balls.mesh[k].zVel * dt;
			
			curPos = new THREE.Vector3().copy(balls.mesh[k].position);
				
			dif = new THREE.Vector3().subVectors(curPos, prevPos);	

			angleZ = dif.x / (2 * Math.PI * balls.mesh[k].r) * Math.PI;
			//log("<br/>Angle Z:"+anglez);
			//rotateAroundWorldAxis(balls.mesh[k], zAxis, -angleZ );
			//balls.mesh[k].rotateOnAxis(zAxis.normalize(), -angleZ);
			angleX = dif.z / (2 *  Math.PI * balls.mesh[k].r) * Math.PI;
			rotateAroundObjectAxis2(balls.mesh[k], 
				balls.mesh[k].xVel < 0 ? angleX : angleX, 
				balls.mesh[k].zVel < 0 ? angleZ: -angleZ);
			//rotateAroundWorldAxis(balls.mesh[k], xAxis, angleX);
			//rotateAroundWorldAxis2(balls.mesh[k], xAxis, zAxis, angleX, angleZ);
			//balls.mesh[k].rotateOnAxis(xAxis.normalize(), angleX);
			//balls.mesh[k].rotateOnAxis(yAxis.normalize(), 0);
			
			
			//var angley = dif.y / (2 * Math.PI * balls.mesh[k].r) * Math.PI;
			//var yAxis = new THREE.Vector3(0,1,0);
			//rotateAroundWorldAxis(balls.mesh[k], yAxis, angley );

			if(k == 0){
				//var l2c = line2Circle(0,7*scale, 11.6*scale, -8 * scale, balls.mesh[0].position.x, balls.mesh[0].position.z, balls.mesh[0].r)
				
			}
			
			
			balls.prevpos[k].copy( balls.mesh[k].position );
		}
		for(k = 0; k< 16; k++){
			balls.col[k] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		}
	}
}
var gameUpdate = 0.009;
var et;
var xDist ,yDist,zDist,dl2 ,dr  ,radius ,n, mSq;
function log(msg){
	message.innerHTML = msg + "<hr>"+ message.innerHTML;
}
function log2(msg){
	message.innerHTML = msg ;
}
function collide(k){
	
		et = clock.getElapsedTime();
		
			if( typeof balls.mesh[k] === undefined) return;
			
			if(balls.mesh[k].position.y + balls.mesh[k].r > 1.4490* scale){
				balls.mesh[k].yVel -= g; 
			}
			
			if(balls.mesh[k].position.x  > 18.9 * scale){
				balls.mesh[k].xVel = (balls.mesh[k].xVel  * -1) ;
				balls.mesh[k].position.x -=  balls.mesh[k].r * .1;
			}
			
			if(balls.mesh[k].position.x  < -21.6 * scale){
				balls.mesh[k].xVel = (balls.mesh[k].xVel  *  -1) ;
				balls.mesh[k].position.x += balls.mesh[k].r * .1;
			}
			
			if(balls.mesh[k].position.z  > 7.80 * scale){
				balls.mesh[k].zVel = (balls.mesh[k].zVel  * -1) ;
				balls.mesh[k].position.z -= balls.mesh[k].r * .1;
			}
			
			if(balls.mesh[k].position.z < -8.7 * scale){
				balls.mesh[k].zVel = (balls.mesh[k].zVel  * -1) ;
				balls.mesh[k].position.z += balls.mesh[k].r * .1;	
			}
			
			if(Math.abs(balls.mesh[0].xVel) < 0.003 && Math.abs(balls.mesh[0].zVel) < 0.3){
				//balls.mesh[0].xVel = rand(-1.3, 1.3);
				//balls.mesh[0].zVel = rand(-1.3, 1.3);
				//balls.mesh[0].position.x = 0;
				//balls.mesh[0].position.z = 0;
			}
			
			var i = 0;
			for(i = 0; i < 2; i++){
				if(i != k){
					if(balls.col[k][i] == 0){
					
						balls.col[k][i]++;
						
						xDist = balls.mesh[k].position.x -  balls.mesh[i].position.x; 
						yDist = balls.mesh[k].position.y -  balls.mesh[i].position.y; 
						zDist =  balls.mesh[k].position.z -  balls.mesh[i].position.z; 

						 // distance squared, radii sum
						dl2  = Math.sqrt(xDist*xDist+zDist*zDist); 
						dr  =  (balls.mesh[k].r +balls.mesh[i].r)*(balls.mesh[k].r + balls.mesh[i].r); 
						radius = balls.mesh[k].r + balls.mesh[i].r;
						n = Math.hypot(xDist, zDist); 
						
						// if distance > pow radii, ignore
						//document.getElementById("message").innerHTML = dl2 + " > " + (dr*dr);
						mSq = new THREE.Vector3().subVectors(	balls.mesh[k].position ,balls.mesh[i].position ).lengthSq();					
						if(mSq <= radius * radius ){
							//gameUpdate = 0.01
							
							//balls.mesh[k].xVel += (balls.mesh[k].xVel * -1);
							//balls.mesh[k].zVel += (balls.mesh[k].zVel * -1);
					
			
							var dx = xDist / mSq;
							var dz = zDist / mSq;
							
							//balls.mesh[k].position.x += (.05 * dx)
							//balls.mesh[k].position.z += (.05 * dz)
			
							var collisionPointX =  ((balls.mesh[k].position.x * balls.mesh[i].r) + (balls.mesh[i].position.x * balls.mesh[k].r))  / (balls.mesh[k].r + balls.mesh[i].r);
							var collisionPointZ =  ((balls.mesh[k].position.z * balls.mesh[i].r) + (balls.mesh[i].position.z * balls.mesh[k].r))  / (balls.mesh[k].r + balls.mesh[i].r);
							
							var xVelocity = balls.mesh[i].xVel - balls.mesh[k].xVel;
							var yVelocity = balls.mesh[i].yVel - balls.mesh[k].yVel;
							var zVelocity = balls.mesh[i].zVel - balls.mesh[k].zVel;
							
							var dotProduct = xDist*xVelocity + yDist * yVelocity + zDist*zVelocity;
							dotProduct /= scale;
							var combinedMass = (balls.mesh[k].m + balls.mesh[i].m) / scale;
							var collisionScale = (mSq  * dotProduct) / scale ;
							var xCollision = 2 * (xDist * collisionScale);
							xCollision = xCollision / scale;
							var zCollision = 2 * (zDist * collisionScale);
							zCollision =  zCollision / scale;
								
								 //The Collision vector is the speed difference projected on the Dist vector,
								//thus it is the component of the speed difference needed for the collision.
								
							var collisionWeightA =  ( balls.mesh[i].m / combinedMass ) / scale;								
							var collisionWeightB = ( balls.mesh[k].m / combinedMass ) / scale;
							
							log("<br/>("+k+", "+i+")["+et+"]DistSq: " + mSq + "<br/>["+et+"]rad:" + (radius * radius) + "<br/>["+et+"]Dot:" + dotProduct);
							 if(dotProduct >  0){
								
								
								
								
								balls.mesh[k].xVel += (collisionWeightA *  xCollision) / scale;
								balls.mesh[k].zVel += (collisionWeightA *  zCollision) / scale;
								//balls.mesh[k].position.x += xDist/15;
								//balls.mesh[k].position.z += zDist/15;
								
								balls.mesh[i].xVel -= (collisionWeightB *  xCollision)/scale;
								balls.mesh[i].zVel -= (collisionWeightB *  zCollision)/scale;
								//balls.mesh[i].position.x -= xDist/15;
								//balls.mesh[i].position.z -= zDist/15;
								
								
								if(mSq < 17){
									//balls.mesh[k].position.x -= balls.mesh[k].xVel * (dt * 1.1) * -1;
									//balls.mesh[k].position.z -= balls.mesh[k].zVel * (dt * 1.1 ) * -1;
									//balls.mesh[i].position.x += balls.mesh[k].xVel * (dt * 1.3) ;
									//balls.mesh[i].position.z += balls.mesh[k].zVel * (dt * 1.3 );
									balls.mesh[k].position.copy(balls.prevpos[k]);
									//gameUpdate = 1;
									return;
								}

							 }else if(dotProduct < 0){
								
								
								//balls.mesh[k].position.x += xDist/15;
								//balls.mesh[k].position.z += zDist/15;
								
								
								if(mSq < 17){
									balls.mesh[k].position.copy(balls.prevpos[k]);
									//balls.mesh[k].position.x += balls.mesh[k].xVel * (dt * 1.3) * -1;
									//balls.mesh[k].position.z += balls.mesh[k].zVel * (dt * 1.3 ) * -1;
									//balls.mesh[i].xVel = balls.mesh[k].xVel;
									//balls.mesh[i].zVel = balls.mesh[k].xVel;
									//balls.mesh[i].position.x -= balls.mesh[k].xVel * (dt * 3.3) ;
									//balls.mesh[i].position.z -= balls.mesh[k].zVel * (dt * 3.3 );
									////balls.mesh[k].xVel *= 0.0001;
									//balls.mesh[k].zVel *= 0.0001;
									return;
								}
								
								

								return;
									
								
							 }else{
								balls.mesh[k].position.x += balls.mesh[k].xVel * (dt * 3.1) * -1;
								balls.mesh[k].position.z += balls.mesh[k].zVel * (dt * 3.1 ) * -1;
							 }
						}
					
					}
				}
			}
			
			
			
			//balls.line[k].position = balls.mesh[k].position;
			if(balls.mesh[k].position.y < 1.4490 * scale){
				
				//balls.mesh[k].position.y = 1.399;
				balls.mesh[k].yVel *= -0.08;   
				
			}	
					
	
	
}

var raycaster = new THREE.Raycaster();
var xDis,zDist, dist, rad;
var kii, kji, kij, kjj;
function collide2(k){
	
		et = clock.getElapsedTime();
		
			if( typeof balls.mesh[k] === undefined) return;
			
			if(balls.mesh[k].position.y + balls.mesh[k].r > 1.4490* scale){
				balls.mesh[k].yVel -= g; 
			}
			/*
			//right side
			if(balls.mesh[k].position.x  > 19.5 * scale && balls.mesh[k].position.z > -9.5 * scale && balls.mesh[k].position.z < 6.2 * scale){
				balls.mesh[k].xVel = (balls.mesh[k].xVel  * -1) ;
				balls.mesh[k].position.x =  (19.5  * scale)  ;
			}
			
			//left side
			if(balls.mesh[k].position.x  < -20 * scale && balls.mesh[k].position.z > -9.5 * scale && balls.mesh[k].position.z < 6.2 * scale){
				balls.mesh[k].xVel = (balls.mesh[k].xVel  *  -1) ;
				balls.mesh[k].position.x = (-20  * scale) ;
			}
			//top
			if(balls.mesh[k].position.z  > 7.20 * scale && balls.mesh[k].position.x < 19.5 * scale && balls.mesh[k].position.x > -20 * scale){
				balls.mesh[k].zVel = (balls.mesh[k].zVel  * -1) ;
				balls.mesh[k].position.z = (7.20  * scale);
			}
			//bottom
			if(balls.mesh[k].position.z < -10.1 * scale && balls.mesh[k].position.x < 19.5 * scale && balls.mesh[k].position.x > -20 * scale){
				balls.mesh[k].zVel = (balls.mesh[k].zVel  * -1) ;
				balls.mesh[k].position.z =( -10.1 * scale)  ;	
			}
			
			if(Math.abs(balls.mesh[0].xVel) < 0.003 && Math.abs(balls.mesh[0].zVel) < 0.3){
				//balls.mesh[0].xVel = rand(-1.3, 1.3);
				//balls.mesh[0].zVel = rand(-1.3, 1.3);
				//balls.mesh[0].position.x = 0;
				//balls.mesh[0].position.z = 0;
			}
			*/
			if(balls.mesh[k].position.x > 17.0 * scale)
				collideWall(rightEdge, k, 0.5);
			
			if(balls.mesh[k].position.x < -16.0 * scale)
				collideWall(leftEdge, k, 0.5);
				
			if(balls.mesh[k].position.z > 9.0 * scale)
				collideWall(topEdges, k, -0.5);
			
			if(balls.mesh[k].position.z < -6.0 * scale)
				collideWall(bottomEdges, k, 0.5);
				
			if(balls.mesh[k].position.x < -12.0 * scale )
				collideWall(topCornerLeft, k, 0.5);
			
			if(balls.mesh[k].position.x < -12.0 * scale)
				collideWall(bottomCornerLeft, k, 0.5);
			
			collideWall(bottomCornerLeft_c, k, -0.5);
			
				for(i = 0; i < 16; i++){
					if(i != k){
						xVel1 = balls.mesh[k].xVel;
						zVel1 = balls.mesh[k].zVel;
						
						xVel2 = balls.mesh[i].xVel;
						zVel2 = balls.mesh[i].zVel;
						
						xDist = balls.mesh[i].position.x - balls.mesh[k].position.x;
						zDist = balls.mesh[i].position.z - balls.mesh[k].position.z;
						
						dist = xDist * xDist + zDist * zDist;
						if (dist == 0.0) return;
						
						radii =  balls.mesh[i].r + balls.mesh[k].r;
						if(dist <= radii * radii){
							kji = (xDist * xVel1 + zDist * zVel1) / dist; // k of j due to i
							kii = (xDist * zVel1 - zDist * xVel1) / dist; // k of i due to i
							kij = (xDist * xVel2 + zDist * zVel2) / dist; // k of i due to j
							kjj = (xDist * zVel2 - zDist * xVel2) / dist; // k of j due to j
							
							balls.mesh[k].zVel = kij * zDist + kii * xDist;
							balls.mesh[k].xVel = kij * xDist - kii * zDist;
							
							balls.mesh[i].zVel = kji * zDist + kjj * xDist;
							balls.mesh[i].xVel = kji * xDist - kjj * zDist;
							
							fixOverlap(k, i, xDist, zDist);
						}
						
									
					}
					
				}

				
				
			
			
			
			
			//balls.line[k].position = balls.mesh[k].position;
			if(balls.mesh[k].position.y < 1.4490 * scale){
				
				//balls.mesh[k].position.y = 1.399;
				balls.mesh[k].yVel *= -0.08;   
				
			}	
					
	
	for(k = 0; k< 16; k++){
		balls.col[k] = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	}
}
var starttime = 0.0;
var timeres = 1.0;


function fixOverlap(k, i, xDist, zDist){
	var _k;
		// the real displacement from i to j


        // the ratio between what it should be and what it really is
        _k = (balls.mesh[i].r*2) / Math.sqrt(xDist * xDist + zDist * zDist);

        // difference between x and y component of the two vectors
        zDist *= (_k - 1) / 2.;
        xDist *= (_k - 1) / 2;

        // set new coordinates of disks
        balls.mesh[i].position.z += zDist;
        balls.mesh[i].position.x += xDist;
        balls.mesh[k].position.z -= zDist;
        balls.mesh[i].position.x -= xDist;
}


function collideWall(edges, k, rot){
	for(var o=0; o<edges.length; o++){
		if(line2Circle(edges[o][0] * scale, edges[o][1] * scale, edges[o][2]* scale, edges[o][3]* scale, balls.mesh[k].position.x, balls.mesh[k].position.z, balls.mesh[k].r)){
			var p1 = new THREE.Vector2(edges[o][0], edges[o][1]);
			var p2 = new THREE.Vector2(edges[o][2], edges[o][3]);
	
			//var line = new THREE.Vector2().subVectors(p2, p1);
			var line = new THREE.Vector2(p2.x - p1.x, p2.y - p1.y);
			var leftNormal = rotate2d(line, Math.PI * rot);
	
			var velos = new THREE.Vector2(balls.mesh[k].xVel, balls.mesh[k].zVel);
			

			//balls.mesh[k].position.x += balls.mesh[k].xVel < 0 ? balls.mesh[k].r : -balls.mesh[k].r*.5;
			//balls.mesh[k].position.z += balls.mesh[k].zVel < 0 ? balls.mesh[k].r : -balls.mesh[k].r*.5
			
			var v_leftNormSeg2 = leftNormal.clone();
			var leftNormSeg2_mag = Math.abs(projectOn(velos, leftNormal));
			v_leftNormSeg2.setLength(leftNormSeg2_mag);
			velos = velos.add(v_leftNormSeg2.multiplyScalar(2));
			
			if(Math.abs(velos.x) > Math.abs(balls.mesh[k].xVel)){
				velos.x = velos.x > 0 ?  Math.abs(balls.mesh[k].xVel) : - Math.abs(balls.mesh[k].xVel);
			}
			
			if(Math.abs(velos.y) > Math.abs(balls.mesh[k].zVel)){
				velos.y = velos.y > 0 ?  Math.abs(balls.mesh[k].zVel) : -  Math.abs(balls.mesh[k].zVel);
			}
			
			
			balls.mesh[k].xVel = velos.x;
			balls.mesh[k].zVel = velos.y;
			
		}
	}
}


function qRotAdd(a,b){
	return new THREE.Quaternion(a._x + b._x, a._y + b._y, a._z + b._z, a._w + b._w);

}
function qSetAxisAngle(axis, rad) {
    rad = rad * 0.5;
    var s = Math.sin(rad);
    var x = s * axis.x;
    var y = s * axis.y;
    var z = s * axis.z;
    var w = Math.cos(rad);
    return new THREE.Quaternion(x, y, z, w);
};

function vCross(a, b) {
    var ax = a.x, ay = a.y, az = a.z,
        bx = b.x, by = b.y, bz = b.z;

    var x = ay * bz - az * by;
    var y = az * bx - ax * bz;
    var z = ax * by - ay * bx;
    return new THREE.Vector3(x,y,z);
};

function LRotationf(axis, angle){
	 rad = angle * 0.5;
    var s = Math.sin(rad);
    var i = s * axis.x;
    var j = s * axis.y;
    var k = s * axis.z;
    var r = Math.cos(rad);
  
  return new THREE.Quaternion( i, j, k, r);
}

function multiQuat(r, q){
	var n_x = r._x * q._x - r._y * q._y - r._z * q._z - r._w * q._w;
	var n_y = r._x * q._y + r._y * q._x + r._z * q._w + r._w * q._z;
	var n_z = r._x * q._z + r._y * q._w + r._z * q._x - r._w * q._y;
	var n_w = r._x * q._w - r._y * q._z + r._Z * q._y + r._w * q._x;
	return new THREE.Quaternion(n_x, n_y, n_z, n_w);
}

// Rotate an object around an arbitrary axis in object space

function rotateAroundObjectAxis(object, axis, radians) {
    
    object.rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.multiply(object.rotObjectMatrix);

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js r50-r58:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // new code for Three.js r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
	//object.updateMatrix();
}

function rotateAroundObjectAxis2(object,  r1, r2) {
    var m1 = new THREE.Matrix4();
	m1.makeRotationZ( r2);
		
	var m2 =  new THREE.Matrix4();
	m2.makeRotationX( r1);
	m2.multiply(m1);
		
   //// object.rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

   
   
   object.rotObjectMatrix.multiply(m2);
    // old code for Three.JS pre r54:
    // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    // new code for Three.JS r55+:
    object.matrix.copy(  object.rotObjectMatrix );

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js r50-r58:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // new code for Three.js r59+:
    object.rotation.setFromRotationMatrix(object.matrix);
	//object.updateMatrix();
}

// Rotate an object around an arbitrary axis in world space       

function rotateAroundWorldAxis(object, axis, radians) {
	
	
    object.rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

    // old code for Three.JS pre r54:
    //  rotWorldMatrix.multiply(object.matrix);
    // new code for Three.JS r55+:
    object.rotWorldMatrix.multiply(object.matrix);                // pre-multiply

    object.matrix.copy( object.rotWorldMatrix );

    // old code for Three.js pre r49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
    // old code for Three.js pre r59:
    // object.rotation.setEulerFromRotationMatrix(object.matrix);
    // code for r59+:
    object.rotation.setFromRotationMatrix(object.matrix);

}

	function rotateAroundWorldAxis2(object, axis1, axis2, radians1, radians2) {
		

		var m1 = new THREE.Matrix4();
		m1.makeRotationX( radians1);
		
		var m2 =  new THREE.Matrix4();
		m2.makeRotationZ( -radians2);

	   // object.rotWorldMatrix;
	
		// old code for Three.JS pre r54:
		//  rotWorldMatrix.multiply(object.matrix);
		// new code for Three.JS r55+:
		var res = new THREE.Matrix4();
		res.multiplyMatrices( m2, m1 );               // pre-multiply
		
		var m3 =  new THREE.Matrix4();
		m3.makeRotationY(0);


		object.rotWorldMatrix.multiply(res);
		object.matrix.copy( object.rotWorldMatrix );

		// old code for Three.js pre r49:
		// object.rotation.getRotationFromMatrix(object.matrix, object.scale);
		// old code for Three.js pre r59:
		// object.rotation.setEulerFromRotationMatrix(object.matrix);
		// code for r59+:
		object.rotation.setFromRotationMatrix(object.matrix);

	}
	
function rotate2d(v, n){
	var vt = new THREE.Vector2(v.x, v.y);
	var xtmp = vt.x;
	var ytmp = vt.y;
	var cn = Math.cos(n);
	var sn = Math.sin(n);
	var rx = (vt.x * cn) - (vt.y * sn);
    var ry = (xtmp * sn) + (ytmp * cn);
   return new THREE.Vector2(Math.floor(rx),Math.floor(ry));
}

function projectOn(v1, v2){
	return dotProduct(v1,v2.normalize());
}

function dotProduct(v1, v2)
{
	var vt = new THREE.Vector2(v1.x, v1.y);
	var dot_product = ((vt.x * v2.x) + (vt.y * v2.y));
	return dot_product;
}

function line2Circle(x0, y0, x1, y1, cx, cy, r){
  var fxgy,t;
  var f = (x1 - x0);
  var g = (y1 - y0);
  var f2 = f*f;
  var g2 = g*g;
  var fg2 = f2 + g2;
  var r2 = r*r;

  var xc0 = cx - x0;
  var yc0 = cy - y0;
  var xj1 = cx - x1;
  var yj1 = cy - y1;

  var fygx = f*yc0 - g*xc0;
  var root = r*r*fg2 - fygx*fygx;

  if(root >= 0){
    fxgy = f*xc0 + g*yc0;
    t = fxgy / fg2;
    return ((t >= 0 && t <= 1) || (xc0*xc0 + yc0*yc0 < r2) || (xj1*xj1 + yj1*yj1 < r2) );
  }
  return false;
}