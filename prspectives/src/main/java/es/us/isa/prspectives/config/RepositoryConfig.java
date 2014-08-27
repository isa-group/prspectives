package es.us.isa.prspectives.config;

import es.us.isa.prspectives.core.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * RepositoryConfig
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
@Configuration
public class RepositoryConfig {

    @Value("${PPINOT_REPOSITORY_DIRECTORY}")
    String repositoryDirectory;

    @Bean
    public ModelRepository modelRepository() {
        return new SharedModelRepository(new SharedModelHandler());
    }

    @Bean
    public WorkspaceFactory workspaceFactory() {
        return new FileWorkspaceFactory(repositoryDirectory);
    }
}
