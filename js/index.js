//detyre vendos nje texture objekteve


ObjectModel = Backbone.Model.extend({

    initialize : function () {

        console.log("model created");

    }});

ObjectsCollection = Backbone.Collection.extend({

    model: ObjectModel,


});

ObjectView = Backbone.View.extend({


    render: function(){

        this.$el.html("uuid : " + this.model.get("uuid") + " =====    "
            + "Name : " + this.model.get("Name")  + "   =====        "
            + "Position : " + this.model.get("Position") + "   ======    "
            + "Rotation : " + this.model.get("Rotation")) ;
        return this;


    }
});

ObjectsView = Backbone.View.extend({

    render: function () {

        var scope = this;

        this.model.each(function(object){

            var objectView = new ObjectView({model : object});
            scope.$el.append(objectView.render().$el);

        })

    }


});

//setup scene
var scene = new THREE.Scene();
//setup camera
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1 , 1000);
camera.position.z = 5;
//setup renderer
var renderer = new THREE.WebGLRenderer({antialias : true});
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth,window.innerHeight);

//create a canvas
document.body.appendChild(renderer.domElement);
//update the following every time we resize
window.addEventListener('resize',() => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;

    camera.updateProjectionMatrix();





    //transform control
    transform = new THREE.TransformControls( camera, renderer.domElement );
    transform.attach( mesh );


    transform.addEventListener('mouseDown', function () {
        orbit.enabled = false;
    });
    transform.addEventListener('mouseUp', function () {
        orbit.enabled = true;
    });
    scene.add( transform );





})


//define geometry
var geometry =  new THREE.BoxGeometry(1,1,1); //radius,width,height
//define material
var cubeMaterials = [new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('img/blacksand.png'),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('img/blacksand.png'),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('img/blacksand.png'),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('img/blacksand.png'),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('img/blacksand.png'),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load('img/blacksand.png'),side: THREE.DoubleSide})]
var material = new THREE.MeshFaceMaterial(cubeMaterials);
//define the mesh
var mesh = new THREE.Mesh(geometry,material);
var objectsCollection = new ObjectsCollection();
scene.add(mesh);

//add orbit controls

orbit = new THREE.OrbitControls( camera, renderer.domElement );
orbit.update();




//add light

var light = new THREE.PointLight( 0xFFFFFF,1,700) //color,intensity,distance
//add light position
light.position.set(10,0,25)

function AddCube() {

    var cube = new THREE.Mesh(geometry,  new THREE.MeshLambertMaterial({color: 0xFFCC00}));
    cube.position.x = (Math.random() - 0.5) * 10;
    cube.position.y = (Math.random() - 0.5) * 10;
    cube.position.z = (Math.random() - 0.5) * 10;
    scene.add(cube);
    camera.lookAt(cube.position);
    //assign attributes to the new model
    var objectModel = new ObjectModel({

        Name : 'cube',
        uuid : cube.uuid,
        Position : '(' + cube.position.x + ',' + cube.position.y + ',' + cube.position.z + ')',
        Rotation : '(' + cube.rotation.x + ',' + cube.rotation.y + ',' + cube.rotation.z + ')',

    });

    //add model to collection instance
    objectsCollection.add(objectModel);

    //assign a view to the model and render
    var objectView = new ObjectView({el: "#container", model : objectModel });
    objectView.render();
    var objectsView = new ObjectsView({el: "#container" , model : objectsCollection});
    objectsView.render();

}
function AddSphere(){

    var mesh = new THREE.Mesh( new THREE.SphereGeometry(0.8,20,20), material);
    mesh.position.x = (Math.random() - 0.5) * 10;
    mesh.position.y = (Math.random() - 0.5) * 10;
    mesh.position.z = (Math.random() - 0.5) * 10;
    scene.add(mesh);
    camera.lookAt(mesh.position);




}
var mouse = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var currentObject;
function onMouseMove( event ) {

    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components



    mouse.x = (( event.clientX - $(renderer.domElement).offset().left)/ window.innerWidth ) * 2 - 1;
    mouse.y = - ( (event.clientY  - $(renderer.domElement).offset().top)/ window.innerHeight ) * 2 + 1;
// https://i.imgur.com/FWMrgKF.jpg

    raycaster.setFromCamera( mouse, camera );

    for(var i = 0; i < objectsCollection.models.length; i++){
        const object = scene.getObjectByProperty("uuid", objectsCollection.models[i].get("uuid"));
        if(object){

            object.material.color=new THREE.Color("#ffff00");
            // object.material.needsUpdate = true;
        }

    }

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects( scene.children );

    if(intersects.length){
        currentObject = intersects[0].object;

        transform.attach( currentObject );
    }   else {
        currentObject = null;
    }


    /*for ( var i = 0; i < intersects.length; i++ ) {

        intersects[ i ].object.material.color.set( 0xff0000 );

    }*/

}

function onMouseDown(event){

}


window.addEventListener( 'mousemove', onMouseMove.bind(this), false );
window.addEventListener( 'mousemove', onMouseDown.bind(this), false );

scene.add(light);


var render = function(){
    requestAnimationFrame(render);
    mesh.rotation.x += .05;
    renderer.render(scene,camera);
}
render();



