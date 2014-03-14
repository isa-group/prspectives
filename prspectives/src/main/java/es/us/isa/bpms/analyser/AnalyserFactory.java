package es.us.isa.bpms.analyser;

import es.us.isa.cristal.analyser.RALAnalyser;

public interface AnalyserFactory {
	
	RALAnalyser getAnalyser(String processId, String modelId, String organizationId, String assignment) throws Exception;
	
}
