module api.dom {

    export class UlEl extends Element {

        constructor(idPrefix?:string, className?:string) {
            super("ul", idPrefix, className);
        }
    }
}
