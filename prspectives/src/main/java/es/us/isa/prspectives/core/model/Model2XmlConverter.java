package es.us.isa.prspectives.core.model;

import java.io.StringWriter;

/**
 * Model2XmlConverter
 *
 * @author resinas
 */
public interface Model2XmlConverter {
    boolean canTransform(String type);
    StringWriter transformToXml(Model m);
}
