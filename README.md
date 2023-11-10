# Frontend Image compression

This is script and implementation of frontend image compression, convert, rotate, resize based on codecs in [Google/Squoosh](https://github.com/GoogleChromeLabs/squoosh). All codecs are copy from the Squoosh repo without modifying. if you want to pre-process images before uploading them to the server, please use this repo for reference
## Usage

```html
<script type="module">
    import { loadImage, encodeWebP, encodeWebP2, encodeAvif, encodeJpeg, encodeJxl, rotateImage, resizeImage, encodeOnixPng, quantizeImage, resizePixelImage } from "https://cdn.jsdelivr.net/gh/thangman22/frontend-image-encode@main/index.js";

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
            avifEncJs: "/codecs/avif/enc/avif_enc.js"
        }
    }

    // Call function to encode image return is base64 format
    const webPImageResult = await encodeAvif(image, options);

    document.getElementById('webp-image').src = webPImageResult
</script>
```

## Available methods & options

### Encode WEBP

Convert image to WEBP format with https://github.com/webmproject/libwebp

```javascript
// Available & Default options
const options = {
    quality: 75,
    target_size: 0,
    target_PSNR: 0,
    method: 4,
    sns_strength: 50,
    filter_strength: 60,
    filter_sharpness: 0,
    filter_type: 1,
    partitions: 0,
    segments: 4,
    pass: 1,
    show_compressed: 0,
    preprocessing: 0,
    autofilter: 0,
    partition_limit: 0,
    alpha_compression: 1,
    alpha_filtering: 1,
    alpha_quality: 100,
    lossless: 0,
    exact: 0,
    image_hint: 0,
    emulate_jpeg_size: 0,
    thread_level: 0,
    low_memory: 0,
    near_lossless: 100,
    use_delta_palette: 0,
    use_sharp_yuv: 0,
    module: {
        webpEncJs: "/codecs/webp/enc/webp_enc.js"
    }
}

// Call function to encode image return is base64 format
const result = await encodeWebP(image, options);
```
---
### Encode AVIF

Convert image to AVIF format

```javascript
// Available & Default options
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
        avifEncJs: "/codecs/avif/enc/avif_enc.js"
    }
}

// Call function to encode image return is base64 format
const result = await encodeWebP(image, options);
```
---
### Encode JPEG

Encode JPEG image with mozjpeg

```javascript
// Available & Default options
const options = {
    quality: 75,
    baseline: false,
    arithmetic: false,
    progressive: true,
    optimize_coding: true,
    smoothing: 0,
    color_space: 3 /*YCbCr*/,
    quant_table: 3,
    trellis_multipass: false,
    trellis_opt_zero: false,
    trellis_opt_table: false,
    trellis_loops: 1,
    auto_subsample: true,
    chroma_subsample: 2,
    separate_chroma_quality: false,
    chroma_quality: 75,
    module: {
        mozjpegEncJs: "/codecs/mozjpeg/enc/mozjpeg_enc.js"
    }
}

// Call function to encode image return is base64 format
const result = await encodeJpeg(image, options);
```
---
### Encode PNG

Encode PNG image with oxipng

```javascript
// Available & Default options
const options = {
    level: 2,
    module: {
        pngEncDecJs: "/codecs/png/pkg/squoosh_png.js",
        oxipngEncJs: "/codecs/oxipng/pkg/squoosh_oxipng.js",
        squooshPngBgWasm: "/codecs/png/pkg/squoosh_png_bg.wasm",
        squooshOxipngBgWasm: "/codecs/oxipng/pkg/squoosh_oxipng_bg.wasm"
    }
}

// Call function to encode image return is base64 format
const result = await encodeOnixPng(image, options);
```
---
### Rotate Image

```javascript
const degree = 90
// Call function to encode image return is base64 format
const result = await rotateImage(image, degree);
```
---
### Resize Image
```javascript
const outputWidth = 300
const outputHeight = 300
const options = {
    method: 3, // triangle = 0, catrom = 1, mitchell = 2, lanczos3 = 3
    fitMethod: 'stretch',
    premultiply: true,
    linearRGB: true,
    module: {
        squooshResizeJs: "/codecs/resize/pkg/squoosh_resize.js",
        squooshResizeBgWasm: "/codecs/resize/pkg/squoosh_resize_bg.wasm"
    }
}
const aspectRatio = true

// Call function to encode image return is base64 format
const result = await resizeImage(image, outputWidth, outputHeight, options, aspectRatio)
```
---
### Resize Pixel Art Image
```javascript
const options = {
    factor: 2,
    module: {
        squooshhqxJs: "/codecs/hqx/pkg/squooshhqx.js",
        squooshhqxBgWasm: "/codecs/hqx/pkg/squooshhqx_bg.wasm"
    }
}
const result = await resizePixelImage(image, options)
```
---
### Reduce Color of Image
```javascript
const options = {
    numColors: 255,
    dither: 1.0,
    module: {
        imagequantJs: "/codecs/imagequant/imagequant.js"
    }
}
const result = await quantizeImage(image, options)
```
---

*** Browser Not Support yet ***

### encode WEBP2
```javascript
const options = {
    quality: 75,
    alpha_quality: 75,
    effort: 5,
    pass: 1,
    sns: 50,
    uv_mode: 0 /*UVMode.UVModeAuto*/,
    csp_type: 0 /*Csp.kYCoCg*/,
    error_diffusion: 0,
    use_random_matrix: false,
    module: {
        wp2EncJs : "/codecs/wp2/enc/wp2_enc.js"
    }
}
const result = await encodeWebP2(image, options)
```
---
### encode JPEGXL
```javascript
const options = {
    speed: 4,
    quality: 75,
    progressive: false,
    epf: -1,
    nearLossless: 0,
    lossyPalette: false,
    module: {
        jxlEncJs: "/codecs/jxl/enc/jxl_enc.js"
    }
}
const result = await encodeJxl(image, options)
```
---

## Todo

- [ ] Support Web Worker (Not check yet)