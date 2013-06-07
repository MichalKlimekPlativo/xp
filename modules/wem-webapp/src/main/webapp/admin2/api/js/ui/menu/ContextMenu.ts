module api_ui_menu{

    export class ContextMenu extends api_ui.Component {
        private menuItems:MenuItem[] = [];

        constructor() {
            super("context-menu", "ul");
            this.getEl().addClass("context-menu");

            var htmlEl = this.getHTMLElement();
            document.body.insertBefore(htmlEl, document.body.childNodes[0]);

            document.addEventListener('click', (evt:Event) => {
                this.hideMenuOnOutsideClick(evt);
            });
        }

        addAction(action:api_action.Action) {
            var menuItem = this.createMenuItem(action);
            this.appendChild(menuItem);
        }

        private createMenuItem(action:api_action.Action):MenuItem {
            var menuItem = new MenuItem(action);
            menuItem.getEl().addEventListener('click', (evt:Event) => {
                this.hide();
            });
            this.menuItems.push(menuItem);
            return menuItem;
        }

        showAt(x:number, y:number) {
            this.getEl().
                setPosition('absolute').
                setZindex(20000).
                setLeft(x + 'px').
                setTop(y + 'px').
                setDisplay('block');
        }

        private hide() {
            this.getEl().setDisplay('none');
        }

        private hideMenuOnOutsideClick(evt:Event):void {
            var id = this.getId();
            var target:any = evt.target;
            for (var element = target; element; element = element.parentNode) {
                if (element.id === id) {
                    return; // menu clicked
                }
            }

            // click outside menu
            this.hide();
        }
    }

}
