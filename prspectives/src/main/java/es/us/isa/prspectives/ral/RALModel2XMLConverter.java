package es.us.isa.prspectives.ral;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.xml.bind.JAXBElement;
import javax.xml.namespace.QName;

import org.json.JSONException;
import org.json.JSONObject;

import bpmn.TExpression;
import bpmn.TFormalExpression;
import bpmn.TPotentialOwner;
import bpmn.TResourceAssignmentExpression;
import bpmn.TResourceRole;
import bpmn.TTask;
import org.springframework.core.io.Resource;
import raci2bpmn.ModelHandler;
import raci2bpmn.ProcessHandler;
import es.us.isa.prspectives.model.Model;
import es.us.isa.prspectives.resource.PPINOTModel2XmlConverter;

/**
 * 
 * @author Manuel Leon
 *
 */
public class RALModel2XMLConverter extends PPINOTModel2XmlConverter {

	private static final Logger log = Logger.getLogger(RALModel2XMLConverter.class.getName());

	
	
	public RALModel2XMLConverter() {
		super();
	}

	public RALModel2XMLConverter(String bpmn20XsdPath) {
		super(bpmn20XsdPath);
	}

    public RALModel2XMLConverter(Resource bpmn20Xsd) {
        super(bpmn20Xsd);
    }

	@Override
	public StringWriter transformToXml(Model m) {
		StringWriter xmlResult = super.transformToXml(m);
		Map<String, String> activityAssignmentMap = new HashMap<String,String>();
		String bpmnString = xmlResult.toString();
		
		try {
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
								processJSONProcess(process,activityAssignmentMap);
							}
						}
					}
			}		
			ModelHandler bpmn = new ModelHandler();
			bpmn.loadModel(new ByteArrayInputStream(bpmnString.getBytes()));
			ProcessHandler handler = new ProcessHandler(bpmn.getDefinitions());
			List<TTask> tasks = handler.getTasks();
			for(TTask task: tasks){
				if(activityAssignmentMap.containsKey(task.getName())){
					String assignment = activityAssignmentMap.get(task.getName());
					TPotentialOwner resourceRole = new TPotentialOwner();
					TResourceAssignmentExpression rae = new TResourceAssignmentExpression();
					TFormalExpression exp = new TFormalExpression();
					exp.setLanguage("RAL");
					//QName assignQname = new QName(assignment);
					//exp.setEvaluatesToTypeRef(assignQname);
					exp.getContent().add(assignment);
					QName formalExpQname = new QName("http://www.omg.org/spec/BPMN/20100524/MODEL", "formalExpression", "");
					JAXBElement<? extends TExpression> expEl= new JAXBElement<TFormalExpression>(formalExpQname, TFormalExpression.class, exp);
					rae.setExpression(expEl);
					resourceRole.setResourceAssignmentExpression(rae);
					QName roleQname = new QName("http://www.omg.org/spec/BPMN/20100524/MODEL","potentialOwner","");
					JAXBElement<? extends TResourceRole> res = new JAXBElement<TPotentialOwner>(roleQname, TPotentialOwner.class, resourceRole);
					task.getResourceRole().add(res);
				}
			}
			
			
			
			ByteArrayOutputStream os = new ByteArrayOutputStream();
			bpmn.saveModel(os);
			String modified = os.toString();
			//System.out.println(modified);
			xmlResult = new StringWriter();
			xmlResult.write(modified);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		 return xmlResult;
	}
	
	private void processJSONProcess(JSONObject process, Map<String, String> activityAssignmentMap) throws JSONException{
		
		if(process.has("active") && process.getString("active").equalsIgnoreCase("ral")){
			if(process.has("ralAssignment")){
				JSONObject assignments = process.getJSONObject("ralAssignment");
				Iterator<?> it = assignments.keys();
				while(it.hasNext()){
					String next = (String) it.next();
					activityAssignmentMap.put(next, assignments.getString(next));
					//System.out.println("INSERTED IN MAP: <" + next + ", " + assignments.getString(next) + ">");
				}
			}
			
			
		}
		
	}
}
