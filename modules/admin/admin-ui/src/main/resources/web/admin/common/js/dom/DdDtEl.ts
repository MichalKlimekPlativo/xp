module api.dom {

    export class DdDtEl extends Element {

        constructor(tag: string, className?: string) {
            var builder = new NewElementBuilder();
            if (className) {
                builder.setClassName(className);
            }
            if (tag == "dt" || tag == "dd") {
                builder.setTagName(tag);
            }

            super(builder);
        }
    }
}
