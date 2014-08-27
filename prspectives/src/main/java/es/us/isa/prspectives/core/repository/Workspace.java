package es.us.isa.prspectives.core.repository;

import java.io.InputStream;
import java.util.List;

/**
 * Workspace
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public interface Workspace {
    List<String> listModels();

    InputStream getModelReader(String id);

    boolean remove(String id);

    boolean existsModel(String id);

    boolean createModel(String id, Storeable modelToStore);

    void save(String id, Storeable model);
}
