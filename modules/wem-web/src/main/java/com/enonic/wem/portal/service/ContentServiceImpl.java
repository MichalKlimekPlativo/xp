package com.enonic.wem.portal.service;

import com.google.inject.Singleton;

import com.enonic.wem.api.command.Commands;
import com.enonic.wem.api.command.content.GetContents;
import com.enonic.wem.api.content.Content;
import com.enonic.wem.api.content.ContentPath;
import com.enonic.wem.api.content.ContentPaths;
import com.enonic.wem.api.content.Contents;
import com.enonic.wem.portal.request.PortalRequest;
import com.enonic.wem.portal.request.PortalRequestPath;

@Singleton
public class ContentServiceImpl
    extends AbstractPortalService
    implements ContentService
{
    public Content getContent( final PortalRequest portalRequest )
    {
        final PortalRequestPath portalRequestPath = portalRequest.getPortalRequestPath();

        final ContentPath contentPath =
            ContentPath.newPath().spaceName( portalRequestPath.getSpaceName() ).elements( portalRequestPath.getElements() ).build();

        return findContent( contentPath );
    }

    private Content findContent( final ContentPath contentPath )
    {
        final GetContents getContents = Commands.content().get();
        getContents.selectors( ContentPaths.from( contentPath ) );

        final Contents contents = client.execute( getContents );
        return contents.isNotEmpty() ? contents.first() : null;
    }

}
