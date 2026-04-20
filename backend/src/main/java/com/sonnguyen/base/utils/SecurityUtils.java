package com.sonnguyen.base.utils;
import com.sonnguyen.base.model.User;
import com.sonnguyen.base.model.CustomUserDetails;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtils {

    public static User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication instanceof AnonymousAuthenticationToken) {
            throw new IllegalStateException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User u) {
            return u;
        }
        if (principal instanceof CustomUserDetails cud) {
            return cud.getUser();
        }
        if (principal instanceof UserDetails) {
            throw new IllegalStateException("Authenticated principal is not a User entity");
        }
        throw new IllegalStateException("No authenticated user found");
    }

    public static boolean isAuthenticated() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null
            && !(authentication instanceof AnonymousAuthenticationToken)
            && authentication.isAuthenticated();
    }
}
