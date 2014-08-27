package es.us.isa.prspectives.core.model.metamodels;

import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.core.model.Model2XmlConverter;
import es.us.isa.prspectives.core.model.ModelsResource;

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * AbstractPerspective
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public abstract class AbstractPerspective implements Perspective {

    public abstract String getDescription();
    public abstract String getEditorUrl();

    @Override
    public Map<String, URI> createLinks(Model model, UriBuilder builder) {
        Map<String, URI> links = new HashMap<String, URI>();

        if (getEditorUrl() != null) {
            UriBuilder basic = builder.clone().path("{html}").fragment("{id}");
            links.put(getDescription(), basic.build(getEditorUrl(), "/" + model.getModelId()));
        }

        return links;
    }

    @Override
    public Map<String, URI> createExports(Model model, UriBuilder builder) {
        return null;
    }

    @Override
    public Map<String, URI> createModelLinks(Model model, UriBuilder builder) {
        Map<String, URI> modelLinks = new HashMap<String, URI>();

        modelLinks.put(getType(),
                builder.clone()
                        .path(ModelsResource.class)
                        .path(ModelsResource.class, "getPerspective")
                        .build(model.getModelId(), getType()));

        return modelLinks;
    }

    @Override
    public Model2XmlConverter getXmlConverter() {
        return null;
    }

}
