import { TreiElement } from './TreiElement.js';
import { css, html } from 'lit';
import * as THREE from 'three';

export class TreiScene extends TreiElement {
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
    this.scene.background = new THREE.Color(0x000000);
  }

  firstUpdated() {
    super.firstUpdated();
    this.renderer.setSize(this.clientWidth, this.clientHeight);
    this.shadowRoot.appendChild(this.renderer.domElement);
    this.setupResizeObserver();
    this.animate();
  }

  setupResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
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
  }

  removeObject(object) {
    this.scene.remove(object);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.camera) {
      // Update camera controls
      const cameraElement = this.querySelector('trei-orbit-camera, trei-camera');
      if (cameraElement && 'update' in cameraElement) {
        cameraElement.update();
      }
      
      this.renderer.render(this.scene, this.camera);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('trei-scene', TreiScene);