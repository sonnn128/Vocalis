package com.sonnguyen.base.service.impl;

import com.sonnguyen.base.config.JwtService;
import com.sonnguyen.base.exception.CommonException;
import com.sonnguyen.base.model.Gender;
import com.sonnguyen.base.model.Role;
import com.sonnguyen.base.model.User;
import com.sonnguyen.base.payload.request.RegisterRequest;
import com.sonnguyen.base.payload.response.AuthResponse;
import com.sonnguyen.base.payload.response.UserDTO;
import com.sonnguyen.base.repository.RoleRepository;
import com.sonnguyen.base.repository.UserRepository;
import com.sonnguyen.base.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    @Value("${jwt.EXPIRATION_TIME:3600000}")
    private int JWT_EXPIRATION_TIME;

    @Value("${jwt.EXPIRATION_TIME_REMEMBER_ME:3600000}")
    private int JWT_EXPIRATION_TIME_REMEMBER_ME;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public AuthResponse login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        User user = userRepository.findByUsername(username);
        String token = jwtService.generateToken((UserDetails) authentication.getPrincipal(), JWT_EXPIRATION_TIME);
        
        return AuthResponse.builder()
                .token(token)
                .user(UserDTO.fromUser(user))
                .build();
    }

    @Override
    public void register(String username, String password) {
        User existingUser = userRepository.findByUsername(username);
        if (existingUser != null) {
            throw new CommonException("username exist", HttpStatus.CONFLICT);
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        
        // Assign default USER role
        Role userRole = roleRepository.findById("USER").orElse(null);
        if (userRole == null) {
            userRole = new Role();
            userRole.setId("USER");
            userRole.setPermissions(new HashSet<>());
            roleRepository.save(userRole);
        }
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);
        
        userRepository.save(user);
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        // Check if username already exists
        User existingUser = userRepository.findByUsername(request.getUsername());
        if (existingUser != null) {
            throw new CommonException("Username already exists", HttpStatus.CONFLICT);
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        
        // Set gender if provided
        if (request.getGender() != null) {
            try {
                user.setGender(Gender.valueOf(request.getGender().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Invalid gender, leave as null
            }
        }

        // Assign default USER role
        Role userRole = roleRepository.findById("USER").orElse(null);
        if (userRole == null) {
            userRole = new Role();
            userRole.setId("USER");
            userRole.setPermissions(new HashSet<>());
            roleRepository.save(userRole);
        }
        Set<Role> roles = new HashSet<>();
        roles.add(userRole);
        user.setRoles(roles);

        // Save user
        user = userRepository.save(user);

        // Generate token for the new user
        String token = jwtService.generateToken(
                new com.sonnguyen.base.model.CustomUserDetails(user),
                JWT_EXPIRATION_TIME
        );

        // Return response with token and user data
        return AuthResponse.builder()
                .token(token)
                .user(UserDTO.fromUser(user))
                .build();
    }
}

