interface ButtonConfig {
    name?:string;
    text:string;
    cls?:string;
    iconCls?:string;
    handler(event:Event):void;
}

module LiveEdit.ui.contextmenu.menuitem {

    // Uses
    var $ = $liveEdit;

    export class BaseMenuItem extends LiveEdit.ui.Base {
        constructor() {
            super();
        }

        createButton(config:ButtonConfig):JQuery {
            var name:string = config.name || '',
                text:string = config.text,
                cls:string = config.cls || '',
                iconCls:string = config.iconCls || '',
                html:string = '<div data-live-edit-ctx-menu-item-name="' + name + '" class="live-edit-menu-item ' + cls + '">';
            if (iconCls !== '') {
                html += '<span class="live-menu-item-icon ' + iconCls + '"></span>';
            }
            html += '<span class="live-edit-menu-item-text">' + text + '</span></div>';

            var button:JQuery = this.createHtmlFromString(html);
            if (config.handler) {
                button.on('click', (event) => config.handler.call(this, event));
            }
            return button;
        }
    }
}