package com.enonic.xp.schema.content.validator;

import java.text.MessageFormat;

import com.google.common.annotations.Beta;

import com.enonic.xp.form.FormItemPath;

@Beta
public class DataValidationError
{
    private final FormItemPath path;

    private final String errorMessage;

    DataValidationError( final FormItemPath path, final String errorMessage, final Object... args )
    {
        this.path = path;
        this.errorMessage = args.length == 0 ? errorMessage : MessageFormat.format( errorMessage, args );
    }

    public FormItemPath getPath()
    {
        return path;
    }

    public String getErrorMessage()
    {
        return errorMessage;
    }
}
