/**
 * @file threejs-lit-framework.js
 * @description A comprehensive framework for creating Three.js components with Lit
 */

import { LitElement, html } from 'lit';
import * as THREE from 'three';

/**
 * Cache for parsed JSDoc data to improve performance.
 * @type {Map<Function, Object>}
 */
const jsdocCache = new Map();

/**
 * Parses a type string into a structured type object.
 * @param {string} typeString - The type string to parse.
 * @returns {Object} The parsed type object.
 */
function parseType(typeString) {
    console.log('Parsing type:', typeString);
    if (typeString.startsWith('Array.<') && typeString.endsWith('>')) {
        return { array: parseType(typeString.slice(7, -1)) };
    }

    const types = typeString.split('|').map(t => t.trim());
    if (types.length > 1) {
        return { union: types.map(parseType) };
    }

    const genericMatch = typeString.match(/^(\w+)<(.+)>$/);
    if (genericMatch) {
        return {
            generic: genericMatch[1],
            params: genericMatch[2].split(',').map(t => parseType(t.trim()))
        };
    }

    if (typeString.startsWith('{') && typeString.endsWith('}')) {
        const objTypes = {};
        typeString.slice(1, -1).split(',').forEach(pair => {
            const [key, value] = pair.split(':').map(s => s.trim());
            objTypes[key] = parseType(value);
        });
        return { object: objTypes };
    }

    return typeString;
}

/**
 * Converts a value to the specified type.
 * @param {*} value - The value to convert.
 * @param {Object|string} type - The type to convert to.
 * @returns {*} The converted value.
 */
function convertValue(value, type) {
    console.log('Converting value:', value, 'to type:', type);
    const parsedType = typeof type === 'string' ? parseType(type) : type;

    if (typeof parsedType === 'object') {
        if (parsedType.union) {
            for (const subType of parsedType.union) {
                try {
                    return convertValue(value, subType);
                } catch (e) {
                    console.error('Conversion failed for type:', subType, 'Error:', e);
                }
            }
            throw new Error(`Cannot convert ${value} to any of ${parsedType.union.join(', ')}`);
        } else if (parsedType.array) {
            return value.split(',').map(item => convertValue(item.trim(), parsedType.array));
        } else if (parsedType.object) {
            const result = {};
            const parsedValue = typeof value === 'string' ? JSON.parse(value) : value;
            if (parsedType.object) {
                for (const [key, propType] of Object.entries(parsedType.object || {})) {
                    result[key] = convertValue(parsedValue[key], propType);
                }
            }
            return result;
        } else if (parsedType.generic) {
            const GenericClass = THREE[parsedType.generic];
            if (GenericClass) {
                return new GenericClass(...value.split(',').map((v, i) => convertValue(v.trim(), parsedType.params[i])));
            }
        }
    }

    switch (parsedType) {
        case 'number': return Number(value);
        case 'boolean': return Boolean(value);
        case 'string': return String(value);
        case 'Vector2': return new THREE.Vector2(...value.split(',').map(Number));
        case 'Vector3': return new THREE.Vector3(...value.split(',').map(Number));
        case 'Vector4': return new THREE.Vector4(...value.split(',').map(Number));
        case 'Color': return new THREE.Color(value);
        case 'Euler': return new THREE.Euler(...value.split(',').map(Number));
        case 'Quaternion': return new THREE.Quaternion(...value.split(',').map(Number));
        case 'Matrix3': return new THREE.Matrix3().fromArray(value.split(',').map(Number));
        case 'Matrix4': return new THREE.Matrix4().fromArray(value.split(',').map(Number));
        default: return value;
    }
}

/**
 * Parses a single JSDoc comment.
 * @param {string} comment - The JSDoc comment to parse.
 * @returns {Object} Parsed comment information.
 */
function parseComment(comment) {
    console.log('Parsing comment:', comment);
    const lines = comment.split('\n');
    const parsed = {};
    lines.forEach(line => {
        const match = line.match(/@(\w+)\s+{(.+)}\s+(.+)/);
        if (match) {
            const [, tag, type, description] = match;
            parsed[tag] = { type: parseType(type), description };
        }
    });
    return parsed;
}

/**
 * Parses JSDoc comments for a Three.js class.
 * @param {Function} ThreeClass - The Three.js class to parse.
 * @returns {Object} Parsed JSDoc information.
 */
