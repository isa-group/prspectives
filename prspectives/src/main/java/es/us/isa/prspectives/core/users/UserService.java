package es.us.isa.prspectives.core.users;

/**
 * User: resinas
 * Date: 20/05/13
 * Time: 21:10
 */
public interface UserService {
    public String getLoggedUser();
    public boolean isLogged();
    public void logout();
    public String getToken();
    public String getUserByToken(String token);
    
}
