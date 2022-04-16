import Experience from '../experience'
import fragmentShader from '../shaders/fragment.glsl'
import vertexShader from '../shaders/vertex.glsl'
import * as THREE from 'three'

export default class ShaderPlane {
	constructor() {
		this.experience = new Experience()
		this.scene = this.experience.scene
		this.resources = this.experience.resources
		this.debug = this.experience.debug

		this.params = {
			texture: 0,
		}

		this.geometry = new THREE.PlaneGeometry(1, 1)
		this.material = new THREE.ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			side: THREE.DoubleSide,
			uniforms: {
				uTime: { value: this.experience.time.elapsed },
				uSurfaceResolution: {
					value: {
						x: this.geometry.parameters.width,
						y: this.geometry.parameters.height,
					},
				},
				uCursor: { value: new THREE.Vector2(0) },
				uCursorHover: { value: false },
				uCursorEnter: { value: false },
				uCursorLeave: { value: false },
				uSpeed: { value: 1 },
				uCursorIntensity: { value: 1 },
				uTexture: { value: this.resources.items.paintTexture },
				uTextureResolution: {
					value: {
						x: this.resources.items.paintTexture.image.width,
						y: this.resources.items.paintTexture.image.height,
					},
				},
				uBlocks: { value: 12 },
			},
		})

		this.shaderMesh = new THREE.Mesh(this.geometry, this.material)
		this.shaderMesh.position.y = 1
		this.scene.add(this.shaderMesh)

		//debug
		this.debugFolder = this.debug.ui.addFolder({
			title: 'Shader',
			index: 0,
		})

		this.debugFolder
			.addInput(this.params, 'texture', {
				view: 'list',
				options: [
					{
						text: 'Paint',
						value: this.resources.items.paintTexture,
					},
					{
						text: 'Guy Profile',
						value: this.resources.items.guyProfileTexture,
					},
					{
						text: 'Beautiful Doggo',
						value: this.resources.items.doggoTexture,
					},
					{
						text: 'Hills',
						value: this.resources.items.hillsTexture,
					},
				],
				label: 'Texture',
			})
			.on('change', event => {
				this.material.uniforms.uTexture.value = event.value
				this.material.uniforms.uTextureResolution.value = {
					x: event.value.image.width,
					y: event.value.image.height,
				}
			})

		this.debugFolder.addInput(this.material.uniforms.uSpeed, 'value', {
			min: 0,
			max: 10,
			label: 'Distortion Speed',
		})

		this.debugFolder.addInput(
			this.material.uniforms.uCursorIntensity,
			'value',
			{
				min: 0,
				max: 10,
				label: 'Cursor Distortion Intensity',
			},
		)

		this.debugFolder.addInput(this.material.uniforms.uBlocks, 'value', {
			step: 1,
			min: 1,
			max: 50,
			label: 'Sampling block (per side)',
		})
	}

	update = () => {
		const uniforms = this.shaderMesh.material.uniforms
		uniforms.uTime.value = this.experience.time.elapsed
	}
}
