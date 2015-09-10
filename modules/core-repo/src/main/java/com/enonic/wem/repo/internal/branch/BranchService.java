package com.enonic.wem.repo.internal.branch;

import com.enonic.wem.repo.internal.InternalContext;
import com.enonic.wem.repo.internal.storage.branch.NodeBranchQuery;
import com.enonic.wem.repo.internal.storage.branch.NodeBranchQueryResult;
import com.enonic.wem.repo.internal.storage.branch.NodeBranchVersion;
import com.enonic.wem.repo.internal.storage.branch.NodeBranchVersions;
import com.enonic.xp.node.NodeId;
import com.enonic.xp.node.NodeIds;
import com.enonic.xp.node.NodePath;
import com.enonic.xp.node.NodePaths;

public interface BranchService
{
    String store( final StoreBranchDocument storeBranchDocument, final InternalContext context );

    void delete( final NodeId nodeId, final InternalContext context );

    NodeBranchVersion get( final NodeId nodeId, final InternalContext context );

    NodeBranchVersions get( final NodeIds nodeIds, final InternalContext context );

    NodeBranchVersion get( final NodePath nodePath, final InternalContext context );

    NodeBranchVersions get( final NodePaths nodePath, final InternalContext context );

    NodeBranchQueryResult findAll( final NodeBranchQuery nodeBranchQuery, final InternalContext context );

    boolean hasChildren( final NodeId nodeId, final InternalContext context );

    NodeBranchVersions getChildren( final NodeId nodeId, final InternalContext context );
}
