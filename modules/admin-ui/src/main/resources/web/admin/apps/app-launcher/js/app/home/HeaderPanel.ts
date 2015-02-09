module app.home {

    import TabMenuItemBuilder = api.ui.tab.TabMenuItemBuilder;

    export class HeaderPanel extends api.dom.DivEl {

        private installationHeader: api.dom.H1El;

        private returnButton: api.dom.DivEl;

        private returnAction: api.ui.Action;

        private userIcon: api.dom.ImgEl;

        private logonMenu: api.ui.tab.TabMenu;

        constructor() {
            super('header-panel');

            this.installationHeader = new api.dom.H1El("installation-header");

            this.returnButton = new api.dom.DivEl('return-button');
            this.returnButton.onClicked(() => {
                this.returnAction.execute()
            });
            this.returnButton.hide();

            this.logonMenu = new api.ui.tab.TabMenu("tab-menu-logon");
            this.logonMenu.hide();
            var logoutMenuItem = (<TabMenuItemBuilder>new TabMenuItemBuilder().setLabel("Log out")).build();
            logoutMenuItem.onClicked(() => {
                new LogOutEvent().fire()
            });
            this.logonMenu.addNavigationItem(logoutMenuItem);
            this.logonMenu.onBlur((event) => {
                console.log(event);
                this.logonMenu.hide();
            });

            var hrefWrapperForTabmenu = new api.dom.AEl("tab-menu-logon-wrapper"); // to get onblur event
            hrefWrapperForTabmenu.appendChild(this.logonMenu);
            hrefWrapperForTabmenu.onBlur(() => {
                this.logonMenu.hideMenu();
            })

            this.appendChild(this.installationHeader);
            this.appendChild(this.returnButton);
            this.appendChild(hrefWrapperForTabmenu);

            app.home.LogInEvent.on((event) => {
                this.logonMenu.setButtonLabel(event.getUser().getDisplayName());
                this.logonMenu.show();
                //TODO: init icon for user
            });

            app.home.LogOutEvent.on((event) => {
                this.logonMenu.hide();
            });

            new api.system.StatusRequest().send().done((response: api.rest.JsonResponse<api.system.StatusJson>) => {
                var installationText = response.getResult().installation ? response.getResult().installation : "Enonic experience platform";
                this.installationHeader.setHtml(installationText);
            });

        }

        enableReturnButton() {
            this.returnButton.show();
        }

        disableReturnButton() {
            this.returnButton.hide();
        }


        setReturnAction(action: api.ui.Action) {
            this.returnAction = action;
        }


    }

}
