import "../../api.ts";
import {DeleteAction} from "../view/DeleteAction";
import {DependantItemsDialog} from "../dialog/DependantItemsDialog";
import {ContentDeleteDialogAction} from "./ContentDeleteDialogAction";
import {ConfirmContentDeleteDialog} from "./ConfirmContentDeleteDialog";

import ContentSummary = api.content.ContentSummary;
import CompareStatus = api.content.CompareStatus;
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;
import DialogButton = api.ui.dialog.DialogButton;
import ListBox = api.ui.selector.list.ListBox;

export class ContentDeleteDialog extends DependantItemsDialog {

    private instantDeleteCheckbox: api.ui.Checkbox;

    private yesCallback: (exclude?: CompareStatus[]) => void;

    private noCallback: () => void;

    private totalItemsToDelete: number;

    constructor() {
        super("Delete item",
            "Delete selected items and their children",
            "Other items that will be deleted");

        this.addClass("delete-dialog");

        this.getItemList().onItemsRemoved(this.onListItemsRemoved.bind(this));

        let deleteAction = new ContentDeleteDialogAction();
        this.addDeleteActionHandler(deleteAction);
        this.actionButton = this.addAction(deleteAction, true, true);

        this.addCancelButtonToBottom();

        this.instantDeleteCheckbox = new api.ui.Checkbox("Instantly delete published items");
        this.instantDeleteCheckbox.addClass('instant-delete-check');

        this.appendChild(this.instantDeleteCheckbox);
    }

    private onListItemsRemoved() {
        if (this.isIgnoreItemsChanged()) {
            return;
        }

        this.updateSubTitle();

        this.manageDescendants();
    }

    protected manageDescendants() {
        this.loadMask.show();
        this.actionButton.setEnabled(false);

        return this.loadDescendantIds().then(() => {
            this.loadDescendants(0, 20).
                then((descendants: ContentSummaryAndCompareStatus[]) => {
                    this.setDependantItems(descendants);

                    if (!this.isAnyOnline(this.getItemList().getItems())) {
                        this.verifyInstantDeleteVisibility(descendants);
                    }
                    this.countItemsToDeleteAndUpdateButtonCounter();
                    this.centerMyself();
                }).finally(() => {
                    this.loadMask.hide();
                    this.actionButton.setEnabled(true);
                });
        });
    }

    private verifyInstantDeleteVisibility(items: ContentSummaryAndCompareStatus[]) {
        if (this.isAnyOnline(items)) {
            this.instantDeleteCheckbox.show();
        } else {
            this.instantDeleteCheckbox.hide();
        }
    }

    setContentToDelete(contents: ContentSummaryAndCompareStatus[]): ContentDeleteDialog {
        this.setIgnoreItemsChanged(true);
        this.setListItems(contents);
        this.setIgnoreItemsChanged(false);
        this.updateSubTitle();

        this.verifyInstantDeleteVisibility(contents);

        this.instantDeleteCheckbox.setChecked(false, true);

        this.manageDescendants();

        return this;
    }

    setYesCallback(callback: () => void): ContentDeleteDialog {
        this.yesCallback = callback;
        return this;
    }

    setNoCallback(callback: () => void): ContentDeleteDialog {
        this.noCallback = callback;
        return this;
    }


    private addDeleteActionHandler(deleteAction: api.ui.Action) {
        deleteAction.onExecuted(() => {
            if (this.isAnySiteToBeDeleted()) {
                new ConfirmContentDeleteDialog({
                    totalItemsToDelete: this.totalItemsToDelete,
                    deleteRequest: this.createDeleteRequest(),
                    yesCallback: this.yesCallback
                }).open();
                this.close();
                return;
            }

            if (!!this.yesCallback) {
                this.instantDeleteCheckbox.isChecked() ? this.yesCallback([]) : this.yesCallback();
            }

            this.actionButton.setEnabled(false);
            this.showLoadingSpinner();

            this.createDeleteRequest().sendAndParse().then((result: api.content.DeleteContentResult) => {
                this.close();
                DeleteAction.showDeleteResult(result);
            }).catch((reason: any) => {
                if (reason && reason.message) {
                    api.notify.showError(reason.message);
                } else {
                    api.notify.showError('Content could not be deleted.');
                }
            }).finally(() => {
                this.actionButton.setEnabled(true);
                this.hideLoadingSpinner();
            }).done();
        });
    }

    private countItemsToDeleteAndUpdateButtonCounter() {
        this.actionButton.setLabel("Delete ");

        this.totalItemsToDelete = this.countTotal();
        this.updateButtonCount("Delete", this.totalItemsToDelete);
    }

    private createDeleteRequest(): api.content.DeleteContentRequest {
        var deleteRequest = new api.content.DeleteContentRequest();

        this.getItemList().getItems().forEach((item) => {
            deleteRequest.addContentPath(item.getContentSummary().getPath());
        });

        deleteRequest.setDeleteOnline(this.instantDeleteCheckbox.isChecked());

        return deleteRequest;
    }

    protected updateButtonCount(actionString: string, count:number) {
        super.updateButtonCount(actionString, count);
    }

    private doAnyHaveChildren(items: ContentSummaryAndCompareStatus[]): boolean {
        return items.some((item: ContentSummaryAndCompareStatus) => {
            return item.getContentSummary().hasChildren();
        });
    }

    private isAnyOnline(items: ContentSummaryAndCompareStatus[]): boolean {
        return items.some((item: ContentSummaryAndCompareStatus) => {
            return this.isStatusOnline(item.getCompareStatus());
        });
    }

    private isStatusOnline(status: CompareStatus): boolean {
        return status === CompareStatus.EQUAL ||
               status === CompareStatus.MOVED ||
               status === CompareStatus.NEWER ||
               status === CompareStatus.PENDING_DELETE;
    }

    private updateSubTitle() {
        var items = this.getItemList().getItems(),
            count = items.length;

        if (!this.doAnyHaveChildren(items)) {
            super.setSubTitle("");
        } else {
            super.setSubTitle(`Delete selected items and ${count > 1 ? 'their' : 'its'} child content`);
        }
    }


    private isAnySiteToBeDeleted(): boolean {
        var result = this.getItemList().getItems().some((item: ContentSummaryAndCompareStatus) => {
            return item.getContentSummary().isSite();
        });

        if (result) {
            return true;
        }

        var dependantList = this.getDependantList();
        if (dependantList.getItemCount() > 0) {
            return dependantList.getItems().some((descendant: ContentSummaryAndCompareStatus) => {
                return descendant.getContentSummary().isSite();
            });
        } else {
            return false;
        }
    }

}


