package com.enonic.wem.api.content.page;


import com.enonic.wem.api.data.RootDataSet;
import com.enonic.wem.api.schema.content.QualifiedContentTypeNames;

public class PageTemplate
    extends Template<PageTemplate, PageTemplateId>
{
    /**
     * Template templateConfig.
     */
    RootDataSet templateConfig;

    /**
     * Default page templateConfig that can be overridden in page (content).
     */
    RootDataSet pageConfig;

    QualifiedContentTypeNames canRender;

    private PageTemplate( final Builder builder )
    {
        this.id = builder.id;
    }

    PageTemplateId id()
    {
        return id;
    }

    public RootDataSet getTemplateConfig()
    {
        return templateConfig;
    }

    public RootDataSet getPageConfig()
    {
        return pageConfig;
    }

    public static class Builder
    {
        private PageTemplateId id;

        public Builder id( final PageTemplateId value )
        {
            this.id = value;
            return this;
        }
    }
}
