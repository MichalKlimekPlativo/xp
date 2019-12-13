package com.enonic.xp.lib.node;

import com.enonic.xp.branch.Branch;

public class PushNodeHandlerParams
{
    private NodeKey key;

    private NodeKeys keys;

    private Branch targetBranch;

    private boolean resolve;

    private boolean includeChildren;

    private NodeKeys exclude;


    public NodeKey getKey()
    {
        return key;
    }

    public void setKey( final String key )
    {
        this.key = NodeKey.from( key );
    }

    public NodeKeys getKeys()
    {
        return keys;
    }

    public void setKeys( final String[] keys )
    {
        this.keys = NodeKeys.from( keys );
    }

    public Branch getTargetBranch()
    {
        return targetBranch;
    }

    public void setTargetBranch( final String targetBranch )
    {
        this.targetBranch = Branch.from( targetBranch );
    }

    public boolean isResolve()
    {
        return resolve;
    }

    public void setResolve( final boolean resolve )
    {
        this.resolve = resolve;
    }

    public boolean isIncludeChildren()
    {
        return includeChildren;
    }

    public void setIncludeChildren( final boolean includeChildren )
    {
        this.includeChildren = includeChildren;
    }

    public NodeKeys getExclude()
    {
        return exclude;
    }

    public void setExclude( final String[] exclude )
    {
        this.exclude = NodeKeys.from( exclude );
    }
}
