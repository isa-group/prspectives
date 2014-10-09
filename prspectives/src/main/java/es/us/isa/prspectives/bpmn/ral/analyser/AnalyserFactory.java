package es.us.isa.prspectives.bpmn.ral.analyser;

import es.us.isa.bpmn.handler.Bpmn20ModelHandler;
import es.us.isa.cristal.RawResourceAssignment;
import es.us.isa.cristal.analyser.RALAnalyser;
import es.us.isa.cristal.organization.model.gson.OrganizationalModel;
import es.us.isa.prspectives.core.model.metamodels.TypedElement;

public interface AnalyserFactory extends TypedElement {

    RALAnalyser getAnalyser(Bpmn20ModelHandler bpmn, String processId, OrganizationalModel organization) throws Exception;
    RALAnalyser getAnalyser(RawResourceAssignment assignment, OrganizationalModel organization) throws Exception;
}
