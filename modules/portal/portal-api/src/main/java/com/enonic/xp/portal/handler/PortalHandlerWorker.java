package com.enonic.xp.portal.handler;

import com.google.common.net.HttpHeaders;

import com.enonic.xp.portal.PortalResponse;
import com.enonic.xp.web.WebException;
import com.enonic.xp.web.WebRequest;

public abstract class PortalHandlerWorker<WebRequestType extends WebRequest>
{
    protected WebRequestType request;

    protected PortalResponse.Builder response;

    public PortalHandlerWorker( final WebRequestType request, final PortalResponse.Builder response )
    {
        this.request = request;
        this.response = response;
    }

    public abstract PortalResponse execute()
        throws Exception;

    protected final WebException notFound( final String message, final Object... args )
    {
        return WebException.notFound( String.format( message, args ) );
    }

    protected final WebException forbidden( final String message, final Object... args )
    {
        return WebException.forbidden( String.format( message, args ) );
    }

    protected void setResponseCacheable( final boolean isPublic )
    {
        final String cacheControlValue = ( isPublic ? "public" : "private" ) + ", max-age=31536000";
        this.response.header( HttpHeaders.CACHE_CONTROL, cacheControlValue );
    }
}
