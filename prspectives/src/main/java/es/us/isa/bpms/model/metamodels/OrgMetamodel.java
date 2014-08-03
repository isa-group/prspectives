package es.us.isa.bpms.model.metamodels;

import es.us.isa.bpms.editor.EditorResource;
import es.us.isa.bpms.model.Model2XmlConverter;
import es.us.isa.bpms.model.ModelsResource;
import org.json.JSONObject;

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * OrgMetamodel
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class OrgMetamodel implements Metamodel {

    public static final String ORG = "Organization";

    @Override
    public String getType() {
        return ORG;
    }

    @Override
    public Map<String, URI> createLinks(String modelId, UriBuilder builder) {
        Map<String, URI> links = new HashMap<String, URI>();

        UriBuilder basic = builder.clone().path("{html}").fragment("{id}");

        links.put("editor", basic.build("organizational.html", "/" + modelId));

        return links;
    }

    @Override
    public Map<String, URI> createExports(String modelId, UriBuilder builder) {
        Map<String, URI> exports = new HashMap<String, URI>();

        UriBuilder base = builder.clone().path(ModelsResource.class);

        exports.put("JSON", base.clone().path(ModelsResource.class, "getModelJson").build(modelId));

        return exports;
    }

    @Override
    public JSONObject createEmptyModel() {
        return new JSONObject();
    }

    @Override
    public Model2XmlConverter getXmlConverter() {
        return null;
    }
}
