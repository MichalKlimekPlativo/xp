module app.wizard.page {

    import DescriptorKey = api.content.page.DescriptorKey;
    import PageTemplateKey = api.content.page.PageTemplateKey;
    import PageTemplate = api.content.page.PageTemplate;
    import Content = api.content.Content;
    import ContentId = api.content.ContentId;
    import ContentTypeName = api.schema.content.ContentTypeName;
    import ComponentPathRegionAndComponent = api.content.page.ComponentPathRegionAndComponent;
    import Page = api.content.page.Page;
    import PageBuilder = api.content.page.PageBuilder;
    import PageRegions = api.content.page.PageRegions;
    import PageRegionsBuilder = api.content.page.PageRegionsBuilder;
    import RegionBuilder = api.content.page.region.RegionBuilder;
    import RegionDescriptor = api.content.page.region.RegionDescriptor;
    import RegionPath = api.content.page.RegionPath;
    import RootDataSet = api.data.RootDataSet;

    import PageDescriptor = api.content.page.PageDescriptor;
    import Descriptor = api.content.page.Descriptor;
    import LayoutRegions = api.content.page.layout.LayoutRegions;
    import GetPageDescriptorByKeyRequest = api.content.page.GetPageDescriptorByKeyRequest;
    import LayoutDescriptorChangedEvent = app.wizard.page.contextwindow.inspect.LayoutDescriptorChangedEvent;

    import PageComponentBuilder = api.content.page.PageComponentBuilder;
    import ComponentName = api.content.page.ComponentName;
    import PageComponent = api.content.page.PageComponent;
    import PageComponentType = api.content.page.PageComponentType;
    import DescriptorBasedPageComponent = api.content.page.DescriptorBasedPageComponent;
    import DescriptorBasedPageComponentBuilder = api.content.page.DescriptorBasedPageComponentBuilder;
    import LayoutComponent = api.content.page.layout.LayoutComponent;
    import TextComponent = api.content.page.text.TextComponent;
    import PartComponent = api.content.page.part.PartComponent;
    import ImageComponent = api.content.page.image.ImageComponent;

    import GetPartDescriptorsByModulesRequest = api.content.page.part.GetPartDescriptorsByModulesRequest;
    import GetLayoutDescriptorsByModulesRequest = api.content.page.layout.GetLayoutDescriptorsByModulesRequest;

    import InspectionPanelConfig = app.wizard.page.contextwindow.inspect.InspectionPanelConfig;
    import InspectionPanel = app.wizard.page.contextwindow.inspect.InspectionPanel;
    import ContentInspectionPanel = app.wizard.page.contextwindow.inspect.ContentInspectionPanel;
    import PageInspectionPanel = app.wizard.page.contextwindow.inspect.PageInspectionPanel;
    import PageInspectionPanelConfig = app.wizard.page.contextwindow.inspect.PageInspectionPanelConfig;
    import RegionInspectionPanel = app.wizard.page.contextwindow.inspect.RegionInspectionPanel;
    import ImageInspectionPanel = app.wizard.page.contextwindow.inspect.ImageInspectionPanel;
    import ImageInspectionPanelConfig = app.wizard.page.contextwindow.inspect.ImageInspectionPanelConfig;
    import PartInspectionPanel = app.wizard.page.contextwindow.inspect.PartInspectionPanel;
    import PartInspectionPanelConfig = app.wizard.page.contextwindow.inspect.PartInspectionPanelConfig;
    import LayoutInspectionPanel = app.wizard.page.contextwindow.inspect.LayoutInspectionPanel;
    import LayoutInspectionPanelConfig = app.wizard.page.contextwindow.inspect.LayoutInspectionPanelConfig;
    import ContextWindow = app.wizard.page.contextwindow.ContextWindow;
    import ContextWindowConfig = app.wizard.page.contextwindow.ContextWindowConfig;
    import ContextWindowController = app.wizard.page.contextwindow.ContextWindowController;
    import EmulatorPanel = app.wizard.page.contextwindow.EmulatorPanel;
    import InsertablesPanel = app.wizard.page.contextwindow.insert.InsertablesPanel;
    import RenderingMode = api.rendering.RenderingMode;

    import ItemView = api.liveedit.ItemView;
    import PageView = api.liveedit.PageView;
    import RegionView = api.liveedit.RegionView;
    import PageComponentView = api.liveedit.PageComponentView;
    import ImageComponentView = api.liveedit.image.ImageComponentView;
    import PartComponentView = api.liveedit.part.PartComponentView;
    import LayoutComponentView = api.liveedit.layout.LayoutComponentView;
    import TextComponentView = api.liveedit.text.TextComponentView;
    import DraggingPageComponentViewStartedEvent = api.liveedit.DraggingPageComponentViewStartedEvent;
    import DraggingPageComponentViewCompletedEvent = api.liveedit.DraggingPageComponentViewCompletedEvent;
    import DraggingPageComponentViewCanceledEvent = api.liveedit.DraggingPageComponentViewCanceledEvent;
    import PageSelectEvent = api.liveedit.PageSelectEvent;
    import RegionSelectEvent = api.liveedit.RegionSelectEvent;
    import ImageComponentSetImageEvent = api.liveedit.image.ImageComponentSetImageEvent;
    import ItemViewSelectedEvent = api.liveedit.ItemViewSelectedEvent;
    import ItemViewDeselectEvent = api.liveedit.ItemViewDeselectEvent;
    import PageComponentAddedEvent = api.liveedit.PageComponentAddedEvent;
    import PageComponentRemoveEvent = api.liveedit.PageComponentRemoveEvent;
    import PageComponentResetEvent = api.liveedit.PageComponentResetEvent;
    import PageComponentSetDescriptorEvent = api.liveedit.PageComponentSetDescriptorEvent;
    import PageComponentDuplicateEvent = api.liveedit.PageComponentDuplicateEvent;

    import Panel = api.ui.panel.Panel;

    export interface LiveFormPanelConfig {

        site:Content;

        contentType:ContentTypeName;

        contentWizardPanel:ContentWizardPanel;

        defaultModels: DefaultModels;
    }

    export class LiveFormPanel extends api.ui.panel.Panel {

        private site: Content;

        private defaultModels: DefaultModels;

        private content: Content;
        private page: Page;
        private pageTemplate: PageTemplate;
        private pageDescriptor: PageDescriptor;

        private pageLoading: boolean;

        private pageSkipReload: boolean;
        private frameContainer: Panel;

        private contextWindow: ContextWindow;
        private contextWindowController: ContextWindowController;

        private emulatorPanel: EmulatorPanel;
        private insertablesPanel: InsertablesPanel;
        private inspectionPanel: InspectionPanel;
        private contentInspectionPanel: ContentInspectionPanel;
        private pageInspectionPanel: PageInspectionPanel;
        private regionInspectionPanel: RegionInspectionPanel;
        private imageInspectionPanel: ImageInspectionPanel;
        private partInspectionPanel: PartInspectionPanel;
        private layoutInspectionPanel: LayoutInspectionPanel;

        private contentWizardPanel: ContentWizardPanel;

        private liveEditPage: LiveEditPageProxy;

        constructor(config: LiveFormPanelConfig) {
            super("live-form-panel");
            this.contentWizardPanel = config.contentWizardPanel;
            this.site = config.site;
            this.defaultModels = config.defaultModels;

            this.pageLoading = false;
            this.pageSkipReload = false;

            this.liveEditPage = new LiveEditPageProxy(<LiveEditPageProxyConfig>{
                liveFormPanel: this,
                site: this.site
            });

            this.contentInspectionPanel = new ContentInspectionPanel();
            this.pageInspectionPanel = new PageInspectionPanel(<PageInspectionPanelConfig>{
                site: this.site,
                contentType: config.contentType
            });

            this.regionInspectionPanel = new RegionInspectionPanel();

            this.imageInspectionPanel = new ImageInspectionPanel(<ImageInspectionPanelConfig>{
            });

            this.partInspectionPanel = new PartInspectionPanel(<PartInspectionPanelConfig>{
                site: this.site
            });

            this.layoutInspectionPanel = new LayoutInspectionPanel(<LayoutInspectionPanelConfig>{
                site: this.site
            });

            this.layoutInspectionPanel.onLayoutDescriptorChanged((event: LayoutDescriptorChangedEvent) => {

                var layoutView = event.getLayoutComponentView();
                var command = new PageComponentSetDescriptorCommand().
                    setPageComponentView(layoutView).
                    setPageRegions(this.page.getRegions()).
                    setDescriptor(event.getDescriptor());
                command.execute();
                this.saveAndReloadOnlyPageComponent(layoutView);
            });

            this.inspectionPanel = new InspectionPanel(<InspectionPanelConfig>{
                contentInspectionPanel: this.contentInspectionPanel,
                pageInspectionPanel: this.pageInspectionPanel,
                regionInspectionPanel: this.regionInspectionPanel,
                imageInspectionPanel: this.imageInspectionPanel,
                partInspectionPanel: this.partInspectionPanel,
                layoutInspectionPanel: this.layoutInspectionPanel
            });

            this.emulatorPanel = new EmulatorPanel({
                liveEditPage: this.liveEditPage
            });

            this.insertablesPanel = new InsertablesPanel({
                liveEditPage: this.liveEditPage
            });

            this.frameContainer = new Panel("frame-container");
            this.appendChild(this.frameContainer);
            this.frameContainer.appendChild(this.liveEditPage.getIFrame());

            // append it here in order for the context window to be above
            this.appendChild(this.liveEditPage.getLoadMask());


            this.contextWindow = new ContextWindow(<ContextWindowConfig>{
                liveFormPanel: this,
                inspectionPanel: this.inspectionPanel,
                emulatorPanel: this.emulatorPanel,
                insertablesPanel: this.insertablesPanel
            });

            this.appendChild(this.contextWindow);

            this.contextWindowController = new app.wizard.page.contextwindow.ContextWindowController(this.contextWindow,
                this.contentWizardPanel.getContextWindowToggler());

            this.pageInspectionPanel.onPageControllerChanged((event: app.wizard.page.contextwindow.inspect.PageControllerChangedEvent) => {
                this.page.setController(event.getPageDescriptor().getKey());
                var regionsBuilder = new PageRegionsBuilder();
                event.getPageDescriptor().getRegions().forEach((regionDescriptor: RegionDescriptor) => {
                    regionsBuilder.addRegion(new RegionBuilder().
                        setName(regionDescriptor.getName()).
                        build());
                });
                this.page.setRegions(regionsBuilder.build());

                this.saveAndReloadPage();
            });

            this.pageInspectionPanel.onPageTemplateChanged((event: app.wizard.page.contextwindow.inspect.PageTemplateChangedEvent) => {

                this.pageTemplate = event.getPageTemplate();
                this.page.setTemplate(event.getPageTemplate() ? event.getPageTemplate().getKey() : null);

                if (this.pageTemplate) {

                    this.page.setRegions(this.resolvePageRegions(this.content, this.pageTemplate));
                    this.page.setConfig(this.resolvePageConfig(this.content, this.pageTemplate));
                    new GetPageDescriptorByKeyRequest(this.pageTemplate.getController()).sendAndParse().
                        then((pageDescriptor: PageDescriptor) => {
                            this.pageDescriptor = pageDescriptor;
                            this.pageInspectionPanel.setPage(this.content, this.pageDescriptor, this.page);
                            this.saveAndReloadPage();
                        }).catch((reason: any) => api.DefaultErrorHandler.handle(reason)).done();
                }
                else {
                    this.pageTemplate = null;
                    this.pageDescriptor = null;
                    this.page.setRegions(this.defaultModels.getPageTemplate().getRegions());
                    this.page.setConfig(this.defaultModels.getPageTemplate().getConfig());
                    this.pageInspectionPanel.setPage(this.content, null, this.page);

                    this.saveAndReloadPage();
                }
            });

            this.liveEditListen();
        }

        remove() {

            this.liveEditPage.remove();
            super.remove();
        }

        public getPage(): Page {

            var originalPage = null;
            if (this.content.isPage()) {
                originalPage = this.content.getPage();
            }
            else {
                if (this.defaultModels.hasPageTemplate()) {
                    originalPage = this.defaultModels.getPageTemplate().getPage();
                }
            }

            if (!this.content.isPage() && this.page.equals(originalPage)) {
                console.log("not a page and no page changes are made");
                return null; // Do not create page when not a page and no page changes are made
            }

            return this.page;
        }

        layout(content: Content, pageTemplate: PageTemplate) {

            api.util.assertNotNull(content, "content is required");

            this.content = content;
            this.pageTemplate = pageTemplate;

            if (!this.pageSkipReload) {

                if (!this.page) {
                    // Resolve page...
                    if (this.content.isPageTemplate()) {
                        if (this.content.isPage()) {
                            this.page = this.content.getPage();
                        }
                        else {
                            this.page = new PageBuilder().
                                setConfig(new RootDataSet()).
                                setRegions(new PageRegionsBuilder().build()).
                                build();
                        }
                    }
                    else if (!this.content.isPage()) {
                        if (this.defaultModels.hasPageTemplate()) {
                            this.page = this.defaultModels.getPageTemplate().getPage();
                            this.page.setController(null);
                            this.page.setTemplate(this.defaultModels.getPageTemplate().getKey());
                        }
                        else {
                            this.page = null;
                        }
                    }
                    else if (this.content.isPage()) {
                        this.page = this.content.getPage();
                    }
                    // Forward the resolved page to the LiveEditPageProxy
                    this.liveEditPage.setPage(this.page);
                }
            }
            this.loadPage();
        }

        loadPage() {
            if (this.pageSkipReload == false && !this.pageLoading) {

                this.loadPageDescriptor().then(() => {

                    this.contextWindow.showInspectionPanel(this.pageInspectionPanel);
                    this.pageInspectionPanel.setPage(this.content, this.pageDescriptor, this.page);

                    this.pageLoading = true;
                    this.liveEditPage.load(this.content);
                    this.liveEditPage.onLoaded(() => {
                        this.pageLoading = false;

                    });
                }).catch((reason: any) => api.DefaultErrorHandler.handle(reason)).done();
            }
        }

        private loadPageDescriptor(): wemQ.Promise<void> {

            var pageDescriptorKey: DescriptorKey = null;
            if (!this.page.getController() && this.pageTemplate) {
                pageDescriptorKey = this.pageTemplate.getController();
            }
            else if (!this.page.getController() && this.defaultModels.hasPageTemplate()) {
                pageDescriptorKey = this.defaultModels.getPageTemplate().getController();
            }
            else {
                pageDescriptorKey = this.page.getController();
            }

            if (!pageDescriptorKey) {
                var deferred = wemQ.defer<void>();
                deferred.resolve(null);
                return deferred.promise;
            }
            else {
                return new GetPageDescriptorByKeyRequest(pageDescriptorKey).sendAndParse().
                    then((pageDescriptor: PageDescriptor): void => {
                        this.pageDescriptor = pageDescriptor;
                    });
            }
        }

        private resolvePageRegions(content: Content, pageTemplate: PageTemplate): PageRegions {

            if (content.isPage() && content.getPage().hasRegions()) {
                return content.getPage().getRegions();
            }
            else {
                return pageTemplate.getRegions();
            }
        }

        private resolvePageConfig(content: Content, pageTemplate: PageTemplate): RootDataSet {

            if (content.isPage() && content.getPage().hasConfig()) {
                return content.getPage().getConfig();
            }
            else {
                return pageTemplate.getConfig();
            }
        }

        private initializePageFromDefault(): wemQ.Promise<void> {

            var skip = false;
            if (this.pageTemplate) {
                skip = true;
            }
            if (this.page.getController()) {
                skip = true;
            }

            if (skip) {
                var deferred = wemQ.defer<void>();
                deferred.resolve(null);
                return deferred.promise;
            }
            else {

                var defaultPageTemplate = this.defaultModels.getPageTemplate();

                return new GetPageDescriptorByKeyRequest(defaultPageTemplate.getController()).sendAndParse().
                    then((pageDescriptor: PageDescriptor): void => {

                        this.page.setTemplate(defaultPageTemplate.getKey());
                        this.page.setConfig(defaultPageTemplate.getConfig());
                        this.page.setRegions(defaultPageTemplate.getRegions());
                        this.pageDescriptor = pageDescriptor;

                        this.pageInspectionPanel.setPage(this.content, this.pageDescriptor, this.page);

                    });
            }
        }

        private saveAndReloadPage() {
            this.pageSkipReload = true;
            this.contentWizardPanel.saveChanges().
                then(() => {
                    this.pageSkipReload = false;
                    this.liveEditPage.load(this.content);
                }).
                catch((reason: any) => api.DefaultErrorHandler.handle(reason)).
                done();
        }

        private saveAndReloadOnlyPageComponent(pageComponentView: PageComponentView<PageComponent>) {

            api.util.assertNotNull(pageComponentView, "pageComponentView cannot be null");

            this.pageSkipReload = true;
            var componentUrl = api.rendering.UriHelper.getComponentUri(this.content.getContentId().toString(),
                pageComponentView.getComponentPath().toString(),
                RenderingMode.EDIT,
                api.content.Workspace.STAGE);

            this.contentWizardPanel.saveChanges().
                then(() => {
                    this.pageSkipReload = false;
                    pageComponentView.showLoadingSpinner();
                    return this.liveEditPage.loadComponent(pageComponentView, componentUrl);
                }).
                catch((errorMessage: string) => {
                    pageComponentView.hideLoadingSpinner();
                    pageComponentView.showRenderingError(componentUrl, errorMessage);
                }).done();
        }

        updateFrameContainerSize(contextWindowShown: boolean, contextWindowWidth?: number) {
            if (contextWindowShown && contextWindowWidth) {
                this.frameContainer.getEl().setWidth("calc(100% - " + (contextWindowWidth - 1) + "px)");
            } else {
                this.frameContainer.getEl().setWidth("100%");
            }
        }

        private liveEditListen() {

            this.liveEditPage.onPageSelected((event: PageSelectEvent) => {

                this.inspectPage(event.getPageView());
            });

            this.liveEditPage.onRegionSelected((event: RegionSelectEvent) => {

                this.inspectRegion(event.getRegionView());
            });

            this.liveEditPage.onPageComponentSelected((event: ItemViewSelectedEvent) => {

                var itemView = event.getItemView();

                if (itemView.isEmpty() || api.ObjectHelper.iFrameSafeInstanceOf(itemView, TextComponentView)) {
                    if (this.contextWindow.isFloating() && this.contextWindow.isShown()) {
                        this.contextWindow.slideOut();
                    }
                }
                else {
                    if (this.contextWindow.isFloating() && !this.contextWindow.isShown()) {
                        this.contextWindow.slideIn();
                    }
                }

                if (api.ObjectHelper.iFrameSafeInstanceOf(itemView, PageComponentView)) {
                    this.inspectPageComponent(<PageComponentView<PageComponent>>itemView);
                }
            });

            this.liveEditPage.onDeselect((event: ItemViewDeselectEvent) => {
                var toggler = this.contentWizardPanel.getContextWindowToggler();
                if (!toggler.isActive() && this.contextWindow.isShown()) {
                    this.contextWindow.slideOut();
                } else if (toggler.isActive() && !this.contextWindow.isShown()) {
                    this.contextWindow.slideIn();
                }
                this.contextWindow.clearSelection();
            });

            this.liveEditPage.onPageComponentRemoved((event: PageComponentRemoveEvent) => {

                var toggler = this.contentWizardPanel.getContextWindowToggler();
                if ((this.contextWindow.isFloating() || toggler.isActive()) && !this.contextWindow.isShown()) {
                    this.contextWindow.slideIn();
                }

                wemQ(!this.pageTemplate ? this.initializePageFromDefault() : null).
                    then(() => {
                        event.getPageComponentView().getPageComponent().removeFromParent();
                        this.contextWindow.clearSelection();
                    }).
                    catch((reason: any) => api.DefaultErrorHandler.handle(reason)).
                    done();

            });

            this.liveEditPage.onPageComponentReset((event: PageComponentResetEvent) => {

                wemQ(!this.pageTemplate ? this.initializePageFromDefault() : null).
                    then(() => {
                        var component: PageComponent = event.getComponentView().getPageComponent();
                        if (component) {
                            component.reset();
                        }
                    }).
                    catch((reason: any) => api.DefaultErrorHandler.handle(reason)).
                    done();
            });

            this.liveEditPage.onDraggingPageComponentViewStartedEvent((event: DraggingPageComponentViewStartedEvent) => {

                if (this.contextWindow.isFloating() && this.contextWindow.isShown()) {
                    this.contextWindow.slideOut();
                }
            });

            this.liveEditPage.onDraggingPageComponentViewCompleted((event: DraggingPageComponentViewCompletedEvent) => {

                var pageComponentView = event.getPageComponentView();
                if (!pageComponentView.isEmpty()) {
                    var toggler = this.contentWizardPanel.getContextWindowToggler();
                    if (this.contextWindow.isFloating() && !this.contextWindow.isShown() && toggler.isActive()) {
                        this.contextWindow.slideIn();
                    }
                    this.inspectPageComponent(pageComponentView);
                }
            });

            this.liveEditPage.onDraggingPageComponentViewCanceled((event: DraggingPageComponentViewCanceledEvent) => {
                var toggler = this.contentWizardPanel.getContextWindowToggler();
                if (this.contextWindow.isFloating() && !this.contextWindow.isShown() && toggler.isActive()) {
                    this.contextWindow.slideIn();
                }
            });

            this.liveEditPage.onPageComponentAdded((event: PageComponentAddedEvent) => {

                if (!this.pageTemplate) {
                    this.initializePageFromDefault().
                        catch((reason: any) => api.DefaultErrorHandler.handle(reason)).
                        done();
                }
            });

            this.liveEditPage.onImageComponentSetImage((event: ImageComponentSetImageEvent) => {

                var command = new ImageComponentSetImageCommand().
                    setDefaultModels(this.defaultModels).
                    setPageRegions(this.page.getRegions()).
                    setImage(event.getImageId()).
                    setPageComponentView(event.getImageComponentView()).
                    setImageName(event.getImageName());

                wemQ(!this.pageTemplate ? this.initializePageFromDefault() : null).
                    then(() => {
                        command.execute();
                        this.saveAndReloadOnlyPageComponent(event.getImageComponentView());
                    }).
                    catch((reason: any) => api.DefaultErrorHandler.handle(reason)).
                    done();
            });

            this.liveEditPage.onPageComponentSetDescriptor((event: PageComponentSetDescriptorEvent) => {

                var command = new PageComponentSetDescriptorCommand().
                    setPageComponentView(event.getPageComponentView()).
                    setPageRegions(this.page.getRegions()).
                    setDescriptor(event.getDescriptor());

                wemQ(!this.pageTemplate ? this.initializePageFromDefault() : null).
                    then(() => {
                        command.execute();
                        this.saveAndReloadOnlyPageComponent(event.getPageComponentView());
                    }).
                    catch((reason: any) => api.DefaultErrorHandler.handle(reason)).
                    done();
            });

            this.liveEditPage.onPageComponentDuplicated((event: PageComponentDuplicateEvent) => {

                this.saveAndReloadOnlyPageComponent(event.getDuplicatedPageComponentView());
            });

            this.insertablesPanel.onHideContextWindowRequest(() => {
                if (this.contextWindow.isFloating() && this.contextWindow.isShown()) {
                    this.contextWindow.slideOut();
                }
            });
        }

        private inspectContent(contentId: api.content.ContentId) {
            this.contextWindow.showInspectionPanel(this.contentInspectionPanel);
        }

        private inspectPage(pageView: PageView) {

            this.pageInspectionPanel.setPage(this.content, this.pageDescriptor, this.page);
            this.contextWindow.showInspectionPanel(this.pageInspectionPanel);
        }

        private inspectRegion(regionView: RegionView) {

            var region = regionView.getRegion();

            this.regionInspectionPanel.setRegion(region);
            this.contextWindow.showInspectionPanel(this.regionInspectionPanel);
        }

        private inspectPageComponent(pageComponentView: PageComponentView<PageComponent>) {
            api.util.assertNotNull(pageComponentView, "pageComponentView cannot be null");

            if (api.ObjectHelper.iFrameSafeInstanceOf(pageComponentView, ImageComponentView)) {
                this.imageInspectionPanel.setImageComponent(<ImageComponentView>pageComponentView);
                this.contextWindow.showInspectionPanel(this.imageInspectionPanel);
            }
            else if (api.ObjectHelper.iFrameSafeInstanceOf(pageComponentView, PartComponentView)) {
                this.partInspectionPanel.setPartComponent(<PartComponentView>pageComponentView);
                this.contextWindow.showInspectionPanel(this.partInspectionPanel);
            }
            else if (api.ObjectHelper.iFrameSafeInstanceOf(pageComponentView, LayoutComponentView)) {
                this.layoutInspectionPanel.setLayoutComponent(<LayoutComponentView>pageComponentView);
                this.contextWindow.showInspectionPanel(this.layoutInspectionPanel);
            }
            else if (api.ObjectHelper.iFrameSafeInstanceOf(pageComponentView, TextComponentView)) {

            }
            else {
                throw new Error("PageComponentView cannot be selected: " + api.util.getClassName(pageComponentView));
            }
        }
    }
}