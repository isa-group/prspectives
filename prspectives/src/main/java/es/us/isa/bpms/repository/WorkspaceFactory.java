package es.us.isa.bpms.repository;

/**
 * WorkspaceFactory
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
public interface WorkspaceFactory {
    Workspace createWorkspace(String email);
}
