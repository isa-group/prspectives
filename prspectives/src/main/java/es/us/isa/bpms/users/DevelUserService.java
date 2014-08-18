package es.us.isa.bpms.users;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * DevelUserService
 * Copyright (C) 2014 Universidad de Sevilla
 *
 * @author resinas
 */
@Service
@Profile("devel")
public class DevelUserService implements UserService {

    private String currentUser = "manuel.resinas@gmail.com";
    private String otherUser = "resman@gmail.com";

    @Override
    public String getLoggedUser() {
        return currentUser;
    }

    @Override
    public boolean isLogged() {
        return true;
    }

    @Override
    public void logout() {
        String old = currentUser;
        currentUser = otherUser;
        otherUser = old;
    }

    @Override
    public String getToken() {
        return null;
    }

    @Override
    public String getUserByToken(String token) {
        return null;
    }
}
