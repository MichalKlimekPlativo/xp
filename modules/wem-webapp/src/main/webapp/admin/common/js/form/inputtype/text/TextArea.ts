module api.form.inputtype.text {

    export class TextArea extends api.form.inputtype.support.BaseInputTypeView {

        private rows:number;
        private columns:number;

        constructor(config:api.form.inputtype.InputTypeViewConfig<TextAreaConfig>) {
            super("TextArea");
            this.rows = config.inputConfig.rows;
            this.columns = config.inputConfig.columns;
        }

        createInputOccurrenceElement(index:number, property:api.data.Property):api.dom.Element {

            var inputEl = new api.ui.TextArea(this.getInput().getName() + "-" + index);
            if (this.rows) {
                inputEl.setRows(this.rows);
            }
            if (this.columns) {
                inputEl.setColumns(this.columns);
            }
            if (property != null) {
                inputEl.setValue(property.getString());
            }
            return inputEl;
        }

        getValue(occurrence:api.dom.Element):api.data.Value {
            var inputEl = <api.ui.TextArea>occurrence;
            return new api.data.Value(inputEl.getValue(), api.data.ValueTypes.STRING);
        }

        valueBreaksRequiredContract(value:api.data.Value):boolean {
            // TODO:
            return false;
        }
    }

    api.form.input.InputTypeManager.register("TextArea", TextArea);
}