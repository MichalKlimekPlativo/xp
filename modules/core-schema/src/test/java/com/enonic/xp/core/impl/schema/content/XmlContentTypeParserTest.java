package com.enonic.xp.core.impl.schema.content;

import org.junit.Before;
import org.junit.Test;

import com.google.common.base.Joiner;

import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.form.FormItem;
import com.enonic.xp.form.Input;
import com.enonic.xp.form.inputtype.InputTypeConfig;
import com.enonic.xp.form.inputtype.InputTypeName;
import com.enonic.xp.schema.content.ContentType;
import com.enonic.xp.schema.content.ContentTypeName;
import com.enonic.xp.xml.parser.XmlModelParserTest;

import static org.junit.Assert.*;

public class XmlContentTypeParserTest
    extends XmlModelParserTest
{
    private XmlContentTypeParser parser;

    private ContentType.Builder builder;

    @Before
    public void setup()
    {
        this.parser = new XmlContentTypeParser();
        this.parser.currentApplication( ApplicationKey.from( "myapplication" ) );

        this.builder = ContentType.create();
        this.builder.name( ContentTypeName.from( "myapplication:mytype" ) );
        this.parser.builder( this.builder );
    }

    @Test
    public void testParse()
        throws Exception
    {
        parse( this.parser, ".xml" );
        assertResult();
    }

    @Test
    public void testParse_noNs()
        throws Exception
    {
        parseRemoveNs( this.parser, ".xml" );
        assertResult();
    }

    private void assertResult()
        throws Exception
    {
        final ContentType result = this.builder.build();
        assertEquals( "myapplication:mytype", result.getName().toString() );
        assertEquals( "All the Base Types", result.getDisplayName() );
        assertEquals( "description", result.getDescription() );
        assertEquals( "$('firstName') + ' ' + $('lastName')", result.getContentDisplayNameScript() );
        assertEquals( "myapplication:content", result.getSuperType().toString() );
        assertEquals( "[myapplication:metadata]", result.getMetadata().toString() );
        assertEquals( false, result.isAbstract() );
        assertEquals( true, result.isFinal() );

        assertEquals( 2, result.form().size() );
        assertEquals( "[myapplication:metadata]", result.getMetadata().toString() );

        final FormItem item = result.form().getFormItem( "myDate" );
        assertNotNull( item );

        final Input input = (Input) item;
        assertEquals( InputTypeName.DATE.toString(), input.getInputType().getName() );

        final InputTypeConfig config = input.getInputTypeConfig();
        assertNotNull( config );

        assertEquals( "true", config.getValue( "timezone" ) );
        assertEquals( "myapp:test1,myapplication:test2", Joiner.on( "," ).join( config.getValues( "someContentType" ) ) );
        assertEquals( "myapp:test1,myapplication:test2", Joiner.on( "," ).join( config.getValues( "someMixinType" ) ) );
        assertEquals( "myapp:test1,myapplication:test2", Joiner.on( "," ).join( config.getValues( "someRelationshipType" ) ) );
    }
}
