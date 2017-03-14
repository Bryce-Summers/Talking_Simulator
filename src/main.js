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
cursor_mesh = null; // The current mesh being written on the screen by user.

var font = null;
var col1 = 0x3B5998;
var col2 = 0xE9EBEE;
var current_highlight = false;

function executeStatement()
{
    var likes = TREE.getLikes(current_index);

    if (legalText())
    {
      current_string = likes + " likes: " + current_string;
      enterChild();
    }
}

function legalText()
{
    return current_string.length > 0
}

// Expression writing logic.
function enterChild()
{
    TREE.setNode(current_string, current_index);

    if(TREE.childExpanded(current_index))
    {
        TREE.gotoChild(current_index);
    }
    else
    {
        // Expand the child, then go to the root.
        TREE.gotoChild(current_index);   
        TREE.gotoRoot();
    }

    /*
    if(goto_root_next)
    {
        TREE.gotoRoot()
        goto_root_next = false;
    }
    else
    {
        goto_root_next = TREE.gotoChild(current_index);
    }*/

    refresh_all_text();
    current_string = '';
}


// Animation.
time = 0
function animate_scene()
{
    time++;

	var y_dest = getY(current_index - .5);
	var y_src  = click_box.position.y;
	
	var y_new  = (y_dest*1 + y_src*9)/10;

	setClickBoxPosition(y_new);

    // This should make the text meshes rotate in some sort of animated and thematic way.
    if(text_mesh)
    {
        var len = text_mesh.length;
        
        for(var i = 0; i < len; i++)
        {
            mesh = text_mesh[i]
            rotation = mesh.rotation
            rotation.copy(new THREE.Vector3(0, 0, Math.random() * Math.PI/8 - Math.PI/4));
        }
    }

    // Set height to proper column.
    cursor_mesh.position.y = getY(current_index - .3)

    if(text_mesh[current_index])
    {
        // Set x location past the length of the current string.
        var box = new THREE.Box3().setFromObject(text_mesh[current_index]);

        cursor_mesh.position.x = box.max.x + dim.padding
    }  

    
    if(time % 100 > 50)
    {
        cursor_mesh.material.color = new THREE.Color(col1);
    }
    else
    {
        cursor_mesh.material.color = new THREE.Color(col2);
    }
    

}

function start()
{

    scene.children = [];

	// Font is now loaded.
	strings = TREE.getCurrentText()
	for(var i = 0; i < TREE.getBranchNum(); i++)
	{
	   updateTextMesh(i, strings[i])
    }
	
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

    // The cursor is a vertical bar.
    cursor_mesh = new_vertical_line(dim.x + padding, getY(.3) - getY(.0));

	render();
}


var loader = new THREE.FontLoader();
loader.load( 'fonts/' + 'optimer_regular.typeface.json', function ( response ) {
	font = response;
	params.font = font;
	start();
} );

var render = function () {
	requestAnimationFrame( render );

	renderer.render(scene, camera);
	
	animate_scene();
};