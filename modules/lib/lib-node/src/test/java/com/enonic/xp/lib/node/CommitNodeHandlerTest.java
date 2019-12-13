package com.enonic.xp.lib.node;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.mockito.stubbing.Answer;

import com.enonic.xp.node.NodeCommitEntry;
import com.enonic.xp.node.NodeCommitId;
import com.enonic.xp.node.NodeIds;
import com.enonic.xp.node.Nodes;
import com.enonic.xp.security.PrincipalKey;

public class CommitNodeHandlerTest
    extends BaseNodeHandlerTest
{
    private void mock()
    {
        Mockito.when( nodeService.getByPaths( Mockito.any() ) ).thenReturn( Nodes.empty() );

        final Answer<NodeCommitEntry> answer = invocation -> {
            final NodeCommitEntry commitEntry = invocation.getArgument( 0, NodeCommitEntry.class );
            return NodeCommitEntry.create( commitEntry ).
                nodeCommitId( NodeCommitId.from( "aa1f76bf-4bb9-41be-b166-03561c1555b2" ) ).
                committer( PrincipalKey.from( "user:system:anonymous" ) ).
                timestamp( Instant.parse( "2019-01-24T15:16:36.260799Z" ) ).
                build();
        };

        Mockito.when( nodeService.commit( Mockito.any(), Mockito.any( NodeIds.class ) ) ).
            thenAnswer( answer );
    }

    @Test
    public void testExample()
    {
        mock();

        runScript( "/lib/xp/examples/node/commit.js" );
    }

}
