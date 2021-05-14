if ( WEBGL.isWebGLAvailable() === false ) {
    document.body.appendChild( WEBGL.getWebGLErrorMessage() );
}
var container, stats, controls;
var camera, scene, renderer, light, bbox;
const rotating = true;

init();
animate();

// pauseRotation(); 旋转

function init() {
    if (!modelUrl) {
        return false;
    }
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    bbox = new THREE.Box3();

    scene.background = new THREE.Color( 0xffffff );
    light = new THREE.HemisphereLight( 0xbbbbff, 0x444422, 1.5 );
    scene.add( light );
    const loader = new THREE.GLTFLoader();

    loader.load( modelUrl, function ( gltf ) {
        gltf.scene.name = '3d';
        this.setContent(gltf.scene);

        scene.add( gltf.scene );
    }, undefined, function ( e ) {
        console.error( e );
    } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.gammaOutput = true;
    container.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );


    camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,0.1,10000);

    controls = new THREE.OrbitControls(camera,renderer.domElement);
    // 是否启用平移
    controls.enablePan = true;
    // 是否启用缩放
    controls.enableZoom = true;
    // 是否启用阻尼
    controls.enableDamping = true
    controls.target.set(0,0,0);
    controls.update();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    //旋转
    // if (rotating) {
    //     scene.rotation.y += -0.005;
    // } else {
    //     scene.rotation.y = scene.rotation.y;
    // }
    renderer.render( scene, camera );
}
//旋转
/*function pauseRotation() {
    const modelBorder = document.getElementById("modelBorder");
    modelBorder.addEventListener("mouseenter", function( event ) {
        rotating = false;
    });
    modelBorder.addEventListener("mouseleave", function( event ) {
        rotating = true;
    });
    modelBorder.addEventListener('touchmove', function(e) {
        rotating = false;
    }, false);
    modelBorder.addEventListener('touchstart', function(e) {
        rotating = false;
    }, false);
    modelBorder.addEventListener('touchend', function(e) {
        rotating = true;
    }, false);

}*/

function setContent(object) {

    object.updateMatrixWorld();
    const box = new THREE.Box3().setFromObject(object);
    box.getSize(new THREE.Vector3()).length();
    const boxSize = box.getSize();
    const center = box.getCenter(new THREE.Vector3());

    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;

    this.camera.position.copy(center);
    if (boxSize.x > boxSize.y) {
        this.camera.position.z = boxSize.x * -2.85
    } else {
        this.camera.position.z = boxSize.y * -2.85
    }
    this.camera.lookAt(0, 0, 0);
}
