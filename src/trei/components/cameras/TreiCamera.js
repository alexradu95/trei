import { TreiElement } from '../Base/TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * Represents a camera in the 3D scene.
 * Automatically connects to the nearest TreiScene.
 */
export class TreiCamera extends TreiElement {
  constructor() {
    super();
    this.threeObject = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  }

  connectedCallback() {
    super.connectedCallback();
    const scene = this.closest('trei-scene');
    if (scene) {
      scene.camera = this.threeObject;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const scene = this.closest('trei-scene');
    if (scene && scene.camera === this.threeObject) {
      scene.camera = null;
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('trei-camera', TreiCamera);
