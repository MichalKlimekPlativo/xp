package com.enonic.wem.api.content.page;


public final class PartTemplate
    extends Template<PartTemplateId>
{
    private PartTemplate( final Builder builder )
    {
        super( builder.id, builder.displayName, builder.descriptor, builder.config );
    }

    public static Builder newPartTemplate()
    {
        return new Builder();
    }

    public static class Builder
        extends BaseTemplateBuilder<Builder, PartTemplateId>
    {
        private Builder()
        {
        }

        public PartTemplate build()
        {
            return new PartTemplate( this );
        }
    }
}
