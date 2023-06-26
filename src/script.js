import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import TWEEN from '@tweenjs/tween.js'
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
// const btnTest = document.querySelector('.test')
const text = document.querySelectorAll('.text')
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
window.mobileCheck = function () {
	let check = false
	let mobile = (function (a) {
		if (
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
				a
			) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
				a.substr(0, 4)
			)
		)
			check = true
	})(navigator.userAgent || navigator.vendor || window.opera)
	console.log(check)
}

mobileCheck()
// btnTest.addEventListener('click', () => {})
point.forEach((e, i) => {
	// movimiento de camara al dar click al punto

	e.addEventListener('click', () => {
		if (point[i] === e) {
			console.log(e.children)
			text.forEach((e) => {
				e.style.opacity = 0
			})

			if (numberMemory !== i) {
				new TWEEN.Tween(controls.target)
					.to(
						new THREE.Vector3(
							points[i].position.x,
							points[i].position.y,
							points[i].position.z
						),
						1000
					)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.onComplete(() => {
						new TWEEN.Tween(camera.position)
							.to(
								{
									x:
										points[i].position.x < 0
											? points[i].position.x - 4
											: points[i].position.x + 4,
									y: points[i].position.y + 2,
									z:
										points[i].position.z < 0
											? points[i].position.z - 4
											: points[i].position.z + 4,
								},
								1000
							)
							.easing(TWEEN.Easing.Quadratic.InOut)
							.onComplete(() => {
								var zoomDistance = Number(4),
									currDistance = camera.position.length(),
									factor = zoomDistance / currDistance

								new TWEEN.Tween(camera.position)
									.to(
										{
											x: camera.position.x * factor,
											y: camera.position.y * factor,
											z: camera.position.z * factor,
										},
										1000
									)
									.easing(TWEEN.Easing.Quadratic.InOut)
									.onComplete(() => {
										if (numberMemory !== i) {
											e.children[1].style.opacity = 1
										}

										numberMemory = i
									})
									.start()
							})
							.start()
					})
					.start()
			} else {
				new TWEEN.Tween(controls.target)
					.to(new THREE.Vector3(0, 0, 0), 1000)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.onComplete(() => {
						new TWEEN.Tween(camera.position)
							.to(
								{
									x: 5,
									y: 1,
									z: -5,
								},
								1000
							)
							.easing(TWEEN.Easing.Quadratic.InOut)
							.start()
					})
					.start()
			}
		}
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
		setTimeout(() => {
			specsShown = true
		}, 1000)
	} else {
		new TWEEN.Tween(controls.target)
			.to(new THREE.Vector3(0, 0, 0), 1000)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onComplete(() => {
				new TWEEN.Tween(camera.position)
					.to(
						{
							x: 5,
							y: 1,
							z: -5,
						},
						1000
					)
					.easing(TWEEN.Easing.Quadratic.InOut)
					.start()
			})
			.start()
		numberMemory = 100
		text.forEach((e) => {
			e.style.opacity = 0
		})
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
	// width: canvas.clientWidth,
	// height: canvas.clientHeight,
	width: window.innerWidth,
	height: window.innerHeight,
}
console.log(sizes)

window.addEventListener('resize', () => {
	console.log(sizes)
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight
	if (sizes.width > sizes.height) {
		// Update sizes
		sizes.width = window.innerWidth
		sizes.height = window.innerHeight

		// Update camera
		camera.aspect = sizes.width / sizes.height
		camera.updateProjectionMatrix()

		// Update renderer
		renderer.setSize(sizes.width, sizes.height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		console.log(Math.min(window.devicePixelRatio, 1))
	}
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
controls.enablePan = false
controls.enableZoom = true
controls.minDistance = 2
controls.maxDistance = 7

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
console.log(Math.min(window.devicePixelRatio, 1))

/**
 * Animate
 */
const tick = () => {
	// Update controls
	controls.update()
	point.forEach((element) => {
		rect = element.getBoundingClientRect()
		if (rect.top > sizes.height) {
			element.style.display = 'none'
		} else {
			element.style.display = 'block'
		}
	})
	var rect = point[2].getBoundingClientRect()
	console.log(rect.top, rect.right, rect.bottom, rect.left)

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
	TWEEN.update()

	if (mixer) {
		mixer.update(mixerUpdateDelta)
	}
}

tick()
