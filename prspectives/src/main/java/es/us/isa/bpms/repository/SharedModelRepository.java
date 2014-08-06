package es.us.isa.bpms.repository;

import es.us.isa.bpms.model.Model;
import es.us.isa.bpms.model.metamodels.MetamodelLibrary;
import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;
import java.util.List;
import java.util.logging.Logger;

/**
 * User: resinas
 * Date: 09/04/13
 * Time: 09:31
 */
public class SharedModelRepository extends AbstractModelHandler implements ModelRepository {

    private static final Logger log = Logger.getLogger(SharedModelRepository.class.toString());
    private SharedModelHandler sharedFileHandler;

    @Autowired
    private MetamodelLibrary metamodelLibrary;

    public SharedModelRepository(SharedModelHandler sharedFileHandler) {
        this.sharedFileHandler = sharedFileHandler;
    }


    @Override
    public Model getModel(String id) {
        Model m;

        try {
            m = Model.createModel(createJSONObject(getModelReader(id)), metamodelLibrary);
        } catch (Exception e) {
            throw new RuntimeException("Unable to get model " + id, e);
        }

        return m;
    }

    @Override
    public InputStream getModelReader(String id) {
        Workspace workspace = createUserWorkspace();
        InputStream modelReader = workspace.getModelReader(id);

        try {
            JSONObject jsonObject = createJSONObject(modelReader);
            if (SharedModel.is(jsonObject)) {
                modelReader = modelReaderFromShared(id, jsonObject);
            } else {
                modelReader = workspace.getModelReader(id);
            }
        } catch (Exception e) {
            throw new RuntimeException("Unable to get model " + id, e);
        }

        return modelReader;
    }

    private InputStream modelReaderFromShared(String id, JSONObject jsonSharedModel) throws JSONException, IOException {
        InputStream modelReader;
        Model originalModel = Model.createModel(sharedFileHandler.getOriginalJson(jsonSharedModel), metamodelLibrary);
        Model clonedModel = originalModel.cloneWithId(id);
        modelReader = IOUtils.toInputStream(clonedModel.getJSON());
        return modelReader;
    }

    @Override
    public List<String> listModels() {
        Workspace workspace = createUserWorkspace();
        return workspace.listModels();
    }

    @Override
    public boolean removeModel(String id) {
        Workspace workspace = createUserWorkspace();
        InputStream modelReader = workspace.getModelReader(id);
        boolean result;

        try {
            JSONObject jsonObject = createJSONObject(modelReader);
            if (! SharedModel.is(jsonObject)) {
                Model m = Model.createModel(jsonObject, metamodelLibrary);
                sharedFileHandler.removeShared(m, m.getShared());
            }
            result = workspace.remove(id);
        } catch (JSONException e) {
            log.warning(e.toString());
            throw new RuntimeException("Invalid model stored " + id, e);
        } catch (IOException e) {
            log.warning(e.toString());
            throw new RuntimeException("Data access error for model " + id, e);
        }

        return result;
    }

    @Override
    public boolean addModel(Model model) {
        boolean result = false;
        Workspace workspace = createUserWorkspace();

        if (model.getModel() == null)
            model.loadEmptyModel();

        if (!workspace.existsModel(model.getModelId())) {
            result = workspace.createModel(model.getModelId(), model);
            sharedFileHandler.addShared(model, model.getShared());
        }

        return result;
    }

    @Override
    public void saveModel(String id, Model model) {
        if (model == null)
            throw new IllegalArgumentException("Unable to save empty model");

        Workspace workspace = createUserWorkspace();

        if (! id.equals(model.getModelId())) {
            throw new RuntimeException("Model id is not valid. Expected " + id + ", but found " + model.getModelId());
        }

        try {
            JSONObject jsonObject = createJSONObject(workspace.getModelReader(id));
            String modelId;

            if (SharedModel.is(jsonObject)) {
                SharedModel shared = SharedModel.createFrom(jsonObject);
                modelId = shared.getModelId();
                model = model.cloneWithId(shared.getModelId());
                workspace = sharedFileHandler.getOwnerBaseDirectory(shared);
            } else {
                modelId = model.getModelId();
                updateShared(model);
            }

            workspace.save(modelId, model);
        } catch (IOException e) {
            log.warning(e.toString());
            throw new RuntimeException(e);
        } catch (JSONException e) {
            throw new RuntimeException("The model metadata is not valid", e);
        }
    }

    private void updateShared(Model model) {
        Model storedModel = getModel(model.getModelId());
        sharedFileHandler.updateShared(model, storedModel);
    }

}
