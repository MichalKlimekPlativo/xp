package com.enonic.xp.repo.impl.commit;

import com.enonic.xp.node.NodeCommitEntry;
import com.enonic.xp.node.NodeCommitId;
import com.enonic.xp.repo.impl.InternalContext;

public interface CommitService
{
    String store( final NodeCommitEntry nodeBranchEntry, final InternalContext context );

    NodeCommitEntry get( final NodeCommitId nodeCommitId, final InternalContext context );
}
