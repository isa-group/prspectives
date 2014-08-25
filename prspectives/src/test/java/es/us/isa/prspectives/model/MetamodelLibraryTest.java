package es.us.isa.prspectives.model;

import es.us.isa.prspectives.model.metamodels.BpmnMetamodel;
import es.us.isa.prspectives.model.metamodels.Metamodel;
import es.us.isa.prspectives.model.metamodels.MetamodelLibrary;
import es.us.isa.prspectives.config.MetamodelsConfig;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * MetamodelLibraryTest
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = {MetamodelsConfig.class})
public class MetamodelLibraryTest {
    @Autowired
    private MetamodelLibrary metamodelLibrary;

    @Test
    public void bpmnMetamodelExists() {
        Metamodel metamodel = metamodelLibrary.getMetamodel(BpmnMetamodel.BPMN20);
        Assert.assertNotNull(metamodel);
        Assert.assertTrue(metamodel instanceof BpmnMetamodel);
    }
}
