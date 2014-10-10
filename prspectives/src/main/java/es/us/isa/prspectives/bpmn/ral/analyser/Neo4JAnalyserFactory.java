package es.us.isa.prspectives.bpmn.ral.analyser;

import java.io.File;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

import es.us.isa.bpmn.handler.Bpmn20ModelHandler;
import es.us.isa.cristal.RawResourceAssignment;
import es.us.isa.cristal.organization.model.gson.OrganizationalModel;
import es.us.isa.prspectives.bpmn.BpmnMetamodel;
import es.us.isa.prspectives.bpmn.ral.ResourceExtensionHandler;
import org.neo4j.cypher.ExecutionEngine;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;
import org.neo4j.graphdb.factory.GraphDatabaseSettings;
import org.neo4j.kernel.impl.util.StringLogger;
import org.springframework.cache.annotation.Cacheable;

import com.google.gson.Gson;

import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.core.repository.ModelRepository;
import es.us.isa.cristal.BPEngine;
import es.us.isa.cristal.analyser.RALAnalyser;
import es.us.isa.cristal.neo4j.analyzer.Neo4jRALAnalyser;
import es.us.isa.cristal.neo4j.analyzer.util.DesignTimeAnalyserBPEngine;


public class Neo4JAnalyserFactory implements AnalyserFactory {

    private static final Logger log = Logger.getLogger(Neo4JAnalyserFactory.class.getName());

    private Neo4JCache cache;

    public Neo4JAnalyserFactory(Neo4JCache cache) {
        this.cache = cache;
    }

    @Override
    public String getType() {
        return "Neo4JAnalyser";
    }


    @Override
    public RALAnalyser getAnalyser(Bpmn20ModelHandler bpmn, String processId, OrganizationalModel organization) throws Exception {
        ExecutionEngine engine = cache.getExecutionEngine(organization);
        BPEngine bpEngine = new DesignTimeAnalyserBPEngine(bpmn, null);
        Neo4jRALAnalyser analyzer = new Neo4jRALAnalyser(engine, bpEngine, processId);

        return analyzer;
    }

    @Override
    public RALAnalyser getAnalyser(Bpmn20ModelHandler bpmn, String processId, OrganizationalModel organization, RawResourceAssignment assignmentExtension) throws Exception {
        ExecutionEngine engine = cache.getExecutionEngine(organization);
        BPEngine bpEngine = new DesignTimeAnalyserBPEngine(bpmn, assignmentExtension);
        Neo4jRALAnalyser analyzer = new Neo4jRALAnalyser(engine, bpEngine, processId);

        return analyzer;
    }



}
