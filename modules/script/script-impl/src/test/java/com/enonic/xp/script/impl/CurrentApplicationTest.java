package com.enonic.xp.script.impl;

import org.junit.jupiter.api.Test;

public class CurrentApplicationTest
    extends AbstractScriptTest
{
    @Test
    public void testCurrentApplication()
        throws Exception
    {
        runTestScript( "application-test.js" );
    }
}
