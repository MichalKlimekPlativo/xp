module LiveEdit.component.dragdropsort {

    // Uses
    var $ = $liveEdit;

    export class EmptyComponent {

        public static createEmptyComponentHtml(component:LiveEdit.component.Component):ComponentPlaceholder {
            var emptyComponent = new ComponentPlaceholder();
            emptyComponent.addClass("live-edit-empty-component");
            emptyComponent.getEl().setData('live-edit-empty-component', "true");
            emptyComponent.getEl().setData('data-live-edit-component', "empty");
            emptyComponent.getEl().setData('live-edit-type', component.getComponentType().getName());

            if (component.componentType.getName() == "image") {
                return new LiveEdit.component.ImagePlaceholder();
            } else {
                var emptyComponentIcon = new api.dom.DivEl();
                emptyComponentIcon.addClass(component.getComponentType().getIconCls() + ' live-edit-empty-component-icon');

                emptyComponent.appendChild(emptyComponentIcon);
            }

            return emptyComponent;
        }

        public static restoreEmptyComponent():ComponentPlaceholder {
            var currentComponent = LiveEdit.component.Selection.getSelectedComponent();
            if (currentComponent) {
                var emptyElement:JQuery = $(LiveEdit.component.dragdropsort.EmptyComponent.createEmptyComponentHtml(currentComponent).getHTMLElement());
                var emptyComponent = LiveEdit.component.dragdropsort.EmptyComponent.createEmptyComponentHtml(currentComponent);//new LiveEdit.component.Component(emptyElement);

                currentComponent.getElement().replaceWith(emptyComponent.getHTMLElement());
                emptyComponent.init();

                //$(window).trigger('sortableUpdate.liveEdit');

                LiveEdit.component.Selection.select(LiveEdit.component.Component.fromElement(emptyComponent));
                LiveEdit.component.Selection.handleSelect(emptyComponent.getHTMLElement());
                return emptyComponent;
            }
            return null;
        }

        public static loadComponent(componentKey:string, itemid:number, imageUrl?:string):void {
            var selectedComponent = LiveEdit.component.Selection.getSelectedComponent();

            if (!selectedComponent.isEmpty()) {
                return;
            }

            var componentUrl:string = '../../admin/live-edit/data/mock-component-' + componentKey + '.html';

            $.ajax({
                url: componentUrl,
                cache: false,
                beforeSend: () => {
                    LiveEdit.component.dragdropsort.EmptyComponent.appendLoadingSpinner(selectedComponent);
                },
                success: (responseHtml:string) => {
                    var newComponent = LiveEdit.component.dragdropsort.EmptyComponent.replaceEmptyComponent(selectedComponent, $(responseHtml));
                    newComponent.element.attr("data-itemid", itemid);

                    //TODO: HACKY!!
                    if (imageUrl) {
                        newComponent.element.find("img").attr("src", imageUrl);
                        newComponent.element.find("img").css("width", "100%");
                    }


                }
            });
        }

        private static replaceEmptyComponent(selectedComponent:LiveEdit.component.Component, responseHtml:JQuery):LiveEdit.component.Component {

            var emptyComponentEl:JQuery = selectedComponent.getElement();

            emptyComponentEl.replaceWith(responseHtml);
            var component = new LiveEdit.component.Component(responseHtml)
            LiveEdit.component.Selection.select(component);
            LiveEdit.component.Selection.handleSelect(component.getElement()[0]);

            $(window).trigger('sortableUpdate.liveEdit');

            // It seems like it is not possible to add new sortables (region in layout) to the existing sortable
            // So we have to create it again.
            // Ideally we should destroy the existing sortable first before creating.
            if (selectedComponent.getComponentType().getType() == LiveEdit.component.Type.LAYOUT) {
                LiveEdit.component.dragdropsort.DragDropSort.createJQueryUiSortable();
            }
            return component;

        }

        private static appendLoadingSpinner(emptyComponent:LiveEdit.component.Component):void {
            var element:JQuery = emptyComponent.getElement();
            element.children('.live-edit-empty-component-icon').addClass('live-edit-font-icon-spinner');
        }

    }
}
