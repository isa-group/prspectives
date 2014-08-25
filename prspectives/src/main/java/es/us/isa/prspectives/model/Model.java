package es.us.isa.prspectives.model;

import es.us.isa.prspectives.model.metamodels.Metamodel;
import es.us.isa.prspectives.model.metamodels.MetamodelLibrary;
import es.us.isa.prspectives.repository.Storeable;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.ws.rs.core.UriBuilder;
import java.net.URI;
import java.util.*;
import java.util.logging.Logger;

/**
 * User: resinas
 * Date: 13/05/13
 * Time: 13:32
 */
public class Model implements Storeable{

    private static final Logger log = Logger.getLogger(Model.class.getName());


    private String modelId;
    private String name;
    private int revision;

    private String description;
    private JSONObject model;
    private JSONObject extensions;
    private String xml;
    private String svg;
    private Metamodel metamodel;

    private Set<String> shared;

    private Model() {
        this.revision = 1;
        this.shared = new HashSet<String>();
        this.model = new JSONObject();
        this.extensions = new JSONObject();
    }

    public Model(String modelId, String name, Metamodel metamodel) {
        this.name = name;
        this.modelId = modelId;
        this.metamodel = metamodel;
        this.shared = new HashSet<String>();

        loadEmptyModel();
        this.extensions = new JSONObject();
    }

    public Model cloneWithId(String modelId) {
        Model clone = new Model(modelId, this.name, this.metamodel);
        clone.setShared(new HashSet<String>(this.getShared()));
        clone.cloneContentFrom(this);
        return clone;
    }

    public void cloneContentFrom(Model clone) {
        this.description = clone.description;
        try {
            this.model = new JSONObject(clone.model.toString());
            this.extensions = new JSONObject(clone.extensions.toString());
        } catch (JSONException e) {
            throw new RuntimeException("Error cloning JSON Model", e);
        }
        this.xml = clone.xml;
        this.svg = clone.svg;
        this.metamodel = clone.metamodel;
    }

    @Override
    public String getJSON() throws JSONException {
        JSONObject jsonModel = new JSONObject();
        jsonModel.put("modelId", modelId);
        jsonModel.put("name", name);
        jsonModel.put("description", description);
        jsonModel.put("revision", revision);
        jsonModel.put("model", model);
        jsonModel.put("extensions", extensions);
        jsonModel.put("xml", xml);
        jsonModel.put("svg", svg);
        jsonModel.put("type", metamodel.getType());
        jsonModel.put("shared", shared);

        return jsonModel.toString();
    }

    public void loadEmptyModel() {
        this.setModel(metamodel.createEmptyModel());
    }

    public static Model createModel(JSONObject jsonModel, MetamodelLibrary library) throws JSONException {
        if (jsonModel == null)
            throw new RuntimeException("Model could not be read");

        Model m = new Model();
        if (jsonModel.has("modelId"))
            m.setModelId(jsonModel.getString("modelId"));

        if (jsonModel.has("name"))
            m.setName(jsonModel.getString("name"));

        if (jsonModel.has("description"))
            m.setDescription(jsonModel.getString("description"));

        if (jsonModel.has("revision"))
            m.setRevision(jsonModel.getInt("revision"));

        if (jsonModel.has("model"))
            m.setModel(jsonModel.getJSONObject("model"));

        if (jsonModel.has("extensions"))
            m.setExtensions(jsonModel.getJSONObject("extensions"));

        if (jsonModel.has("xml")) {
            m.setXml(jsonModel.getString("xml"));
        }

        if (jsonModel.has("svg"))
            m.setSvg(jsonModel.getString("svg"));

        if (jsonModel.has("type"))
            m.setMetamodel(library.getMetamodel(jsonModel.getString("type")));

        if (jsonModel.has("shared")) {
            JSONArray shared = jsonModel.getJSONArray("shared");
            for (int i = 0; i < shared.length(); i++) {
                m.shared.add(shared.getString(i));
            }
        }

        return m;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getModelId() {
        return modelId;
    }

    private void setModelId(String modelId) {
        this.modelId = modelId;
    }

    public int getRevision() {
        return revision;
    }

    public void setRevision(int revision) {
        this.revision = revision;
    }

    public JSONObject getModel() {
        return model;
    }

    public void setModel(JSONObject model) {
        this.model = model;
    }

    public JSONObject getExtensions() {
        return extensions;
    }

    public void setExtensions(JSONObject extensions) {
        this.extensions = extensions;
    }

    public String getXml() {
        return xml;
    }

    public boolean updateXmlFromModel() {
        boolean updated = false;

        if (model == null) {
            log.warning("Cannot update XML: model empty");
        }
        else if (metamodel.getXmlConverter() != null) {
            try {
                xml = metamodel.getXmlConverter().transformToXml(this).toString();
                updated = true;
            } catch (Exception e) {
                log.warning(e.toString());
            }
        }

        return updated;
    }

    private void setXml(String xml) {
        this.xml = xml;
    }

    public String getSvg() {
        return svg;
    }

    public void setSvg(String svg) {
        this.svg = svg;
    }

    public Metamodel getMetamodel() {
        return metamodel;
    }

    private void setMetamodel(Metamodel metamodel) {
        this.metamodel = metamodel;
    }

    public Set<String> getShared() {
        return shared;
    }

    public void setShared(Set<String> shared) {
        this.shared = shared;
    }

    public Set<String> differenceShared(Model m) {
        Set<String> difference = new HashSet<String>(this.shared);
        if (m != null) {
            difference.removeAll(m.shared);
        }

        return difference;
    }

    public boolean sameSharedAs(Model m) {
        return m != null && shared.equals(m.shared);
    }

    public Map<String, URI> createLinks(UriBuilder builder) {
        return metamodel.createLinks(this, builder);
    }

    public Map<String, URI> createExports(UriBuilder builder) {
        return metamodel.createExports(this, builder);
    }

    public Map<String, URI> createModelLinks(UriBuilder builder) { return metamodel.createModelLinks(this, builder); }
}
