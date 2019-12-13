package com.enonic.xp.repo.impl.node;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.enonic.xp.index.ChildOrder;
import com.enonic.xp.node.CreateNodeParams;
import com.enonic.xp.node.Node;
import com.enonic.xp.node.NodePath;
import com.enonic.xp.security.PrincipalKey;
import com.enonic.xp.security.acl.AccessControlEntry;
import com.enonic.xp.security.acl.AccessControlList;
import com.enonic.xp.security.acl.Permission;

public class StoreNodeCommandTest
    extends AbstractNodeTest
{
    @BeforeEach
    public void setUp()
        throws Exception
    {
        this.createDefaultRootNode();
    }

    @Test
    public void with_acl()
        throws Exception
    {

        Node newNode = createNode( CreateNodeParams.create().
            name( "my-node" ).
            parent( NodePath.ROOT ).
            build() );

        Node updatedNode = Node.create( newNode ).
            permissions( AccessControlList.create().
                add( AccessControlEntry.create().
                    allow( Permission.READ ).
                    allow( Permission.CREATE ).
                    allow( Permission.DELETE ).
                    principal( PrincipalKey.from( "user:myidprovider:rmy" ) ).
                    build() ).
                build() ).
            childOrder( ChildOrder.from( "name DESC" ) ).
            build();

        refresh();

        StoreNodeCommand.create().
            node( updatedNode ).
            indexServiceInternal( this.indexServiceInternal ).
            storageService( this.storageService ).
            searchService( this.searchService ).
            build().
            execute();
        refresh();


    }
}
