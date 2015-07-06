package com.enonic.xp.image;

import com.google.common.base.MoreObjects;
import com.google.common.base.Objects;
import com.google.common.base.Preconditions;

public final class Cropping
{

    private final int top;

    private final int left;

    private final int bottom;

    private final int right;

    private Cropping( final Cropping.Builder builder )
    {
        this.top = builder.top;
        this.left = builder.left;
        this.bottom = builder.bottom;
        this.right = builder.right;
        Preconditions.checkArgument( top >= 0, "Cropping top offset value must be positive : %s", top );
        Preconditions.checkArgument( left >= 0, "Cropping left offset value must be positive : %s", left );
        Preconditions.checkArgument( bottom > top, "Cropping bottom value must be bigger than top : %s", bottom );
        Preconditions.checkArgument( right > left, "Cropping right value must be bigger than left : %s", right );
    }

    public int top()
    {
        return top;
    }

    public int left()
    {
        return left;
    }

    public int bottom()
    {
        return bottom;
    }

    public int right()
    {
        return right;
    }

    public int width()
    {
        return right - left;
    }

    public int height()
    {
        return bottom - top;
    }

    @Override
    public boolean equals( final Object o )
    {
        if ( this == o )
        {
            return true;
        }
        if ( o == null || getClass() != o.getClass() )
        {
            return false;
        }
        final Cropping cropping = (Cropping) o;
        return Objects.equal( left, cropping.left ) &&
            Objects.equal( top, cropping.top ) &&
            Objects.equal( right, cropping.right ) &&
            Objects.equal( bottom, cropping.bottom );
    }

    @Override
    public int hashCode()
    {
        return Objects.hashCode( left, top, right, bottom );
    }

    @Override
    public String toString()
    {
        return MoreObjects.toStringHelper( this ).
            add( "top", top ).
            add( "left", left ).
            add( "bottom", bottom ).
            add( "right", right ).
            toString();
    }

    public static Cropping.Builder create()
    {
        return new Cropping.Builder();
    }

    public static Cropping.Builder copyOf( final Cropping cropping )
    {
        return new Cropping.Builder( cropping );
    }

    public static class Builder
    {
        private int top;

        private int left;

        private int bottom;

        private int right;

        private Builder()
        {
            this.top = 0;
            this.left = 0;
            this.bottom = 0;
            this.right = 0;
        }

        private Builder( final Cropping source )
        {
            this.top = source.top;
            this.left = source.left;
            this.bottom = source.bottom;
            this.right = source.right;
        }

        public Builder left( final int left )
        {
            this.left = left;
            return this;
        }

        public Builder top( final int top )
        {
            this.top = top;
            return this;
        }

        public Builder right( final int right )
        {
            this.right = right;
            return this;
        }

        public Builder bottom( final int bottom )
        {
            this.bottom = bottom;
            return this;
        }

        public Cropping build()
        {
            return new Cropping( this );
        }
    }

}