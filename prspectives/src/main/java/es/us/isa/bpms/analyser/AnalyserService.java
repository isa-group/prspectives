package es.us.isa.bpms.analyser;


import java.io.File;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Logger;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.neo4j.cypher.ExecutionEngine;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;
import org.neo4j.graphdb.factory.GraphDatabaseSettings;
import org.neo4j.kernel.impl.util.StringLogger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;

import es.us.isa.bpms.model.ConverterHelper;
import es.us.isa.bpms.model.Model;
import es.us.isa.bpms.repository.ModelRepository;
import es.us.isa.bpms.users.UserService;
import es.us.isa.cristal.BPEngine;
import es.us.isa.cristal.analyser.RALAnalyser;
import es.us.isa.cristal.model.TaskDuty;
import es.us.isa.cristal.neo4j.analyzer.Neo4jRALAnalyser;
import es.us.isa.cristal.neo4j.analyzer.util.DesignTimeAnalyserBPEngine;
import es.us.isa.cristal.organization.model.gson.Document;
import es.us.isa.cristal.organization.model.util.IOUtil;

/**
 * User: resinas
 * Date: 09/04/13
 * Time: 08:55
 */
@Path("/analyser")
public class AnalyserService {

    private static final Logger log = Logger.getLogger(AnalyserService.class
            .getName());

    
    @Autowired
    private ModelRepository modelRepository;

    
    @Autowired
    private ConverterHelper converterHelper;
    
    @Autowired
    private UserService userService;

    

    
    @Path("/potential_participants/{processId}/{activityName}/{duty}")
    @GET
    @Produces("application/json")
	public Set<String> potentialParticipants(@PathParam("processId") String processId, @PathParam("activityName") String activityName, @PathParam("duty") String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId, processId);
		System.out.println("DUTY:" + duty);
		return analyser.potentialParticipants(activityName, TaskDuty.valueOf(duty));
	}
	
	@Path("/check_participants_for_expression/{processId}/{activityName}/{duty}")
	@GET
	@Produces("application/json")
	public Set<String> checkParticipantsForExpression(@QueryParam("expression") String expression, @PathParam("processId") String processId, @QueryParam("organization") String organizationModelUrl, @PathParam("activityName") String activityName, @PathParam("duty") String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId, processId, organizationModelUrl,expression);
		Set<String> result = analyser.potentialParticipants(activityName, TaskDuty.valueOf(duty));
		System.out.println("REUSLT: " + result);
		return result;
	}

	@Path("/potential_activities/{processId}/{personName}/{duty}")
	@GET @Produces("application/json")
	public Set<String> potentialActivities(@PathParam("processId") String processId, @PathParam("personName") String personName, @PathParam("duty") String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId, processId);
		return analyser.potentialActivities(personName, TaskDuty.valueOf(duty));
	}

	@Path("/basic_consistency/{processId}/{activityName}/{duty}")
	@GET @Produces("application/json")
	public boolean basicConsistency(@PathParam("processId") String processId,  @PathParam("activityName") String activityName, @PathParam("duty") String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId, processId);
		return analyser.basicConsistency(activityName, TaskDuty.valueOf(duty));
	}

	@Path("/non_participants/{processId}/{activities}/{duty}")
	@GET @Produces("application/json")
	public Set<String> nonParticipants(@PathParam("processId") String processId, @PathParam("activities") String activities, @PathParam("duty") String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId, processId);
		List<String> acts = getActivities(activities);
		return analyser.nonParticipants(acts, TaskDuty.valueOf(duty));
	}

	@Path("/permanent_participants/{processId}/{activities}/{duty}")
	@GET @Produces("application/json")
	public Set<String> permanentParticipants(@PathParam("processId") String processId, @PathParam("activities") String activities, @PathParam("duty") String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId, processId);
		List<String> acts = getActivities(activities);
		return analyser.permanentParticipants(acts, TaskDuty.valueOf(duty));
	}

	@Path("/critical_activities/{processId}/{activities}/{duty}")
	@GET @Produces("application/json")
	public Set<String> criticalActivities(@PathParam("processId") String processId, @PathParam("activities") String activities, @PathParam("duty") String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId, processId);
		List<String> acts = getActivities(activities);
		return analyser.criticalActivities(acts, TaskDuty.valueOf(duty));
	}

	@Path("/critical_participants/{processId}/{activities}/{duty}")
	@GET @Produces("application/json")
	public Set<String> criticalParticipants(@PathParam("processId") String processId, @PathParam("activities") String activities, @PathParam("duty") String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId, processId);
		System.out.println("----> ACTIVITIES: " + activities);
		List<String> acts = getActivities(activities);
		System.out.println("----> LIST ACTIVITIES: " + acts);
		return analyser.criticalParticipants(acts, TaskDuty.valueOf(duty));
	}

	

	@Path("/indispensable_participants/{processId}/{activities}/{duty}")
	@GET @Produces("application/json")
	public Set<String> indispensableParticipants(@PathParam("processId") String processId, @PathParam("activities") String activities, @PathParam("duty") String duty) throws Exception {
		RALAnalyser analyser = getAnalyser(processId, processId);
		List<String> acts = getActivities(activities);
		return analyser.indispensableParticipants(acts, TaskDuty.valueOf(duty));
	}

	
	
	
	private List<String> getActivities(String activities) {
		List<String> acts = null;
		if(!activities.isEmpty() && !activities.equalsIgnoreCase("all")){
			acts = Arrays.asList(activities.split(";"));
		}
		return acts;
	}
	
	//@Cacheable(value = "defaultCache", key = "#processId.concat('-').concat(#bpmnModelUrl).concat('-').concat(#organizationModelUrl).concat('-').concat(#ralExpr)")
	private RALAnalyser getAnalyser(String processId, String modelId) throws Exception {
		return getAnalyser (processId, modelId, null, null);
	}
	
	private RALAnalyser getAnalyser(String processId, String modelId, String organizationId, String ralExpr) throws Exception {
		
		//System.out.println("CREATE NEW ANALYZER:" + ralExpr);
		
		Model m = modelRepository.getModel(modelId);
		
		String bpmn = converterHelper.createAndStoreXml(m);
		System.out.println(bpmn);
		String orgId = organizationId==null? m.getOrganization() : organizationId;
		
		InputStream is = modelRepository.getModelReader(orgId);
		
		String organization = IOUtil.convertStreamToString(is);
		System.out.println(organization);
		Document doc = Document.importFromJson(organization);
		ExecutionEngine engine;
		
		String dirName = System.getenv("TEMP") + File.separator + "neo4j-" + UUID.randomUUID().toString();
		GraphDatabaseService graphDb = new GraphDatabaseFactory()
		.newEmbeddedDatabaseBuilder(dirName)
		.setConfig(GraphDatabaseSettings.node_keys_indexable,"name, position, role, unit")
		.setConfig(GraphDatabaseSettings.node_auto_indexing, "true")
		.newGraphDatabase();
		engine = new ExecutionEngine( graphDb,StringLogger.logger(new File(dirName + File.separator + "log.log")) );
		engine.execute(doc.getCypherCreateQuery());

		BPEngine bpEngine = new DesignTimeAnalyserBPEngine(bpmn, ralExpr);
		Neo4jRALAnalyser analyzer = new Neo4jRALAnalyser(engine, bpEngine, processId);

		
		
		return analyzer;
	}
    
    
    
}
