package com.enonic.wem.repo.internal.elasticsearch.query.translator.builder;

import java.util.List;

import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;

import com.enonic.wem.repo.internal.elasticsearch.query.translator.QueryFieldNameResolver;
import com.enonic.wem.repo.internal.index.query.IndexQueryBuilderException;
import com.enonic.xp.query.expr.CompareExpr;
import com.enonic.xp.query.expr.ValueExpr;

public class InQueryBuilderFactory
    extends AbstractBuilderFactory
{
    public InQueryBuilderFactory( final QueryFieldNameResolver fieldNameResolver )
    {
        super( fieldNameResolver );
    }

    public QueryBuilder create( final CompareExpr compareExpr )
    {

        final String queryFieldName = this.fieldNameResolver.resolve( compareExpr.getField().getFieldPath() );

        final List<ValueExpr> values = compareExpr.getValues();

        if ( values == null || values.size() == 0 )
        {
            throw new IndexQueryBuilderException( "Cannot build empty 'IN' statements" );
        }

        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery();

        for ( ValueExpr value : values )
        {
            boolQuery.should( new TermQueryBuilderFactory( fieldNameResolver ).create( queryFieldName, value.getValue() ) );
        }

        return boolQuery;
    }

}