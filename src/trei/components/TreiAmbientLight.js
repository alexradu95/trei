import { TreiElement } from './TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * Represents ambient light in the 3D scene.
 * Automatically connects to the nearest TreiScene.
 */
export class TreiAmbientLight extends TreiElement {
  constructor() {
    super();
    this.threeObject = new THREE.AmbientLight(0xffffff, 0.5);
  }

  connectedCallback() {
    super.connectedCallback();
    const scene = this.closest('trei-scene');
    if (scene) {
      scene.addObject(this.threeObject);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const scene = this.closest('trei-scene');
    if (scene) {
      scene.removeObject(this.threeObject);
    }
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('trei-ambient-light', TreiAmbientLight);
