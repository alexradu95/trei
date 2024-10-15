import { TreiElement } from '@/trei/components/base/TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * @class TreiAmbientLight
 * @extends TreiElement
 * @classdesc Represents ambient light in the 3D scene. Automatically connects to the nearest TreiScene.
 */
export class TreiAmbientLight extends TreiElement {
  /**
   * Creates an instance of TreiAmbientLight.
   * Initializes the Three.js AmbientLight.
   */
  constructor() {
    super();
    /**
     * @type {THREE.AmbientLight}
     * @description The Three.js AmbientLight object.
     */
    this.threeObject = new THREE.AmbientLight(0xffffff, 0.5);
    console.debug('TreiAmbientLight initialized', this.threeObject);
  }

  /**
   * Called when the element is added to the document's DOM.
   * Connects the ambient light to the nearest TreiScene.
   */
  connectedCallback() {
    super.connectedCallback();
    const scene = this.closest('trei-scene');
    if (scene) {
      scene.addObject(this.threeObject);
      console.debug('TreiAmbientLight added to scene', scene);
    }
  }

  /**
   * Called when the element is removed from the document's DOM.
   * Disconnects the ambient light from the TreiScene.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    const scene = this.closest('trei-scene');
    if (scene) {
      scene.removeObject(this.threeObject);
      console.debug('TreiAmbientLight removed from scene', scene);
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

customElements.define('trei-ambient-light', TreiAmbientLight);
