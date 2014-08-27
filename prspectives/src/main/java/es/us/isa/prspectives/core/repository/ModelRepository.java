package es.us.isa.prspectives.core.repository;

import es.us.isa.prspectives.core.model.Model;

import java.io.InputStream;
import java.util.List;

/**
 * User: resinas
 * Date: 09/04/13
 * Time: 09:28
 */
public interface ModelRepository {
    public Model getModel(String id);
    
    public List<String> listModels();
    public InputStream getModelReader(String id);

    public boolean addModel(Model model);
    public boolean removeModel(String id);
    public void saveModel(String id, Model model);
    
    public Model getModelUsingToken(String id, String token);
    public InputStream getModelReaderUsingToken(String id, String token);
}
