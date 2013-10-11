package com.enonic.wem.api.content.page;


import com.enonic.wem.api.schema.content.form.Form;

public class PartDescriptor
    extends Descriptor
{
    ControllerSetup controller;

    /**
     * Only for display in PartTemplate.
     */
    Form templateConfig;

    /**
     * Only for display in Part.
     */
    Form config;

    /**
     * Only for display in Live Edit.
     */
    Form liveEditConfig;
}
