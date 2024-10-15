import { TreiElement } from '@/trei/components/base/TreiElement';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * @class TreiSphere
 * @extends TreiElement
 * @classdesc Represents a sphere in the 3D scene. Automatically connects to the nearest TreiScene.
 */
export class TreiSphere extends TreiElement {
  /**
   * Creates an instance of TreiSphere.
   * Initializes the Three.js Mesh with SphereGeometry and MeshStandardMaterial.
   */
  constructor() {
    super();
    /**
     * @type {THREE.Mesh}
     * @description The Three.js Mesh object representing the sphere.
     */
    this.threeObject = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    console.debug('TreiSphere initialized', this.threeObject);
  }

  /**
   * Called when the element is added to the document's DOM.
   * Connects the sphere to the nearest TreiScene.
   */
  connectedCallback() {
    super.connectedCallback();
    const scene = this.closest('trei-scene');
    if (scene) {
      scene.addObject(this.threeObject);
      console.debug('TreiSphere added to scene', scene);
    }
  }

  /**
   * Called when the element is removed from the document's DOM.
   * Disconnects the sphere from the TreiScene.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    const scene = this.closest('trei-scene');
    if (scene) {
      scene.removeObject(this.threeObject);
      console.debug('TreiSphere removed from scene', scene);
    }
  }

  /**
   * Renders the HTML template for the component.
   * @returns {TemplateResult} The Lit HTML template.
   */
  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('trei-sphere', TreiSphere);
