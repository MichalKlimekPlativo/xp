package com.enonic.xp.core.impl.app;

import java.net.URL;
import java.time.Instant;
import java.util.List;
import java.util.Set;

import org.osgi.framework.Bundle;
import org.osgi.framework.Constants;
import org.osgi.framework.Version;
import org.osgi.framework.VersionRange;

import com.enonic.xp.app.Application;
import com.enonic.xp.app.ApplicationKey;
import com.enonic.xp.core.impl.app.resolver.ApplicationUrlResolver;

import static com.enonic.xp.core.impl.app.ApplicationHelper.X_APPLICATION_URL;
import static com.enonic.xp.core.impl.app.ApplicationHelper.X_SYSTEM_VERSION;
import static com.enonic.xp.core.impl.app.ApplicationHelper.X_VENDOR_NAME;
import static com.enonic.xp.core.impl.app.ApplicationHelper.X_VENDOR_URL;

final class ApplicationImpl
    implements Application
{
    private final ApplicationKey key;

    private final VersionRange systemVersion;

    private final Bundle bundle;

    private final List<String> sourcePaths;

    private final ApplicationUrlResolver urlResolver;

    public ApplicationImpl( final Bundle bundle, final ApplicationUrlResolver urlResolver )
    {
        this.bundle = bundle;
        this.key = ApplicationKey.from( bundle );
        this.systemVersion = ApplicationHelper.parseVersionRange( getHeader( X_SYSTEM_VERSION, null ) );
        this.sourcePaths = ApplicationHelper.getSourcePaths( this.bundle );
        this.urlResolver = urlResolver;
    }

    @Override
    public ApplicationKey getKey()
    {
        return this.key;
    }

    @Override
    public Version getVersion()
    {
        return this.bundle.getVersion();
    }

    @Override
    public String getDisplayName()
    {
        return getHeader( Constants.BUNDLE_NAME, this.getKey().toString() );
    }

    @Override
    public String getSystemVersion()
    {
        return this.systemVersion != null ? this.systemVersion.toString() : null;
    }

    @Override
    public String getMaxSystemVersion()
    {
        return this.systemVersion != null ? this.systemVersion.getRight().toString() : null;
    }

    @Override
    public String getMinSystemVersion()
    {
        return this.systemVersion != null ? this.systemVersion.getLeft().toString() : null;
    }

    @Override
    public String getUrl()
    {
        return getHeader( X_APPLICATION_URL, null );
    }

    @Override
    public String getVendorName()
    {
        return getHeader( X_VENDOR_NAME, null );
    }

    @Override
    public String getVendorUrl()
    {
        return getHeader( X_VENDOR_URL, null );
    }

    @Override
    public Bundle getBundle()
    {
        return this.bundle;
    }

    @Override
    public ClassLoader getClassLoader()
    {
        return new BundleClassLoader( this.bundle );
    }

    @Override
    public Instant getModifiedTime()
    {
        return Instant.ofEpochMilli( this.bundle.getLastModified() );
    }

    @Override
    public boolean isStarted()
    {
        return this.bundle.getState() == Bundle.ACTIVE;
    }

    private String getHeader( final String name, final String defValue )
    {
        return ApplicationHelper.getHeader( this.bundle, name, defValue );
    }

    @Override
    public List<String> getSourcePaths()
    {
        return this.sourcePaths;
    }

    @Override
    public Set<String> getFiles()
    {
        return this.urlResolver.findFiles();
    }

    @Override
    public URL resolveFile( final String path )
    {
        return this.urlResolver.findUrl( path );
    }
}
