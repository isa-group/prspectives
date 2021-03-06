package es.us.isa.prspectives.core.model.metamodels;

import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.core.model.Model2XmlConverter;

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.Map;

/**
 * Perspective
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public interface Perspective extends TypedElement {

    public Map<String, URI> createLinks(Model model, UriBuilder builder);
    public Map<String, URI> createExports(Model model, UriBuilder builder);
    public Map<String,URI> createModelLinks(Model model, UriBuilder builder);

    public Model2XmlConverter getXmlConverter();

    Object createPerspectivesResource(Model m);

}
