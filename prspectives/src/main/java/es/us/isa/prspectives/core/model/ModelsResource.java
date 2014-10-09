package es.us.isa.prspectives.core.model;


import es.us.isa.prspectives.core.model.metamodels.Metamodel;
import es.us.isa.prspectives.core.model.metamodels.MetamodelLibrary;
import es.us.isa.prspectives.core.repository.ModelRepository;
import es.us.isa.prspectives.core.users.UserService;
import org.apache.batik.transcoder.AbstractTranscoder;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.commons.io.IOUtils;
import org.apache.fop.svg.PDFTranscoder;
import org.jboss.resteasy.spi.BadRequestException;
import org.jboss.resteasy.spi.NotFoundException;
import org.jboss.resteasy.spi.UnauthorizedException;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * User: resinas
 * Date: 09/04/13
 * Time: 08:55
 */
@Path("/service")
public class ModelsResource {

    private static final Logger log = Logger.getLogger(ModelsResource.class
            .getName());

    private ModelRepository modelRepository;

    @Autowired
    private MetamodelLibrary metamodelLibrary;

    @Autowired
    private UserService userService;

    @Autowired
    private ServletContext context;


    public ModelsResource(UserService userService, ServletContext context) {
        this();
        this.userService = userService;
        this.context = context;
        metamodelLibrary = new MetamodelLibrary();
    }

    public ModelsResource() {
        super();
        log.info("Loaded ModelsResource");

    }

    public ModelRepository getModelRepository() {
        return modelRepository;
    }

    public void setModelRepository(ModelRepository modelRepository) {
        this.modelRepository = modelRepository;
    }

    @Path("/models")
    @GET
    @Produces("application/json")
    public List<ModelInfo> getProcesses(@Context UriInfo uriInfo) {
        List<ModelInfo> result = new ArrayList<ModelInfo>();
        List<String> processes = modelRepository.listModels();

        for (String modelId : processes) {

            ModelInfo modelInfo = createModelInfo(modelId, uriInfo);

            result.add(modelInfo);
        }

        return result;
    }

    private ModelInfo createModelInfo(String modelId, UriInfo uriInfo) {
        UriBuilder ub = uriInfo.getBaseUriBuilder().path(this.getClass()).path(this.getClass(), "getModel");
        URI uri = ub.build(modelId);

        ModelInfo modelInfo = new ModelInfo(modelId, uri.toString());

        try {
            Model m = modelRepository.getModel(modelId);
            modelInfo.setName(m.getName());
            modelInfo.setDescription(m.getDescription());
            modelInfo.setShared(m.getShared());
            modelInfo.setType(m.getMetamodel().getType());
            modelInfo.setOwner(!m.getShared().contains(userService.getLoggedUser()));
            modelInfo.setLinks(m.createLinks(uriInfo.getBaseUriBuilder()));
            modelInfo.setExport(m.createExports(uriInfo.getBaseUriBuilder()));
            modelInfo.setModelLinks(m.createModelLinks(uriInfo.getBaseUriBuilder()));
        } catch (Exception e) {
            log.warning("Error processing model info of " + modelId);
            log.warning(e.toString());
        }

        return modelInfo;
    }

    @Path("/models")
    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response postModel(@Context UriInfo uriInfo, ModelInfo info) {
        checkUserLogged();

        Response r;

        if (info.getModelId() == null) {
            info.setModelId(info.getName().replaceAll("\\W", ""));
        } else if (!info.getModelId().matches("\\w+")) {
            throw new BadRequestException("Invalid modelId");
        }

        Model model = new Model(info.getModelId(), info.getName(), metamodelLibrary.get(info.getType()));

        if (info.hasClone()) {
            model.cloneContentFrom(modelRepository.getModel(info.getCloneFrom()));
        }

        model.setDescription(info.getDescription());

        if (modelRepository.addModel(model)) {
            ModelInfo modelInfo = createModelInfo(info.getModelId(), uriInfo);
            r = Response.ok(modelInfo, MediaType.APPLICATION_JSON_TYPE).build();
        } else {
            r = Response.status(Response.Status.BAD_REQUEST).build();
        }

        return r;
    }

