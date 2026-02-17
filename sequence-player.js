export class ImageSequence {
    /**
     * @param {string} canvasId - The ID of the canvas element.
     * @param {string} folderPath - The path pattern for images (e.g., 'assets/hero-sequence/ezgif-frame-').
     * @param {string} extension - The image extension (e.g., '.jpg').
     * @param {number} frameCount - Total number of frames.
     * @param {number} framePadding - Number of digits in filename (e.g., 3 for 001).
     * @param {number} fps - Playback speed.
     */
    constructor({ canvasId, folderPath, extension, frameCount, framePadding = 3, fps = 24 }) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id ${canvasId} not found`);
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        this.folderPath = folderPath;
        this.extension = extension;
        this.frameCount = frameCount;
        this.framePadding = framePadding;
        this.fps = fps;

        this.images = [];
        this.loadedCount = 0;
        this.currentFrameIndex = 0;
        this.lastFrameTime = 0;
        this.isPlaying = false;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Start loading
        this.loadImages();
    }

    padNumber(num, size) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    loadImages() {
        for (let i = 1; i <= this.frameCount; i++) {
            const img = new Image();
            const paddedIndex = this.padNumber(i, this.framePadding);
            img.src = `${this.folderPath}${paddedIndex}${this.extension}`;

            img.onload = () => {
                this.loadedCount++;
                if (this.loadedCount === 1) {
                    // Draw first frame immediately
                    this.drawFrame(0);
                }
                if (this.loadedCount === this.frameCount) {
                    this.start();
                }
            };

            img.onerror = () => {
                console.error(`Failed to load image: ${img.src}`);
            };

            this.images.push(img);
        }
    }

    resize() {
        // Make canvas cover its parent container
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = parent.clientHeight;
            // Redraw current frame
            if (this.images.length > 0) {
                this.drawFrame(this.currentFrameIndex);
            }
        }
    }

    drawFrame(index) {
        if (!this.ctx || !this.images[index]) return;

        const img = this.images[index];
        const canvas = this.canvas;
        const ctx = this.ctx;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw image "cover" style
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    start() {
        if (this.isPlaying) return;
        this.isPlaying = true;
        this.startTime = performance.now();
        this.animate();
    }

    animate(timestamp) {
        if (!this.isPlaying) return;
        if (!timestamp) timestamp = performance.now();

        // simple fps throttle
        const interval = 1000 / this.fps;

        if (timestamp - this.lastFrameTime > interval) {
            this.currentFrameIndex = (this.currentFrameIndex + 1) % this.frameCount;
            this.drawFrame(this.currentFrameIndex);
            this.lastFrameTime = timestamp;
        }

        requestAnimationFrame((ts) => this.animate(ts));
    }

    stop() {
        this.isPlaying = false;
    }
}
