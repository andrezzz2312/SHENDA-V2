import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'

/**
 * Loaders
 */
const progressBar = document.getElementById('progress-bar')
const progressBarContainer = document.querySelector('.progress-bar-container')
let sceneReady = false
const loadingManager = new THREE.LoadingManager(
	// Loaded
	() => {
		// showParts()
		// Wait a little
		window.setTimeout(() => {
			// Animate overlay
			// gsap.to(overlayMaterial.uniforms.uAlpha, {
			// 	duration: 3,
			// 	value: 0,
			// 	delay: 1,
			// })

			// Update loadingBarElement
			progressBarContainer.classList.add('vanish')
			progressBarContainer.style.pointerEvents = 'none'
			// loadingBarElement.classList.add('ended')
			// loadingBarElement.style.transform = ''
		}, 2500)

		window.setTimeout(() => {
			sceneReady = true
		}, 2000)
	},

	// Progress
	(itemUrl, itemsLoaded, itemsTotal) => {
		// Calculate the progress and update the loadingBarElement
		progressBar.value = (itemsLoaded / itemsTotal) * 100
		// const progressRatio = itemsLoaded / itemsTotal
		// loadingBarElement.style.transform = `scaleX(${progressRatio})`
	}
)
const gltfLoader = new GLTFLoader(loadingManager)
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager)

/**
 * Base
 */
// Debug
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Overlay
 */
// const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
// const overlayMaterial = new THREE.ShaderMaterial({
// 	// wireframe: true,
// 	transparent: false,
// 	uniforms: {
// 		uAlpha: { value: 1 },
// 	},
// 	vertexShader: `
//         void main()
//         {
//             gl_Position = vec4(position, 1.0);
//         }
//     `,
// 	fragmentShader: `
//         uniform float uAlpha;

//         void main()
//         {
//             gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
//         }
//     `,
// })
// const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
// scene.add(overlay)

/**
 * Update all materials
 */
const updateAllMaterials = () => {
	scene.traverse((child) => {
		if (
			child instanceof THREE.Mesh &&
			child.material instanceof THREE.MeshStandardMaterial
		) {
			// child.material.envMap = environmentMap
			child.material.envMapIntensity = debugObject.envMapIntensity
			child.material.needsUpdate = true
			child.castShadow = true
			child.receiveShadow = true
		}
	})
}

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
	'/textures/environmentMaps/0/px.jpg',
	'/textures/environmentMaps/0/nx.jpg',
	'/textures/environmentMaps/0/py.jpg',
	'/textures/environmentMaps/0/ny.jpg',
	'/textures/environmentMaps/0/pz.jpg',
	'/textures/environmentMaps/0/nz.jpg',
])

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap
scene.environment = environmentMap

debugObject.envMapIntensity = 2.5

/**
 * Models
 */
let shenda
let mixer
gltfLoader.load('/models/DamagedHelmet/glTF/SHENDA.glb', (gltf) => {
	shenda = gltf
	gltf.scene.scale.set(0.5, 0.5, 0.5)
	gltf.scene.rotation.y = Math.PI * 0.5
	// linea anadida
	gltf.scene.position.set(0, -2, 0)
	//
	scene.add(gltf.scene)
	mixer = new THREE.AnimationMixer(shenda.scene)

	updateAllMaterials()
})

/**
 * Animations
 */
let clock = new THREE.Clock()

/**
 * HTML
 */
const btnShow = document.querySelector('.btnSp')
const point = document.querySelectorAll('.point')
const labelPoint = document.querySelectorAll('.label')
const btnShowText = document.querySelector('.btnSpText')
let specsShown = false
btnShow.addEventListener('click', () => {
	showParts()
	showSpecs()
})
let btnShowPressed = false
let numberMemory = 100
point.forEach((e) => {
	// movimiento de camara al dar click al punto

	e.addEventListener('click', () => {
		point.forEach((element, i) => {
			if (point[i] === e) {
				console.log(points[i].position)
			}
		})
		console.log(e)
	})

	// hacer que la caja de texto siempre este por encima

	e.addEventListener('mouseover', () => {
		point.forEach((i) => {
			i.style.zIndex = 0
		})
		e.style.zIndex = 100
	})
})