function parseJSDoc(ThreeClass) {
    console.log('Parsing JSDoc for class:', ThreeClass.name);
    if (jsdocCache.has(ThreeClass)) {
        return jsdocCache.get(ThreeClass);
    }

    const obj = new ThreeClass();
    const prototype = Object.getPrototypeOf(obj);
    const properties = {};
    const methods = {};
    const events = {};
    const computed = {};
    const staticProps = {};

    // Parse instance properties and methods
    for (const key of Object.getOwnPropertyNames(prototype)) {
        const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
        const comment = descriptor.value?.toString().match(/\/\*\*[\s\S]*?\*\//)?.[0] || '';
        const parsed = parseComment(comment);

        if (descriptor.get || descriptor.set) {
            computed[key] = {
                get: descriptor.get,
                set: descriptor.set,
                type: parsed.type?.type || 'any'
            };
        } else if (descriptor.value && typeof descriptor.value === 'function') {
            methods[key] = {
                name: key,
                params: parsed.param ? [parsed.param] : [],
                returnType: parsed.returns?.type || 'any'
            };
        } else {
            properties[key] = {
                name: key,
                type: parsed.type?.type || typeof obj[key],
                description: parsed.description || ''
            };
        }

        if (parsed.event) {
            events[parsed.event.description] = {
                name: parsed.event.description,
                type: parsed.event.type
            };
        }
    }

    // Parse static properties and methods
    for (const key of Object.getOwnPropertyNames(ThreeClass)) {
        const descriptor = Object.getOwnPropertyDescriptor(ThreeClass, key);
        const comment = descriptor.value?.toString().match(/\/\*\*[\s\S]*?\*\//)?.[0] || '';
        const parsed = parseComment(comment);

        staticProps[key] = {
            type: typeof ThreeClass[key],
            value: ThreeClass[key],
            description: parsed.description || ''
        };
    }

    const result = { properties, methods, events, computed, staticProps };
    jsdocCache.set(ThreeClass, result);
    return result;
}

/**
 * Creates a Lit component for a Three.js class.
 * @param {Function} ThreeClass - The Three.js class to create a component for.
 * @returns {Class} A Lit component class.
 */
function createThreeComponent(ThreeClass) {
    console.log('Creating Lit component for class:', ThreeClass.name);
    const { properties, methods, events, computed, static: staticProps } = parseJSDoc(ThreeClass);

    return class extends LitElement {
        static get properties() {
            console.log('Defining properties for component:', ThreeClass.name);
            return {
                ...Object.fromEntries(
                    Object.entries(properties || {}).map(([key, value]) => [key, { type: String, attribute: true }])
                ),
                ...Object.fromEntries(
                    Object.entries(computed || {}).map(([key, value]) => [key, { type: String, attribute: true }])
                )
            };
        }

        constructor() {
            super();
            console.log('Initializing component for class:', ThreeClass.name);
            this.threeObject = new ThreeClass();

            // Initialize properties
            Object.keys(properties || {}).forEach(key => {
                this[key] = this.threeObject[key];
            });

            // Bind methods with chaining support
            Object.keys(methods || {}).forEach(key => {
                this[key] = (...args) => {
                    const result = this.threeObject[key](...args);
                    return result === this.threeObject ? this : result;
                };
            });

            // Set up event listeners
            Object.keys(events || {}).forEach(eventName => {
                this.threeObject.addEventListener(eventName, (event) => {
                    this.dispatchEvent(new CustomEvent(`three-${eventName}`, { detail: event, bubbles: true, composed: true }));
                });
            });

            // Set up computed properties
            Object.entries(computed || {}).forEach(([key, { get, set, type }]) => {
                Object.defineProperty(this, key, {
                    get: get ? () => this.threeObject[key] : undefined,
                    set: set ? (value) => {
                        const convertedValue = convertValue(value, type);
                        this.threeObject[key] = convertedValue;
                        this.requestUpdate(key, this[key]);
                    } : undefined,
                    configurable: true,
                    enumerable: true
                });
            });

            // Set up static properties
            Object.entries(staticProps || {}).forEach(([key, { value }]) => {
                this.constructor[key] = value;
            });
        }

        connectedCallback() {
            super.connectedCallback();
            console.log('Component connected:', ThreeClass.name);
        }

        disconnectedCallback() {
            super.disconnectedCallback();
            console.log('Component disconnected:', ThreeClass.name);
        }

        firstUpdated(changedProperties) {
            console.log('First updated for component:', ThreeClass.name, 'Changed properties:', changedProperties);
        }

        updated(changedProperties) {
            console.log('Updated component for class:', ThreeClass.name, 'Changed properties:', changedProperties);
        }

        update(changedProperties) {
            console.log('Updating component for class:', ThreeClass.name, 'Changed properties:', changedProperties);
            super.update(changedProperties);
            if (properties) {
                changedProperties.forEach((oldValue, propName) => {
                    if (properties && propName in properties) {
                        const newValue = convertValue(this[propName], properties[propName].type);
                        if (typeof newValue === 'object' && !Array.isArray(newValue)) {
                            // For object types, update nested properties
                            Object.entries(newValue || {}).forEach(([key, value]) => {
                                this.threeObject[propName][key] = value;
                            });
                        } else {
                            this.threeObject[propName] = newValue;
                        }
                    }
                    // Note: Computed properties are handled by their setters
                });
            }
        }

        createRenderRoot() {
            console.log('Creating render root for component:', ThreeClass.name);
            return this.attachShadow({ mode: 'open' });
        }

        render() {
            console.log('Rendering component for class:', ThreeClass.name);
            return html`<slot></slot>`;
        }
    };
}

// Create and register components for common Three.js classes
const ThreeClasses = [
    THREE.Scene,
    THREE.PerspectiveCamera,
    THREE.OrthographicCamera,
    THREE.AmbientLight,
    THREE.DirectionalLight,
    THREE.PointLight,
    THREE.SpotLight,
    THREE.Mesh,
    THREE.Group,
    THREE.BoxGeometry,
    THREE.SphereGeometry,
    THREE.PlaneGeometry,
    THREE.CylinderGeometry,
    THREE.MeshBasicMaterial,
    THREE.MeshStandardMaterial,
    THREE.MeshPhongMaterial
];

ThreeClasses.forEach(ThreeClass => {
    const componentName = `three-${ThreeClass.name.toLowerCase()}`;
    console.log('Defining custom element:', componentName);
    customElements.define(componentName, createThreeComponent(ThreeClass));
});

// Example usage
class ThreeApp extends LitElement {
    firstUpdated() {
        console.log('First updated for ThreeApp');
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.shadowRoot.appendChild(this.renderer.domElement);

        this.scene = this.shadowRoot.querySelector('three-scene').threeObject;
        this.camera = this.shadowRoot.querySelector('three-perspectivecamera').threeObject;

        this.animate();
    }

    animate() {
        console.log('Animating ThreeApp');
        requestAnimationFrame(() => this.animate());
        const mesh = this.shadowRoot.querySelector('three-mesh');
        if (mesh && typeof mesh.rotateX === 'function') {
            // Example of method chaining
            mesh.rotateX(0.01).rotateY(0.02);
        }
        this.renderer.render(this.scene, this.camera);
    }

    connectedCallback() {
        super.connectedCallback();
        console.log('ThreeApp connected');
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        console.log('ThreeApp disconnected');
    }

    createRenderRoot() {
        console.log('Creating render root for ThreeApp');
        return this.attachShadow({ mode: 'open' });
    }

    render() {
        console.log('Rendering ThreeApp');
        return html`
            <three-scene>
                <three-perspectivecamera position="0,0,5" fov="75" aspect="${window.innerWidth / window.innerHeight}" near="0.1" far="1000"></three-perspectivecamera>
                <three-pointlight position="1,1,1" intensity="1" distance="0"></three-pointlight>
                <three-mesh position="0,0,0" scale="1,1,1">
                    <three-boxgeometry width="1" height="1" depth="1"></three-boxgeometry>
                    <three-meshstandardmaterial color="#00ff00" roughness="0.5" metalness="0.5"></three-meshstandardmaterial>
                </three-mesh>
            </three-scene>
        `;
    }
}
customElements.define('three-app', ThreeApp);

// Export the main functions for potential external use
export { createThreeComponent, parseJSDoc, convertValue, parseType };