    @Path("/models/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public InputStream getModel(@PathParam("id") String id) {
        return getModelJson(id);
    }

    @Path("/models/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @PUT
    @POST
    public ModelInfo updateModelInfo(@Context UriInfo uriInfo, @PathParam("id") String id, ModelInfo info) {
        log.info("Updating model info " + id);
        checkUserLogged();

        Model m = getModelOrNotFound(id);

        if (!m.getModelId().equals(info.getModelId())) {
            throw new BadRequestException("Not allowed to change modelId");
        }

        if (!m.getMetamodel().getType().equals(info.getType())) {
            throw new BadRequestException("Not allowed to change type");
        }

        m.setName(info.getName());
        m.setShared(info.getShared());
        m.setDescription(info.getDescription());

        modelRepository.saveModel(id, m);

        return createModelInfo(info.getModelId(), uriInfo);

    }

    @Path("/models/{id}")
    @DELETE
    public Response removeProcess(@PathParam("id") String id) {
        checkUserLogged();

        Response r;
        if (modelRepository.removeModel(id))
            r = Response.ok().build();
        else
            r = Response.status(Response.Status.NOT_FOUND).build();

        return r;
    }

    @Path("/models/{id}/json")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public InputStream getModelJson(@PathParam("id") String id) {
        return modelRepository.getModelReader(id);
    }

    @Path("/models/{id}/json")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @PUT
    public InputStream updateModel(@PathParam("id") String id, String json) {
        checkUserLogged();
        getModelOrNotFound(id);

        Model newM;

        try {
            newM = Model.createModel(new JSONObject(json), metamodelLibrary);
        } catch (JSONException e) {
            throw new IllegalArgumentException();
        }

        if (!newM.getModelId().equals(id)) {
            throw new IllegalArgumentException();
        }

        modelRepository.saveModel(id, newM);

        return modelRepository.getModelReader(id);
    }

    @Path("/models/{id}/svg")
    @GET
    @Produces("image/svg+xml")
    public String getModelSvg(@PathParam("id") String id) {
        Model m = modelRepository.getModel(id);

        String svg = m.getSvg();

        if (svg == null || svg.isEmpty()) {
            try {
                svg = IOUtils.toString(this.getClass().getResourceAsStream("/No_image_available.svg"));
            } catch (IOException e) {
                log.log(Level.WARNING, "SVG fallback image not found", e);
            }
        }

        return svg;
    }

    @Path("/models/{id}/pdf")
    @GET
    @Produces("application/pdf")
    public InputStream getModelPdf(@PathParam("id") String id) {
        PDFTranscoder transcoder = new PDFTranscoder();

        return transcode(id, transcoder);
    }


    @Path("/models/{id}/png")
    @GET
    @Produces("image/png")
    public InputStream getModelPng(@PathParam("id") String id) {
        PNGTranscoder transcoder = new PNGTranscoder();
        return transcode(id, transcoder);
    }

    private InputStream transcode(String id, AbstractTranscoder transcoder) {
        String svg = getModelSvg(id);
        if (svg == null)
            throw new NotFoundException("No image of model");

        TranscoderInput input = new TranscoderInput(new StringReader(svg));
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        TranscoderOutput output = new TranscoderOutput(out);

        try {
            transcoder.transcode(input, output);
        } catch (TranscoderException e) {
            throw new RuntimeException("Transcoder error", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    @Path("/models/{id}/xml")
    @Produces(MediaType.APPLICATION_XML)
    @GET
    public String getModelXml(@PathParam("id") String id) {
        Model m = modelRepository.getModel(id);

        if (m == null) {
            throw new org.jboss.resteasy.spi.NotFoundException("Model not found");
        }

        String xml = getXmlFromModel(m);

        return xml;
    }

    private String getXmlFromModel(Model m) {
        String xml = m.getXml();

        if ((xml == null || xml.isEmpty())) {
            if (m.updateXmlFromModel()) {
                xml = m.getXml();
                try {
                    modelRepository.saveModel(m.getModelId(), m);
                } catch (Exception e) {
                    log.warning("Error saving model");
                    log.warning(e.toString());
                }
            } else {
                throw new NotFoundException("XML representation not available");
            }
        }
        return xml;
    }


    @Path("/model/{id}/json")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public InputStream getModelJsonForOryx(@PathParam("id") String id) {
        return modelRepository.getModelReader(id);
    }

    @Path("/model/{id}/json")
    @Produces(MediaType.APPLICATION_JSON)
    @PUT
    public InputStream oryxUpdateModel(@PathParam("id") String id, @FormParam("json_xml") String jsonXml, @FormParam("name") String name, @FormParam("type") String type, @FormParam("description") String description, @FormParam("svg_xml") String svgXml) {
        log.info("Saving name: " + name);
        log.info("Saving jsonXML: " + jsonXml);

        checkUserLogged();

        Model m = getModelOrNotFound(id);

        m.setName(name);
        m.setDescription(description);
        m.setSvg(svgXml);

        if (!m.getMetamodel().getType().equals(type)) {
            throw new RuntimeException("The submitted model is not valid (type mismatch)");
        }

        try {
            JSONObject jsonObject = new JSONObject(jsonXml);
            m.setModel(jsonObject);
            m.updateXmlFromModel();
        } catch (JSONException e) {
            throw new RuntimeException("The submitted model is not valid", e);
        } catch (Exception e) {
            log.warning(e.toString());
        }

        if (jsonXml != null) {
            modelRepository.saveModel(id, m);
        }

        return modelRepository.getModelReader(id);
    }

    private void checkUserLogged() {
        if (!userService.isLogged())
            throw new UnauthorizedException("User not logged");
    }


    @Path("/models/{id}/share")
    @Produces(MediaType.APPLICATION_JSON)
    @PUT
    public List<String> updateShare(@PathParam("id") String id, List<String> shares) {
        log.info("Updating share " + id);

        checkUserLogged();

        Model m = getModelOrNotFound(id);

        if (!id.equals(m.getModelId())) {
            throw new UnauthorizedException("Not allowed to change shared");
        }

        m.setShared(new HashSet<String>(shares));

        modelRepository.saveModel(id, m);

        return shares;

    }

    private Model getModelOrNotFound(String id) {
        Model m = modelRepository.getModel(id);
        if (m == null) {
            throw new NotFoundException("Model not found");
        }
        return m;
    }

    @Path("/models/{id}/{perspective}")
    public Object getPerspective(@PathParam("id") String id, @PathParam("perspective") String perspective) {
        checkUserLogged();
        Model m = getModelOrNotFound(id);
        Metamodel metamodel = m.getMetamodel();
        Object perspectivesResource = metamodel.createPerspectivesResource(m, perspective);

        if (perspectivesResource == null) {
            throw new NotFoundException("Perspective " + perspective + " not available for this model");
        }

        return perspectivesResource;
    }


    // ------------------------------ ADDED BY TOKEN

    @Path("/model/{token}/{id}/xml")
    @Produces(MediaType.APPLICATION_XML)
    @GET
    public String getModelByTokenXml(@PathParam("token") String token, @PathParam("id") String id) {
        Model m = modelRepository.getModelUsingToken(id, token);
        return getXmlFromModel(m);
    }

    @Path("/model/{token}/{id}/json")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public InputStream getModelByTokenJson(@PathParam("token") String token, @PathParam("id") String id) {
        return modelRepository.getModelReaderUsingToken(id, token);
    }

}
