export class Camera {
  constructor(videoElement, options = {}) {
    this.videoElement = videoElement;
    this.options = {
      width: 1280,
      height: 720,
      ...options
    };
    this.stream = null;
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: this.options.width },
          height: { ideal: this.options.height },
          facingMode: 'user'
        },
        audio: false
      });
      this.videoElement.srcObject = this.stream;
      await new Promise((resolve) => {
        this.videoElement.onloadedmetadata = () => {
          this.videoElement.play();
          resolve();
        };
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw error;
    }
  }

  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
}
