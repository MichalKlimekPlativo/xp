package com.enonic.xp.portal.impl.idprovider;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import com.enonic.xp.portal.script.PortalScriptService;
import com.enonic.xp.resource.ResourceKey;
import com.enonic.xp.script.ScriptExports;

@Component
public final class IdProviderControllerScriptFactoryImpl
    implements IdProviderControllerScriptFactory
{
    private PortalScriptService scriptService;

    @Override
    public IdProviderControllerScript fromScript( final ResourceKey script )
    {
        final ScriptExports exports = this.scriptService.execute( script );
        return new IdProviderControllerScriptImpl( exports );
    }

    @Reference
    public void setScriptService( final PortalScriptService scriptService )
    {
        this.scriptService = scriptService;
    }

}
