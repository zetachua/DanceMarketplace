import React, { useRef, useState } from 'react';
import GIF from 'gif.js-upgrade';
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedVideo } from '@cloudinary/react';
import { fill } from "@cloudinary/url-gen/actions/resize";

const ScreenRecorderWithGIFConversion = () => {
  const videoRef = useRef();
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null); // Use videoUrl state

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          aspectRatio: 480 / 820, // Set the aspect ratio for portrait mode
        },
      });
      const recorder = new MediaRecorder(stream);

      const chunks = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const webmBlob = new Blob(chunks, { type: 'video/webm' });
        const webmUrl = URL.createObjectURL(webmBlob);
        setVideoUrl(webmUrl); // Update videoUrl state instead of manipulating videoRef.current.src

        convertWebMToGIF(webmBlob);
      };

      recorder.start();
      setRecording(true);

      setTimeout(() => {
        recorder.stop();
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
      }, 5000); // Recording for exactly 5 seconds
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const convertWebMToGIF = (webmBlob) => {
    const videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(webmBlob);
    videoElement.addEventListener('loadeddata', async () => {
      const gif = new GIF({ workers: 2, quality: 10 });
      const originalCanvas = document.createElement('canvas');
      const originalCtx = originalCanvas.getContext('2d');

      const processingCanvas = document.createElement('canvas');
      const processingCtx = processingCanvas.getContext('2d');

      // Set original canvas dimensions to the video dimensions
      originalCanvas.width = videoElement.videoWidth;
      originalCanvas.height = videoElement.videoHeight;

      // Set processing canvas dimensions to the desired aspect ratio
      const aspectRatio = 9 / 16; // Example: 9:16 for portrait mode
      processingCanvas.width = videoElement.videoWidth;
      processingCanvas.height = videoElement.videoWidth * aspectRatio;

      const frameDuration = 40; // Adjust the delay as needed (25 frames per second)

      let currentTime = 0;

      const processFrame = () => {
        originalCtx.drawImage(
          videoElement,
          0,
          0,
          videoElement.videoWidth,
          videoElement.videoHeight
        );

        // Crop the frame to achieve the desired aspect ratio
        const cropY = (videoElement.videoHeight - videoElement.videoWidth * aspectRatio) / 2;
        originalCtx.drawImage(
          originalCanvas,
          0,
          cropY,
          originalCanvas.width,
          originalCanvas.height - 2 * cropY,
          0,
          0,
          processingCanvas.width,
          processingCanvas.height
        );

        // Get the current frame as imageData
        const imageData = originalCtx.getImageData(0, 0, processingCanvas.width, processingCanvas.height);

        // Add the imageData as a frame to the GIF
        gif.addFrame(imageData, { delay: frameDuration });

        // Update the currentTime for the next frame
        currentTime += frameDuration / 1000;

        // Request the next frame
        if (currentTime < videoElement.duration) {
          requestAnimationFrame(processFrame);
        } else {
          // Finish and render the GIF when all frames are processed
          gif.on('finished', (blob) => {
            const gifUrl = URL.createObjectURL(blob);
            setVideoUrl(gifUrl); // Update videoUrl state instead of manipulating videoRef.current.src
          });

          gif.render();
        }
      };

      // Start processing frames
      processFrame();
    });
  };

  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dymsz1apj',
    }
  });

  const mobile = cld
    .video("demo4")
    .resize(fill().width(400).aspectRatio("9:16"));

  return (
    <div>
      <button onClick={startRecording} disabled={recording}>
        {recording ? 'Recording...' : 'Start Recording'}
      </button>
      {videoUrl && (
        <div>
          <AdvancedVideo
          cldVid={mobile}
          autoPlay
          loop
          />
        </div>
    
      )}
    </div>
  );
};

export default ScreenRecorderWithGIFConversion;
