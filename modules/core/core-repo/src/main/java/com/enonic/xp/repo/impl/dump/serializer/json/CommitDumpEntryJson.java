package com.enonic.xp.repo.impl.dump.serializer.json;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import com.enonic.xp.node.NodeCommitId;
import com.enonic.xp.repo.impl.dump.model.CommitDumpEntry;
import com.enonic.xp.security.PrincipalKey;

public class CommitDumpEntryJson
{
    @JsonProperty("commitId")
    private String commitId;

    @JsonProperty("message")
    private String message;

    @JsonProperty("committer")
    private String committer;

    @JsonProperty("timestamp")
    private String timestamp;

    @SuppressWarnings("unused")
    public CommitDumpEntryJson()
    {
    }

    private CommitDumpEntryJson( final Builder builder )
    {
        commitId = builder.commitId;
        message = builder.message;
        committer = builder.committer;
        timestamp = builder.timestamp;
    }

    public static CommitDumpEntryJson from( final CommitDumpEntry commitDumpEntry )
    {
        return create().
            commitId( commitDumpEntry.getNodeCommitId().toString() ).
            message( commitDumpEntry.getMessage() ).
            committer( commitDumpEntry.getCommitter().toString() ).
            timestamp( commitDumpEntry.getTimestamp().toString() ).
            build();
    }

    public static CommitDumpEntry fromJson( final CommitDumpEntryJson commitDumpEntryJson )
    {
        return CommitDumpEntry.create().
            nodeCommitId( NodeCommitId.from( commitDumpEntryJson.commitId ) ).
            message( commitDumpEntryJson.message ).
            committer( PrincipalKey.from(commitDumpEntryJson.committer) ).
            timestamp( Instant.parse( commitDumpEntryJson.timestamp ) ).
            build();
    }

    public static Builder create()
    {
        return new Builder();
    }

    public static final class Builder
    {
        private String commitId;

        private String message;

        private String committer;

        private String timestamp;

        private Builder()
        {
        }

        public Builder commitId( final String commitId )
        {
            this.commitId = commitId;
            return this;
        }

        public Builder message( final String message )
        {
            this.message = message;
            return this;
        }

        public Builder committer( final String committer )
        {
            this.committer = committer;
            return this;
        }

        public Builder timestamp( final String timestamp )
        {
            this.timestamp = timestamp;
            return this;
        }

        public CommitDumpEntryJson build()
        {
            return new CommitDumpEntryJson( this );
        }
    }
}
