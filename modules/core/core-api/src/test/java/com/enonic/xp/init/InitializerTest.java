package com.enonic.xp.init;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

public class InitializerTest
{
    @Test
    public void testNonMaster()
    {
        final Runnable doInitalization = Mockito.mock( Runnable.class );
        final TestInitializer initializer = createInitializer( false, false, doInitalization );

        new Thread( () -> {
            try
            {
                Thread.sleep( 100 );
            }
            catch ( InterruptedException e )
            {
                e.printStackTrace();
            }
            initializer.setInitialized( true );
        } ).start();

        initializer.initialize();
        Mockito.verify( doInitalization, Mockito.never() ).run();
    }

    @Test
    public void testMaster()
    {
        final Runnable doInitalization = Mockito.mock( Runnable.class );
        createInitializer( true, false, doInitalization ).
            initialize();
        Mockito.verify( doInitalization ).run();
    }

    @Test
    public void testNonMasterInitialized()
    {
        final Runnable doInitalization = Mockito.mock( Runnable.class );
        createInitializer( false, true, doInitalization ).
            initialize();
        Mockito.verify( doInitalization, Mockito.never() ).run();
    }

    @Test
    public void testMasterInitialized()
    {
        final Runnable doInitalization = Mockito.mock( Runnable.class );
        createInitializer( true, true, doInitalization ).
            initialize();
        Mockito.verify( doInitalization, Mockito.never() ).run();
    }

    private TestInitializer createInitializer( final boolean isMaster, final boolean isInitialized, final Runnable initialization )
    {
        return TestInitializer.create().
            setInitializationCheckMaxCount( 2L ).
            setInitializationCheckPeriod( 1L ).
            setMaster( isMaster ).
            setInitialized( isInitialized ).setInitialization( initialization ).
            build();
    }
}
