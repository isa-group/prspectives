package es.us.isa.prspectives.bpmn.process;

import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.core.model.metamodels.AbstractPerspective;
import org.apache.commons.io.IOUtils;

import java.io.InputStream;

/**
 * ProcessPerspective
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class ProcessPerspective extends AbstractPerspective {
    @Override
    public String getDescription() {
        return null;
    }

    @Override
    public String getEditorUrl() {
        return null;
    }

    @Override
    public String getType() {
        return "process";
    }

    @Override
    public Object createPerspectivesResource(Model m) {
        InputStream processReader = IOUtils.toInputStream(m.getXml());
        return new ProcessElementsResource(processReader);
    }
}
