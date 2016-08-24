module api.content.form.inputtype.contentselector {

    import PropertyArray = api.data.PropertyArray;
    import Property = api.data.Property;
    import Value = api.data.Value;
    import ValueType = api.data.ValueType;
    import ValueTypes = api.data.ValueTypes;
    import SelectedOption = api.ui.selector.combobox.SelectedOption;
    import OptionSelectedEvent = api.ui.selector.OptionSelectedEvent;
    import SelectedOptionEvent = api.ui.selector.combobox.SelectedOptionEvent;
    import FocusSwitchEvent = api.ui.FocusSwitchEvent;
    import ComboBoxOption = api.form.inputtype.combobox.ComboBoxOption;
    import ComboBoxDisplayValueViewer = api.form.inputtype.combobox.ComboBoxDisplayValueViewer;
    import Dropdown = api.ui.selector.dropdown.Dropdown;
    import Viewer = api.ui.Viewer;
    import NamesAndIconViewer = api.ui.NamesAndIconViewer;
    import JsonRequest = api.rest.JsonRequest;
    import StringHelper = api.util.StringHelper;
    import UriHelper = api.util.UriHelper;
    import Path = api.rest.Path;
    import JsonResponse = api.rest.JsonResponse;
    import ContentInputTypeViewContext = api.content.form.inputtype.ContentInputTypeViewContext;
    import ElementBuilder = api.dom.ElementBuilder;
    import NewElementBuilder = api.dom.NewElementBuilder;
    import RichComboBox = api.ui.selector.combobox.RichComboBox;

    export class CustomSelector extends api.form.inputtype.support.BaseInputTypeManagingAdd<CustomSelectorItem> {

        public static debug: boolean = false;

        private static portalUrl: string = UriHelper.getPortalUri('/edit/draft{0}/_/service/{1}');

        private requestPath: string;

        private context: ContentInputTypeViewContext;

        private comboBox: RichComboBox<CustomSelectorItem>;

        constructor(context: api.content.form.inputtype.ContentInputTypeViewContext) {
            super('custom-selector');

            if (CustomSelector.debug) {
                console.debug("CustomSelector: config", context.inputConfig);
            }

            this.context = context;
            this.readConfig(context);
        }

        private readConfig(context: ContentInputTypeViewContext): void {
            let serviceUrl = context.inputConfig['service'][0]['value'],
                contentPath = context.contentPath.toString();

            this.requestPath = StringHelper.format(CustomSelector.portalUrl, contentPath, serviceUrl);
        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return ValueTypes.STRING.newNullValue();
        }

        layout(input: api.form.Input, propertyArray: PropertyArray): wemQ.Promise<void> {
            if (!ValueTypes.STRING.equals(propertyArray.getType())) {
                propertyArray.convertValues(ValueTypes.STRING);
            }
            super.layout(input, propertyArray);

            this.comboBox = this.createComboBox(input, propertyArray);

            this.appendChild(this.comboBox);

            this.setLayoutInProgress(false);

            return wemQ<void>(null);
        }

        update(propertyArray: api.data.PropertyArray, unchangedOnly?: boolean): Q.Promise<void> {
            var superPromise = super.update(propertyArray, unchangedOnly);

            if (!unchangedOnly || !this.comboBox.isDirty()) {
                return superPromise.then(() => {
                    this.comboBox.setValue(this.getValueFromPropertyArray(propertyArray));
                });
            } else {
                return superPromise;
            }
        }

        createComboBox(input: api.form.Input, propertyArray: PropertyArray): RichComboBox<CustomSelectorItem> {

            var comboBox = new CustomSelectorComboBox(input, this.requestPath, this.getValueFromPropertyArray(propertyArray));
            /*
             comboBox.onOptionFilterInputValueChanged((event: api.ui.selector.OptionFilterInputValueChangedEvent<string>) => {
             comboBox.setFilterArgs({searchString: event.getNewValue()});
             });
             */
            comboBox.onOptionSelected((event: SelectedOptionEvent<CustomSelectorItem>) => {
                this.ignorePropertyChange = true;

                const option = event.getSelectedOption();
                var value = new Value(String(option.getOption().value), ValueTypes.STRING);
                if (option.getIndex() >= 0) {
                    this.getPropertyArray().set(option.getIndex(), value);
                } else {
                    this.getPropertyArray().add(value);
                }

                this.ignorePropertyChange = false;
                this.validate(false);

                this.fireFocusSwitchEvent(event);
            });
            comboBox.onOptionDeselected((event: SelectedOptionEvent<CustomSelectorItem>) => {
                this.ignorePropertyChange = true;

                this.getPropertyArray().remove(event.getSelectedOption().getIndex());

                this.ignorePropertyChange = false;
                this.validate(false);
            });

            return comboBox;
        }

        protected getNumberOfValids(): number {
            return this.comboBox.countSelected();
        }

        giveFocus(): boolean {
            if (this.comboBox.maximumOccurrencesReached()) {
                return false;
            }
            return this.comboBox.giveFocus();
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.comboBox.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.comboBox.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.comboBox.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.comboBox.unBlur(listener);
        }
    }

    api.form.inputtype.InputTypeManager.register(new api.Class("CustomSelector", CustomSelector));
}