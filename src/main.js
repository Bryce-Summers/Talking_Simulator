// Main.js
//
// The program for my Talking simulator - Echo Chamber.
//
// Written by Bryce Summers on 11/16/2016.
// About the nature of selective social networks.


// Application Logic.
current_string = '';
text_mesh = [];
current_index = 0;

var font = null;
var col1 = 0x3B5998;
var col2 = 0xE9EBEE;
var current_highlight = false;


enterChild()
{
	gotoChild(index)	
}


// Animation.
function animate_scene()
{
	var y_dest = getY(current_index - .5);
	var y_src  = click_box.position.y;
	
	var y_new  = (y_dest*1 + y_src*9)/10;

	setClickBoxPosition(y_new);
}

function start()
{
	// Font is now loaded.
	current_string = "Type!"
	for(var i = 0; i < TREE.getBranchNum(); i++)
	{
		current_index = i;
		updateTextMesh(i, current_string)
	}
	current_string = "";
	current_index = 0;
	current_highlight = true;
	updateTextMesh(0, "");
	
	// Add horizontal Lines.
	for(var i = 0; i < TREE.getBranchNum(); i++)
	{
		new_horizontal_line(getY(i) + 20);
	}
	
	col2 = 0xE9EBEE;
	hover_box = new_line_box(col2); // FB gray.
	
	// Render the click box over top of the hover box.
	col1 = 0x3B5998; // FB blue.
	click_box = new_line_box(col1);

	render();
}


var loader = new THREE.FontLoader();
loader.load( 'fonts/' + 'optimer_regular.typeface.json', function ( response ) {
	font = response;
	params.font = font;
	start();
} );



camera.position.z = 5;

var render = function () {
	requestAnimationFrame( render );

	renderer.render(scene, camera);
	
	animate_scene();
};