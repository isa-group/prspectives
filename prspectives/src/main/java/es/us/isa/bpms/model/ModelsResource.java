package es.us.isa.bpms.model;

import es.us.isa.bpms.process.ProcessElementsResource;
import es.us.isa.bpms.ral.RALModel2XMLConverter;
import es.us.isa.bpms.repository.ModelRepository;
import es.us.isa.bpms.users.UserService;
import es.us.isa.ppinot.evaluation.Aggregator;
import es.us.isa.ppinot.evaluation.Evaluation;
import es.us.isa.ppinot.evaluation.MXMLEvaluator;
import es.us.isa.ppinot.evaluation.PPIEvaluator;
import es.us.isa.ppinot.model.PPI;
import es.us.isa.ppinot.model.PPISet;
import es.us.isa.ppinot.model.Target;
import es.us.isa.ppinot.model.aggregated.AggregatedMeasure;
import es.us.isa.ppinot.model.base.CountMeasure;
import es.us.isa.ppinot.model.condition.TimeInstantCondition;
import es.us.isa.ppinot.model.scope.LastInstancesFilter;
import es.us.isa.ppinot.model.state.GenericState;
import es.us.isa.ppinot.resource.PPINOTResource;

import org.apache.batik.transcoder.AbstractTranscoder;
import org.apache.batik.transcoder.TranscoderException;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.commons.compress.archivers.ArchiveException;
import org.apache.commons.compress.archivers.ArchiveInputStream;
import org.apache.commons.compress.archivers.ArchiveStreamFactory;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.compressors.CompressorException;
import org.apache.commons.compress.compressors.CompressorInputStream;
import org.apache.commons.compress.compressors.CompressorStreamFactory;
import org.apache.commons.io.IOUtils;
import org.apache.fop.svg.PDFTranscoder;
import org.jboss.resteasy.annotations.providers.multipart.MultipartForm;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.jboss.resteasy.plugins.providers.multipart.MultipartInput;
import org.jboss.resteasy.spi.BadRequestException;
import org.jboss.resteasy.spi.NotFoundException;
import org.jboss.resteasy.spi.UnauthorizedException;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.google.common.collect.Lists;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.*;

import java.io.*;
import java.net.URI;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.zip.GZIPInputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

/**
 * User: resinas Date: 09/04/13 Time: 08:55
 */

@Path("/service")
public class ModelsResource {

	private static final Logger log = Logger.getLogger(ModelsResource.class
			.getName());

	private ModelRepository modelRepository;

	@Autowired
	private ConverterHelper converterHelper;

	@Autowired
	private UserService userService;

	@Autowired
	private ServletContext context;

	public ModelsResource(UserService userService, ServletContext context) {
		this();
		this.userService = userService;
		this.context = context;

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
		UriBuilder ub = uriInfo.getBaseUriBuilder().path(this.getClass())
				.path(this.getClass(), "getModel");
		URI uri = ub.build(modelId);

		ModelInfo modelInfo = new ModelInfo(modelId, uri.toString());

		try {
			Model m = modelRepository.getModel(modelId);
			modelInfo.setName(m.getName());
			modelInfo.setDescription(m.getDescription());
			modelInfo.setShared(m.getShared());
			modelInfo.setType(m.getType());
			modelInfo.setOwner(modelId.equals(m.getModelId()));
			modelInfo.setLinks(m.createLinks(uriInfo.getBaseUriBuilder()));
			modelInfo.setExport(m.createExports(uriInfo.getBaseUriBuilder()));
		} catch (Exception e) {
			log.warning("Error processing model info of " + modelId);
			log.warning(e.toString());
		}

		return modelInfo;
	}

	@Path("/model/{id}")
	@Produces(MediaType.APPLICATION_XML)
	@GET
	public String getModel(@PathParam("id") String id) {
		return getModelXml(id);
	}

	@Path("/model/{id}/json")
	@Produces(MediaType.APPLICATION_JSON)
	@GET
	public InputStream getModelJson(@PathParam("id") String id) {
		return modelRepository.getModelReader(id);
	}

	@Path("/model/{id}/svg")
	@GET
	@Produces("image/svg+xml")
	public String getModelSvg(@PathParam("id") String id) {
		Model m = modelRepository.getModel(id);

		String svg = m.getSvg();

		if (svg == null || svg.isEmpty()) {
			try {
				svg = IOUtils.toString(this.getClass().getResourceAsStream(
						"/No_image_available.svg"));
			} catch (IOException e) {
				log.log(Level.WARNING, "SVG fallback image not found", e);
			}
		}

		return svg;
	}

	@Path("/model/{id}/pdf")
	@GET
	@Produces("application/pdf")
	public InputStream getModelPdf(@PathParam("id") String id) {
		PDFTranscoder transcoder = new PDFTranscoder();

		return transcode(id, transcoder);
	}

	@Path("/model/{id}/png")
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

	@Path("/model/{id}/xml")
	@Produces(MediaType.APPLICATION_XML)
	@GET
	public String getModelXml(@PathParam("id") String id) {
		Model m = modelRepository.getModel(id);
		return converterHelper.converModelToXML(m);
	}

