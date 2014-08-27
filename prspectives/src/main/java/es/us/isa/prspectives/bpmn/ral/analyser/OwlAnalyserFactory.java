package es.us.isa.prspectives.bpmn.ral.analyser;

import es.us.isa.cristal.analyser.RALAnalyser;

public class OwlAnalyserFactory implements AnalyserFactory{

    @Override
    public String getType() {
        return "OwlAnalyser";
    }

    @Override
	public RALAnalyser getAnalyser(String processId, String modelId, String organizationId, String assignment) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

}
