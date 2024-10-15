import { TreiElement } from '@/trei/components/base/TreiElement.js';
import { css, html } from 'lit';
import * as THREE from 'three';

/**
 * @class TreiScene
 * @extends TreiElement
 * @classdesc Represents the root component for a 3D scene.
 */
export class TreiScene extends TreiElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `;

  /**
   * Creates an instance of TreiScene.
   * Initializes the Three.js scene and renderer.
   */
  constructor() {
    super();
    /**
     * @type {THREE.Scene}
     * @description The Three.js Scene object.
     */
    this.scene = new THREE.Scene();
    /**
     * @type {THREE.WebGLRenderer}
     * @description The Three.js WebGLRenderer object.
     */
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    /**
     * @type {THREE.Camera|null}
     * @description The camera used for rendering the scene.
     */
    this.camera = null;
    this.scene.background = new THREE.Color(0x000000);
    console.debug('TreiScene initialized');
  }

  /**
   * Lifecycle callback when the element's DOM has been updated the first time.
   * Sets up the renderer and starts the animation loop.
   */
  firstUpdated() {
    super.firstUpdated();
    this.renderer.setSize(this.clientWidth, this.clientHeight);
    this.shadowRoot.appendChild(this.renderer.domElement);
    this.setupResizeObserver();
    this.animate();
    console.debug('TreiScene first updated');
  }

  /**
   * Sets up a resize observer to handle window resizing.
   */
  setupResizeObserver() {
    const resizeObserver = new ResizeObserver(() => {
      this.renderer.setSize(this.clientWidth, this.clientHeight);
      if (this.camera) {
        this.camera.aspect = this.clientWidth / this.clientHeight;
        this.camera.updateProjectionMatrix();
      }
      console.debug('TreiScene resized');
    });
    resizeObserver.observe(this);
  }

  /**
   * Adds an object to the Three.js scene.
   * @param {THREE.Object3D} object - The object to add.
   */
  addObject(object) {
    this.scene.add(object);
    console.debug('Object added to TreiScene', object);
  }

  /**
   * Removes an object from the Three.js scene.
   * @param {THREE.Object3D} object - The object to remove.
   */
  removeObject(object) {
    this.scene.remove(object);
    console.debug('Object removed from TreiScene', object);
  }

  /**
   * The animation loop for rendering the scene.
   */
  animate() {
    requestAnimationFrame(() => this.animate());
    if (this.camera) {
      // Update camera controls
      const cameraElement = this.querySelector('trei-orbit-camera, trei-camera');
      if (cameraElement && 'update' in cameraElement) {
        cameraElement.update();
      }
      
      this.renderer.render(this.scene, this.camera);
      console.debug('TreiScene rendered');
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

customElements.define('trei-scene', TreiScene);
