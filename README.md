# Frontend Image compression

This is script and implementation of frontend image compression, convert, rotate, resize based on codecs in [Google/Squoosh](https://github.com/GoogleChromeLabs/squoosh). All codecs are copy from the Squoosh repo without modifying. if you want to pre-process images before uploading them to the server, please use this repo for reference


## How to 

Wait a moment please...
## Usage

```html
<script type="module">
    import { loadImage, encodeWebP, encodeWebP2, encodeAvif, encodeJpeg, encodeJxl, rotateImage, resizeImage, encodeOnixPng, quantizeImage, resizePixelImage } from "./lib.js";

    // Load image before encode 
    const image = await loadImage("./assets/images/example.jpg");

    // Define options is nees
    const options = {
        minQuantizer: 33,
        maxQuantizer: 63,
        minQuantizerAlpha: 33,
        maxQuantizerAlpha: 63,
        tileColsLog2: 0,
        tileRowsLog2: 0,
        speed: 8,
        subsample: 1,
        module: {
            avifEncJs: "/squoosh/codecs/avif/enc/avif_enc.js"
        }
    }

    // Call function to encode image return is base64 format
    const webPImageResult = await encodeAvif(image, options);
</script>
```
## Progress

- **DONE** ---- MozJPEG
- **DONE** ---- WebP
- **DONE** ---- AVIF
- **Browser not support** JXL
- **Browser not support** WP2
- **DONE** OxiPNG
- **DONE** ImageQuant
- **DONE** ---- Rotate
- **DONE** ---- Resize
- **DONE** ---- Resize HQX