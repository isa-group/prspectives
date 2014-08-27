package es.us.isa.prspectives.org;

import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.core.model.Model2XmlConverter;
import es.us.isa.prspectives.core.model.ModelsResource;
import es.us.isa.prspectives.core.model.metamodels.CommonMetamodel;
import es.us.isa.prspectives.core.model.metamodels.Metamodel;
import org.json.JSONObject;

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.Map;

/**
 * OrgMetamodel
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class OrgMetamodel extends CommonMetamodel implements Metamodel {

    public static final String ORG = "Organization";

    @Override
    public String getType() {
        return ORG;
    }

    @Override
    public Map<String, URI> createLinks(Model model, UriBuilder builder) {
        Map<String, URI> links = super.createLinks(model, builder);

        UriBuilder basic = builder.clone().path("{html}").fragment("{id}");
        links.put("editor", basic.build("organizational.html", "/" + model.getModelId()));

        return links;
    }

    @Override
    public Map<String, URI> createExports(Model model, UriBuilder builder) {
        Map<String, URI> exports = super.createExports(model, builder);

        UriBuilder base = builder.clone().path(ModelsResource.class);
        exports.put("JSON", base.clone().path(ModelsResource.class, "getModelJson").build(model.getModelId()));

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
