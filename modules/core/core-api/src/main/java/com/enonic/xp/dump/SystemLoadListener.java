package com.enonic.xp.dump;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.repository.RepositoryId;

public interface SystemLoadListener
{
    void totalBranches( final long total );

    void loadingBranch( final RepositoryId repositoryId, final Branch branch, final Long total );

    void loadingVersions( final RepositoryId repositoryId );

    void loadingCommits( final RepositoryId repositoryId );

    void entryLoaded();
}
