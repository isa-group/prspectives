package es.us.isa.prspectives.core.model;

import es.us.isa.prspectives.bpmn.BpmnMetamodel;
import es.us.isa.prspectives.org.OrgMetamodel;
import es.us.isa.prspectives.bpmn.ppinot.PPINOTModel2XmlConverter;
import es.us.isa.prspectives.bpmn.ppinot.PPINOTPerspective;
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
    public void testCreateLinksBpmnMetamodel() {
        Model bpmnModel = new Model("mid", "name",
                new BpmnMetamodel(new PPINOTModel2XmlConverter(), new PPINOTPerspective(null)));

        Map<String, URI> links = bpmnModel.createLinks(UriBuilder.fromPath("/"));
        Assert.assertEquals("/service/editor?id=mid", links.get("editor").toString());
        Assert.assertEquals("/ppi-template.html#/mid", links.get("Performance perspective").toString());
    }

    @Test
    public void testCreateLinksOrgMetamodel() {
        Model orgModel = new Model("mid", "name", new OrgMetamodel());
        Map<String, URI> links = orgModel.createLinks(UriBuilder.fromPath("/"));
        Assert.assertEquals("/organizational.html#/mid", links.get("editor").toString());
    }

    @Test public void testCreateExports() {
        Model orgModel = new Model("mid", "name", new OrgMetamodel());
        Map<String, URI> exports = orgModel.createExports(UriBuilder.fromPath("/"));

        Assert.assertEquals("/service/models/mid/json", exports.get("JSON").toString());
    }
}
