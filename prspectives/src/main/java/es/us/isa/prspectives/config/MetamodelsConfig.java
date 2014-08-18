package es.us.isa.prspectives.config;

import es.us.isa.bpms.model.metamodels.BpmnMetamodel;
import es.us.isa.bpms.model.metamodels.MetamodelLibrary;
import es.us.isa.bpms.model.metamodels.OrgMetamodel;
import es.us.isa.bpms.ral.RALModel2XMLConverter;
import es.us.isa.ppinot.resource.PPINOTModel2XmlConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

/**
 * MetamodelsConfig
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
@Configuration
public class MetamodelsConfig {

    @Value("/WEB-INF/xsd/BPMN20.xsd")
    Resource bpmn20xsd;

    @Bean
    public MetamodelLibrary metamodelLibrary() {
        MetamodelLibrary library = new MetamodelLibrary();
        library.registerMetamodel(new OrgMetamodel());
        library.registerMetamodel(new BpmnMetamodel(new RALModel2XMLConverter(bpmn20xsd)));

        return library;
    }

}
