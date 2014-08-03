package es.us.isa.bpms.model.metamodels;

import es.us.isa.bpms.model.Model2XmlConverter;
import org.json.JSONObject;

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.Map;

/**
 * Metamodel
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public interface Metamodel {

    public String getType();

    public Map<String, URI> createLinks(String modelId, UriBuilder builder);
    public Map<String, URI> createExports(String modelId, UriBuilder builder);

    public JSONObject createEmptyModel();

    public Model2XmlConverter getXmlConverter();

}
