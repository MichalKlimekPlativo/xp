package com.enonic.wem.core.content.type.formitem;


import com.enonic.wem.core.content.data.Data;

public class BreaksRegexValidationException
    extends Exception
{
    private Data data;

    private String regex;

    public BreaksRegexValidationException( final Data data, final String regex )
    {
        super( buildMessage( data, regex ) );
        this.data = data;
        this.regex = regex;
    }

    public Data getData()
    {
        return data;
    }

    public String getRegex()
    {
        return regex;
    }

    private static String buildMessage( final Data data, final String regex )
    {
        return "Data [" + data + "] breaks regexp [" + regex + "]";
    }
}
