/*
 * Talking Tree.
 * Written by Bryce Summes on 12/15/2016.
 *
 * Purpose: Handles all of the logic for the talking Tree.
 */

function NEW_NODE()
{
    var node = {};
    node.txt = "";
    node.children = [];
    return node;
}

TalkTree = function()
{
    // The Root of the tree.
    this.root    = NEW_NODE();

    // The current node pointed at in the tree.
    this.current = this.root;

    // The branching number.
    this.N = 4;

    this._expandCurrentNode();
}

TalkTree.prototype =
{
    // Returns the Current text strings that the user should see.
    getCurrentText()
    {
        var output   = [];
        
        var children = this.current.children;

        for(var i = 0; i < this.N; i++)
        {
            output.push(children[i]);
        }

        return output;
    },

    // Expands the current node with childen nodes if necessary.
    _expandCurrentNode()
    {
        
        var children = this.current.children;
        
        // Already Expanded.
        if(children.length > 0)
        {
            return;
        }

        for(var i = 0; i < this.N; i++)
        {
            children.push(NEW_NODE());
        }
    },

    setNode(str, index)
    {
        var children = this.current.children;
        children[index].txt = str;
    },

    gotoChild(index)
    {
        this.current = this.current.children[index];
        this._expandCurrentNode();
    },

    gotoRoot()
    {
        this.current = this.root;
    },

    getBranchNum()
    {
        return this.N;
    }

}