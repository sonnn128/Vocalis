package com.sonnguyen.base.config.initializr;

import com.sonnguyen.base.model.Role;
import com.sonnguyen.base.model.User;
import com.sonnguyen.base.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {
        // Initialize USER role
        Role userRole = roleRepository.findById("USER").orElse(null);
        if (userRole == null) {
            userRole = new Role();
            userRole.setId("USER");
            userRole.setPermissions(new HashSet<>());
            roleRepository.save(userRole);
        }

        // Initialize ADMIN role
        Role adminRole = roleRepository.findById("ADMIN").orElse(null);
        if (adminRole == null) {
            adminRole = new Role();
            adminRole.setId("ADMIN");
            adminRole.setPermissions(new HashSet<>());
            roleRepository.save(adminRole);
        }

        // Create default admin user if not exists
        String query = "SELECT u FROM User u WHERE u.username = :username";
        try {
            User existingUser = entityManager.createQuery(query, User.class)
                    .setParameter("username", "admin")
                    .getSingleResult();
            // User already exists, do nothing
        } catch (Exception e) {
            // Create new admin user
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@vocalis.local");
            adminUser.setPassword(passwordEncoder.encode("admin"));
            adminUser.setFullName("Admin User");

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            adminUser.setRoles(roles);

            entityManager.persist(adminUser);
            entityManager.flush();
        }
    }
}