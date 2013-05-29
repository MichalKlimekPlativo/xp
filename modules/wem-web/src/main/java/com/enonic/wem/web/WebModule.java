package com.enonic.wem.web;

import com.google.inject.AbstractModule;

import com.enonic.wem.admin.AdminModule;
import com.enonic.wem.core.CoreModule;
import com.enonic.wem.portal.PortalModule;

public final class WebModule
    extends AbstractModule
{
    @Override
    protected void configure()
    {
        install( new CoreModule() );
        install( new AdminModule() );
        install( new PortalModule() );
    }
}
