document.addEventListener('DOMContentLoaded', () => {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded!');
        return;
    }

    // Check if GLTFLoader is available
    if (typeof THREE.GLTFLoader === 'undefined') {
        console.error('GLTFLoader is not loaded!');
        return;
    }

    let scene, camera, renderer, controls;

    function init() {
        // Scene setup
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x1a1a1a);

        // Camera setup
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer setup
        const container = document.getElementById('model-container');
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Load model
        const loader = new THREE.GLTFLoader();
        console.log('Loading model...');
        
        loader.load(
            './showcase.glb', // Update this path to your actual model
            (gltf) => {
                console.log('Model loaded successfully!');
                scene.add(gltf.scene);
                
                // Center model
                const box = new THREE.Box3().setFromObject(gltf.scene);
                const center = box.getCenter(new THREE.Vector3());
                gltf.scene.position.sub(center);
            },
            (progress) => {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('Error loading model:', error);
            }
        );

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    function onWindowResize() {
        const container = document.getElementById('model-container');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', onWindowResize);
    init();
});