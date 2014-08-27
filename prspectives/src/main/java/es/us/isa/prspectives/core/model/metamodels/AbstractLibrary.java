package es.us.isa.prspectives.core.model.metamodels;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * AbstractLibrary
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public abstract class AbstractLibrary<T extends TypedElement> {
    protected Map<String, T> elements;

    public AbstractLibrary() {
        elements = new HashMap<String, T>();
    }

    public AbstractLibrary(T... elements) {
        this();
        for (T e : elements) {
            this.elements.put(e.getType(), e);
        }
    }

    public void register(T m) {
        elements.put(m.getType(), m);
    }

    public T get(String type) {
        return elements.get(type);
    }

    public Set<String> availableTypes() {
        return elements.keySet();
    }
}
