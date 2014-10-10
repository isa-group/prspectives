package es.us.isa.prspectives.bpmn.ral.analyser;

import es.us.isa.cristal.organization.model.gson.OrganizationalModel;
import org.neo4j.cypher.ExecutionEngine;
import org.neo4j.graphdb.GraphDatabaseService;
import org.neo4j.graphdb.factory.GraphDatabaseFactory;
import org.neo4j.graphdb.factory.GraphDatabaseSettings;
import org.neo4j.kernel.impl.util.StringLogger;
import org.springframework.cache.annotation.Cacheable;

import java.io.File;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * Neo4JCache
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class Neo4JCache {
    private static final Logger log = Logger.getLogger(Neo4JCache.class.getName());

    @Cacheable("modelCache")
    public ExecutionEngine getExecutionEngine(OrganizationalModel org) {

        ExecutionEngine engine;

        log.info("Loading execution engine for " + org.hashCode());

        String dirName = System.getenv("TEMP") + File.separator + "neo4j-" + UUID.randomUUID().toString();
        GraphDatabaseService graphDb = new GraphDatabaseFactory()
                .newEmbeddedDatabaseBuilder(dirName)
                .setConfig(GraphDatabaseSettings.node_keys_indexable, "name, position, role, unit")
                .setConfig(GraphDatabaseSettings.node_auto_indexing, "true")
                .newGraphDatabase();
        engine = new ExecutionEngine(graphDb, StringLogger.logger(new File(dirName + File.separator + "log.log")));
        engine.execute(org.getCypherCreateQuery());

        return engine;
    }

}
