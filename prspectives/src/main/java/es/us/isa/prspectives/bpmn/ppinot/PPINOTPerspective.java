package es.us.isa.prspectives.bpmn.ppinot;

import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.core.model.metamodels.AbstractPerspective;
import es.us.isa.prspectives.core.repository.ModelRepository;
import org.apache.commons.io.IOUtils;

import java.io.InputStream;

/**
 * PPINOTPerspective
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class PPINOTPerspective extends AbstractPerspective {

    private ModelRepository modelRepository;

    public PPINOTPerspective(ModelRepository modelRepository) {
        this.modelRepository = modelRepository;
    }

    @Override
    public String getDescription() {
        return "Performance perspective";
    }

    @Override
    public String getEditorUrl() {
        return "ppi-template.html";
    }

    @Override
    public String getType() {
        return "ppis";
    }

    @Override
    public Object createPerspectivesResource(Model model) {
        InputStream processReader = IOUtils.toInputStream(model.getXml());
        return new PPINOTResource(processReader, model.getModelId(), modelRepository);
    }
}
