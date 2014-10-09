package es.us.isa.prspectives.config;

import es.us.isa.prspectives.bpmn.process.ProcessPerspective;
import es.us.isa.prspectives.bpmn.BpmnMetamodel;
import es.us.isa.prspectives.core.model.metamodels.MetamodelLibrary;
import es.us.isa.prspectives.org.OrgMetamodel;
import es.us.isa.prspectives.bpmn.ral.RALModel2XMLConverter;
import es.us.isa.prspectives.bpmn.ral.ResourcePerspective;
import es.us.isa.prspectives.bpmn.ral.analyser.Neo4JAnalyserFactory;
import es.us.isa.prspectives.bpmn.ral.analyser.OwlAnalyserFactory;
import es.us.isa.prspectives.bpmn.ral.analyser.RALAnalyserLibrary;
import es.us.isa.prspectives.core.repository.ModelRepository;
import es.us.isa.prspectives.bpmn.ppinot.PPINOTPerspective;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    ModelRepository modelRepository;

    @Value("/WEB-INF/xsd/BPMN20.xsd")
    Resource bpmn20xsd;

    @Bean
    public MetamodelLibrary metamodelLibrary() {
        MetamodelLibrary library = new MetamodelLibrary();
        library.register(new OrgMetamodel());
        library.register(bpmnMetamodel());

        return library;
    }

    @Bean
    public BpmnMetamodel bpmnMetamodel() {
        return new BpmnMetamodel(new RALModel2XMLConverter(bpmn20xsd),
                new ProcessPerspective(),
                new PPINOTPerspective(modelRepository),
                new ResourcePerspective(modelRepository, ralAnalyserLibrary()));
    }

    @Bean
    public RALAnalyserLibrary ralAnalyserLibrary() {
        Neo4JAnalyserFactory neo4JAnalyserFactory = new Neo4JAnalyserFactory();
        OwlAnalyserFactory owlAnalyserFactory = new OwlAnalyserFactory();

        RALAnalyserLibrary analyserLibrary = new RALAnalyserLibrary(
                neo4JAnalyserFactory,
                owlAnalyserFactory
        );

        analyserLibrary.defaultFactory(neo4JAnalyserFactory);

        return analyserLibrary;
    }

}
