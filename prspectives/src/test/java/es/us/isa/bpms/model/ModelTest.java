package es.us.isa.bpms.model;

import es.us.isa.bpms.model.metamodels.BpmnMetamodel;
import es.us.isa.bpms.model.metamodels.OrgMetamodel;
import es.us.isa.ppinot.resource.PPINOTModel2XmlConverter;
import org.junit.Assert;
import org.junit.Test;

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.Map;

/**
 * ModelTest
 *
 * @author resinas
 */
public class ModelTest {
    @Test
    public void testCreateLinks() {
        Model bpmnModel = new Model("mid", "name", new BpmnMetamodel(new PPINOTModel2XmlConverter()));
        Model orgModel = new Model("mid", "name", new OrgMetamodel());
        Map<String, URI> links = bpmnModel.createLinks(UriBuilder.fromPath("/"));

        Assert.assertEquals("/service/editor?id=mid", links.get("editor").toString());
        Assert.assertEquals("/ppi-template.html#/mid", links.get("View PPIs").toString());

        links = orgModel.createLinks(UriBuilder.fromPath("/"));

        Assert.assertEquals("/organizational.html#/mid", links.get("editor").toString());
    }

    @Test public void testCreateExports() {
        Model orgModel = new Model("mid", "name", new OrgMetamodel());
        Map<String, URI> exports = orgModel.createExports(UriBuilder.fromPath("/"));

        Assert.assertEquals("/service/model/mid/json", exports.get("JSON").toString());
    }
}
