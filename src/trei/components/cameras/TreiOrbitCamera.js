import { TreiCamera } from './TreiCamera.js';
import { html } from 'lit';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class TreiOrbitCamera extends TreiCamera {
  static properties = {
    ...super.properties,
    enableDamping: { type: Boolean },
    dampingFactor: { type: Number },
    enableZoom: { type: Boolean },
    minDistance: { type: Number },
    maxDistance: { type: Number },
    enablePan: { type: Boolean },
    autoRotate: { type: Boolean },
    autoRotateSpeed: { type: Number }
  };

  constructor() {
    super();
    this.enableDamping = true;
    this.dampingFactor = 0.05;
    this.enableZoom = true;
    this.minDistance = 1;
    this.maxDistance = 1000;
    this.enablePan = true;
    this.autoRotate = false;
    this.autoRotateSpeed = 2.0;
    this.controls = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setupControls();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.controls) {
      this.controls.dispose();
    }
  }

  setupControls() {
    const scene = this.closest('trei-scene');
    if (scene && scene.renderer) {
      this.controls = new OrbitControls(this.threeObject, scene.renderer.domElement);
      this.updateControlsProperties();
    }
  }

  updateControlsProperties() {
    if (this.controls) {
      this.controls.enableDamping = this.enableDamping;
      this.controls.dampingFactor = this.dampingFactor;
      this.controls.enableZoom = this.enableZoom;
      this.controls.minDistance = this.minDistance;
      this.controls.maxDistance = this.maxDistance;
      this.controls.enablePan = this.enablePan;
      this.controls.autoRotate = this.autoRotate;
      this.controls.autoRotateSpeed = this.autoRotateSpeed;
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    this.updateControlsProperties();
  }

  update() {
    if (this.controls) {
      this.controls.update();
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('trei-orbit-camera', TreiOrbitCamera);