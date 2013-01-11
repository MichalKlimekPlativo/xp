package com.enonic.wem.web.rest.rpc.content;

import org.junit.Test;
import org.mockito.Mockito;

import com.enonic.wem.api.Client;
import com.enonic.wem.api.command.Commands;
import com.enonic.wem.web.json.rpc.JsonRpcHandler;
import com.enonic.wem.web.rest.rpc.AbstractRpcHandlerTest;

public class GenerateContentNameRpcHandlerTest
    extends AbstractRpcHandlerTest
{

    private Client client;

    @Override
    protected JsonRpcHandler createHandler()
        throws Exception
    {
        final GenerateContentNameRpcHandler handler = new GenerateContentNameRpcHandler();

        client = Mockito.mock( Client.class );
        handler.setClient( client );

        return handler;
    }

    @Test
    public void testGenerateContentName()
        throws Exception
    {

        Mockito.when( client.execute( Mockito.any( Commands.content().generateContentName().getClass() ) ) ).thenReturn( "displayname" );

        testSuccess( "generateContentName_param.json", "generateContentName_result.json" );
    }
}
