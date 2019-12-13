package com.enonic.xp.launcher.impl.env;

import org.junit.jupiter.api.Test;

import com.enonic.xp.launcher.LauncherException;

import static com.google.common.base.StandardSystemProperty.JAVA_VERSION;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class RequirementCheckerTest
{
    @Test
    public void rightJavaVersion()
    {
        final SystemProperties props = new SystemProperties();
        props.put( JAVA_VERSION.key(), "11" );

        new RequirementChecker( props ).check();
    }

    @Test
    public void rightJavaVersionWithMinorVersion()
    {
        final SystemProperties props = new SystemProperties();
        props.put( JAVA_VERSION.key(), "11.0.2" );

        new RequirementChecker( props ).check();
    }

    @Test
    public void rightJavaVersion_withClassifier()
    {
        final SystemProperties props = new SystemProperties();
        props.put( JAVA_VERSION.key(), "11.0.2_94-internal" );

        new RequirementChecker( props ).check();
    }

    @Test
    public void wrongJavaVersion()
    {
        final SystemProperties props = new SystemProperties();
        props.put( JAVA_VERSION.key(), "1.7.0" );

        RequirementChecker requirementChecker = new RequirementChecker(props);
        assertThrows(LauncherException.class, () -> requirementChecker.check());
    }
}
