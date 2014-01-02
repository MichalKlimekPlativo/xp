module app.browse {

    export class BaseModuleBrowseAction extends api.ui.Action {

        constructor(label:string, shortcut?:string) {
            super(label, shortcut);
        }

    }

    export class ImportModuleAction extends api.ui.Action {

        constructor() {
            super("Import");
            this.addExecutionListener(() => {
                new ImportModuleEvent().fire();
            });
        }
    }

    export class ExportModuleAction extends BaseModuleBrowseAction {

        constructor() {
            super("Export");
            this.setEnabled(false);
            this.addExecutionListener(() => {
                new ExportModuleEvent().fire();
            });
        }
    }

    export class DeleteModuleAction extends BaseModuleBrowseAction {

        constructor() {
            super("Delete");
            this.setEnabled(false);
            this.addExecutionListener(() => {
                var moduleModel:api.module.ModuleSummary = api.module.ModuleSummary.fromExtModel(components.gridPanel.getSelection()[0]);
                new DeleteModulePromptEvent(moduleModel).fire();
            });
        }
    }

    export class ModuleBrowseActions {

        public IMPORT_MODULE:api.ui.Action;
        public EXPORT_MODULE:api.ui.Action;
        public DELETE_MODULE:api.ui.Action;

        private allActions:api.ui.Action[] = [];

        private static INSTANCE:ModuleBrowseActions;

        static init():ModuleBrowseActions {
            new ModuleBrowseActions();
            return ModuleBrowseActions.INSTANCE;
        }

        static get():ModuleBrowseActions {
            return ModuleBrowseActions.INSTANCE;
        }

        constructor() {

            this.IMPORT_MODULE = new ImportModuleAction();
            this.DELETE_MODULE = new DeleteModuleAction();
            this.EXPORT_MODULE = new ExportModuleAction();

            this.allActions.push(this.IMPORT_MODULE, this.DELETE_MODULE, this.EXPORT_MODULE);

            ModuleBrowseActions.INSTANCE = this;
        }

        getAllActions():api.ui.Action[] {
            return this.allActions;
        }

        updateActionsEnabledState(modules:any[]) {
            var modulesSelected = modules.length;
            this.IMPORT_MODULE.setEnabled( true );
            this.DELETE_MODULE.setEnabled( modulesSelected > 0 );
            this.EXPORT_MODULE.setEnabled( modulesSelected === 1 );
        }

    }
}