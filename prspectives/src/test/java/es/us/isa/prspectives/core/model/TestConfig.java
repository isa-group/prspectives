package es.us.isa.prspectives.core.model;

import es.us.isa.prspectives.core.users.DevelUserService;
import es.us.isa.prspectives.core.users.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * TestConfig
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
@Configuration
public class TestConfig {
    @Bean
    public UserService userService() {
        return new DevelUserService();
    }
}
