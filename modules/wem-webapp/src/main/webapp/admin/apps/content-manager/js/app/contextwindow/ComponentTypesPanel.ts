module app.contextwindow {
    export interface ComponentData {
        title:string;
        subtitle:string;
        iconUrl:string;
    }

    export class ComponentTypesPanel extends api.ui.Panel {
        private searchBox;
        private dataView:api.ui.grid.DataView<ComponentData>;
        private data:ComponentData[];
        private grid:ComponentGrid;
        private contextWindow:ContextWindow;

        constructor(contextWindow:ContextWindow) {
            super();
            this.addClass('component-types-panel');

            this.contextWindow = contextWindow;
            this.dataView = new api.ui.grid.DataView<ComponentData>();

            this.grid = new ComponentGrid(this.dataView, {draggableRows: true, rowClass: "comp"});

            this.searchBox = new api.ui.TextInput();
            this.searchBox.addClass("search");
            this.searchBox.setPlaceholder("Search");
            this.searchBox.getEl().addEventListener("keyup", (e) => {
                this.grid.updateFilter(this.searchBox.getValue());
            });

            this.appendChild(this.searchBox);
            this.appendChild(this.grid);
            this.getData();
        }

        afterRender() {
            this.initComponentDraggables();
        }

        setData(dataArray:ComponentData[]) {
            this.data = dataArray;
        }

        appendData(data:ComponentData) {
            this.data.push(data);
        }


        initComponentDraggables() {
            var components = jQuery('[data-context-window-draggable="true"]');

            components.liveDraggable({
                zIndex: 400000,
                cursorAt: {left: -10, top: -15},
                appendTo: 'body',
                cursor: 'move',
                revert: 'true',
                distance: 10,
                addClasses: false,
                helper: 'clone',
                scope: 'component',
                start: (event, ui) => {
                    this.onStartDrag(event, ui);
                },
                stop: () => {
                    this.contextWindow.show();
                }
            });

            jQuery(this.contextWindow.getLiveEditEl().getHTMLElement()).droppable({
                tolerance: 'pointer',
                addClasses: false,
                accept: '.comp',
                scope: 'component',
                over: (event, ui) => {
                    this.onDragOverIFrame(event, ui);
                }
            });

            this.contextWindow.getLiveEditJQuery()(this.contextWindow.getLiveEditWindow()).on('sortableUpdate.liveEdit sortableStop.liveEdit draggableStop.liveEdit',
                (event:JQueryEventObject) => {
                    jQuery('[data-context-window-draggable="true"]').simulate('mouseup');
                    this.contextWindow.show();
                });
        }

        onStartDrag(event, ui) {
            this.contextWindow.getDraggingMask().show();
        }

        onDragOverIFrame(event, ui) {
            var liveEditJQ = this.contextWindow.getLiveEditJQuery();

            this.contextWindow.getDraggingMask().hide();

            var clone = liveEditJQ(ui.draggable.clone());

            clone.css({
                'position': 'absolute',
                'z-index': '5100000',
                'top': '-1000px'
            });

            console.log(clone);
            liveEditJQ('body').append(clone);

            ui.helper.hide(null);

            this.contextWindow.getLiveEditWindow().LiveEdit.component.dragdropsort.DragDropSort.createJQueryUiDraggable(clone);

            clone.simulate('mousedown');

            this.contextWindow.hide();
        }

        private getData():void {
            jQuery.ajax({
                url: api.util.getAdminUri("apps/content-manager/js/data/context-window/mock-component-types.json"),
                success: (data:any, textStatus:string, jqXHR:JQueryXHR) => {
                    this.dataView.setItems(ComponentGrid.toSlickData(data));
                }
            });
        }
    }
}