package com.enonic.xp.node;

public interface DuplicateNodeListener
{
    void nodesDuplicated( int count );

    void nodesReferencesUpdated( int count );
}
