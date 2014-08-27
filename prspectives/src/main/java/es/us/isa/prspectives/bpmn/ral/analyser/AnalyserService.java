package es.us.isa.prspectives.bpmn.ral.analyser;


import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import es.us.isa.cristal.analyser.RALAnalyser;
import es.us.isa.cristal.model.TaskDuty;

/**
 * User: resinas
 * Date: 09/04/13
 * Time: 08:55
 */
@Path("/analyser")
public class AnalyserService {

    private static final Logger log = Logger.getLogger(AnalyserService.class
            .getName());

    private RALAnalyserLibrary library;

    public AnalyserService(RALAnalyserLibrary library) {
        this.library = library;
    }

    @Path("/{processId}/{activityName}/potential_participants")
    @GET
    @Produces("application/json")
	public Set<String> potentialParticipants(@PathParam("processId") String processId, @PathParam("activityName") String activityName, @QueryParam("duty") String duty, @QueryParam("organization") String organizationModelUrl, @QueryParam("assignment") String assignment) throws Exception {
    	
    	
    	if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
    	RALAnalyser analyser = getAnalyser(processId, processId, organizationModelUrl, assignment);
		return analyser.potentialParticipants(activityName, TaskDuty.valueOf(duty));
	}
    
    
    @Path("/{processId}/potential_participants")
    @GET
    @Produces("application/json")
	public Map<String,Set<String>> potentialParticipantsForMultipleActivities(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty, @QueryParam("organization") String organizationModelUrl, @QueryParam("assignment") String assignment) throws Exception {
    	Map<String,Set<String>> resultMap = new HashMap<String,Set<String>>();
    	if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
    	TaskDuty td = TaskDuty.valueOf(duty);
    	RALAnalyser analyser = getAnalyser(processId, processId, organizationModelUrl, assignment);
    	List<String> acts = getActivities(activities);
    	for(String activityName: acts){
    		Set<String> res = analyser.potentialParticipants(activityName, td);
    		resultMap.put(activityName, res);
    	}
    	return resultMap;
    }
    
    	
	

	@Path("/{processId}/{personName}/potential_activities")
	@GET @Produces("application/json")
	public Set<String> potentialActivities(@PathParam("processId") String processId, @PathParam("personName") String personName, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId, processId);
		return analyser.potentialActivities(personName, TaskDuty.valueOf(duty));
	}

	@Path("/{processId}/{activityName}/basic_consistency")
	@GET @Produces("application/json")
	public boolean basicConsistency(@PathParam("processId") String processId,  @PathParam("activityName") String activityName, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId, processId);
		return analyser.basicConsistency(activityName, TaskDuty.valueOf(duty));
	}

	@Path("/{processId}/non_participants")
	@GET @Produces("application/json")
	public Set<String> nonParticipants(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId, processId);
		List<String> acts = getActivities(activities);
		return analyser.nonParticipants(acts, TaskDuty.valueOf(duty));
	}

	@Path("/{processId}/permanent_participants")
	@GET @Produces("application/json")
	public Set<String> permanentParticipants(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId, processId);
		List<String> acts = getActivities(activities);
		return analyser.permanentParticipants(acts, TaskDuty.valueOf(duty));
	}

	@Path("/{processId}/critical_activities")
	@GET @Produces("application/json")
	public Set<String> criticalActivities(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId, processId);
		List<String> acts = getActivities(activities);
		return analyser.criticalActivities(acts, TaskDuty.valueOf(duty));
	}

	@Path("/{processId}/critical_participants")
	@GET @Produces("application/json")
	public Set<String> criticalParticipants(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId, processId);
		List<String> acts = getActivities(activities);
		return analyser.criticalParticipants(acts, TaskDuty.valueOf(duty));
	}

	

	@Path("/{processId}/indispensable_participants")
	@GET @Produces("application/json")
	public Set<String> indispensableParticipants(@PathParam("processId") String processId, @QueryParam("activities") String activities, @QueryParam("duty") String duty) throws Exception {
		if(duty==null || duty.isEmpty()){
			duty = "RESPONSIBLE";
		}
		RALAnalyser analyser = getAnalyser(processId, processId);
		List<String> acts = getActivities(activities);
		return analyser.indispensableParticipants(acts, TaskDuty.valueOf(duty));
	}

	
	
	
	private List<String> getActivities(String activities) {
		List<String> acts = null;
		if(activities!=null && !activities.isEmpty() && !activities.equalsIgnoreCase("all")){
			acts = Arrays.asList(activities.split(";"));
		}
		return acts;
	}
	
	//@Cacheable(value = "defaultCache", key = "#processId.concat('-').concat(#bpmnModelUrl).concat('-').concat(#organizationModelUrl).concat('-').concat(#ralExpr)")
	private RALAnalyser getAnalyser(String processId, String modelId) throws Exception {
		return getAnalyser (processId, modelId, null, null);
	}
	
	private  RALAnalyser getAnalyser(String processId, String modelId, String organizationId, String assignment) throws Exception {
        AnalyserFactory analyserFactory = library.getFactory();
        return analyserFactory.getAnalyser(processId, modelId, organizationId, assignment);
    }
}