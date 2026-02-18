import './ui/style.css';
import { Camera } from './core/camera.js';
import { Segmenter } from './core/segmenter.js';

const videoElement = document.getElementById('input-video');
const canvasElement = document.getElementById('output-canvas');
const controls = document.querySelectorAll('.filter-btn');

// Initialize with default dimensions
// We will resize on start
const segmenter = new Segmenter(canvasElement, 1280, 720);
const camera = new Camera(videoElement, {
  width: 1280,
  height: 720
});

async function init() {
  try {
    await camera.start();

    // Start processing loop
    const processFrame = async () => {
      if (videoElement.readyState >= 2) {
        await segmenter.process(videoElement);
      }
      requestAnimationFrame(processFrame);
    };
    processFrame();

  } catch (error) {
    console.error('Failed to start camera:', error);
  }
}

// Handle UI controls
controls.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    controls.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update filter
    const type = btn.dataset.type;
    const value = btn.dataset.value;

    if (type === 'color') {
      segmenter.setBackground('color', value);
    } else if (type === 'blur') {
      segmenter.setBackground('blur');
    }
  });
});

init();