	@Path("/models")
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addNewProcess(@Context UriInfo uriInfo, ModelInfo info) {
		checkUserLogged();

		Response r;

		if (info.getModelId() == null || !info.getModelId().matches("\\w+")) {
			throw new BadRequestException("Invalid modelId");
		}

		Model model = new Model(info.getModelId(), info.getName(),
				info.getType());

		if (info.hasClone()) {
			model.cloneFrom(modelRepository.getModel(info.getCloneFrom()));
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

	@Path("/model/{id}")
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

	@Path("/model/{id}/json")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	@PUT
	public InputStream updateModel(@PathParam("id") String id, String json) {
		checkUserLogged();
		getModelOrNotFound(id);

		Model newM;

		try {
			newM = Model.createModel(new JSONObject(json));
		} catch (JSONException e) {
			throw new IllegalArgumentException();
		}

		if (!newM.getModelId().equals(id)) {
			throw new IllegalArgumentException();
		}

		modelRepository.saveModel(id, newM);

		return modelRepository.getModelReader(id);
	}

	@Path("/model/{id}/json")
	@Produces(MediaType.APPLICATION_JSON)
	@PUT
	public InputStream oryxUpdateModel(@PathParam("id") String id,
			@FormParam("json_xml") String jsonXml,
			@FormParam("name") String name, @FormParam("type") String type,
			@FormParam("description") String description,
			@FormParam("svg_xml") String svgXml) {
		log.info("Saving name: " + name);
		log.info("Saving jsonXML: " + jsonXml);

		checkUserLogged();

		Model m = getModelOrNotFound(id);

		m.setName(name);
		m.setDescription(description);
		m.setSvg(svgXml);
		m.setType(type);
		try {
			JSONObject jsonObject = new JSONObject(jsonXml);
			m.setModel(jsonObject);
			if (converterHelper.getModel2XmlConverter().canTransform(type)) {
				m.setXml(converterHelper.getModel2XmlConverter()
						.transformToXml(m).toString());
			}
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

	@Path("/model/{id}/share")
	@Produces(MediaType.APPLICATION_JSON)
	@PUT
	public List<String> updateShare(@PathParam("id") String id,
			List<String> shares) {
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

	@Path("/model/{id}")
	public ProcessElementsResource getProcessInfo(@PathParam("id") String id) {
		InputStream processReader = IOUtils.toInputStream(getModel(id));
		return new ProcessElementsResource(processReader);
	}

	@Path("/model/{id}/ppis")
	public PPINOTResource getPPIs(@PathParam("id") String id) {
		InputStream processReader = IOUtils.toInputStream(getModel(id));
		return new PPINOTResource(processReader, id, userService,
				converterHelper.getModel2XmlConverter(), modelRepository);
	}
	
	@POST
	@Path("/model/{id}/ppis/calculate")
	@Consumes("multipart/form-data")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Collection<Evaluation>> calculatePPIs(MultipartFormDataInput input, @PathParam("id") String id) throws IOException {
		InputStream processReader = IOUtils.toInputStream(getModel(id));
		Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
		List<InputPart> filePart = uploadForm.get("file");
		List<InputPart> namePart = uploadForm.get("name");
		InputStream inputStream = filePart.get(0).getBody(InputStream.class,null);
		String fileName = namePart.get(0).getBodyAsString();
		List<String> nameP = Lists.newArrayList(fileName.split("\\."));
		String ext = nameP.get(nameP.size()-1);
		if (ext.equals("gz") || ext.equals("zip")) {
			inputStream = fromGzippedToBytes(inputStream, ext);
		}
		PPINOTResource resource = new PPINOTResource(processReader, id,userService, converterHelper.getModel2XmlConverter(),modelRepository);
		Collection<PPISet> ppiSet = resource.getPPIs(id);
		PPIEvaluator evaluator = new MXMLEvaluator(inputStream);
		PPISet ppis = (PPISet) ppiSet.toArray()[0];
		List<Collection<Evaluation>> evaluations = new ArrayList<Collection<Evaluation>>();
		for(PPI ppi : ppis.getPpis()) {
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
	        	ZipArchiveEntry entry = (ZipArchiveEntry)in.getNextEntry();
	        	out = new FileOutputStream("temp.mxml");
	        	IOUtils.copy(in, out); 
	        	file = new FileInputStream("temp.mxml");
	        	return file;
        	}
        	else if (ext.equals("gz")) {
        		CompressorInputStream in = new CompressorStreamFactory().createCompressorInputStream("gz", inputStream);
        		out = new FileOutputStream("temp.mxml");
        		IOUtils.copy(in, out); 
            	file = new FileInputStream("temp.mxml");
            	return file;
        	}
        } catch (ArchiveException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
        } catch (CompressorException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return file;
    }

	// ------------------------------ ADDED BY TOKEN

	@Path("/model/{token}/{id}/xml")
	@Produces(MediaType.APPLICATION_XML)
	@GET
	public String getModelByTokenXml(@PathParam("token") String token,
			@PathParam("id") String id) {
		Model m = modelRepository.getModelUsingToken(id, token);
		return converterHelper.converModelToXML(m);
	}

	@Path("/model/{token}/{id}/json")
	@Produces(MediaType.APPLICATION_JSON)
	@GET
	public InputStream getModelByTokenJson(@PathParam("token") String token,
			@PathParam("id") String id) {
		return modelRepository.getModelReaderUsingToken(id, token);
	}

}
