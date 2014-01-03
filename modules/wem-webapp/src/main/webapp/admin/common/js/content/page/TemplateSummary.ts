module api.content.page {

    export class TemplateSummary<KEY extends TemplateKey,NAME extends TemplateName> {

        private key: KEY;

        private name: NAME;

        private displayName: string;

        private descriptorKey: api.module.ModuleResourceKey;

        constructor(builder: TemplateSummaryBuilder<KEY,NAME>) {
            this.key = builder.key;
            this.name = builder.name;
            this.displayName = builder.displayName;
            this.descriptorKey = builder.descriptorKey;
        }

        getKey(): KEY {
            return this.key;
        }

        getName(): NAME {
            return this.name;
        }

        getDisplayName(): string {
            return this.displayName;
        }

        getDescriptorKey(): api.module.ModuleResourceKey {
            return this.descriptorKey;
        }
    }

    export class TemplateSummaryBuilder<KEY extends TemplateKey,NAME extends TemplateName> {

        key: KEY;

        name: NAME;

        displayName: string;

        descriptorKey: api.module.ModuleResourceKey;

        public setKey(value: KEY): TemplateSummaryBuilder<KEY,NAME> {
            this.key = value;
            return this;
        }

        public setName(value: NAME): TemplateSummaryBuilder<KEY,NAME> {
            this.name = value;
            return this;
        }

        public setDisplayName(value: string): TemplateSummaryBuilder<KEY,NAME> {
            this.displayName = value;
            return this;
        }

        public setDescriptorKey(value: api.module.ModuleResourceKey): TemplateSummaryBuilder<KEY,NAME> {
            this.descriptorKey = value;
            return this;
        }

    }
}