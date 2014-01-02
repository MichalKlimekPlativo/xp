module api.schema.mixin {

    export class CreateMixinRequest extends MixinResourceRequest<api.schema.mixin.json.MixinJson> {

        private name:string;

        private config:string;

        private icon:api.icon.Icon;

        constructor() {
            super();
            super.setMethod( "POST" );
        }

        setName( name:string ):CreateMixinRequest {
            this.name = name;
            return this;
        }

        setConfig( config:string ):CreateMixinRequest {
            this.config = config;
            return this;
        }

        setIcon( value:api.icon.Icon ):CreateMixinRequest
        {
            this.icon = value;
            return this;
        }

        getParams():Object {
            return {
                name: this.name,
                config: this.config,
                icon: this.icon != null ? this.icon.toJson() : null
            };
        }

        getRequestPath():api.rest.Path {
            return api.rest.Path.fromParent( super.getResourcePath(), "create" );
        }

        sendAndParse(): JQueryPromise<Mixin> {

            var deferred = jQuery.Deferred<Mixin>();

            this.send().done((response: api.rest.JsonResponse<api.schema.mixin.json.MixinJson>) => {
                deferred.resolve(this.fromJsonToMixin(response.getResult()));
            }).fail((response: api.rest.RequestError) => {
                    deferred.reject(null);
                });

            return deferred;
        }

    }
}