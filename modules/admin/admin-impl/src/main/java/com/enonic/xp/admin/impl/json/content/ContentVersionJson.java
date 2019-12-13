package com.enonic.xp.admin.impl.json.content;

import java.time.Instant;
import java.util.Objects;

import com.enonic.xp.admin.impl.rest.resource.content.ContentPrincipalsResolver;
import com.enonic.xp.content.ContentVersion;
import com.enonic.xp.security.Principal;

public class ContentVersionJson
{
    private final String modifier;

    private final String modifierDisplayName;

    private final String displayName;

    private final Instant modified;

    private final String comment;

    private final String id;

    private final ContentVersionPublishInfoJson publishInfo;

    private final ContentWorkflowInfoJson workflow;

    public ContentVersionJson( final ContentVersion contentVersion, final ContentPrincipalsResolver principalsResolver )
    {
        this.modified = contentVersion.getModified();
        this.displayName = contentVersion.getDisplayName();
        this.comment = contentVersion.getComment();

        final Principal modifier = principalsResolver.findPrincipal( contentVersion.getModifier() );

        this.modifierDisplayName = modifier != null ? modifier.getDisplayName() : "";
        this.modifier = contentVersion.getModifier().toString();
        this.id = contentVersion.getId().toString();
        this.publishInfo = contentVersion.getPublishInfo() != null ? new ContentVersionPublishInfoJson( contentVersion.getPublishInfo(),
                                                                                                        principalsResolver ) : null;

        this.workflow =
            contentVersion.getWorkflowInfo() != null ? new ContentWorkflowInfoJson( contentVersion.getWorkflowInfo() ) : null;

    }

    @SuppressWarnings("UnusedDeclaration")
    public String getModifier()
    {
        return modifier;
    }

    @SuppressWarnings("UnusedDeclaration")
    public String getDisplayName()
    {
        return displayName;
    }

    @SuppressWarnings("UnusedDeclaration")
    public Instant getModified()
    {
        return modified;
    }

    @SuppressWarnings("UnusedDeclaration")
    public String getComment()
    {
        return comment;
    }

    @SuppressWarnings("UnusedDeclaration")
    public String getId()
    {
        return id;
    }

    @SuppressWarnings("UnusedDeclaration")
    public String getModifierDisplayName()
    {
        return modifierDisplayName;
    }

    @SuppressWarnings("unused")
    public ContentVersionPublishInfoJson getPublishInfo()
    {
        return publishInfo;
    }

    @SuppressWarnings("UnusedDeclaration")
    public ContentWorkflowInfoJson getWorkflow()
    {
        return workflow;
    }

    @Override
    public boolean equals( final Object o )
    {
        if ( this == o )
        {
            return true;
        }
        if ( o == null || getClass() != o.getClass() )
        {
            return false;
        }
        final ContentVersionJson that = (ContentVersionJson) o;
        return Objects.equals( modifier, that.modifier ) && Objects.equals( modifierDisplayName, that.modifierDisplayName ) &&
            Objects.equals( displayName, that.displayName ) && Objects.equals( modified, that.modified ) &&
            Objects.equals( comment, that.comment ) && Objects.equals( id, that.id ) && Objects.equals( publishInfo, that.publishInfo ) &&
            Objects.equals( workflow, that.workflow );
    }

    @Override
    public int hashCode()
    {
        return Objects.hash( modifier, modifierDisplayName, displayName, modified, comment, id, publishInfo, workflow );
    }
}
