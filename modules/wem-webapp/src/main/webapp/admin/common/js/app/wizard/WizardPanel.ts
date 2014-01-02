module api.app.wizard {

    export interface WizardPanelParams {

        tabId:api.app.AppBarTabId;

        persistedItem:any;

        formIcon:FormIcon;

        mainToolbar:api.ui.toolbar.Toolbar;

        stepToolbar?:api.ui.toolbar.Toolbar;

        header:WizardHeader;

        actions:WizardActions<any>;

        livePanel?:api.ui.Panel;

        steps:api.app.wizard.WizardStep[];
    }

    export class WizardPanel<T> extends api.ui.Panel implements api.ui.Closeable, api.event.Observable, api.ui.ActionContainer {

        private tabId: api.app.AppBarTabId;

        private persistedItem: T;

        private mainToolbar: api.ui.toolbar.Toolbar;

        private stepToolbar: api.ui.toolbar.Toolbar;

        private actions: WizardActions<T>;

        private header: WizardHeader;

        private stepNavigator: WizardStepNavigator;

        private stepPanels: api.app.wizard.WizardStepDeckPanel;

        // TODO: @alb - Value is set to 'changed' by default to see SaveChangesBeforeCloseDialog behavior.
        private isChanged: boolean = true;

        private renderingNew: boolean;

        private previous: WizardStepNavigationArrow;

        private next: WizardStepNavigationArrow;

        private listeners: WizardPanelListener[] = [];

        private backPanel: api.ui.DeckPanel;

        private formPanel: api.ui.Panel;

        private lastFocusedElement: JQuery;

        private stepNavigatorAndToolbarContainer: api.dom.DivEl;

        constructor(params: WizardPanelParams, callback:Function) {
            super("WizardPanel");

            console.log("WizardPanel.constructor started");

            this.tabId = params.tabId;
            this.persistedItem = params.persistedItem;
            this.header = params.header;
            this.mainToolbar = params.mainToolbar;
            this.stepToolbar = params.stepToolbar;
            this.actions = params.actions;

            this.getEl().addClass("wizard-panel");
            this.backPanel = new api.ui.DeckPanel("WizardBackPanel");
            this.backPanel.addClass("wizard-back-panel");
            this.formPanel = new api.ui.Panel("FormPanel");
            this.formPanel.addClass("form-panel");

            this.backPanel.addPanel(this.formPanel);
            this.backPanel.showPanel(0);

            this.appendChild(this.mainToolbar);
            this.appendChild(this.backPanel);

            var aboveStepPanels = new api.dom.DivEl();
            this.formPanel.appendChild(aboveStepPanels);

            aboveStepPanels.appendChild(params.formIcon);

            aboveStepPanels.appendChild(this.header);

            this.stepNavigatorAndToolbarContainer = new api.dom.DivEl("WizardStepNavigatorAndToolbar", "wizard-step-navigator-and-toolbar");
            this.stepNavigator = new WizardStepNavigator();
            if (this.stepToolbar) {
                this.stepNavigatorAndToolbarContainer.appendChild(this.stepToolbar);
            }
            this.stepNavigatorAndToolbarContainer.appendChild(this.stepNavigator);
            aboveStepPanels.appendChild(this.stepNavigatorAndToolbarContainer);

            this.stepPanels = new WizardStepDeckPanel(this.stepNavigator);
            this.formPanel.appendChild(this.stepPanels);

            this.previous = new WizardStepNavigationArrow(WizardStepNavigationArrow.PREVIOUS, this.stepNavigator);
            this.next = new WizardStepNavigationArrow(WizardStepNavigationArrow.NEXT, this.stepNavigator);
            this.formPanel.appendChild(this.previous);
            this.formPanel.appendChild(this.next);

            if (params.livePanel) {
                this.backPanel.addPanel(params.livePanel);
            }

            this.setSteps(params.steps);

            if (this.persistedItem != null) {
                this.renderExisting(this.persistedItem, () => {
                    this.postRenderExisting(() => {
                        console.log("WizardPanel.constructor finished");
                        callback();
                    });
                });
            }
            else {
                this.preRenderNew(() => {
                    this.renderNew(() => {
                        this.postRenderNew( ()=> {
                            console.log("WizardPanel.constructor finished");
                            callback();
                        } );
                    });
                });
            }
        }

        initWizardPanel() {
            console.log("WizardPanel.initWizardPanel");
            this.giveInitialFocus();
        }

        giveInitialFocus() {
            console.log("WizardPanel.giveInitialFocus");
            this.header.giveFocus();

            this.startRememberFocus();
        }

        startRememberFocus() {
            jQuery(this.getHTMLElement()).on("focus", "*", (e) => {
                e.stopPropagation();
                this.lastFocusedElement = jQuery(e.target);
            });
        }

        onElementShown() {
            console.log("WizardPanel.onElementShown");
            if (this.lastFocusedElement) {
                console.log("Last focused element was remembered: ", this.lastFocusedElement);
                this.lastFocusedElement.focus();
            }
        }

        toggleFormPanel(toggle: boolean) {
            if (toggle) {
                this.backPanel.showPanel(0)
            } else {
                this.backPanel.showPanel(1)
            }
        }

        afterRender() {
            super.afterRender();
            this.stepPanels.afterRender();
            this.backPanel.afterRender();

            $('.form-panel').scroll(() => {
                var scrollTop = $('.form-panel').scrollTop();
                var wizardHeaderHeight = this.header.getEl().getHeightWithMargin() + this.header.getEl().getOffsetTop();
                if (scrollTop > wizardHeaderHeight) {
                    this.mainToolbar.removeClass("scrolling");
                    this.stepNavigatorAndToolbarContainer.addClass("scroll-stick");
                } else if (scrollTop < wizardHeaderHeight) {
                    this.mainToolbar.addClass("scrolling");
                    this.stepNavigatorAndToolbarContainer.removeClass("scroll-stick");
                }
                if (scrollTop == 0) {
                    this.mainToolbar.removeClass("scrolling");
                }
            });
        }

        addListener(listener: WizardPanelListener) {
            this.listeners.push(listener);
        }

        removeListener(listener: WizardPanelListener) {
            this.listeners = this.listeners.filter(function (curr) {
                return curr != listener;
            });
        }

        getTabId(): api.app.AppBarTabId {
            return this.tabId;
        }

        getHeader(): WizardHeader {
            return this.header;
        }

        getActions(): api.ui.Action[] {
            return this.mainToolbar.getActions();
        }

        private notifyClosed() {
            this.listeners.forEach((listener: WizardPanelListener) => {
                if (listener.onClosed) {
                    listener.onClosed(this);
                }
            });
        }

        preRenderNew(callback:Function) {
            // To be overridden by inheritors - if extra work is needed at end of renderNew
            callback();
        }

        renderNew(callback:Function) {
            console.log("WizardPanel.renderNew");

            this.renderingNew = true;
            //this.giveInitialFocus();
            this.actions.enableActionsForNew();
            callback();
        }

        postRenderNew(callback:Function) {
            // To be overridden by inheritors - if extra work is needed at end of renderNew
            callback();
        }

        isRenderingNew(): boolean {
            return this.renderingNew;
        }

        renderExisting(item: T, callback:Function) {
            console.log("WizardPanel.renderExisting");
            console.log("        - > setPersistedItem");
            this.renderingNew = false;
            this.setPersistedItem(item, () => {
                callback();
            });
        }

        postRenderExisting(callback:Function) {
            // To be overridden by inheritors - if extra work is needed at end of renderExisting
            callback();
        }

        setPersistedItem(item: T, callback:Function) {
            console.log("WizardPanel.setPersistedItem");

            this.persistedItem = item;
            this.actions.enableActionsForExisting(item);
            callback();
        }

        getPersistedItem(): T {
            return this.persistedItem;
        }

        isItemPersisted(): boolean {
            return this.persistedItem != null;
        }

        getIconUrl(): string {
            return null; // TODO:
        }

        private setSteps(steps: api.app.wizard.WizardStep[]) {

            steps.forEach((step: api.app.wizard.WizardStep, index: number) => {
                this.stepPanels.addNavigablePanelToBack(step.getTabBarItem(), step.getPanel());
                // Ensure first step is shown
                if (index == 0) {
                    this.stepPanels.showPanel(0);
                }
            });
        }

        close(checkCanClose: boolean = false) {

            if (checkCanClose) {
                if (this.canClose()) {
                    this.closing();
                }
            }
            else {
                this.closing();
            }
        }

        canClose(): boolean {

            if (this.hasUnsavedChanges()) {
                this.askUserForSaveChangesBeforeClosing();
                return false;
            }
            else {
                return true;
            }
        }

        closing() {
            this.notifyClosed();
        }

        /*
         * Override this method in specific wizard to do proper check.
         */
        hasUnsavedChanges(): boolean {
            return this.isChanged;
        }

        askUserForSaveChangesBeforeClosing() {
            new api.app.wizard.SaveBeforeCloseDialog(this).open();
        }

        saveChanges(callback: () => void) {

            if (this.isItemPersisted()) {
                this.updatePersistedItem(() => {
                    callback();
                });
            }
            else {
                this.persistNewItem(()=> {
                    callback();
                });
            }

            this.isChanged = false;
        }

        /*
         * Override this method in specific wizard to do actual persisting of new item.
         */
        persistNewItem(callback: (persistedItem:T) => void) {

        }

        /*
         * Override this method in specific wizard to do actual update of item.
         */
        updatePersistedItem(callback: (persistedItem:T) => void) {

        }
    }
}