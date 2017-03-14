/*
 * Talking Simulator Input / Output.
 * Written by Bryce Summers on 12 - 15 - 2016.
 */

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

	//console.log(key_name);

	if(key_name === "enter")
	{
        executeStatement();
		return;
	}

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

    // Change the index down by one box.
    if(key_name === 'down')
    {
        executeStatement();
        var index = (current_index + 1) % text_mesh.length;
        changeIndex(index);
    }

    // Change the index up by one box.
    if(key_name === 'up')
    {
        executeStatement();
        var index = (current_index + text_mesh.length - 1) % text_mesh.length;
        changeIndex(index);
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

    // Display the old message for no input.
    if(current_string.length < 1)
    {
        updateTextMesh(current_index, TREE.getText(current_index));
    }
    else // display the current string.
    {
	   updateTextMesh(current_index, current_string);
    }
}
var keyboard = new KeyboardState(new KeyAction());

function init_input()
{

    window.addEventListener( 'resize', onWindowResize, false);

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
	setHoverBoxY(y + dim.y - (getY(1) - getY(0))/2);
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

    executeStatement();
	changeIndex(index);
}

function changeIndex(index)
{
    current_highlight = false;
    updateTextMesh(current_index, TREE.getText(current_index));
    current_index = index;
    current_highlight = true;
    
    current_string = "";
    //updateTextMesh(current_index, current_string);
}

function onWindowResize()
{
    console.log("resize");
    dim = {x:0, y:0, w:window.innerWidth, h:window.innerHeight, padding:10};
    start();
}