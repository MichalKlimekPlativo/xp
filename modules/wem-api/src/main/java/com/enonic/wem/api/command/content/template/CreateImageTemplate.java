package com.enonic.wem.api.command.content.template;


import com.enonic.wem.api.command.Command;
import com.enonic.wem.api.content.page.ImageTemplate;
import com.enonic.wem.api.content.page.ImageTemplateId;
import com.enonic.wem.api.data.RootDataSet;
import com.enonic.wem.api.module.ModuleResourceKey;

public final class CreateImageTemplate
    extends Command<ImageTemplate>
{
    private ImageTemplateId id;

    private String displayName;

    private ModuleResourceKey descriptor;

    private RootDataSet config;

    public CreateImageTemplate templateId( final ImageTemplateId id )
    {
        this.id = id;
        return this;
    }

    public CreateImageTemplate displayName( final String displayName )
    {
        this.displayName = displayName;
        return this;
    }

    public CreateImageTemplate descriptor( final ModuleResourceKey descriptor )
    {
        this.descriptor = descriptor;
        return this;
    }

    public CreateImageTemplate config( final RootDataSet config )
    {
        this.config = config;
        return this;
    }

    @Override
    public void validate()
    {
    }
}
