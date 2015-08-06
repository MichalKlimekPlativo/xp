package com.enonic.xp.form.inputtype;


import org.junit.Test;

import com.enonic.xp.data.PropertyTree;
import com.enonic.xp.form.InputValidationException;

public class XmlTest
{
    @Test(expected = InputValidationException.class)
    public void checkBreaksRequiredContract_throws_exception_when_value_is_empty_string()
    {
        new Xml().checkBreaksRequiredContract( new PropertyTree().setXml( "myXml", "" ) );
    }

    @Test(expected = InputValidationException.class)
    public void checkBreaksRequiredContract_throws_exception_when_value_is_blank_string()
    {
        new Xml().checkBreaksRequiredContract( new PropertyTree().setXml( "myXml", "  " ) );
    }
}
