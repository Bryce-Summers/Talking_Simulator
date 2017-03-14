/*
 * Talking Tree.
 * Written by Bryce Summes on 12/15/2016.
 *
 * Purpose: Handles all of the logic for the talking Tree.
 */

function NEW_NODE()
{
    var node = {};
    node.txt = "Click, Comment, Reply, Repeat";
    node.likes = 0;
    node.children = [];
    node.default = true
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
            output.push(children[i].txt);
        }

        return output;
    },

    getText(index)
    {
        var children = this.current.children;
        var node = children[index]

        return node.txt;
    },

    // Expands the current node with childen nodes if necessary.
    _expandCurrentNode()
    {
        
        var children = this.current.children;
        
        // Already Expanded.
        if(children.length > 0)
        {
            return false;
        }

        for(var i = 0; i < this.N; i++)
        {
            children.push(NEW_NODE());
        }

        return true;
    },

    childExpanded(index)
    {
        var child = this.current.children[index];
        return child.children.length > 0;
    },

    setNode(str, index)
    {
        var children = this.current.children;
        node = children[index]
        node.txt = str;
        node.default = false;
        node.likes++;
    },

    getLikes(index)
    {
        return this.current.children[index].likes;
    },

    // Goes to the indicated child,
    // returns true iff the child node was a leaf and has now been expanded.
    gotoChild(index)
    {
        this.current = this.current.children[index];
        return this._expandCurrentNode();
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