package com.enonic.xp.lib.portal.current;

import javax.servlet.http.HttpServletRequest;

import org.junit.Test;
import org.mockito.Mockito;

import com.enonic.xp.lib.portal.TestDataFixtures;
import com.enonic.xp.security.IdProvider;
import com.enonic.xp.testing.ScriptTestSupport;

public class GetCurrentIdProviderKeyHandlerTest
    extends ScriptTestSupport
{
    @Test
    public void testExample()
    {
        final IdProvider idProvider = TestDataFixtures.newIdProvider();
        this.portalRequest.setIdProvider( idProvider );

        runScript( "/lib/xp/examples/portal/getIdProviderKey.js" );
    }

    @Test
    public void noIdProviderConfig()
    {
        this.portalRequest.setRawRequest( Mockito.mock( HttpServletRequest.class ) );
        this.portalRequest.setIdProvider( null );
        runFunction( "/test/getIdProviderKey-test.js", "noIdProvider" );
    }
}
