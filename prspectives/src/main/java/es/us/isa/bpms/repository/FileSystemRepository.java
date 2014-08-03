package es.us.isa.bpms.repository;

import es.us.isa.bpms.model.Model;
import es.us.isa.bpms.model.metamodels.MetamodelLibrary;
import es.us.isa.bpms.users.UserService;
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
public class FileSystemRepository extends AbstractFileHandler implements ModelRepository {

    private static final Logger log = Logger.getLogger(FileSystemRepository.class.toString());
    private SharedFileHandler sharedFileHandler;

    @Autowired
    private MetamodelLibrary metamodelLibrary;

    public FileSystemRepository(String directory, SharedFileHandler sharedFileHandler) {
        super(directory);
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
        BaseDirectory baseDirectory = createBaseDirectory();
        InputStream modelReader = baseDirectory.getModelReader(id);

        try {
            JSONObject jsonObject = createJSONObject(modelReader);
            if (SharedModel.is(jsonObject)) {
                modelReader = modelReaderFromShared(id, jsonObject);
            } else {
                modelReader = baseDirectory.getModelReader(id);
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
        BaseDirectory baseDirectory = createBaseDirectory();
        return baseDirectory.listModels();
    }

    @Override
    public boolean removeModel(String id) {
        BaseDirectory baseDirectory = createBaseDirectory();
        InputStream modelReader = baseDirectory.getModelReader(id);
        boolean result;

        try {
            JSONObject jsonObject = createJSONObject(modelReader);
            if (! SharedModel.is(jsonObject)) {
                Model m = Model.createModel(jsonObject, metamodelLibrary);
                sharedFileHandler.removeShared(m, m.getShared());
            }
            result = baseDirectory.remove(id);
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
        BaseDirectory baseDirectory = createBaseDirectory();

        if (model.getModel() == null)
            model.loadEmptyModel();

        File newModelFile = baseDirectory.getModelFile(model.getModelId());
        if (!newModelFile.exists()) {
            try {
                newModelFile.createNewFile();
                saveModelToFile(model, newModelFile);
                sharedFileHandler.addShared(model, model.getShared());

                result = true;
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }


        return result;
    }

    @Override
    public void saveModel(String id, Model model) {
        if (model == null)
            throw new IllegalArgumentException("Unable to save empty model");

        BaseDirectory baseDirectory = createBaseDirectory();

        if (! id.equals(model.getModelId())) {
            throw new RuntimeException("Model id is not valid. Expected " + id + ", but found " + model.getModelId());
        }

        try {
            JSONObject jsonObject = createJSONObject(baseDirectory.getModelReader(id));
            File modelFile = null;

            if (SharedModel.is(jsonObject)) {
                SharedModel shared = SharedModel.createFrom(jsonObject);
                model = model.cloneWithId(shared.getModelId());
                modelFile = sharedFileHandler.getOriginalFile(shared);
            } else {
                Model storedModel = getModel(model.getModelId());
                sharedFileHandler.updateShared(model, storedModel);
                modelFile = baseDirectory.getModelFile(id);
            }

            saveModelToFile(model, modelFile);
        } catch (IOException e) {
            log.warning(e.toString());
            throw new RuntimeException(e);
        } catch (JSONException e) {
            throw new RuntimeException("The model metadata is not valid", e);
        }
    }

}
