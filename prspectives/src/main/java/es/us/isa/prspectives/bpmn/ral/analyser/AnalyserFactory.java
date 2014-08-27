package es.us.isa.prspectives.bpmn.ral.analyser;

import es.us.isa.cristal.analyser.RALAnalyser;
import es.us.isa.prspectives.core.model.metamodels.TypedElement;

public interface AnalyserFactory extends TypedElement {
	
	RALAnalyser getAnalyser(String processId, String modelId, String organizationId, String assignment) throws Exception;
	
}
