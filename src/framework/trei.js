import { LitElement, html, css } from 'lit';
import * as THREE from 'three';

console.log('THREE library loaded:', THREE);

class TreiElement extends LitElement {
  static properties = {
    position: { type: Array },
    rotation: { type: Array },
    scale: { type: Array },
  };

  constructor() {
    super();
    this.threeObject = null;
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
  }

  firstUpdated() {
    this.updateThreeObject();
  }

  updated(changedProperties) {
    if (changedProperties.has('position') || 
        changedProperties.has('rotation') || 
        changedProperties.has('scale')) {
      this.updateThreeObject();
    }
  }

  updateThreeObject() {
    if (this.threeObject) {
      this.threeObject.position.set(...this.position);
      this.threeObject.rotation.set(...this.rotation);
      this.threeObject.scale.set(...this.scale);
      console.log(`${this.tagName} updated:`, this.threeObject);
    }
  }

  addToParent() {
    const parent = this.closest('trei-scene, trei-group');
    if (parent && this.threeObject) {
      parent.addObject(this.threeObject);
      console.log(`Added ${this.tagName} to parent`);
    } else if (this.tagName.toLowerCase() === 'trei-scene') {
      console.log('TreiScene does not need a parent');
    } else {
      console.warn(`No parent found for ${this.tagName}`);
    }
  }

  removeFromParent() {
    const parent = this.closest('trei-scene, trei-group');
    if (parent && this.threeObject) {
      parent.removeObject(this.threeObject);
      console.log(`Removed ${this.tagName} from parent`);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addToParent();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeFromParent();
  }
}

class TreiScene extends TreiElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  constructor() {
    super();
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.camera = null;
    this.scene.background = new THREE.Color(0x00ff00); // Bright green background
    console.log('TreiScene constructed');
  }

  firstUpdated() {
    super.firstUpdated();
    console.log(`TreiScene dimensions: ${this.clientWidth}x${this.clientHeight}`);
    this.renderer.setSize(this.clientWidth, this.clientHeight);
    this.shadowRoot.appendChild(this.renderer.domElement);
    console.log('Renderer added to shadow DOM');
    this.setupResizeObserver();
    this.animate();
  }

  setupResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      console.log(`TreiScene resized to: ${this.clientWidth}x${this.clientHeight}`);
      this.renderer.setSize(this.clientWidth, this.clientHeight);
      if (this.camera) {
        this.camera.aspect = this.clientWidth / this.clientHeight;
        this.camera.updateProjectionMatrix();
      }
    });
    resizeObserver.observe(this);
  }

  addObject(object) {
    this.scene.add(object);
    console.log(`Added object to scene: ${object.type}`);
  }

  removeObject(object) {
    this.scene.remove(object);
    console.log(`Removed object from scene: ${object.type}`);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.camera) {
      // Rotate the cube if it exists
      const cube = this.scene.getObjectByProperty('type', 'Mesh');
      if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }
      this.renderer.render(this.scene, this.camera);
      console.log('Scene rendered', this.scene.children);
    } else {
      console.warn('No camera set for scene');
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
customElements.define('trei-scene', TreiScene);

class TreiCamera extends TreiElement {
  constructor() {
    super();
    this.threeObject = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    console.log('TreiCamera created');
  }

  connectedCallback() {
    super.connectedCallback();
    const scene = this.closest('trei-scene');
    if (scene) {
      scene.camera = this.threeObject;
      console.log('Camera set for scene');
    } else {
      console.warn('No scene found for camera');
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const scene = this.closest('trei-scene');
    if (scene && scene.camera === this.threeObject) {
      scene.camera = null;
      console.log('Camera removed from scene');
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
customElements.define('trei-camera', TreiCamera);

class TreiLight extends TreiElement {
  static properties = {
    ...super.properties,
    color: { type: String },
    intensity: { type: Number },
  };

  constructor() {
    super();
    this.color = '#ffffff';
    this.intensity = 1;
    this.threeObject = new THREE.PointLight(this.color, this.intensity);
    console.log('TreiLight created');
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('color')) {
      this.threeObject.color.set(this.color);
    }
    if (changedProperties.has('intensity')) {
      this.threeObject.intensity = this.intensity;
    }
    console.log('TreiLight updated:', this.threeObject);
  }

  render() {
    return html`<slot></slot>`;
  }
}
customElements.define('trei-light', TreiLight);

class TreiCube extends TreiElement {
  static properties = {
    ...super.properties,
    color: { type: String },
  };

  constructor() {
    super();
    this.color = '#ff0000';
  }

  firstUpdated() {
    super.firstUpdated();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: this.color });
    this.threeObject = new THREE.Mesh(geometry, material);
    console.log('TreiCube created:', this.threeObject);
    this.addToParent();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('color') && this.threeObject) {
      this.threeObject.material.color.set(this.color);
      console.log('TreiCube color updated:', this.color);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}
customElements.define('trei-cube', TreiCube);