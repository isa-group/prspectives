package es.us.isa.prspectives.bpmn.ral;

import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.core.model.metamodels.AbstractPerspective;
import es.us.isa.prspectives.core.model.metamodels.Perspective;
import es.us.isa.prspectives.bpmn.ral.analyser.AnalyserService;
import es.us.isa.prspectives.bpmn.ral.analyser.RALAnalyserLibrary;
import es.us.isa.prspectives.core.repository.ModelRepository;

/**
 * ResourcePerspective
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class ResourcePerspective extends AbstractPerspective implements Perspective {
    public static final String RESOURCES = "resources";

    private RALAnalyserLibrary analyserLibrary;
    private ModelRepository modelRepository;

    public ResourcePerspective(ModelRepository modelRepository, RALAnalyserLibrary analyserLibrary) {
        this.modelRepository = modelRepository;
        this.analyserLibrary = analyserLibrary;
    }

    @Override
    public String getType() {
        return RESOURCES;
    }

    @Override
    public String getDescription() {
        return "Resource perspective";
    }

    @Override
    public String getEditorUrl() {
        return "resource-assignment.html";
    }

    @Override
    public Object createPerspectivesResource(Model m) {
        return new AnalyserService(m, modelRepository, analyserLibrary);
    }
}
