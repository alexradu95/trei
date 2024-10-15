# TreiJS

TreiJS is a lightweight 3D rendering framework that combines Lit for web components and Three.js for 3D graphics. The framework is designed to be modular and follows SOLID principles.

## Architecture

The framework consists of the following main components, organized into directories:

- **src/trei/components/**: Contains all the Trei components.
  - `TreiElement.js`: The base class for all Trei components.
  - `TreiScene.js`: The root component for a 3D scene.
  - `TreiCamera.js`: Represents a camera in the 3D scene.
  - `TreiLight.js`: Adds a light source to the scene.
  - `TreiCube.js`: Creates a cube in the scene.
  - `TreiSphere.js`: Represents a sphere in the 3D scene.
  - `TreiPlane.js`: Represents a plane in the 3D scene.
  - `TreiAmbientLight.js`: Provides ambient lighting in the scene.

- **src/trei/utils/**: Contains utility files.
  - `index.js`: Re-exports all Trei components for easy import.

## Usage

To use these components in a Lit-based web application, import them using the utility file:

```javascript
import './src/trei/utils/index.js';
```

Example usage in HTML:

```html
<trei-scene>
  <trei-camera .position=${[0, 0, 5]}></trei-camera>
  <trei-light .position=${[5, 5, 5]} color="#ffffff" intensity="1.5"></trei-light>
  <trei-cube .position=${[0, 0, 0]} color="#ff0000"></trei-cube>
  <trei-sphere .position=${[2, 0, 0]} color="#00ff00"></trei-sphere>
  <trei-plane .position=${[0, -1, 0]} rotation=${[-Math.PI / 2, 0, 0]} color="#0000ff"></trei-plane>
  <trei-ambient-light></trei-ambient-light>
</trei-scene>
```

Ensure you have the necessary setup for Lit and Three.js in your project.

### Note
Always include the new components (`TreiSphere`, `TreiPlane`, `TreiAmbientLight`) in your `index.js` to ensure they are part of the scene setup.
