package es.us.isa.prspectives.bpmn;

import es.us.isa.prspectives.editor.EditorResource;
import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.core.model.Model2XmlConverter;
import es.us.isa.prspectives.core.model.ModelsResource;
import es.us.isa.prspectives.core.model.metamodels.CommonMetamodel;
import es.us.isa.prspectives.core.model.metamodels.Metamodel;
import es.us.isa.prspectives.core.model.metamodels.Perspective;
import org.json.JSONException;
import org.json.JSONObject;

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.Arrays;
import java.util.Map;

/**
 * BpmnMetamodel
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class BpmnMetamodel extends CommonMetamodel implements Metamodel {

    public static final String BPMN20 = "BPMN 2.0";

    private BPMNModel2XmlConverter converter;

    public BpmnMetamodel(BPMNModel2XmlConverter converter, Perspective... perspectives) {
        super(perspectives);
        this.converter = converter;
    }

    @Override
    public String getType() {
        return BPMN20;
    }

    @Override
    public Map<String, URI> createLinks(Model model, UriBuilder builder) {
        Map<String, URI> links = super.createLinks(model, builder);

        links.put("editor",
                builder.clone()
                        .path(EditorResource.class)
                        .queryParam("id", model.getModelId())
                        .build());

        return links;
    }

    @Override
    public Map<String, URI> createExports(Model model, UriBuilder builder) {
        Map<String, URI> exports = super.createExports(model, builder);

        String modelId = model.getModelId();
        UriBuilder base = builder.clone().path(ModelsResource.class);

        exports.put("XML", base.clone().path(ModelsResource.class, "getModelXml").build(modelId));
        exports.put("SVG", base.clone().path(ModelsResource.class, "getModelSvg").build(modelId));
        exports.put("PNG", base.clone().path(ModelsResource.class, "getModelPng").build(modelId));
        exports.put("PDF", base.clone().path(ModelsResource.class, "getModelPdf").build(modelId));

        return exports;
    }

    @Override
    public JSONObject createEmptyModel() {
        JSONObject jsonModel = new JSONObject();

        try {
            jsonModel.put("ssextensions", Arrays.asList("http://www.isa.us.es/ppiontology/stencilsets/extensions/bpmnppi#"));
            JSONObject stencilset = new JSONObject();
            stencilset.put("url", "../stencilsets/bpmn2.0/bpmn2.0.json");
            stencilset.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
            jsonModel.put("stencilset", stencilset);
            JSONObject stencil = new JSONObject();
            stencil.put("id", "BPMNDiagram");
            jsonModel.put("stencil", stencil);
        } catch (JSONException e) {
            throw new RuntimeException("Unexpected error", e);
        }

        return jsonModel;
    }

    @Override
    public Model2XmlConverter getXmlConverter() {
        return converter;
    }

    private boolean hasBeenAssigned(Model m){
        boolean result = false;
        try {
            if(m.getExtensions().has("assignments")){
                JSONObject obj = m.getExtensions().getJSONObject("assignments");
                if(obj.has("organizationalModel") && !obj.getString("organizationalModel").isEmpty()){
                    result = true;
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return result;
    }

    public String getOrganization(Model m){
        if(!hasBeenAssigned(m)){
            return null;
        }
        String result=null;

        try {
            if(m.getExtensions().has("assignments")){
                JSONObject obj = m.getExtensions().getJSONObject("assignments");
                if(obj.has("organizationalModel") && !obj.getString("organizationalModel").isEmpty()){
                    result = obj.getString("organizationalModel");
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return result;
    }


}
