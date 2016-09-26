module api.form.optionset {

    import PropertySet = api.data.PropertySet;
    import PropertyArray = api.data.PropertyArray;
    import PropertyPath = api.data.PropertyPath;
    import ValueTypes = api.data.ValueTypes;
    import Value = api.data.Value;

    export interface FormOptionSetOccurrenceViewConfig {
        context: FormContext;

        formOptionSetOccurrence: FormOptionSetOccurrence;

        formOptionSet: FormOptionSet;

        parent: FormItemOccurrenceView;

        dataSet: PropertySet
    }

    export class FormOptionSetOccurrenceView extends FormItemOccurrenceView {

        private context: FormContext;

        private formOptionSetOccurrence: FormOptionSetOccurrence;

        private formOptionSet: FormOptionSet;

        private removeButton: api.dom.AEl;

        private label: FormOccurrenceDraggableLabel;

        private constructedWithData: boolean;

        private parent: FormItemOccurrenceView;

        private propertySet: PropertySet;

        private formItemLayer: FormItemLayer;

        private formItemViews: FormItemView[] = [];

        private formOptionSetOccurrencesContainer: api.dom.DivEl;

        private validityChangedListeners: {(event: RecordingValidityChangedEvent) : void}[] = [];

        private previousValidationRecording: ValidationRecording;

        constructor(config: FormOptionSetOccurrenceViewConfig) {
            super("form-option-set-occurrence-view", config.formOptionSetOccurrence);
            this.context = config.context;
            this.formOptionSetOccurrence = config.formOptionSetOccurrence;
            this.formOptionSet = config.formOptionSet;
            this.parent = config.parent;
            this.constructedWithData = config.dataSet != null;
            this.propertySet = config.dataSet;

            this.formItemLayer = new FormItemLayer(config.context);
        }

        getDataPath(): PropertyPath {

            return this.propertySet.getProperty().getPath();
        }

        public layout(validate: boolean = true): wemQ.Promise<void> {

            var deferred = wemQ.defer<void>();

            this.removeButton = new api.dom.AEl("remove-button");
            this.appendChild(this.removeButton);
            this.removeButton.onClicked((event: MouseEvent) => {
                this.notifyRemoveButtonClicked();
                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            this.label = new FormOccurrenceDraggableLabel(this.formOptionSet.getLabel(), this.formOptionSet.getOccurrences(),
                this.makeMultiselectionNote());
            this.appendChild(this.label);

            this.formOptionSetOccurrencesContainer = new api.dom.DivEl("form-option-set-occurrences-container");
            this.appendChild(this.formOptionSetOccurrencesContainer);

            this.ensureSelectionArrayExists(this.propertySet);

            var layoutPromise: wemQ.Promise<FormItemView[]> = this.formItemLayer.
                setFormItems(this.formOptionSet.getFormItems()).
                setParentElement(this.formOptionSetOccurrencesContainer).
                setParent(this).
                layout(this.propertySet, validate);

            layoutPromise.then((formItemViews: FormItemView[]) => {

                this.formItemViews = formItemViews;
                if (validate) {
                    this.validate(true);
                }

                this.formItemViews.forEach((formItemView: FormItemView) => {
                    formItemView.onValidityChanged((event: RecordingValidityChangedEvent) => {

                        if (!this.previousValidationRecording) {
                            return; // previousValidationRecording is initialized on validate() call which may not be triggered in some cases
                        }

                        var previousValidState = this.previousValidationRecording.isValid();
                        if (event.isValid()) {
                            this.previousValidationRecording.removeByPath(event.getOrigin(), false, event.isIncludeChildren());
                        } else {
                            this.previousValidationRecording.flatten(event.getRecording());
                        }

                        if (previousValidState != this.previousValidationRecording.isValid()) {
                            this.notifyValidityChanged(new RecordingValidityChangedEvent(this.previousValidationRecording,
                                this.resolveValidationRecordingPath()).setIncludeChildren(true));
                        }
                    });

                    (<FormOptionSetOptionView> formItemView).onSelectionChanged(() => {
                        if (!this.previousValidationRecording) {
                            return; // previousValidationRecording is initialized on validate() call which may not be triggered in some cases
                        }

                        var previousValidState = this.previousValidationRecording.isValid(),
                            multiselectionValidationRecording = this.validateMultiselection();
                        if (multiselectionValidationRecording.isValid()) {
                            this.previousValidationRecording.removeByPath(this.resolveValidationRecordingPath(), false);
                        } else {
                            this.previousValidationRecording.flatten(multiselectionValidationRecording);
                        }

                        if (previousValidState != this.previousValidationRecording.isValid()) {
                            this.notifyValidityChanged(new RecordingValidityChangedEvent(this.previousValidationRecording,
                                this.resolveValidationRecordingPath()).setIncludeChildren(true));
                        }
                    })
                });

                this.refresh();
                deferred.resolve(null);
            }).catch((reason: any) => {
                api.DefaultErrorHandler.handle(reason);
            }).done();

            return deferred.promise;
        }

        private makeMultiselectionNote(): string {
            var multiselection = this.formOptionSet.getMultiselection();
            if (multiselection.getMinimum() == 1 && multiselection.getMaximum() == 1) {
                return null;
            }

            if (multiselection.getMinimum() == 0 && multiselection.getMaximum() == 0) {
                return "(any)"
            }
            if (multiselection.getMinimum() > 0 && multiselection.getMaximum() == 0) {
                return "(at least " + multiselection.getMinimum() + ")";
            }
            if (multiselection.getMinimum() > 1 && multiselection.getMinimum() == multiselection.getMaximum()) {
                return "(pick " + multiselection.getMinimum() + ")";
            }
            if (multiselection.getMinimum() == 0 && multiselection.getMaximum() > 1) {
                return "(up to " + multiselection.getMaximum() + ")";
            }
            if (multiselection.getMinimum() > 0 && multiselection.getMaximum() > multiselection.getMinimum()) {
                return "(" + multiselection.getMinimum() + " to " + multiselection.getMaximum() + ")";
            }
            if (multiselection.getMinimum() == 0 && multiselection.getMaximum() == 1) {
                return "(0 or 1)";
            }
            return null;
        }

        public update(propertyArray: PropertyArray, unchangedOnly?: boolean): wemQ.Promise<void> {
            var set = propertyArray.getSet(this.formOptionSetOccurrence.getIndex());
            if (!set) {
                set = propertyArray.addSet();
            }
            this.propertySet = set;
            return this.formItemLayer.update(this.propertySet, unchangedOnly);
        }

        private ensureSelectionArrayExists(propertyArraySet: PropertySet) {
            var selectionPropertyArray = propertyArraySet.getPropertyArray(this.formOptionSet.getName() + "_selection");
            if (!selectionPropertyArray) {
                selectionPropertyArray = PropertyArray.create().
                    setType(ValueTypes.STRING).
                    setName(this.formOptionSet.getName() + "_selection").
                    setParent(propertyArraySet).
                    build();
                propertyArraySet.addPropertyArray(selectionPropertyArray);
                this.addDefaultSelectionToSelectionArray(selectionPropertyArray);
            }
        }

        private addDefaultSelectionToSelectionArray(selectionPropertyArray: PropertyArray) {
            this.formOptionSet.getOptions().forEach((option: FormOptionSetOption) => {
                if (option.isDefaultOption() && selectionPropertyArray.getSize() < this.formOptionSet.getMultiselection().getMaximum()) {
                    selectionPropertyArray.add(new Value(option.getName(), new api.data.ValueTypeString()))
                }
            });
        }

        getFormItemViews(): FormItemView[] {
            return this.formItemViews;
        }

        giveFocus() {
            var focusGiven = false;
            this.getFormItemViews().forEach((formItemView: FormItemView) => {
                if (!focusGiven && formItemView.giveFocus()) {
                    focusGiven = true;
                }
            });
            return focusGiven;
        }

        refresh() {

            if (!this.formOptionSetOccurrence.oneAndOnly()) {
                this.label.addClass("drag-control");
            } else {
                this.label.removeClass("drag-control");
            }

            this.removeButton.setVisible(this.formOptionSetOccurrence.isRemoveButtonRequired());
        }

        onEditContentRequest(listener: (content: api.content.ContentSummary) => void) {
            this.formItemViews.forEach((formItemView: FormItemView) => {
                formItemView.onEditContentRequest(listener);
            });
        }

        unEditContentRequest(listener: (content: api.content.ContentSummary) => void) {
            this.formItemViews.forEach((formItemView: FormItemView) => {
                formItemView.unEditContentRequest(listener);
            });
        }

        showContainer(show: boolean) {
            if (show) {
                this.formOptionSetOccurrencesContainer.show();
            } else {
                this.formOptionSetOccurrencesContainer.hide();
            }
        }

        private resolveValidationRecordingPath(): ValidationRecordingPath {
            return new ValidationRecordingPath(this.getDataPath(), null);
        }

        getLastValidationRecording(): ValidationRecording {
            return this.previousValidationRecording;
        }

        public displayValidationErrors(value: boolean) {
            this.formItemViews.forEach((view: FormItemView) => {
                view.displayValidationErrors(value);
            });
        }

        public setHighlightOnValidityChange(highlight: boolean) {
            this.formItemViews.forEach((view: FormItemView) => {
                view.setHighlightOnValidityChange(highlight);
            });
        }

        hasValidUserInput(): boolean {

            var result = true;
            this.formItemViews.forEach((formItemView: FormItemView) => {
                if (!formItemView.hasValidUserInput()) {
                    result = false;
                }
            });
            return result;
        }

        validate(silent: boolean = true): ValidationRecording {

            var allRecordings = new ValidationRecording();

            this.formItemViews.forEach((formItemView: FormItemView) => {
                var currRecording = formItemView.validate(silent);
                allRecordings.flatten(currRecording);
            });

            allRecordings.flatten(this.validateMultiselection());

            if (!silent) {
                if (allRecordings.validityChanged(this.previousValidationRecording)) {
                    this.notifyValidityChanged(new RecordingValidityChangedEvent(allRecordings, this.resolveValidationRecordingPath()));
                }
            }
            this.previousValidationRecording = allRecordings;
            return allRecordings;
        }

        private validateMultiselection(): ValidationRecording {
            var multiselectionRecording = new ValidationRecording(),
                validationRecordingPath = this.resolveValidationRecordingPath(),
                selectionPropertyArray = this.propertySet.getPropertyArray(this.formOptionSet.getName() + "_selection");

            if (selectionPropertyArray.getSize() < this.formOptionSet.getMultiselection().getMinimum()) {
                multiselectionRecording.breaksMinimumOccurrences(validationRecordingPath);
            }

            if (this.formOptionSet.getMultiselection().maximumBreached(selectionPropertyArray.getSize())) {
                multiselectionRecording.breaksMaximumOccurrences(validationRecordingPath);
            }

            if (this.previousValidationRecording) {
                if (selectionPropertyArray.getSize() < this.formOptionSet.getMultiselection().getMinimum()) {
                    this.previousValidationRecording.breaksMinimumOccurrences(validationRecordingPath);
                } else {
                    this.previousValidationRecording.removeUnreachedMinimumOccurrencesByPath(validationRecordingPath, true);
                }

                if (this.formOptionSet.getMultiselection().maximumBreached(selectionPropertyArray.getSize())) {
                    this.previousValidationRecording.breaksMaximumOccurrences(validationRecordingPath);
                } else {
                    this.previousValidationRecording.removeBreachedMaximumOccurrencesByPath(validationRecordingPath, true);
                }
            }

            return multiselectionRecording;
        }

        onValidityChanged(listener: (event: RecordingValidityChangedEvent)=>void) {
            this.validityChangedListeners.push(listener);
        }

        unValidityChanged(listener: (event: RecordingValidityChangedEvent)=>void) {
            this.validityChangedListeners.filter((currentListener: (event: RecordingValidityChangedEvent)=>void) => {
                return listener == currentListener;
            });
        }

        private notifyValidityChanged(event: RecordingValidityChangedEvent) {
            this.validityChangedListeners.forEach((listener: (event: RecordingValidityChangedEvent)=>void) => {
                listener(event);
            });
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.formItemViews.forEach((formItemView) => {
                formItemView.onFocus(listener);
            });
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.formItemViews.forEach((formItemView) => {
                formItemView.unFocus(listener);
            });
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.formItemViews.forEach((formItemView) => {
                formItemView.onBlur(listener);
            });
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.formItemViews.forEach((formItemView) => {
                formItemView.unBlur(listener);
            });
        }
    }
}