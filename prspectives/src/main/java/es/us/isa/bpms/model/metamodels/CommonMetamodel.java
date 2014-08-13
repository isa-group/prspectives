package es.us.isa.bpms.model.metamodels;

import es.us.isa.bpms.model.Model;
import es.us.isa.bpms.model.ModelsResource;

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * CommonMetamodel
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public abstract class CommonMetamodel implements Metamodel {
    @Override
    public Map<String, URI> createModelLinks(Model model, UriBuilder builder) {
        Map<String, URI> modelLinks = new HashMap<String, URI>();

        modelLinks.put("model", builder.clone().path(ModelsResource.class).path(ModelsResource.class, "getModelJson").build(model.getModelId()));

        return modelLinks;
    }
}
