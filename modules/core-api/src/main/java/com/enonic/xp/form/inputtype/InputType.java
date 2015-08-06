package com.enonic.xp.form.inputtype;

import java.util.Objects;

import org.apache.commons.lang.StringUtils;

import com.google.common.annotations.Beta;

import com.enonic.xp.data.Property;
import com.enonic.xp.data.Value;
import com.enonic.xp.data.ValueType;
import com.enonic.xp.data.ValueTypes;
import com.enonic.xp.form.InputValidationException;
import com.enonic.xp.form.InvalidTypeException;
import com.enonic.xp.form.Occurrences;

@Beta
public abstract class InputType
{
    private final InputTypeName name;

    private final Class configClass;

    private final boolean requiresConfig;

    protected InputType( final InputTypeName name, final Class configClass, final boolean requiresConfig )
    {
        this.configClass = configClass;
        this.name = name;
        this.requiresConfig = requiresConfig;
    }

    public String getName()
    {
        return name.toString();
    }

    public final boolean requiresConfig()
    {
        return requiresConfig;
    }

    public final boolean hasConfig()
    {
        return configClass != null;
    }

    public final Class requiredConfigClass()
    {
        return configClass;
    }

    public InputTypeConfigSerializer getConfigSerializer()
    {
        return null;
    }

    public abstract void checkBreaksRequiredContract( final Property property );

    public abstract void checkTypeValidity( final Property property );

    @Override
    public boolean equals( final Object o )
    {
        if ( this == o )
        {
            return true;
        }
        if ( !( o instanceof InputType ) )
        {
            return false;
        }

        final InputType that = (InputType) o;

        return Objects.equals( this.name, that.name ) && Objects.equals( this.configClass, that.configClass );
    }

    @Override
    public int hashCode()
    {
        return Objects.hash( this.name, this.configClass );
    }

    @Override
    public String toString()
    {
        return this.name.toString();
    }

    public InputTypeConfig getDefaultConfig()
    {
        return null;
    }

    public void validateOccurrences( final Occurrences occurrences )
    {
        // Default: nothing
    }

    public abstract Value createPropertyValue( final String value, final InputTypeConfig config );

    protected final void validateType( final Property property, final ValueType type )
    {
        if ( property.getType() != type )
        {
            throw new InvalidTypeException( property, ValueTypes.STRING );
        }
    }

    protected final void validateNotBlank( final Property property )
    {
        final String stringValue = property.getString();
        if ( StringUtils.isBlank( stringValue ) )
        {
            throw new InputValidationException( property, this );
        }
    }

    protected final void validateNotNull( final Property property, final Object value )
    {
        if ( value == null )
        {
            throw new InputValidationException( property, this );
        }
    }
}
