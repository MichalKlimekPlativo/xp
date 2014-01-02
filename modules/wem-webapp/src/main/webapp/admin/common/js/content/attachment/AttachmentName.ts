module api.content.attachment{

    export class AttachmentName {

        private fileName:string;

        constructor(fileName:string) {
            this.fileName = fileName;
        }

        toString():string {
            return this.fileName;
        }
    }
}
