const fingerJoints = {
    thumb: [0, 1, 2, 3, 4],
    indexFinger: [0, 5, 6, 7, 8],
    middleFinger: [0, 9, 10, 11, 12],
    ringFinger: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};


export const drawHand = (predictions, ctx) => {
    console.log(1);
    if (predictions.length > 0){
        console.log(2);
        if (predictions != null){
        predictions.forEach((prediction) => {
            console.log(3);
            const landmarks = prediction.landmarks;
            console.log(4);

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
        


            for (let i = 0; i < landmarks.length; i++){
                const x = landmarks[i][0];
                const y = landmarks[i][1];

                ctx.beginPath();
                ctx.arc( x, y, 5, 0, 3 * Math.PI);

                ctx.beginPath();
                ctx.arc( x, y, 5, 0, 3 * Math.PI);

                ctx.fillStyle = "indigo";
                ctx.fill();
            } 
        });
    }
    }
};