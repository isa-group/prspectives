package es.us.isa.prspectives.bpmn.ral.analyser;

import es.us.isa.bpmn.handler.Bpmn20ModelHandler;
import es.us.isa.cristal.RawResourceAssignment;
import es.us.isa.cristal.analyser.RALAnalyser;
import es.us.isa.cristal.organization.model.gson.OrganizationalModel;

public class OwlAnalyserFactory implements AnalyserFactory{

    @Override
    public String getType() {
        return "OwlAnalyser";
    }

    @Override
    public RALAnalyser getAnalyser(Bpmn20ModelHandler bpmn, String processId, OrganizationalModel organization) throws Exception {
        return null;
    }

    @Override
    public RALAnalyser getAnalyser(RawResourceAssignment assignment, OrganizationalModel organization) throws Exception {
        return null;
    }
}
