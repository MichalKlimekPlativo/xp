package com.enonic.wem.api.schema.content.form.inputtype;


import org.junit.Test;

import com.enonic.wem.api.data.Property;
import com.enonic.wem.api.data.type.ValueTypes;
import com.enonic.wem.api.schema.content.form.BreaksRequiredContractException;

public class TextAreaTest
{
    @Test(expected = BreaksRequiredContractException.class)
    public void breaksRequiredContract_textLine_which_is_empty_throws_exception()
    {
        new TextArea().checkBreaksRequiredContract( Property.newProperty().name( "myText" ).type( ValueTypes.STRING ).value( "" ).build() );
    }

    @Test(expected = BreaksRequiredContractException.class)
    public void breaksRequiredContract_textLine_which_is_blank_throws_exception()
    {
        new TextArea().checkBreaksRequiredContract(
            Property.newProperty().name( "myText" ).type( ValueTypes.STRING ).value( " " ).build() );
    }
}
