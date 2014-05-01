package com.enonic.wem.core.content.page;


import com.enonic.wem.api.content.page.ComponentName;
import com.enonic.wem.api.content.page.DescriptorKey;
import com.enonic.wem.api.content.page.PageComponent;
import com.enonic.wem.api.content.page.image.ImageComponent;
import com.enonic.wem.api.content.page.layout.LayoutComponent;
import com.enonic.wem.api.content.page.part.PartComponent;
import com.enonic.wem.api.data.DataSet;
import com.enonic.wem.api.data.Value;
import com.enonic.wem.api.support.serializer.AbstractDataSetSerializer;
import com.enonic.wem.core.content.page.image.ImageComponentDataSerializer;
import com.enonic.wem.core.content.page.layout.LayoutComponentDataSerializer;
import com.enonic.wem.core.content.page.part.PartComponentDataSerializer;

public abstract class PageComponentDataSerializer<TO_DATA_INPUT extends PageComponent, FROM_DATA_OUTPUT extends PageComponent>
    extends AbstractDataSetSerializer<TO_DATA_INPUT, FROM_DATA_OUTPUT>
{
    private static ImageComponentDataSerializer imageComponentSerializer = new ImageComponentDataSerializer();

    private static PartComponentDataSerializer partComponentSerializer = new PartComponentDataSerializer();

    private static LayoutComponentDataSerializer layoutComponentSerializer = new LayoutComponentDataSerializer();

    public abstract DataSet toData( final TO_DATA_INPUT component );

    public abstract FROM_DATA_OUTPUT fromData( final DataSet asData );

    protected void applyPageComponentToData( final PageComponent component, final DataSet asData )
    {
        asData.setProperty( "name", Value.newString( component.getName().toString() ) );
        if ( component.getDescriptor() != null )
        {
            asData.setProperty( "template", Value.newString( component.getDescriptor().toString() ) );
        }

        if ( component.hasConfig() )
        {
            asData.add( component.getConfig().toDataSet( "config" ) );
        }
    }

    protected void applyPageComponentFromData( final PageComponent.Builder component, final DataSet asData )
    {
        component.name( new ComponentName( asData.getProperty( "name" ).getString() ) );
        if ( asData.hasData( "template" ) )
        {
            component.descriptor( toDescriptorkey( asData.getProperty( "template" ).getString() ) );
        }
        if ( asData.hasData( "config" ) )
        {
            component.config( asData.getData( "config" ).toDataSet().toRootDataSet() );
        }
    }

    protected abstract DescriptorKey toDescriptorkey( final String s );

    public static PageComponentDataSerializer get( final DataSet dataSet )
    {
        if ( ImageComponent.class.getSimpleName().equals( dataSet.getName() ) )
        {
            return imageComponentSerializer;
        }
        else if ( PartComponent.class.getSimpleName().equals( dataSet.getName() ) )
        {
            return partComponentSerializer;
        }
        else if ( LayoutComponent.class.getSimpleName().equals( dataSet.getName() ) )
        {
            return layoutComponentSerializer;
        }
        else
        {
            throw new UnsupportedOperationException( "PageComponent not supported: " + dataSet.getName() );
        }
    }

    public static PageComponentDataSerializer get( final PageComponent component )
    {
        if ( component instanceof ImageComponent )
        {
            return imageComponentSerializer;
        }
        else if ( component instanceof PartComponent )
        {
            return partComponentSerializer;
        }
        else if ( component instanceof LayoutComponent )
        {
            return layoutComponentSerializer;
        }
        else
        {
            throw new UnsupportedOperationException( "PageComponent not supported: " + component.getClass().getSimpleName() );
        }
    }


}
