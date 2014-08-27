package es.us.isa.prspectives.bpmn.ral.analyser;

import es.us.isa.prspectives.core.model.metamodels.AbstractLibrary;

/**
 * RALAnalyserLibrary
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class RALAnalyserLibrary extends AbstractLibrary<AnalyserFactory> {
    private AnalyserFactory defaultFactory;

    public RALAnalyserLibrary(AnalyserFactory... analyserFactories) {
        super(analyserFactories);
        if (analyserFactories.length > 0) {
            defaultFactory = analyserFactories[0];
        }
    }

    public void defaultFactory(AnalyserFactory factory) {
        if (!availableTypes().contains(factory.getType())) {
            register(factory);
        }

        defaultFactory = factory;
    }

    public AnalyserFactory getFactory() {
        return defaultFactory;
    }


}
