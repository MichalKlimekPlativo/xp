package com.enonic.xp.repo.impl.dump.upgrade;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.common.io.Files;

import com.enonic.xp.branch.Branch;
import com.enonic.xp.repository.RepositoryId;

public abstract class AbstractMetaBlobUpgrader
    extends AbstractDumpUpgrader
{
    public AbstractMetaBlobUpgrader( final Path basePath )
    {
        super( basePath );
    }

    @Override
    public void upgrade( final String dumpName )
    {
        super.upgrade( dumpName );

        try
        {
            dumpReader.getRepositories().
                forEach( this::upgradeRepository );
        }
        catch ( Exception e )
        {
            throw new DumpUpgradeException( "Error while upgrading dump [" + dumpName + "]", e );
        }
    }

    protected void upgradeRepository( final RepositoryId repositoryId )
    {
        final File versionsFile = dumpReader.getVersionsFile( repositoryId );
        if ( versionsFile != null )
        {
            upgradeVersionEntries( repositoryId, versionsFile );
        }
        dumpReader.getBranches( repositoryId ).
            forEach( branch -> upgradeBranch( repositoryId, branch ) );
    }

    protected void upgradeBranch( final RepositoryId repositoryId, final Branch branch )
    {
        final File entriesFile = dumpReader.getBranchEntriesFile( repositoryId, branch );
        if ( entriesFile != null )
        {
            upgradeBranchEntries( repositoryId, branch, entriesFile );
        }
        else
        {
            throw new DumpUpgradeException(
                "Branch entries file missing for repository [" + repositoryId + "] and branch [" + branch + "]" );
        }
    }

    protected void upgradeVersionEntries( final RepositoryId repositoryId, final File entriesFile )
    {
        dumpReader.processEntries( ( entryContent, entryName ) -> upgradeVersionEntry( repositoryId, entryContent ), entriesFile );
    }

    protected void upgradeBranchEntries( final RepositoryId repositoryId, final Branch branch, final File entriesFile )
    {
        dumpReader.processEntries( ( entryContent, entryName ) -> upgradeBranchEntry( repositoryId, entryContent ), entriesFile );
    }

    protected abstract void upgradeVersionEntry( final RepositoryId repositoryId, final String entryContent );

    protected abstract void upgradeBranchEntry( final RepositoryId repositoryId, final String entryContent );
}
