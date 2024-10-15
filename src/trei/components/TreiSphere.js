import { TreiElement } from './base/TreiElement';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * Represents a sphere in the 3D scene.
 * Automatically connects to the nearest TreiScene.
 */
export class TreiSphere extends TreiElement {
  constructor() {
    super();
    this.threeObject = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
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

customElements.define('trei-sphere', TreiSphere);
