import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';

export class Segmenter {
    constructor(canvasElement, width, height) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.segmentation = new SelfieSegmentation({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
            }
        });

        this.segmentation.setOptions({
            modelSelection: 1,
            selfieMode: false,
        });

        this.segmentation.onResults(this.onResults.bind(this));

        // Default background style
        this.backgroundStyle = { type: 'color', value: '#1a1a1a' };
    }

    setBackground(type, value) {
        this.backgroundStyle = { type, value };
    }

    onResults(results) {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw segmentation mask
        this.ctx.drawImage(results.segmentationMask, 0, 0, this.canvas.width, this.canvas.height);

        // Keep only the person where the mask is
        this.ctx.globalCompositeOperation = 'source-in';
        this.ctx.drawImage(results.image, 0, 0, this.canvas.width, this.canvas.height);

        // Draw the background behind
        this.ctx.globalCompositeOperation = 'destination-over';

        if (this.backgroundStyle.type === 'color') {
            this.ctx.fillStyle = this.backgroundStyle.value;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else if (this.backgroundStyle.type === 'image') {
            // Assume value is an image object
            this.ctx.drawImage(this.backgroundStyle.value, 0, 0, this.canvas.width, this.canvas.height);
        } else if (this.backgroundStyle.type === 'blur') {
            // Ideally we would blur the original image and draw it, but that requires preprocessing
            // For simplicity, just use a dark overlay
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        this.ctx.restore();
    }

    async process(videoElement) {
        await this.segmentation.send({ image: videoElement });
    }
}
