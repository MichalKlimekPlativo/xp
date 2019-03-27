package com.enonic.xp.repo.impl.dump.writer;

import com.enonic.xp.blob.NodeVersionKey;
import com.enonic.xp.branch.Branch;
import com.enonic.xp.repo.impl.dump.model.BranchDumpEntry;
import com.enonic.xp.repo.impl.dump.model.CommitDumpEntry;
import com.enonic.xp.repo.impl.dump.model.DumpMeta;
import com.enonic.xp.repo.impl.dump.model.VersionsDumpEntry;
import com.enonic.xp.repository.RepositoryId;

public interface DumpWriter
{
    void writeDumpMetaData( final DumpMeta dumpMeta );

    void openBranchMeta( final RepositoryId repositoryId, final Branch branch );

    void openVersionsMeta( final RepositoryId repositoryId );

    void openCommitsMeta( final RepositoryId repositoryId );

    void close();

    void writeBranchEntry( final BranchDumpEntry branchDumpEntry );

    void writeVersionsEntry( final VersionsDumpEntry versionsDumpEntry );

    void writeCommitEntry( final CommitDumpEntry commitDumpEntry );

    void writeNodeVersionBlobs( final RepositoryId repositoryId, final NodeVersionKey nodeVersionKey );

    void writeBinaryBlob( final RepositoryId repositoryId, final String key );

}
