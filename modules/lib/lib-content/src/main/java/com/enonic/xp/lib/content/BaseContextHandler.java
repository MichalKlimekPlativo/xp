package com.enonic.xp.lib.content;

import com.fasterxml.jackson.databind.JsonNode;

import com.enonic.xp.content.ContentService;
import com.enonic.xp.data.PropertyTree;
import com.enonic.xp.form.Form;
import com.enonic.xp.lib.common.FormJsonToPropertyTreeTranslator;
import com.enonic.xp.schema.content.ContentType;
import com.enonic.xp.schema.content.ContentTypeName;
import com.enonic.xp.schema.content.ContentTypeService;
import com.enonic.xp.schema.content.GetContentTypeParams;
import com.enonic.xp.schema.mixin.MixinService;
import com.enonic.xp.schema.xdata.XData;
import com.enonic.xp.schema.xdata.XDataName;
import com.enonic.xp.schema.xdata.XDataService;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;

public abstract class BaseContextHandler
    implements ScriptBean
{
    protected ContentService contentService;

    private ContentTypeService contentTypeService;

    private MixinService mixinService;

    private XDataService xDataService;

    public final Object execute()
    {
        return this.doExecute();
    }

    protected abstract Object doExecute();

    protected <T> T valueOrDefault( final T value, final T defValue )
    {
        return value == null ? defValue : value;
    }

    protected boolean strictDataValidation()
    {
        return true;
    }

    private boolean strictContentValidation( final ContentTypeName contentTypeName )
    {
        return ( !contentTypeName.isUnstructured() ) && strictDataValidation();
    }

    protected PropertyTree translateToPropertyTree( final JsonNode json, final ContentTypeName contentTypeName )
    {
        final ContentType contentType = this.contentTypeService.getByName( GetContentTypeParams.from( contentTypeName ) );

        if ( contentType == null )
        {
            throw new IllegalArgumentException( "Content type not found [" + contentTypeName + "]" );
        }

        return new FormJsonToPropertyTreeTranslator( inlineMixins( contentType.getForm() ),
                                                     strictContentValidation( contentTypeName ) ).translate( json );
    }

    protected PropertyTree translateToPropertyTree( final JsonNode json, final XDataName xDataName, final ContentTypeName contentTypeName )
    {
        final XData xData = this.xDataService.getByName( xDataName );

        if ( xData == null )
        {
            throw new IllegalArgumentException( "XData not found [" + xDataName + "]" );
        }

        return new FormJsonToPropertyTreeTranslator( inlineMixins( xData.getForm() ),
                                                     strictContentValidation( contentTypeName ) ).translate( json );
    }

    private Form inlineMixins( final Form form )
    {
        return this.mixinService.inlineFormItems( form );
    }

    @Override
    public void initialize( final BeanContext context )
    {
        this.contentService = context.getService( ContentService.class ).get();
        this.contentTypeService = context.getService( ContentTypeService.class ).get();
        this.mixinService = context.getService( MixinService.class ).get();
        this.xDataService = context.getService( XDataService.class ).get();
    }
}
