module app.wizard {

    export class DuplicateContentTypeAction extends api.ui.Action {

        constructor() {
            super("Duplicate");
            this.addExecutionListener(() => {
                // TODO
            });
        }
    }

    export class DeleteContentTypeAction extends api.ui.Action {

        constructor(wizardPanel:api.app.wizard.WizardPanel<api.schema.content.ContentType>) {
            super("Delete", "mod+del");
            this.addExecutionListener(() => {
                api.ui.dialog.ConfirmationDialog.get()
                    .setQuestion("Are you sure you want to delete this content type?")
                    .setNoCallback(null)
                    .setYesCallback(() => {
                        wizardPanel.close();
                        new api.schema.content.DeleteContentTypeRequest()
                            .addName(wizardPanel.getPersistedItem().getContentTypeName())
                            .send()
                            .done((jsonResponse:api.rest.JsonResponse<api.schema.SchemaDeleteJson>) => {
                                var json = jsonResponse.getResult();

                                if (json.successes && json.successes.length > 0) {
                                    var name = json.successes[0].name;
                                    var deletedContentType = wizardPanel.getPersistedItem();

                                    api.notify.showFeedback('Content [' + name + '] deleted!');
                                    new api.schema.SchemaDeletedEvent([deletedContentType]).fire();
                                }
                            });
                    }).open();
            });
        }
    }

    export class ContentTypeWizardActions implements api.app.wizard.WizardActions<api.schema.content.ContentType> {

        private save:api.ui.Action;

        private close:api.ui.Action;

        private delete:api.ui.Action;

        private duplicate:api.ui.Action;


        constructor(wizardPanel:api.app.wizard.WizardPanel<api.schema.content.ContentType>) {
            this.save = new api.app.wizard.SaveAction(wizardPanel);
            this.duplicate = new DuplicateContentTypeAction();
            this.delete = new DeleteContentTypeAction(wizardPanel);
            this.close = new api.app.wizard.CloseAction(wizardPanel);
        }

        enableActionsForNew() {
            this.save.setEnabled( true );
            this.duplicate.setEnabled( false );
            this.delete.setEnabled( false )
        }

        enableActionsForExisting(existing:api.schema.content.ContentType) {
            this.save.setEnabled( existing.isEditable() );
            this.duplicate.setEnabled( true );
            this.delete.setEnabled( existing.isDeletable() );
        }

        getDeleteAction() {
            return this.delete;
        }

        getSaveAction() {
            return this.save;
        }

        getDuplicateAction() {
            return this.duplicate;
        }

        getCloseAction() {
            return this.close;
        }

    }

}
