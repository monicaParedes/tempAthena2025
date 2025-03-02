import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, flower;
let currentHandBase = null;
let flowerLoaded = false; 
let flowerTextures = [];

function initThreeJS() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 10);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.classList.add('three-canvas');

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  const textureLoader = new THREE.TextureLoader();
  const texturePaths = [
    '/BlueHarebell.png',
    '/bush allamanda.png',
    '/Hydrangeas.png',
    '/LilyoftheValley.png',
    '/MexicanSunflower.png'
  ];
  let texturesLoaded = 0;

  texturePaths.forEach((path, index) => {
    textureLoader.load(
      path,
      (texture) => {
        flowerTextures[index] = texture;
        texturesLoaded++;
        if (texturesLoaded === texturePaths.length) {
          flowerLoaded = true;
          console.log('All flower textures loaded successfully!');
        }
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );
  });

  // Load 3D Flower Model
  const loader = new GLTFLoader();

  loader.load('flower.glb', function(gltf) {
      flower = gltf.scene;
      flower.scale.set(0.5, 0.5, 0.5);
      scene.add(flower);
      flowerLoaded = true; 
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (flowerLoaded && flower) {
    // make sure we have the last hand position
    if (currentHandBase) {
      // start translating the flower to the right position
      const targetX = currentHandBase.x / 100 + 15;
      const targetY = currentHandBase.y / 100 -4;

      console.log("difference", targetX - flower.position.x, targetY - flower.position.y)

      flower.position.x = targetX;
      flower.position.y = targetY;

      flower.rotation.y += 0.03 ;
      // flower.rotation.x += 0.01;
    } else {
      // console.log("no currentHandBase")
    }
  }
  renderer.render(scene, camera);
}

async function start() {
  initThreeJS();
}

start();


const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};


export const drawHand = (predictions, ctx) => {
  if (!flowerLoaded || !flower) return;
    if (predictions.length > 0){
        if (predictions != null) {
          predictions.forEach((prediction) => {
              const landmarks = prediction.landmarks;

              // have the flower track the first landmark
              const x = landmarks[0][0];
              const y = landmarks[0][1];
              const z = landmarks[0][2]
      
              // Normalize screen-space coordinates to NDC (Normalized Device Coordinates)
              const normalizedX = (x / window.innerWidth) * 2 - 1;
              const normalizedY = -(y / window.innerHeight) * 2 + 1;

      
              // Create a vector based on normalized coordinates
              const vector = new THREE.Vector3(normalizedX, normalizedY, 1); // Ensure the flowers are closer to the camera
              vector.unproject(camera); // Convert the normalized coordinates to world space based on the camera
      
              // Ensure the flower is in front of the camera, modify the z-position

              currentHandBase = vector;

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
                    // draw a flower

                    // Step 2: Create a new image object
                    // const image = new Image(); 
                    // image.src = './2DFlower.png'; // Replace with your image URL

                    // // Step 3: Once the image is loaded, draw it onto the canvas
                    // image.onload = function() {
                    //   // Draw the image at (x, y) coordinates on the canvas
                    //   ctx.drawImage(image, landmarks[firstJointIndex][0], landmarks[firstJointIndex][1], 50, 50);
                    // };
                  }
                }
          


                  for (let i = 0; i < landmarks.length; i++) {
                    const x = landmarks[i][0];
                    const y = landmarks[i][1];
            
                    // Normalize screen-space coordinates to NDC (Normalized Device Coordinates)
                    const normalizedX = (x / window.innerWidth) * 2 - 1.5;
                    const normalizedY = -(y / window.innerHeight) * 2 + 1;
            
                    // Create a vector based on normalized coordinates
                    const vector = new THREE.Vector3(normalizedX, normalizedY, 1); // Ensure the flowers are closer to the camera
                    vector.unproject(camera); // Convert the normalized coordinates to world space based on the camera
            
                    // Ensure the flower is in front of the camera, modify the z-position
                    //vector.z = Math.max(0.1, Math.min(10, vector.z)); // Adjust the z-position to ensure it's in front of the camera
                    vector.z = 1.5;

                    currentHandBase = vector;
                    for (let finger in fingerJoints) {
                      for (let i = 0; i < fingerJoints[finger].length; i++) {
                        const jointIndex = fingerJoints[finger][i];
                        const x = landmarks[jointIndex][0];
                        const y = landmarks[jointIndex][1];
              
                        // Step 1: Randomly select a flower texture
                        const randomTexture = flowerTextures[Math.floor(Math.random() * flowerTextures.length)];
              
                        // Step 2: Create an image object
                        const image = new Image();
                        image.src = randomTexture.image.src;
              
                        // Step 3: Draw the image at the joint location when loaded
                        image.onload = function () {
                          ctx.drawImage(image, x - 25, y - 25, 50, 50);
                        };
                }
              }
            }
          });
        } else {
          // no hand
          currentHandBase = null;
        }
    }
        renderer.render(scene,camera);
};