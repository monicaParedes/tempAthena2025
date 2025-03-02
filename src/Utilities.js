import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, flower;
let flowerLoaded = false; 

function initThreeJS() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  // Load 3D Flower Model
  //const loader = new THREE.GLTFLoader();
  const loader = new GLTFLoader();

  loader.load('flower.glb', function(gltf) {
      flower = gltf.scene;
      flower.scale.set(0.1, 0.1, 0.1);
      scene.add(flower);
      flowerLoaded = true; 
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

async function start() {
  initThreeJS();
}

start();


// // Initialize Three.js Scene
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Stronger light
// directionalLight.position.set(1, 1, 1).normalize();
// scene.add(directionalLight);


// // Load the Flower Model
// const loader = new GLTFLoader();
// let flowerModel;


// loader.load('/flower.glb', (gltf) => {
//     flowerModel = gltf.scene;
//     // flowerModel.scale.set(0.05, 0.05, 0.05); // Adjust size as needed
//     flowerModel.scale.set(1, 1, 1); // Adjust size as needed
//     flowerModel.position.set(0, 0, 1.5);
//     scene.add(flowerModel);
//     console.log("Flower model loaded:", flowerModel);

//     flowerModel.traverse((child) => {
//       if (child.isMesh) {
//           child.material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
//       }
//   });
    
// }, undefined, (error) => {
//     console.error('Error loading GLB:', error);
// });

// Position camera
// camera.position.z = 3;

// Position camera
// camera.position.set(0, 0, 5); // Move camera forward
// camera.lookAt(scene.position); // Make sure it looks at the center

// window.addEventListener('resize', () => {
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
// });

// function animate() {
//   // console.log(flowerModel.x, flowerModel.y, flowerModel.z);
//   // console.log("!!!");
//   requestAnimationFrame(animate);

//   // Any animations for the flower can be added here (e.g., rotation)
//   if (flowerModel) {
//       flowerModel.rotation.y += 0.01; // Rotate the flower slightly for effect
//   }

//   renderer.render(scene, camera);
// }

// // Start the render loop
// animate();


// const convertTo3D = (x, y) => {
//   return {
//       x: (x / window.innerWidth) * 2 - 1,  // Normalize X
//       y: -(y / window.innerHeight) * 2 + 1, // Normalize Y
//       // z: -0.5  // Fixed Z depth
//       z: 1.5
//   };
// };


const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};

// export const drawHand = (predictions) => {
//   if (predictions.length > 0 && flowerModel) {
//       predictions.forEach((prediction) => {
//           const landmarks = prediction.landmarks;

//           // Check if hand is open (basic: all fingers far apart)
//           const thumbTip = landmarks[4];
//           const pinkyTip = landmarks[20];

//           const handOpen = Math.abs(thumbTip[0] - pinkyTip[0]) > 100; // Adjust threshold

//           if (handOpen) {
//               landmarks.forEach((landmark, index) => {
//                   let { x, y, z } = convertTo3D(landmark[0], landmark[1]);

//                   // Clone and position flower
//                   let flowerClone = flowerModel.clone();
//                   flowerClone.position.set(x, y, z);
//                   scene.add(flowerClone);
//               });
//           }
//       });
//   }
//   renderer.render(scene, camera);
// };

// export const drawHand = (predictions, ctx) => {
//   if (predictions.length > 0 && flowerModel){
//       if (predictions != null){
//       predictions.forEach((prediction) => {
//           const landmarks = prediction.landmarks;

//           for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
//               let finger = Object.keys(fingerJoints)[j];
//               //  Loop through pairs of joints
//               for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
//                 // Get pairs of joints
//                 const firstJointIndex = fingerJoints[finger][k];
//                 const secondJointIndex = fingerJoints[finger][k + 1];
      
//                 // Draw path
//                 ctx.beginPath();
//                 ctx.moveTo(
//                   landmarks[firstJointIndex][0],
//                   landmarks[firstJointIndex][1]
//                 );
//                 ctx.lineTo(
//                   landmarks[secondJointIndex][0],
//                   landmarks[secondJointIndex][1]
//                 );
//                 ctx.strokeStyle = "plum";
//                 ctx.lineWidth = 4;
//                 ctx.stroke();
//               }
//             }
      


//           for (let i = 0; i < landmarks.length; i++){
//               const x = landmarks[i][0];
//               const y = landmarks[i][1];
//               // x = landmarks[i][0];
//               // y = landmarks[i][1];

//               // ctx.beginPath();
//               // ctx.arc( x, y, 5, 0, 3 * Math.PI);


//               // ctx.fillStyle = "indigo";
//               // ctx.fill();

//               let { x: newx, y: newy, z: newz } = convertTo3D(x, y);
//               // newz = Math.max(0.1, Math.min(1000, newz)); // Ensures the flower is within visible range

//                   // Clone and position flower
//               let flowerClone = flowerModel.clone();
//               // +1 to move flowers forward to they don't get lost behind
//               flowerClone.position.set(newx, newy, newz + 1);
//               scene.add(flowerClone);
//               console.log(New x, y, z: (${newx}, ${newy}, ${newz}));
//               console.log(Actual x, y, z: (${flowerClone.position.x}, ${flowerClone.position.y}, ${flowerClone.position.z}));
//               console.log("Camera position:", camera.position);

//             } 
//         });
//     }
//   }
//   renderer.render(scene, camera);
// };

export const drawHand = (predictions, ctx) => {
  if (!flowerLoaded || !flower) return;
    if (predictions.length > 0){
        if (predictions != null){
        predictions.forEach((prediction) => {
            const landmarks = prediction.landmarks;

            for (let j = 0; j < Object.keys(fingerJoints).length; j++) {
                let finger = Object.keys(fingerJoints)[j];
                //  Loop through pairs of joints
                for (let k = 0; k < fingerJoints[finger].length - 1; k++) {
                  // Get pairs of joints
                  const firstJointIndex = fingerJoints[finger][k];
                  const secondJointIndex = fingerJoints[finger][k + 1];
        
                  // Draw path
                  ctx.beginPath();
                  ctx.moveTo(
                    landmarks[firstJointIndex][0],
                    landmarks[firstJointIndex][1]
                  );
                  ctx.lineTo(
                    landmarks[secondJointIndex][0],
                    landmarks[secondJointIndex][1]
                  );
                  ctx.strokeStyle = "plum";
                  ctx.lineWidth = 4;
                  ctx.stroke();
                }
              }
        


                for (let i = 0; i < landmarks.length; i++) {
                  const x = landmarks[i][0];
                  const y = landmarks[i][1];
          
                  // Normalize screen-space coordinates to NDC (Normalized Device Coordinates)
                  const normalizedX = (x / window.innerWidth) * 2 - 1;
                  const normalizedY = -(y / window.innerHeight) * 2 + 1;
          
                  // Create a vector based on normalized coordinates
                  const vector = new THREE.Vector3(normalizedX, normalizedY, 1); // Ensure the flowers are closer to the camera
                  vector.unproject(camera); // Convert the normalized coordinates to world space based on the camera
          
                  // Ensure the flower is in front of the camera, modify the z-position
                  //vector.z = Math.max(0.1, Math.min(10, vector.z)); // Adjust the z-position to ensure it's in front of the camera
                  vector.z = 1.5;

                  // Clone the flower model and position it at the fingertip
                  let flowerClone = flower.clone();
                  flowerClone.position.set(vector.x, vector.y, vector.z);
          
                  // Ensure the flower is positioned above the webcam feed (not below)
                  // flowerClone.position.z = 1.5; // Make sure it's placed in front of the camera, not too far back
          
                  // Add the flower clone to the scene
                  scene.add(flowerClone);
              }
                
                // let flowerClone = flower.clone();
                // flowerClone.position.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0);
                // scene.add(flowerClone);
                // }            
        });
    }
    // renderer.render(scene,camera);
    }
        renderer.render(scene,camera);
};