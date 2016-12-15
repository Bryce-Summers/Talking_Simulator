// Main.js
//
// The program for my Talking simulator - Echo Chamber.
//
// Written by Bryce Summers on 11/16/2016.
// About the nature of selective social networks.

// -- Rendering.

var scene = new THREE.Scene();

var dim = {x:0, y:0, w:window.innerWidth, h:window.innerHeight, padding:10};
var camera = new THREE.OrthographicCamera( dim.x, dim.x + dim.w, dim.y, dim.y + dim.h, 1, 1000 );
camera.position.z = -2;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



// https://threejs.org/docs/index.html#Reference/Geometries/TextGeometry
var params = {};
params.size = 32;

function NEW_NODE()
{
	var node = {};
	node.txt = "";
	node.children = [];
}
var ROOT = NEW_NODE();
var CURRENT = ROOT;
// The branching number.
var N = 4;

var padding = 20;

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

function updateScene()
{
	var i = current_index;
	
	scene.remove(text_mesh[i]);
	text_mesh[i] = new_text_mesh(current_string);
	text_mesh[i].position.y = getY(i);
	scene.add(text_mesh[i]);

}

// Application Logic.
current_string = '';
text_mesh = [];
current_index = 0;
var click_box;
var hover_box;

function getY(i)
{
	return dim.y + dim.h*(i + .5)/N;
}


// Animation
function animate_scene()
{
	var y_dest = getY(current_index - .5);
	var y_src = click_box.position.y;
	
	click_box.position.y = (y_dest*1 + y_src*9)/10;
}


// IO
KeyAction = function(){}
var shift_pressed = false;
KeyAction.prototype.keyUp = function(key_name)
{
	if(key_name === "shift")
	{
		shift_pressed = false;
		return;
	}
}

KeyAction.prototype.keyDown = function(key_code)
{
	var key_name = KeyboardState.keyName(key_code);

	console.log(key_name);

	if(key_name === "shift")
	{
		shift_pressed = true;
		return;
	}

	// AlphaNumericSymbolic keystrokes.

	if(key_name === "space")
	{
		key_name = ' ';
	}

	if(key_name.length === 1)
	{
		// Shift Modified.

		//key_name = key_name.charAt(0).toLowerCase();
		//char -> ascii -> key_name with shift kmodifier. see KeyboardState.
		// Note: we use key_code, instead of key name here to allow for multiple keys with the same default value such as 1.
		key_name = mapKeyPressToActualCharacter(shift_pressed, key_code);


		current_string = current_string + key_name;
	}

	// Backspace.
	if(key_name === "backspace")
	{
		current_string = current_string.substring(0, current_string.length - 1);
	}

	updateScene();
}
var keyboard = new KeyboardState(new KeyAction());


var font = null;
var col1 = 0x3B5998;
var col2 = 0xE9EBEE;
var current_highlight = false;

function start()
{
	// Font is now loaded.
	
	current_string = "Type!"
	for(var i = 0; i < N; i++)
	{
		current_index = i;
		updateScene();
	}
	current_string = "";
	current_index = 0;
	current_highlight = true;
	updateScene();
	
	// Add horizontal Lines.
	for(var i = 0; i < N; i++)
	{
		new_horizontal_line(getY(i) + 20);
	}
	
	col2 = 0xE9EBEE;
	hover_box = new_line_box(col2); // FB gray.
	
	// Render the click box over top of the hover box.
	col1 = 0x3B5998; // FB blue.
	click_box = new_line_box(col1);
}


var loader = new THREE.FontLoader();
loader.load( 'fonts/' + 'optimer_regular.typeface.json', function ( response ) {
	font = response;
	params.font = font;
	start();
} );

function init_input()
{

    //window.addEventListener( 'resize', onWindowResize, false);

    //window.addEventListener("keypress", onKeyPress);
    //window.addEventListener("keydown", onKeyPress);

    window.addEventListener("mousemove", onMouseMove);
	
    window.addEventListener("mousedown", onMouseDown);
    //window.addEventListener("mouseup",   onMouseUp);
	
}

init_input();

function onMouseMove( event )
{
    var y = event.y;
	
	// Move the hover box centered vertically on the mouse cursor.
	hover_box.position.y = y + dim.y - (getY(1) - getY(0))/2;
}

function onMouseDown( event )
{
    var y = event.y;
	
	// Move the hover box centered vertically on the mouse cursor.
	mouse_y = hover_box.position.y = y + dim.y;
	
	var round = getY(1) - getY(0);
	round = Math.floor(round);
	
	var index = mouse_y / round;
	index = Math.floor(index);
	
	
	current_highlight = false;
	updateScene();
	current_index = index;
	current_highlight = true;
	
	current_string = "";
	updateScene();
}

camera.position.z = 5;

var render = function () {
	requestAnimationFrame( render );

	renderer.render(scene, camera);
	
	animate_scene();
};

render();