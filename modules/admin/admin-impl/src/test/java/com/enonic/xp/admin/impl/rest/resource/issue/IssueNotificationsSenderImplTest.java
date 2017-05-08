package com.enonic.xp.admin.impl.rest.resource.issue;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.junit.Before;
import org.junit.Test;
import org.mockito.Mockito;

import com.enonic.xp.content.CompareContentsParams;
import com.enonic.xp.content.ContentId;
import com.enonic.xp.content.ContentService;
import com.enonic.xp.content.Contents;
import com.enonic.xp.content.GetContentByIdsParams;
import com.enonic.xp.issue.Issue;
import com.enonic.xp.issue.IssueId;
import com.enonic.xp.issue.PublishRequest;
import com.enonic.xp.issue.PublishRequestItem;
import com.enonic.xp.mail.MailService;
import com.enonic.xp.security.PrincipalKey;
import com.enonic.xp.security.PrincipalKeys;
import com.enonic.xp.security.SecurityService;
import com.enonic.xp.security.User;
import com.enonic.xp.security.UserStoreKey;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

public class IssueNotificationsSenderImplTest
{
    private MailService mailService;

    private SecurityService securityService;

    private ContentService contentService;

    private IssueNotificationsSenderImpl issueNotificationsSender;

    @Before
    public void setUp()
    {
        mailService = Mockito.mock( MailService.class );
        securityService = Mockito.mock( SecurityService.class );
        contentService = Mockito.mock( ContentService.class );
        issueNotificationsSender = new IssueNotificationsSenderImpl();

        issueNotificationsSender.setSecurityService( securityService );
        issueNotificationsSender.setMailService( mailService );
        issueNotificationsSender.setContentService( contentService );
    }

    @Test
    public void testNotifyIssueCreatedSingleApprover()
        throws InterruptedException
    {
        issueNotificationsSender.setMailService( mailService );
        final User creator = generateUser();
        final User approver = generateUser();
        final Issue issue = createIssue( creator.getKey(), PrincipalKeys.from( approver.getKey() ) );
        final Contents contents = Contents.empty();

        Mockito.when( securityService.getUser( issue.getCreator() ) ).thenReturn( Optional.of( creator ) );
        Mockito.when( securityService.getUser( issue.getApproverIds().first() ) ).thenReturn( Optional.of( approver ) );
        Mockito.when( contentService.getByIds( Mockito.any( GetContentByIdsParams.class ) ) ).thenReturn( contents );

        issueNotificationsSender.notifyIssueCreated( issue, "url" );

        Thread.sleep( 1000 ); // giving a chance to run threads that send mails

        verify( securityService, times( 2 ) ).getUser( Mockito.any() );
        verify( mailService, times( 1 ) ).send( Mockito.any() );
        verify( contentService, times( 1 ) ).getByIds( Mockito.any() );
        verify( contentService, times( 1 ) ).compare( Mockito.any( CompareContentsParams.class ) );
    }

    @Test
    public void testNotifyIssueCreatedMultipleApprovers()
        throws InterruptedException
    {
        final User creator = generateUser();
        final List<User> approvers = Arrays.asList( generateUser(), generateUser(), generateUser() );
        final PrincipalKeys approverIds =
            PrincipalKeys.from( approvers.stream().map( approver -> approver.getKey() ).collect( Collectors.toList() ) );
        final Issue issue = createIssue( creator.getKey(), approverIds );
        final Contents contents = Contents.empty();

        Mockito.when( securityService.getUser( issue.getCreator() ) ).thenReturn( Optional.of( creator ) );
        approvers.stream().forEach(
            approver -> Mockito.when( securityService.getUser( approver.getKey() ) ).thenReturn( Optional.of( approver ) ) );
        Mockito.when( contentService.getByIds( Mockito.any( GetContentByIdsParams.class ) ) ).thenReturn( contents );

        issueNotificationsSender.notifyIssueCreated( issue, "url" );

        Thread.sleep( 1000 ); // giving a chance to run threads that send mails

        verify( securityService, times( 4 ) ).getUser( Mockito.any() );
        verify( mailService, times( 1 ) ).send( Mockito.any() );
        verify( contentService, times( 1 ) ).getByIds( Mockito.any() );
        verify( contentService, times( 1 ) ).compare( Mockito.any( CompareContentsParams.class ) );
    }

    private Issue createIssue( final PrincipalKey creator, final PrincipalKeys approvers )
    {
        return Issue.create().id( IssueId.create() ).title( "title" ).description( "description" ).creator( creator ).addApproverIds(
            approvers ).setPublishRequest( PublishRequest.create().addExcludeId( ContentId.from( "exclude-id" ) ).addItem(
            PublishRequestItem.create().id( ContentId.from( "content-id" ) ).includeChildren( true ).build() ).build() ).build();
    }

    private User generateUser()
    {
        final String userId = UUID.randomUUID().toString();
        return User.create().key( PrincipalKey.ofUser( UserStoreKey.createDefault(), userId ) ).login( userId ).email(
            "kitamo@tut.by" ).build();
    }
}
