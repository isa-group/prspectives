package es.us.isa.prspectives.core.repository;

import es.us.isa.prspectives.core.model.Model;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;

public class SharedModelHandler extends AbstractModelHandler {
    void addShared(Model model, Set<String> shared) {
        for (String sharedUser : shared) {
            Workspace workspace = createUserWorkspace(sharedUser);
            String sharedModelId = createNewSharedModelId(workspace);
            SharedModel sharedModel = new SharedModel(model.getModelId(), getLoggedUser());
            workspace.createModel(sharedModelId, sharedModel);
        }
    }

    private String createNewSharedModelId(Workspace workspace) {
        String id;
        do {
            id = ModelUUID.generate();
        } while ( workspace.existsModel(id));

        return id;
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
            Workspace workspace = createUserWorkspace(sharedUser);
            List<String> models = workspace.listModels();
            for (String modelId : models) {
                if (represents(workspace, modelId, model)) {
                    workspace.remove(modelId);
                }
            }
        }
    }

    private boolean represents(Workspace workspace, String modelId, Model model) {
        boolean represents = false;

        try {
            JSONObject jsonObject = createJSONObject(workspace.getModelReader(modelId));
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
        return createJSONObject(getSharedModelReader(shared));
    }

    InputStream getSharedModelReader(SharedModel shared) {
        return createUserWorkspace(shared.getOwner()).getModelReader(shared.getModelId());
    }

    Workspace getOwnerBaseDirectory(SharedModel shared) {
        return createUserWorkspace(shared.getOwner());
    }


}