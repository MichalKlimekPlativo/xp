package com.enonic.xp.lib.content;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import com.enonic.xp.content.Content;
import com.enonic.xp.content.UpdateContentParams;

public class RemoveAttachmentHandlerTest
    extends BaseContentHandlerTest

{

    @Test
    public void testExample()
    {
        final Content content = TestDataFixtures.newExampleContent();
        Mockito.when( this.contentService.getByPath( Mockito.any() ) ).thenReturn( content );
        runScript( "/lib/xp/examples/content/removeAttachment.js" );

        Mockito.verify( this.contentService, Mockito.times( 2 ) ).update( Mockito.any( UpdateContentParams.class ) );
    }

    @Test
    public void removeAttachmentSingle()
        throws Exception
    {
        final Content content = TestDataFixtures.newExampleContent();
        Mockito.when( this.contentService.getByPath( Mockito.any() ) ).thenReturn( content );

        runFunction( "/test/RemoveAttachmentHandlerTest.js", "removeAttachmentSingle" );
    }

    @Test
    public void removeAttachmentMulti()
        throws Exception
    {
        final Content content = TestDataFixtures.newExampleContent();
        Mockito.when( this.contentService.getByPath( Mockito.any() ) ).thenReturn( content );

        runFunction( "/test/RemoveAttachmentHandlerTest.js", "removeAttachmentMulti" );
    }

}
