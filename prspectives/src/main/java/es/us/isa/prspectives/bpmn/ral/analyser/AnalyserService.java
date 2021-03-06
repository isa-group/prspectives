package es.us.isa.prspectives.bpmn.ral.analyser;


import java.io.ByteArrayInputStream;
import java.net.URI;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.UriInfo;

import com.google.gson.Gson;
import es.us.isa.bpmn.handler.Bpmn20ModelHandler;
import es.us.isa.bpmn.handler.Bpmn20ModelHandlerImpl;
import es.us.isa.cristal.RawResourceAssignment;
import es.us.isa.cristal.analyser.RALAnalyser;
import es.us.isa.cristal.model.TaskDuty;
import es.us.isa.cristal.organization.model.gson.OrganizationalModel;
import es.us.isa.prspectives.bpmn.BpmnMetamodel;
import es.us.isa.prspectives.bpmn.ral.ResourceExtensionHandler;
import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.core.repository.ModelRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.util.StringUtils;

/**
 * User: resinas
 * Date: 09/04/13
 * Time: 08:55
 */
public class AnalyserService {

    private static final Logger log = Logger.getLogger(AnalyserService.class
            .getName());

    private RALAnalyserLibrary library;
    private ModelRepository modelRepository;
    private Model model;

    public AnalyserService(Model model, ModelRepository modelRepository, RALAnalyserLibrary library) {
        this.library = library;
        this.model = model;
        this.modelRepository = modelRepository;
    }

    @Path("/{processId}/potential_participants")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Map<String,Set<String>> genericPotentialParticipants(String operationData,
                                                    @PathParam("processId") String processId,
                                                    @QueryParam("duty") @DefaultValue("RESPONSIBLE") String duty) throws Exception {
        Map<String,Set<String>> resultMap = new HashMap<String,Set<String>>();
        OperationData data = new OperationData(operationData);
        TaskDuty taskDuty = TaskDuty.valueOf(duty);

        RALAnalyser analyser = getAnalyser(processId, data.getOrganizationId(), data.getRawResourceAssignment());

        Collection<String> acts = data.getActivitiesId();
        for(String activityId: acts){
            Set<String> res = analyser.potentialParticipants(activityId, taskDuty);
            resultMap.put(activityId, res);
        }

        return resultMap;
    }

    @Path("/{processId}/potential_participants/{activityId}")
    @GET
    @Produces("application/json")
    public Set<String> potentialParticipants(@PathParam("activityId") String activityId,
                                             @PathParam("processId") String processId,
                                             @QueryParam("duty") @DefaultValue("RESPONSIBLE") String duty,
                                             String context) throws Exception {

        RALAnalyser analyser = getAnalyser(processId);
        return analyser.potentialParticipants(activityId, TaskDuty.valueOf(duty));
    }
    

	@Path("/{processId}/potential_activities/{personName}")
	@GET @Produces("application/json")
	public Set<String> potentialActivities(@PathParam("processId") String processId,
                                           @PathParam("personName") String personName,
                                           @QueryParam("duty") @DefaultValue("RESPONSIBLE") String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId);
		return analyser.potentialActivities(personName, TaskDuty.valueOf(duty));
	}

	@Path("/{processId}/basic_consistency")
	@GET @Produces("application/json")
	public boolean basicConsistency(@PathParam("processId") String processId,
                                    @PathParam("activityName") String activityName,
                                    @QueryParam("duty") @DefaultValue("RESPONSIBLE")  String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId);
		return analyser.basicConsistency(activityName, TaskDuty.valueOf(duty));
	}

	@Path("/{processId}/non_participants")
	@GET @Produces("application/json")
	public Set<String> nonParticipants(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId);
		List<String> acts = getActivities(activities);
		return analyser.nonParticipants(acts, TaskDuty.valueOf(duty));
	}

	@Path("/{processId}/permanent_participants")
	@GET @Produces("application/json")
	public Set<String> permanentParticipants(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId);
		List<String> acts = getActivities(activities);
		return analyser.permanentParticipants(acts, TaskDuty.valueOf(duty));
	}

	@Path("/{processId}/critical_activities")
	@GET @Produces("application/json")
	public Set<String> criticalActivities(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId);
		List<String> acts = getActivities(activities);
		return analyser.criticalActivities(acts, TaskDuty.valueOf(duty));
	}

	@Path("/{processId}/critical_participants")
	@GET @Produces("application/json")
	public Set<String> criticalParticipants(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId);
		List<String> acts = getActivities(activities);
		return analyser.criticalParticipants(acts, TaskDuty.valueOf(duty));
	}

	

	@Path("/{processId}/indispensable_participants")
	@GET @Produces("application/json")
	public Set<String> indispensableParticipants(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId);
		List<String> acts = getActivities(activities);
		return analyser.indispensableParticipants(acts, TaskDuty.valueOf(duty));
	}


    // -- Auxiliary methods
	
	
	private List<String> getActivities(String activities) {
		List<String> acts = null;
		if(activities!=null && !activities.isEmpty() && !activities.equalsIgnoreCase("all")){
			acts = Arrays.asList(activities.split(";"));
		}
		return acts;
	}
	
	//@Cacheable(value = "defaultCache", key = "#processId.concat('-').concat(#bpmnModelUrl).concat('-').concat(#organizationModelUrl).concat('-').concat(#ralExpr)")
	private RALAnalyser getAnalyser(String processId) throws Exception {
		return getAnalyser (processId, null);
	}

    private  RALAnalyser getAnalyser(String processId, String organizationId) throws Exception {
        AnalyserFactory analyserFactory = library.getFactory();
        log.info("CREATE NEW ANALYZER:" + model.getModelId());

        Bpmn20ModelHandler bpmn = getBpmn();
        OrganizationalModel org = getOrganizationalModel(organizationId);

        return analyserFactory.getAnalyser(bpmn, processId, org);
    }

    private RALAnalyser getAnalyser(String processId, String organizationId, RawResourceAssignment resourceAssignment) throws Exception {
        AnalyserFactory analyserFactory = library.getFactory();
        Bpmn20ModelHandler bpmn = getBpmn();
        OrganizationalModel org = getOrganizationalModel(organizationId);

        return analyserFactory.getAnalyser(bpmn, processId, org, resourceAssignment);
    }

    private OrganizationalModel getOrganizationalModel(String organizationId) {
        if (StringUtils.isEmpty(organizationId)) {
            ResourceExtensionHandler extension = new ResourceExtensionHandler();
            organizationId = extension.getOrganizationId(model);
        }

        return loadOrganizationalModel(organizationId);
    }

    private OrganizationalModel loadOrganizationalModel(String organizationId) {
        Model model = modelRepository.getModel(organizationId);
        Gson gson = new Gson();
        return gson.fromJson(model.getModel().toString(), OrganizationalModel.class);
    }

    private Bpmn20ModelHandler getBpmn() {
        if (! (model.getMetamodel() instanceof BpmnMetamodel)) {
            throw new RuntimeException("Model is not a BPMN model");
        }

        return loadBpmn(model);
    }

    private Bpmn20ModelHandler loadBpmn(Model m) {
        m.updateXmlFromModel();
        Bpmn20ModelHandler modelHandler = new Bpmn20ModelHandlerImpl();
        try {
            modelHandler.load(new ByteArrayInputStream(m.getXml().getBytes()));
        } catch (Exception e) {
            log.log(Level.SEVERE, "Error loading BPMN XML", e);
            throw new RuntimeException("Error loading BPMN XML", e);
        }
        return modelHandler;
    }


}
