package com.enonic.wem.portal.service;

import com.enonic.wem.api.command.Commands;
import com.enonic.wem.api.space.Space;
import com.enonic.wem.api.space.SpaceName;

public class SpaceServiceImpl
    extends AbstractPortalService
    implements SpaceService
{

    @Override
    public Space getSpace( final String space )
    {
        SpaceName spaceName = SpaceName.from( space );

        return client.execute( Commands.space().get().name( spaceName ) ).first();
    }
}
