package es.us.isa.bpms.repository;

import es.us.isa.bpms.users.UserService;
import org.apache.commons.io.IOUtils;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.*;

/**
 * AbstractFileHandler
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class AbstractFileHandler {

    private String directory;

    @Autowired
    private UserService userService;

    public AbstractFileHandler(String directory) {
        this.directory = directory;
    }

    protected void saveModelToFile(Storeable modelToStore, File file) {
        try {
            Writer writer = new FileWriter(file);
            writer.write(modelToStore.getJSON());
            writer.close();
        } catch (Exception e) {
            throw new RuntimeException("Could not save model to file " + file.getAbsolutePath(), e);
        }
    }

    protected String getLoggedUser() {
        String email = "";
        try {
            email = userService.getLoggedUser();
        } catch (Exception e) {
            // Not logged in
        }
        return email;
    }

    protected BaseDirectory createBaseDirectory() {
        String email = getLoggedUser();
        return createBaseDirectory(email);
    }

    protected BaseDirectory createBaseDirectory(String email) {
        String baseDirectory = directory;

        if (email != null && !"".equals(email)) {
            baseDirectory = baseDirectory + File.separator + email.hashCode();
            File dir = new File(baseDirectory);
            if (!dir.exists()) {
                dir.mkdir();
            }
        }

        return new BaseDirectory(baseDirectory);
    }

    protected JSONObject createJSONObject(InputStream modelReader) throws IOException, JSONException {
        String json = IOUtils.toString(modelReader);
        return new JSONObject(json);
    }
}
