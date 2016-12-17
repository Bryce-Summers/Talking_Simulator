/*
 * THREE.js Rendering Functionality.
 *
 * Written by Bryce Summers on 12/15/2016.
 *
 * We put all of the rendering functions here.
 */

var scene = new THREE.Scene();

var dim = {x:0, y:0, w:window.innerWidth, h:window.innerHeight, padding:10};
var camera = new THREE.OrthographicCamera( dim.x, dim.x + dim.w, dim.y, dim.y + dim.h, 1, 1000 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


// GUI Elements.
var click_box;
var hover_box;

// https://threejs.org/docs/index.html#Reference/Geometries/TextGeometry
var params = {};
params.size = 32;

var padding = 20;

var text_meshes = new THREE.Object3D();

function new_text_mesh(str)
{

	var col = current_highlight ? col2 : col1

	var geometry  = new THREE.TextGeometry(str, params);
	var material  = new THREE.MeshBasicMaterial( { color: col, side: THREE.DoubleSide } );
	var text_mesh = new THREE.Mesh( geometry, material );
	text_mesh.scale.y *= -1; // Text is loaded inverted by default.
	text_mesh.position.x = padding;
	return text_mesh;
}

function new_horizontal_line(y)
{
	var material = new THREE.LineBasicMaterial({
		color: col1
	});

	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( dim.x + padding, y, 0 ),
		new THREE.Vector3( dim.x + padding + dim.w - padding*2, y, 0 )
	);

	var line = new THREE.Line( geometry, material );
	scene.add( line );
}

function new_line_box(col)
{
	var material = new THREE.LineBasicMaterial({
		color: col
	});

	var y0 = getY(-.5) + padding/2;
	var y1 = getY(.5) - padding/2;
	
	var geometry = new THREE.Geometry();
	geometry.vertices.push(
		new THREE.Vector3( dim.x + padding/2, y0, 0 ),
		new THREE.Vector3( dim.x + dim.w - padding/2, y0, 0 ),
		new THREE.Vector3( dim.x + dim.w - padding/2, y1, 0 ),
		new THREE.Vector3( dim.x + padding/2, y1, 0 ),
		new THREE.Vector3( dim.x + padding/2, y0, 0 )// closure
	);

	var line = new THREE.Line( geometry, material );
	scene.add( line );
	return line;
}

function refresh_all_text()
{
    current_texts = TREE.getCurrentText()
    for(var i = 0; i < TREE.N; i++)
    {
        updateTextMesh(i, current_texts[i])
    }
}

// Updates the text text mesh on the screen with the given index to the input string.
function updateTextMesh(index, str)
{
	var i = index;
	
	scene.remove(text_mesh[i]);
    text_meshes.remove(text_mesh[i]);

	text_mesh[i] = new_text_mesh(str);
	text_mesh[i].position.y = getY(i);

	scene.add(text_mesh[i]);
    scene.add(text_mesh[i]);

}

function getY(i)
{
	return dim.y + dim.h*(i + .5)/TREE.getBranchNum();
}

function setClickBoxPosition(y_new)
{
	click_box.position.y = y_new;
}

function setHoverBoxY(y)
{
	if(hover_box)
	{
		hover_box.position.y = y;	
	}
}