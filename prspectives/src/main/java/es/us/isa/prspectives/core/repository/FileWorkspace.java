package es.us.isa.prspectives.core.repository;

import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class FileWorkspace implements Workspace {
    private static final Logger log = Logger.getLogger(FileWorkspace.class.toString());

    private final String baseDirectory;

    public FileWorkspace(String baseDirectory) {
        this.baseDirectory = baseDirectory;
    }

    @Override
    public List<String> listModels() {
        return genericListModels("json");
    }

    private List<String> genericListModels(String ext) {
        List<String> processes = new ArrayList<String>();
        File dir = new File(baseDirectory);
        File[] files = dir.listFiles();

        if (files != null) {
            for (File f : files) {
                String filename = f.getName();
                if (filename.endsWith(ext)) {
                    processes.add(filename.replace("." + ext, ""));
                }
            }
        }

        return processes;
    }

    private File getModelFile(String id) {
        String filename = baseDirectory + File.separator + id + ".json";
        return new File(filename);
    }

    @Override
    public InputStream getModelReader(String id) {
        File processFile = getModelFile(id);

        try {
            return new FileInputStream(processFile);
        } catch (FileNotFoundException e) {
            throw new RuntimeException("Model with id: " + id + " not found ", e);
        }
    }

    @Override
    public boolean remove(String id) {
        File modelFile = getModelFile(id);
        boolean result = false;

        if (modelFile.exists())
            result = modelFile.delete();

        return result;
    }

    @Override
    public boolean existsModel(String id) {
        File file = getModelFile(id);
        return file.exists();
    }

    @Override
    public boolean createModel(String id, Storeable modelToStore) {
        boolean created = false;
        File file = getModelFile(id);
        if (! file.exists()) {
            try {
                file.createNewFile();
                created = true;
            } catch (IOException e) {
                log.warning("Model already exists " + file.getAbsolutePath());
            }
            saveModelToFile(modelToStore, file);
        }

        return created;
    }

    @Override
    public void save(String id, Storeable model) {
        File file = getModelFile(id);
        saveModelToFile(model, file);
    }

    private void saveModelToFile(Storeable modelToStore, File file) {
        try {
            Writer writer = new FileWriter(file);
            writer.write(modelToStore.getJSON());
            writer.close();
        } catch (Exception e) {
            throw new RuntimeException("Could not save model to file " + file.getAbsolutePath(), e);
        }
    }


}