package com.enonic.wem.api.data;


import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;

import org.junit.Test;

import com.enonic.wem.api.support.JsonTestHelper;
import com.enonic.wem.api.util.GeoPoint;

import static junit.framework.Assert.assertEquals;

public class DataJsonTest
{
    private JsonTestHelper jsonTestHelper;

    public DataJsonTest()
    {
        jsonTestHelper = new JsonTestHelper( this, true );
    }

    @Test
    public void deserialize_serialization_of_Property()
        throws IOException
    {
        PropertyJson propertyJson = new PropertyJson( Property.newString( "A", "1" ) );

        // serialize from object
        String expectedSerialization = jsonTestHelper.objectToString( propertyJson );

        System.out.println( expectedSerialization );

        // de-serialize
        DataJson parsedData = jsonTestHelper.objectMapper().readValue( expectedSerialization, DataJson.class );

        // serialize from json
        String serializationOfDeSerialization = jsonTestHelper.objectToString( parsedData );

        assertEquals( expectedSerialization, serializationOfDeSerialization );
    }

    @Test
    public void deserialize_serialization_of_DataSet()
        throws IOException
    {
        DataSet dataSet = new DataSet( "mySet" );
        dataSet.setProperty( "String", Value.newString( "a" ) );
        dataSet.setProperty( "Long", Value.newLong( 1 ) );
        dataSet.setProperty( "Double", Value.newDouble( 1.1 ) );
        dataSet.setProperty( "Instant", Value.newInstant( LocalDateTime.of( 2012, 12, 12, 12, 0, 0 ).toInstant( ZoneOffset.UTC ) ) );
        dataSet.setProperty( "LocalDate", Value.newLocalDate( LocalDate.of( 2012, 12, 12 ) ) );
        dataSet.setProperty( "LocalDateTime", Value.newLocalDateTime( LocalDateTime.of( 2012, 12, 12, 12, 0, 0 ) ) );
        dataSet.setProperty( "LocalTime", Value.newLocalTime( LocalTime.of( 12, 30 ) ) );
        dataSet.setProperty( "HtmlPart", Value.newHtmlPart( "<div></div>" ) );
        dataSet.setProperty( "GeoPoint", Value.newGeoPoint( GeoPoint.from( "1.1,-1.1" ) ) );
        DataSetJson dataSetJson = new DataSetJson( dataSet );

        // serialize from object
        String expectedSerialization = jsonTestHelper.objectToString( dataSetJson );

        System.out.println( expectedSerialization );

        // de-serialize
        DataJson parsedData = jsonTestHelper.objectMapper().readValue( expectedSerialization, DataJson.class );

        // serialize from json
        String serializationOfDeSerialization = jsonTestHelper.objectToString( parsedData );

        assertEquals( expectedSerialization, serializationOfDeSerialization );
    }

    @Test
    public void deserialize_serialization_of_RootDataSet()
        throws IOException
    {
        RootDataSet dataPropertyValue = new RootDataSet();
        dataPropertyValue.setProperty( "a", Value.newString( "1" ) );
        dataPropertyValue.setProperty( "b", Value.newString( "2" ) );
        RootDataSet rootDataSet = new RootDataSet();
        rootDataSet.setProperty( "mydata", Value.newData( dataPropertyValue ) );
        RootDataSetJson rootDataSetJson = new RootDataSetJson( rootDataSet );

        // serialize from object
        String expectedSerialization = jsonTestHelper.objectToString( rootDataSetJson );

        System.out.println( expectedSerialization );

        // de-serialize
        RootDataSetJson parsedData = jsonTestHelper.objectMapper().readValue( expectedSerialization, RootDataSetJson.class );

        // serialize from json
        String serializationOfDeSerialization = jsonTestHelper.objectToString( parsedData );

        assertEquals( expectedSerialization, serializationOfDeSerialization );
    }
}
