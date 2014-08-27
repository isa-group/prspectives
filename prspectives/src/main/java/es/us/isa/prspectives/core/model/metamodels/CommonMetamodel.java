package es.us.isa.prspectives.core.model.metamodels;

import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.core.model.ModelsResource;

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.*;

/**
 * CommonMetamodel
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public abstract class CommonMetamodel implements Metamodel {

    protected final Map<String,Perspective> perspectives;

    public CommonMetamodel(Perspective... perspectives) {
        this.perspectives = new HashMap<String, Perspective>();
        for (Perspective p : perspectives) {
            this.perspectives.put(p.getType(), p);
        }
    }

    @Override
    public Map<String, URI> createModelLinks(Model model, UriBuilder builder) {
        Map<String, URI> modelLinks = new HashMap<String, URI>();

        modelLinks.put("model", builder.clone().path(ModelsResource.class).path(ModelsResource.class, "getModelJson").build(model.getModelId()));

        for (Perspective p : perspectives.values()) {
            Map<String, URI> pLinks = p.createModelLinks(model, builder);
            if (pLinks != null) {
                modelLinks.putAll(pLinks);
            }
        }

        return modelLinks;
    }

    @Override
    public Map<String, URI> createLinks(Model model, UriBuilder builder) {
        Map<String, URI> links = new HashMap<String, URI>();
        for (Perspective p : perspectives.values()) {
            Map<String, URI> pLinks = p.createLinks(model, builder);
            if (pLinks != null) {
                links.putAll(pLinks);
            }
        }
        return links;
    }

    @Override
    public Map<String, URI> createExports(Model model, UriBuilder builder) {
        Map<String, URI> exports = new HashMap<String, URI>();
        for (Perspective p : perspectives.values()) {
            Map<String, URI> pExports = p.createExports(model, builder);
            if (pExports != null) {
                exports.putAll(pExports);
            }
        }
        return exports;
    }

    @Override
    public Object createPerspectivesResource(Model m, String perspective) {
        return perspectives.get(perspective).createPerspectivesResource(m);
    }
}