function showParts() {
	if (btnShowPressed) {
		shenda.animations.forEach((animation) => {
			const action = mixer.existingAction(animation)
			action.timeScale = -1
			action.paused = false
		})

		btnShow.disabled = true
		btnShow.style.transition =
			'box-shadow 400ms ease-in-out,opacity 0.5s ease-in-out'

		btnShow.style.opacity = 0.5
		btnShow.style.pointerEvents = 'none'

		mixer.addEventListener('finished', function (e) {
			btnShowPressed = false
			btnShow.disabled = false
			btnShowText.textContent = 'SHOW PARTS'
			btnShow.style.transition =
				'box-shadow 400ms ease-in-out,opacity 0.5s ease-in-out'
			btnShow.style.opacity = 1
			btnShow.style.pointerEvents = 'all'
		})
	} else {
		console.log('check')
		mixer.stopAllAction()
		shenda.animations.forEach((animation) => {
			const action = mixer.clipAction(animation)
			action.reset()
			action.clampWhenFinished = true
			action.timeScale = 1
			action.setLoop(THREE.LoopOnce, 1)
			action.play()
		})

		btnShow.disabled = true
		btnShow.style.transition =
			'box-shadow 400ms ease-in-out,opacity 0.5s ease-in-out'
		btnShow.style.opacity = 0.5
		btnShow.style.pointerEvents = 'none'

		mixer.addEventListener('finished', function (e) {
			btnShowPressed = true
			btnShow.disabled = false
			btnShowText.textContent = 'BACK'
			btnShow.style.transition =
				'box-shadow 400ms ease-in-out,opacity 0.5s ease-in-out'
			btnShow.style.opacity = 1
			btnShow.style.pointerEvents = 'all'
		})
	}
}
function showSpecs() {
	if (specsShown === false) {
		// measure()
		// point.forEach((element) => {
		// 	element.style.opacity = '0.3'
		// })

		setTimeout(() => {
			specsShown = true
		}, 1000)
	} else {
		// moveAndLookAt(
		// 	camera,
		// 	new THREE.Vector3(-15.75, 3.44, 34.4),
		// 	new THREE.Vector3(1.4, 3, -2.8),
		// 	{ duration: 1500 }
		// )
		labelPoint.forEach((e) => {
			console.log(e)
		})
		// obj_measure.visible = false
		specsShown = false
	}
}
/**
 * Points of interest
 */
const raycaster = new THREE.Raycaster()
const points = [
	{
		position: new THREE.Vector3(2.4, -1, 0),
		element: document.querySelector('.point-0'),
	},
	{
		position: new THREE.Vector3(2.4, -1, -0.4),
		element: document.querySelector('.point-1'),
	},
	{
		position: new THREE.Vector3(2.2, -1.3, -0.9),
		element: document.querySelector('.point-2'),
	},
	{
		position: new THREE.Vector3(1.9, -1.2, -0.2),
		element: document.querySelector('.point-3'),
	},
	{
		position: new THREE.Vector3(0, -1.55, -2.5),
		element: document.querySelector('.point-4'),
	},
	{
		position: new THREE.Vector3(0, -0.1, -2.1),
		element: document.querySelector('.point-5'),
	},
	{
		position: new THREE.Vector3(3.77, 1.7, 1.1),
		element: document.querySelector('.point-6'),
	},
	{
		position: new THREE.Vector3(3.77, 1.7, -1),
		element: document.querySelector('.point-7'),
	},
	{
		position: new THREE.Vector3(-0.15, 3, -0.6),
		element: document.querySelector('.point-8'),
	},
	{
		position: new THREE.Vector3(-1.2, 1.7, -0.6),
		element: document.querySelector('.point-9'),
	},
	{
		position: new THREE.Vector3(-1.5, 2.1, 0.35),
		element: document.querySelector('.point-10'),
	},
	{
		position: new THREE.Vector3(0.8, 2.3, 0.7),
		element: document.querySelector('.point-11'),
	},
	{
		position: new THREE.Vector3(0.8, 1.7, 0.7),
		element: document.querySelector('.point-12'),
	},
	{
		position: new THREE.Vector3(0, 0.5, 0.7),
		element: document.querySelector('.point-13'),
	},
	{
		position: new THREE.Vector3(0, -0.1, 2.1),
		element: document.querySelector('.point-14'),
	},
	{
		position: new THREE.Vector3(1.9, 0.6, 2.15),
		element: document.querySelector('.point-15'),
	},
	{
		position: new THREE.Vector3(-1.5, 1.4, -0.5),
		element: document.querySelector('.point-16'),
	},
]

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, -2.25)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
)
camera.position.set(5, 1, -5)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */

const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
})
renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ReinhardToneMapping
renderer.toneMappingExposure = 3
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () => {
	// Update controls
	controls.update()

	// Update points only when the scene is ready
	if (sceneReady) {
		if (specsShown) {
			point.forEach((element) => {
				element.style.opacity = '1'
			})
			// Go through each point
			for (const point of points) {
				// Get 2D screen position
				const screenPosition = point.position.clone()
				screenPosition.project(camera)

				// Set the raycaster
				raycaster.setFromCamera(screenPosition, camera)
				const intersects = raycaster.intersectObjects(scene.children, true)

				// No intersect found
				if (intersects.length === 0) {
					// Show
					point.element.classList.add('visible')
				}

				// Intersect found
				else {
					// Get the distance of the intersection and the distance of the point
					const intersectionDistance = intersects[0].distance
					const pointDistance = point.position.distanceTo(camera.position)

					// Intersection is close than the point
					if (intersectionDistance < pointDistance) {
						// Hide
						point.element.classList.remove('visible')
					}
					// Intersection is further than the point
					else {
						// Show
						point.element.classList.add('visible')
					}
				}

				const translateX = screenPosition.x * sizes.width * 0.5
				const translateY = -screenPosition.y * sizes.height * 0.5
				point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`
			}
		} else {
			point.forEach((element) => {
				element.classList.remove('visible')
				element.style.opacity = '0'
			})
		}
		// Go through each point
	}

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)

	let mixerUpdateDelta = clock.getDelta()
	// controls.update()
	// TWEEN.update()

	if (mixer) {
		mixer.update(mixerUpdateDelta)
	}
}

tick()

