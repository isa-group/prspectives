package es.us.isa.prspectives.bpmn.ral;

import es.us.isa.cristal.RawResourceAssignment;
import es.us.isa.prspectives.core.model.Model;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * ResourceExtensionHandler
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public class ResourceExtensionHandler {
    private boolean hasBeenAssigned(Model m){
        boolean result = false;
        try {
            if(m.getExtensions().has("assignments")){
                JSONObject obj = m.getExtensions().getJSONObject("assignments");
                if(obj.has("organizationalModel") && !obj.getString("organizationalModel").isEmpty()){
                    result = true;
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return result;
    }

    public String getOrganizationId(Model m){
        if(!hasBeenAssigned(m)){
            return null;
        }
        String result=null;

        try {
            if(m.getExtensions().has("assignments")){
                JSONObject obj = m.getExtensions().getJSONObject("assignments");
                if(obj.has("organizationalModel") && !obj.getString("organizationalModel").isEmpty()){
                    result = obj.getString("organizationalModel");
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return result;
    }

    public RawResourceAssignment getRALAssignment(Model m) throws JSONException {
        RawResourceAssignment assignment = new RawResourceAssignment();
        //System.out.println("HAS ASSIGNMENTS: " + m.getExtensions().has("assignments"));
        if(m.getExtensions().has("assignments")){
            JSONObject obj = m.getExtensions().getJSONObject("assignments");
            //System.out.println("ORGANIZATIONAL MODEL: " + obj.getString("organizationalModel"));
            if(obj.has("organizationalModel") && !obj.getString("organizationalModel").isEmpty()){
                Iterator<?> it = obj.keys();
                while(it.hasNext()){
                    String next = (String) it.next();
                    //System.out.println("NEXT: " + next);
                    if(!next.equals("organizationalModel")){
                        JSONObject process = obj.getJSONObject(next);
                        processJSONProcess(process,assignment);
                    }
                }
            }
        }
        return assignment;
    }

    private void processJSONProcess(JSONObject process, RawResourceAssignment activityAssignmentMap) throws JSONException{
        if(process.has("active") && process.getString("active").equalsIgnoreCase("ral")){
            if(process.has("ralAssignment")){
                JSONObject assignments = process.getJSONObject("ralAssignment");
                Iterator<?> it = assignments.keys();
                while(it.hasNext()){
                    String next = (String) it.next();
                    activityAssignmentMap.add(next, assignments.getString(next));
                }
            }
        }
    }

}
