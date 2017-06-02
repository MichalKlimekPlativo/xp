import {IssueDialog} from './IssueDialog';
import {CreateIssueRequest} from '../resource/CreateIssueRequest';
import {PublishRequest} from '../PublishRequest';
import LabelEl = api.dom.LabelEl;
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import DialogButton = api.ui.dialog.DialogButton;

export class CreateIssueDialog extends IssueDialog {

    private static INSTANCE: CreateIssueDialog;

    private itemsLabel: LabelEl;

    private cancelButton: DialogButton;

    protected constructor() {
        super('New Issue');

        this.getEl().addClass('create-issue-dialog');

        this.cancelButton = this.addCancelButtonToBottom('Back');

        this.publishProcessor.onLoadingStarted(() => {
            (<CreateIssueAction>this.actionButton.getAction()).updateLabel(0);
            this.loadMask.show();
        });

        this.publishProcessor.onLoadingFinished(() => {
            (<CreateIssueAction>this.actionButton.getAction()).updateLabel(this.countTotal());
            this.loadMask.hide();
            this.centerMyself();
        });

        this.itemsLabel = new LabelEl('Items that will be added to the issue:', this.getItemList());
        this.itemsLabel.insertBeforeEl(this.getItemList());

    }

    static get(): CreateIssueDialog {
        if (!CreateIssueDialog.INSTANCE) {
            CreateIssueDialog.INSTANCE = new CreateIssueDialog();
        }
        return CreateIssueDialog.INSTANCE;
    }

    public setItems(items: ContentSummaryAndCompareStatus[]): CreateIssueDialog {
        super.setItems(items);
        (<CreateIssueAction>this.actionButton.getAction()).updateLabel(this.countTotal());

        return this;
    }

    private doCreateIssue() {

        const valid = this.form.validate(true).isValid();

        this.displayValidationErrors(!valid);

        if (valid) {
            const createIssueRequest = new CreateIssueRequest()
                .setApprovers(this.form.getApprovers())
                .setPublishRequest(
                    PublishRequest.create()
                        .addExcludeIds(this.getExcludedIds())
                        .addPublishRequestItems(this.createPublishRequestItems())
                        .build()
                ).setDescription(this.form.getDescription()).setTitle(this.form.getTitle());

            createIssueRequest.sendAndParse().then((issue) => {
                this.close();
                this.reset();

                api.notify.showSuccess('New issue created successfully');
            }).catch((reason) => {
                if (reason && reason.message) {
                    api.notify.showError(reason.message);
                }
            });
        }
    }

    public lockPublishItems() {
        this.itemsLabel.show();

        super.lockPublishItems();
    }

    public unlockPublishItems() {
        this.itemsLabel.hide();
        super.unlockPublishItems();
    }

    protected initActions() {
        const createAction = new CreateIssueAction(this.countTotal());
        createAction.onExecuted(this.doCreateIssue.bind(this));
        this.actionButton = this.addAction(createAction, true);
    }

    public enableCancelButton() {
        this.addClass('cancel-enabled');
        this.cancelButton.setLabel('Cancel');
    }

    private disableCancelButton() {
        if (this.hasClass('cancel-enabled')) {
            this.removeClass('cancel-enabled');
            this.cancelButton.setLabel('Back');
        }
    }

    close() {
        super.close();
        this.disableCancelButton();
    }
}

export class CreateIssueAction extends api.ui.Action {

    constructor(itemCount: number) {
        super();
        this.updateLabel(itemCount);
        this.setIconClass('create-issue-action');
    }

    public updateLabel(count: number) {
        let label = 'Create Issue ';
        if (count) {
            label += '(' + count + ')';
        }
        this.setLabel(label);
    }
}