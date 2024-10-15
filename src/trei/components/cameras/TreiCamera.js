import { TreiElement } from '@/trei/components/base/TreiElement.js';
import { html } from 'lit';
import * as THREE from 'three';

/**
 * @class TreiCamera
 * @extends TreiElement
 * @classdesc Represents a camera in the 3D scene. Automatically connects to the nearest TreiScene.
 */
export class TreiCamera extends TreiElement {
  /**
   * Creates an instance of TreiCamera.
   * Initializes the Three.js PerspectiveCamera.
   */
  constructor() {
    super();
    /**
     * @type {THREE.PerspectiveCamera}
     * @description The Three.js PerspectiveCamera object.
     */
    this.threeObject = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    console.debug('TreiCamera initialized', this.threeObject);
  }

  /**
   * Called when the element is added to the document's DOM.
   * Connects the camera to the nearest TreiScene.
   */
  connectedCallback() {
    super.connectedCallback();
    const scene = this.closest('trei-scene');
    if (scene) {
      scene.camera = this.threeObject;
      console.debug('TreiCamera connected to scene', scene);
    }
  }

  /**
   * Called when the element is removed from the document's DOM.
   * Disconnects the camera from the TreiScene.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    const scene = this.closest('trei-scene');
    if (scene && scene.camera === this.threeObject) {
      scene.camera = null;
      console.debug('TreiCamera disconnected from scene', scene);
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

customElements.define('trei-camera', TreiCamera);
