# tweakpane-plugin-camerakit
Enjoyable camera-flavoed controls for [Tweakpane].


## Installation


### Browser
```html
<script src="tweakpane.min.js"></script>
<scirpt src="tweakpane-plugin-camerakit.min.js"></script>
```


### Package
```js
import Tweakpane from 'tweakpane';
import 'tweakpane-plugin-camerakit';
```



# Usage
```js
// Ring input
pane.addInput(params, 'key', {
  // Use CameraKit for this input
  plugin: 'camerakit',
  // Ring control
  view: 'ring',
  // Appearance of the ring view: 0 | 1 | 2
  series: 0,
});
```

```js
// Configuring a scale
pane.addInput(params, 'key', {
  plugin: 'camerakit',
  view: 'ring',
  series: 0,
  // Scale unit
  unit: {
    // Pixels for the unit
    pixels: 50,
    // Number of ticks for the unit
    ticks: 10,
    // Amount of a value for the unit
    value: 0.2,
  },
  // You can use `min`, `max`, `step` same as a number input
  min: 1,
  step: 0.02,
});
```

```js
// Wide
pane.addInput(params, 'key', {
  plugin: 'camerakit',
  view: 'ring',
  series: 0,
  // Hide a text input and widen the ring view
  wide: true,
});
```

```js
// Wheel input
pane.addInput(params, 'key', {
  plugin: 'camerakit',
  view: 'wheel',
  // Amount of a value per pixel
  amount: 100,
});
```


[tweakpane]: https://github.com/cocopon/tweakpane/
