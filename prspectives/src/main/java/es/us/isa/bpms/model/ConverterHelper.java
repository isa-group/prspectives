package es.us.isa.bpms.model;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.jboss.resteasy.spi.NotFoundException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.us.isa.bpms.ral.RALModel2XMLConverter;
import es.us.isa.bpms.repository.ModelRepository;

@Service("converterHelper")
public class ConverterHelper {

	private static final Logger log = Logger.getLogger(ConverterHelper.class
            .getName());
	
	
	private Model2XmlConverter model2XmlConverter;
	
	@Autowired
	private ModelRepository modelRepository;
	
	
	public ConverterHelper() {
		model2XmlConverter = new RALModel2XMLConverter();
	}

	
	
	
	
	public final Model2XmlConverter getModel2XmlConverter() {
		return model2XmlConverter;
	}





	public final void setModel2XmlConverter(Model2XmlConverter model2XmlConverter) {
		this.model2XmlConverter = model2XmlConverter;
	}





	public String converModelToXML(Model m){
    	if (m == null) {
            throw new org.jboss.resteasy.spi.NotFoundException("Model not found");
        }

        //String xml = m.getXml();

    	String xml=null;
    	
        if ((xml == null || xml.isEmpty())) {
        	//System.out.println("TYPE: " + m.getType());
            if (model2XmlConverter.canTransform(m.getType())) {
                try {
                    xml = createAndStoreXml(m);
                } catch (Exception e) {
                    log.log(Level.WARNING, "Error while transforming model to XML", e);
                    throw new RuntimeException("Error while transforming model to XML", e);
                }
            } else {
                throw new NotFoundException("XML representation not available");
            }
        }

        return xml;
    }
    
    
    public String createAndStoreXml(Model m) {
        String xml;
        
        JSONObject jsonModel = m.getModel();
        if (jsonModel == null) {
            throw new RuntimeException("Model not valid");
        }

        xml = model2XmlConverter.transformToXml(m).toString();
        m.setXml(xml);

        try {
            modelRepository.saveModel(m.getModelId(), m);
        } catch (Exception e) {
            log.warning("Error saving model");
            log.warning(e.toString());
        }

        return xml;
    }
	
	
}
