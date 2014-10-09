package es.us.isa.prspectives.bpmn.ral;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.StringWriter;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import es.us.isa.bpmn.handler.Bpmn20ModelHandler;
import es.us.isa.bpmn.handler.Bpmn20ModelHandlerImpl;
import es.us.isa.cristal.BpmnAssignmentModelHandler;

import es.us.isa.cristal.RawResourceAssignment;
import org.springframework.core.io.Resource;
import es.us.isa.prspectives.core.model.Model;
import es.us.isa.prspectives.bpmn.ppinot.PPINOTModel2XmlConverter;

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

		String bpmnString = xmlResult.toString();
        ResourceExtensionHandler extensionHandler = new ResourceExtensionHandler();

        try {
            RawResourceAssignment activityAssignmentMap = extensionHandler.getRALAssignment(m);

            Bpmn20ModelHandler bpmn = new Bpmn20ModelHandlerImpl();
            bpmn.load(new ByteArrayInputStream(bpmnString.getBytes()));

            BpmnAssignmentModelHandler assignmentHandler = new BpmnAssignmentModelHandler(bpmn);
            assignmentHandler.updatePotentialOwners(activityAssignmentMap);

			ByteArrayOutputStream os = new ByteArrayOutputStream();
			bpmn.save(os);
			String modified = os.toString();
			xmlResult = new StringWriter();
			xmlResult.write(modified);
			
		} catch (Exception e) {
			e.printStackTrace();
            log.log(Level.WARNING, "Could not add assignments to XML model", e);
		}
		
		return xmlResult;
	}


}
