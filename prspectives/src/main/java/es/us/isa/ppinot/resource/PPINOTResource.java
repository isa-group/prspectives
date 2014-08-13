package es.us.isa.ppinot.resource;

import com.google.common.collect.Lists;
import es.us.isa.bpms.model.Model;
import es.us.isa.bpms.repository.ModelRepository;
import es.us.isa.bpms.users.UserService;
import es.us.isa.ppinot.evaluation.Evaluation;
import es.us.isa.ppinot.evaluation.MXMLEvaluator;
import es.us.isa.ppinot.evaluation.PPIEvaluator;
import es.us.isa.ppinot.handler.PPINotModelHandler;
import es.us.isa.ppinot.handler.PPINotModelHandlerImpl;
import es.us.isa.ppinot.model.PPI;
import es.us.isa.ppinot.model.PPISet;
import es.us.isa.ppinot.model2diagram.PPI2DiagramUpdater;
import org.apache.commons.compress.archivers.ArchiveException;
import org.apache.commons.compress.archivers.ArchiveInputStream;
import org.apache.commons.compress.archivers.ArchiveStreamFactory;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.compressors.CompressorException;
import org.apache.commons.compress.compressors.CompressorInputStream;
import org.apache.commons.compress.compressors.CompressorStreamFactory;
import org.apache.commons.io.IOUtils;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.resteasy.spi.BadRequestException;
import org.jboss.resteasy.spi.UnauthorizedException;
import org.json.JSONException;
import org.json.JSONObject;
import org.oryxeditor.server.diagram.basic.BasicDiagram;
import org.oryxeditor.server.diagram.basic.BasicDiagramBuilder;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * User: resinas
 * Date: 20/05/13
 * Time: 22:06
 */
public class PPINOTResource {

    private static final Logger log = Logger.getLogger(PPINOTResource.class.getName());


    private UserService userService;
    private ModelRepository modelRepository;
    private String id;
    private InputStream processStream;

    public PPINOTResource(InputStream processStream, String id, UserService userService, ModelRepository modelRepository) {
        this.processStream = processStream;
        this.id = id;
        this.userService = userService;
        this.modelRepository = modelRepository;
    }

    @Produces("application/json")
    @GET
    public Collection<PPISet> getPPIs(@PathParam("id") String id) {
        PPINotModelHandler handler = getPpiNotModelHandler(id);
        return handler.getPPISets();
    }

    @Consumes("application/json")
    @PUT
    public Collection<PPISet> storePPIs(Collection<PPISet> ppiSets) {
        if (! userService.isLogged())
            throw new UnauthorizedException("User not logged");
        Model m = modelRepository.getModel(id);

        try {
            BasicDiagram diagram = BasicDiagramBuilder.parseJson(m.getModel());

            new PPI2DiagramUpdater().update(ppiSets, diagram);

            JSONObject diagramJSON = diagram.getJSON();
            m.setModel(diagramJSON);
            m.updateXmlFromModel();
            modelRepository.saveModel(id, m);
        } catch (JSONException e) {
            log.warning("Could not load model of  " + id);
            log.warning(e.toString());
            throw new RuntimeException("Could not load model of " + id, e);
        }


        try {
            return ppiSets;
        } catch (Exception e) {
            throw new RuntimeException("unable to create file", e);
        }


    }


    private PPINotModelHandler getPpiNotModelHandler(String id) {
        PPINotModelHandler ppinotModelHandler;
        try {
            ppinotModelHandler = new PPINotModelHandlerImpl();
            ppinotModelHandler.load(processStream);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Problem loading PPIs of process " + id, e);
        }
        return ppinotModelHandler;
    }

    // PPI computation ------

    @POST
    @Path("/calculate")
    @Consumes("multipart/form-data")
    @Produces(MediaType.APPLICATION_JSON)
    public Collection<Collection<Evaluation>> calculatePPIs(MultipartFormDataInput input, @PathParam("id") String id) throws IOException {
        Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
        List<InputPart> filePart = uploadForm.get("file");
        List<InputPart> namePart = uploadForm.get("name");
        InputStream inputStream = filePart.get(0).getBody(InputStream.class, null);
        String fileName = namePart.get(0).getBodyAsString();
        List<String> nameP = Lists.newArrayList(fileName.split("\\."));
        String ext = nameP.get(nameP.size() - 1);
        if (ext.equals("gz") || ext.equals("zip")) {
            inputStream = fromGzippedToBytes(inputStream, ext);
        }
//        String log = IOUtils.toString(inputStream);

        Collection<PPISet> ppiSet = getPPIs(id);
        PPISet ppis = (PPISet) ppiSet.toArray()[0];
        List<Collection<Evaluation>> evaluations = new ArrayList<Collection<Evaluation>>();
        for (PPI ppi : ppis.getPpis()) {
//            PPIEvaluator evaluator = new MXMLEvaluator(new ByteArrayInputStream(log.getBytes()));
            PPIEvaluator evaluator = new MXMLEvaluator(inputStream);
            evaluations.add(evaluator.eval(ppi));
        }
        return evaluations;
    }

    public static InputStream fromGzippedToBytes(InputStream inputStream, String ext) throws IOException {
        ByteArrayInputStream byteArrayInputStream = null;
        OutputStream out;
        InputStream file = null;
        try {
            if (ext.equals("zip")) {
                ArchiveInputStream in = new ArchiveStreamFactory().createArchiveInputStream("zip", inputStream);
                ZipArchiveEntry entry = (ZipArchiveEntry) in.getNextEntry();
                return in;
//                out = new FileOutputStream("temp.mxml");
//                IOUtils.copy(in, out);
//                file = new FileInputStream("temp.mxml");
//                return file;
            } else if (ext.equals("gz")) {
                CompressorInputStream in = new CompressorStreamFactory().createCompressorInputStream("gz", inputStream);
                return in;
//                out = new FileOutputStream("temp.mxml");
//                IOUtils.copy(in, out);
//                file = new FileInputStream("temp.mxml");
//                return file;
            }
        } catch (ArchiveException e) {
            log.log(Level.SEVERE, "Failed decompressing the file", e);
            throw new BadRequestException("Invalid compressed file");
        } catch (CompressorException e) {
            log.log(Level.SEVERE, "Failed decompressing the file", e);
            throw new BadRequestException("Invalid compressed file");
        }
        return file;
    }

}
