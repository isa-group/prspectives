package es.us.isa.prspectives.repository;

import java.io.File;

/**
 * FileWorkspaceFactory
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class FileWorkspaceFactory implements WorkspaceFactory {

    private String baseDirectory;

    public FileWorkspaceFactory(String directory) {
        this.baseDirectory = directory;
    }

    @Override
    public Workspace createWorkspace(String email) {
        String workspaceDirectory = baseDirectory;
        if (email != null && !"".equals(email)) {
            workspaceDirectory = baseDirectory + File.separator + email.hashCode();
            File dir = new File(workspaceDirectory);
            if (!dir.exists()) {
                dir.mkdir();
            }
        }

        return new FileWorkspace(workspaceDirectory);
    }

}
