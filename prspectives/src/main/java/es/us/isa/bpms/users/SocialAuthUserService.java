package es.us.isa.bpms.users;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import org.brickred.socialauth.SocialAuthManager;
import org.brickred.socialauth.spring.bean.SocialAuthTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

/**
 * User: resinas
 * Date: 20/05/13
 * Time: 21:12
 */
@Service
@Profile("!devel")
public class SocialAuthUserService implements UserService {
	
	private Map<String,String> tokenMap;
	
	public SocialAuthUserService(){
		super();
		tokenMap = new HashMap<String,String>();
	}
	
    @Autowired
    private SocialAuthTemplate socialAuthTemplate;

    @Override
    public String getLoggedUser() {
        SocialAuthManager manager = socialAuthTemplate.getSocialAuthManager();
        if (manager == null) {
            throw new RuntimeException("Not authenticated");
        }
        else {
            try {
                return manager.getCurrentAuthProvider().getUserProfile().getEmail();
            } catch (Exception e) {
                throw new RuntimeException("Not authenticated");
            }
        }
    }

    @Override
    public boolean isLogged() {
        boolean result = false;
        try {
            String user = getLoggedUser();
            if (user != null && !user.isEmpty())
                result = true;
        } catch (Exception e) {

        }

        return result;
    }

    @Override
    public void logout() {
        SocialAuthManager manager = socialAuthTemplate.getSocialAuthManager();
        if (manager != null) {
            for(String id: manager.getConnectedProvidersIds()) {
                manager.disconnectProvider(id);
            }
        }
    }

	@Override
	public String getToken() {
		String token="";
		if(tokenMap.containsValue(this.getLoggedUser())){
			for(Entry<String,String> e: tokenMap.entrySet()){
				if(e.getValue().equals(this.getLoggedUser())){
					token = e.getKey();
					break;
				}
			}
		}else{
			token = UUID.randomUUID().toString();
			tokenMap.put(token, this.getLoggedUser());
		}
		return token;
	}

	@Override
	public String getUserByToken(String token) {
		return tokenMap.get(token);
	}
}
