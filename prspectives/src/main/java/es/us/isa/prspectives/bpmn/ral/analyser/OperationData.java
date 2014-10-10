package es.us.isa.prspectives.bpmn.ral.analyser;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import es.us.isa.cristal.RawResourceAssignment;
import es.us.isa.cristal.analyser.RALAnalyser;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

/**
 * OperationData
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class OperationData {
    private JsonObject data;
    private final Gson gson;

    public OperationData(String operationData) {
        gson = new Gson();
        this.data = gson.fromJson(operationData, JsonObject.class);
    }

    public Collection<String> getActivitiesId() {
        List<String> activities = gson.fromJson(data.get("activities"), ArrayList.class);
        return activities;
    }

    public Collection<String> getPersonNames() {
        return gson.fromJson(data.get("persons"), ArrayList.class);
    }

    public RawResourceAssignment getRawResourceAssignment() {
        JsonElement assignment = data.get("assignment");
        RawResourceAssignment resourceAssignment = new RawResourceAssignment();
        resourceAssignment.addAll(gson.fromJson(assignment, HashMap.class));
        return resourceAssignment;
    }

    public String getOrganizationId() {
        return data.getAsJsonPrimitive("organization").getAsString();
    }


}
