package es.us.isa.prspectives.repository;

import es.us.isa.prspectives.users.UserService;
import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;

/**
 * AbstractModelHandler
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class AbstractModelHandler {


    @Autowired
    private WorkspaceFactory workspaceFactory;

    @Autowired
    private UserService userService;

    protected String getLoggedUser() {
        String email = "";
        try {
            email = userService.getLoggedUser();
        } catch (Exception e) {
            // Not logged in
        }
        return email;
    }

    protected Workspace createUserWorkspace() {
        String email = getLoggedUser();
        return createUserWorkspace(email);
    }

    protected Workspace createUserWorkspaceByToken(String token) {
        return createUserWorkspace(userService.getUserByToken(token));
    }

    protected Workspace createUserWorkspace(String email) {
        return workspaceFactory.createWorkspace(email);
    }

    protected JSONObject createJSONObject(InputStream modelReader) throws IOException, JSONException {
        String json = IOUtils.toString(modelReader);
        return new JSONObject(json);
    }
}
