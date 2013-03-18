package com.enonic.wem.web.rest.rpc.content.schema.mixin;

import org.junit.Test;
import org.mockito.Mockito;

import com.enonic.wem.api.Client;
import com.enonic.wem.api.command.Commands;
import com.enonic.wem.api.command.content.schema.mixin.DeleteMixinResult;
import com.enonic.wem.api.content.schema.mixin.QualifiedMixinName;
import com.enonic.wem.web.json.rpc.JsonRpcHandler;
import com.enonic.wem.web.rest.rpc.AbstractRpcHandlerTest;

public class DeleteMixinRpcHandlerTest
    extends AbstractRpcHandlerTest
{
    private Client client;

    @Override
    protected JsonRpcHandler createHandler()
        throws Exception
    {
        final DeleteMixinRpcHandler handler = new DeleteMixinRpcHandler();
        client = Mockito.mock( Client.class );
        handler.setClient( client );
        return handler;
    }

    @Test
    public void deleteSingleMixin()
        throws Exception
    {
        Mockito.when( client.execute( Mockito.any( Commands.mixin().delete().getClass() ) ) ).thenReturn( DeleteMixinResult.SUCCESS );

        testSuccess( "deleteMixin_param.json", "deleteMixin_success_result.json" );
    }

    @Test
    public void deleteMultipleMixins()
        throws Exception
    {
        final QualifiedMixinName existingName = new QualifiedMixinName( "my:existingMixin" );
        final QualifiedMixinName notFoundName = new QualifiedMixinName( "my:notFoundMixin" );
        final QualifiedMixinName beingUsedName = new QualifiedMixinName( "my:beingUsedMixin" );

        MixinDeletionResult mixinDeletionResult = new MixinDeletionResult();
        mixinDeletionResult.success( existingName );
        mixinDeletionResult.failure( notFoundName, "Mixin [my:notFoundMixin] was not found" );
        mixinDeletionResult.failure( beingUsedName, "Mixin is being used" );

        Mockito.when( client.execute( Mockito.any( Commands.mixin().delete().getClass() ) ) ).
            thenReturn( DeleteMixinResult.SUCCESS ).
            thenReturn( DeleteMixinResult.NOT_FOUND ).
            thenReturn( DeleteMixinResult.UNABLE_TO_DELETE );

        testSuccess( "deleteMixin_param_multiple.json", "deleteMixin_error_result.json" );
    }

}
