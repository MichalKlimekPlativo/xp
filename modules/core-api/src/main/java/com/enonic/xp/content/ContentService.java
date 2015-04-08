package com.enonic.xp.content;

import java.util.concurrent.CompletableFuture;

import com.google.common.annotations.Beta;
import com.google.common.io.ByteSource;

import com.enonic.xp.content.site.CreateSiteParams;
import com.enonic.xp.content.site.Site;
import com.enonic.xp.security.acl.AccessControlList;
import com.enonic.xp.util.BinaryReference;

@Beta
public interface ContentService
{
    Site create( CreateSiteParams params );

    Content create( CreateContentParams params );

    Content create( CreateMediaParams params );

    Content update( UpdateContentParams params );

    Content update( UpdateMediaParams params );

    Content rename( RenameContentParams params );

    String generateContentName( String displayName );

    Content delete( DeleteContentParams params );

    PushContentsResult push( PushContentParams params );

    Content duplicate( DuplicateContentParams params );

    Contents move( MoveContentParams params );

    Content sort( SortContentParams params );

    Content setChildOrder( SetContentChildOrderParams params );

    ReorderChildContentsResult reorderChildren( ReorderChildContentsParams params );

    CompletableFuture<Integer> applyPermissions( ApplyContentPermissionsParams params );

    Content getById( ContentId contentId );

    Site getNearestSite( ContentId contentId );

    Contents getByIds( GetContentByIdsParams params );

    Content getByPath( ContentPath path );

    AccessControlList getPermissionsByPath( ContentPath path );

    Contents getByPaths( ContentPaths paths );

    FindContentByParentResult findByParent( FindContentByParentParams params );

    FindContentByQueryResult find( FindContentByQueryParams params );

    CompareContentResult compare( CompareContentParams params );

    CompareContentResults compare( CompareContentsParams params );

    FindContentVersionsResult getVersions( FindContentVersionsParams params );

    GetActiveContentVersionsResult getActiveVersions( GetActiveContentVersionsParams params );

    ByteSource getBinary( ContentId contentId, BinaryReference binaryReference );

    AccessControlList getRootPermissions();

    boolean contentExists( ContentId contentId );

    boolean contentExists( ContentPath contentPath );

}
