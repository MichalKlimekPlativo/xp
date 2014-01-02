module api.data{

    export class DataId {

        private name:string;

        private arrayIndex:number;

        private refString:string;

        constructor(name:string, arrayIndex:number) {
            this.name = name;
            this.arrayIndex = arrayIndex;
            if (arrayIndex > 0) {
                this.refString = name + '[' + arrayIndex + ']';
            }
            else {
                this.refString = name;
            }
        }

        getName():string {
            return this.name;
        }

        getArrayIndex():number {
            return this.arrayIndex;
        }

        toString():string {
            return this.refString;
        }

        static from(str:string):DataId {
            var endsWithEndBracket:boolean = str.indexOf(']', str.length - ']'.length) !== -1;
            var containsStartBracket:boolean = str.indexOf('[') !== -1;

            if (endsWithEndBracket && containsStartBracket) {
                var firstBracketPos:number = str.indexOf('[');
                var nameStr:string = str.substring(0, firstBracketPos);
                var indexStr:string = str.substring(nameStr.length + 1, (str.length - 1));
                var index:number = parseInt(indexStr);
                return new DataId(nameStr, index)
            }
            else {
                return new DataId(str, 0);
            }
        }

    }

}