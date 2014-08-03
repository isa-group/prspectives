package es.us.isa.bpms.repository;

import es.us.isa.bpms.model.Model;
import es.us.isa.bpms.users.UserService;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Set;

public class SharedFileHandler extends AbstractFileHandler {
    public SharedFileHandler(String directory) {
        super(directory);
    }

    void addShared(Model model, Set<String> shared) {
        for (String sharedUser : shared) {
            File file = createNewSharedFileForUser(sharedUser);
            SharedModel sharedModel = new SharedModel(model.getModelId(), getLoggedUser());
            saveModelToFile(sharedModel, file);
        }
    }

    private File createNewSharedFileForUser(String sharedUser) {
        BaseDirectory baseDirectory = createBaseDirectory(sharedUser);
        File file;
        try {
            do {
                String id = ModelUUID.generate();
                file = baseDirectory.getModelFile(id);
            } while (!file.createNewFile());
        } catch (IOException e) {
            throw new RuntimeException("Could not create new file", e);
        }
        return file;
    }

    void updateShared(Model model, Model storedModel) {

        if (storedModel == null) {
            addShared(model, model.getShared());
        } else if (!model.sameSharedAs(storedModel)) {
            addShared(model, model.differenceShared(storedModel));
            removeShared(model, storedModel.differenceShared(model));
        }
    }

    void removeShared(Model model, Set<String> shared) {
        for (String sharedUser : shared) {
            BaseDirectory baseDirectory = createBaseDirectory(sharedUser);
            List<String> models = baseDirectory.listModels();
            for (String modelId : models) {
                if (represents(baseDirectory, modelId, model)) {
                    baseDirectory.remove(modelId);
                }
            }
        }
    }

    private boolean represents(BaseDirectory baseDirectory, String modelId, Model model) {
        boolean represents = false;

        try {
            JSONObject jsonObject = createJSONObject(baseDirectory.getModelReader(modelId));
            if (SharedModel.is(jsonObject)) {
                SharedModel sharedModel = SharedModel.createFrom(jsonObject);
                if (sharedModel.represents(model.getModelId(), getLoggedUser())) {
                    represents = true;
                }
            }
        } catch (Exception e) {
            // Ignores the model
        }

        return represents;
    }

    JSONObject getOriginalJson(JSONObject jsonSharedModel) throws JSONException, IOException {
        SharedModel shared = SharedModel.createFrom(jsonSharedModel);
        JSONObject original = createJSONObject(createBaseDirectory(shared.getOwner()).getModelReader(shared.getModelId()));
        return original;
    }

    File getOriginalFile(SharedModel shared) {
        return createBaseDirectory(shared.getOwner()).getModelFile(shared.getModelId());
    }


}