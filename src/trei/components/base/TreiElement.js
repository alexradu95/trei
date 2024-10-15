import { LitElement } from 'lit';
import * as THREE from 'three';

/**
 * @class TreiElement
 * @extends LitElement
 * @classdesc Base class for all Trei components. Manages position, rotation, and scale of Three.js objects.
 */
export class TreiElement extends LitElement {
  static properties = {
    /**
     * @property {Array<number>} position - The position of the Three.js object.
     */
    position: { type: Array },
    /**
     * @property {Array<number>} rotation - The rotation of the Three.js object.
     */
    rotation: { type: Array },
    /**
     * @property {Array<number>} scale - The scale of the Three.js object.
     */
    scale: { type: Array },
  };

  /**
   * Creates an instance of TreiElement.
   * Initializes the position, rotation, and scale properties.
   */
  constructor() {
    super();
    /**
     * @type {THREE.Object3D|null}
     * @description The Three.js object managed by this element.
     */
    this.threeObject = null;
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
    console.debug('TreiElement initialized');
  }

  /**
   * Lifecycle callback when the element's DOM has been updated the first time.
   * Updates the Three.js object with the initial properties.
   */
  firstUpdated() {
    this.updateThreeObject();
    console.debug('TreiElement first updated');
  }

  /**
   * Lifecycle callback when the element's properties change.
   * Updates the Three.js object if position, rotation, or scale changes.
   * @param {Map} changedProperties - The properties that changed.
   */
  updated(changedProperties) {
    if (changedProperties.has('position') || 
        changedProperties.has('rotation') || 
        changedProperties.has('scale')) {
      this.updateThreeObject();
      console.debug('TreiElement properties updated', {
        position: this.position,
        rotation: this.rotation,
        scale: this.scale
      });
    }
  }

  /**
   * Updates the Three.js object with the current position, rotation, and scale.
   */
  updateThreeObject() {
    if (this.threeObject) {
      if (Array.isArray(this.position) && this.position.length === 3) {
        this.threeObject.position.set(...this.position);
      }
      if (Array.isArray(this.rotation) && this.rotation.length === 3) {
        this.threeObject.rotation.set(...this.rotation);
      }
      if (Array.isArray(this.scale) && this.scale.length === 3) {
        this.threeObject.scale.set(...this.scale);
      }
      console.debug('TreiElement Three.js object updated', this.threeObject);
    }
  }

  /**
   * Adds the Three.js object to the parent scene or group.
   */
  addToParent() {
    const parent = this.closest('trei-scene, trei-group');
    if (parent && this.threeObject) {
      parent.addObject(this.threeObject);
      console.debug('TreiElement added to parent', parent);
    }
  }

  /**
   * Removes the Three.js object from the parent scene or group.
   */
  removeFromParent() {
    const parent = this.closest('trei-scene, trei-group');
    if (parent && this.threeObject) {
      parent.removeObject(this.threeObject);
      console.debug('TreiElement removed from parent', parent);
    }
  }

  /**
   * Lifecycle callback when the element is added to the DOM.
   * Adds the Three.js object to the parent.
   */
  connectedCallback() {
    super.connectedCallback();
    this.addToParent();
  }

  /**
   * Lifecycle callback when the element is removed from the DOM.
   * Removes the Three.js object from the parent.
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeFromParent();
  }
}
