module api.dom {

    export class DivEl extends Element {

        constructor(idPrefix?:string, className?:string) {
            super("div", idPrefix, className);
        }
    }
}
