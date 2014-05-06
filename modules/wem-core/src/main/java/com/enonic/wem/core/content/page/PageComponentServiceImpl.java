package com.enonic.wem.core.content.page;

import javax.inject.Inject;

import com.enonic.wem.api.content.page.AbstractDescriptorBasedPageComponent;
import com.enonic.wem.api.content.page.ComponentName;
import com.enonic.wem.api.content.page.DescriptorKey;
import com.enonic.wem.api.content.page.PageComponentService;
import com.enonic.wem.api.content.page.image.ImageDescriptorService;
import com.enonic.wem.api.content.page.layout.LayoutDescriptorService;
import com.enonic.wem.api.content.page.part.PartDescriptorService;
import com.enonic.wem.api.module.ModuleKey;

public final class PageComponentServiceImpl
    implements PageComponentService
{

    @Inject
    protected PartDescriptorService partDescriptorService;

    @Inject
    protected ImageDescriptorService imageDescriptorService;

    @Inject
    protected LayoutDescriptorService layoutDescriptorService;

    @Override
    public AbstractDescriptorBasedPageComponent<? extends DescriptorKey> getByName( final ModuleKey module, final ComponentName name )
    {
        return new GetPageComponentByNameCommand().
            partDescriptorService( this.partDescriptorService ).
            imageDescriptorService( this.imageDescriptorService ).
            layoutDescriptorService( this.layoutDescriptorService ).
            module( module ).
            name( name ).
            execute();
    }
}
