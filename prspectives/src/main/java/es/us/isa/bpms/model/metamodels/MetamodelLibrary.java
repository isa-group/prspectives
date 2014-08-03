package es.us.isa.bpms.model.metamodels;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * MetamodelLibrary
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class MetamodelLibrary {
    private Map<String, Metamodel> metamodels;

    public MetamodelLibrary() {
        metamodels = new HashMap<String, Metamodel>();
    }

    public MetamodelLibrary(Map<String,Metamodel> availableMetamodels) {
        metamodels = new HashMap<String, Metamodel>(availableMetamodels);
    }

    public void registerMetamodel(Metamodel m) {
        metamodels.put(m.getType(), m);
    }

    public Metamodel getMetamodel(String type) {
        return metamodels.get(type);
    }

    public Set<String> availableTypes() {
        return metamodels.keySet();
    }
}
