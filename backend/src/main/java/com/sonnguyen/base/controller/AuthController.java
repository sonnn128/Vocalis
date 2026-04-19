package com.sonnguyen.base.controller;

import com.sonnguyen.base.model.User;
import com.sonnguyen.base.payload.request.AuthRequest;
import com.sonnguyen.base.payload.request.RegisterRequest;
import com.sonnguyen.base.payload.response.ApiResponse;
import com.sonnguyen.base.payload.response.UserDTO;
import com.sonnguyen.base.service.AuthService;
import com.sonnguyen.base.utils.SecurityUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .success(true)
                        .message("Login successful")
                        .data(authService.login(authRequest.getUsername(), authRequest.getPassword()))
                        .build()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        var authResponse = authService.register(registerRequest);
        return ResponseEntity.ok().body(
                ApiResponse.builder()
                        .success(true)
                        .message("Registration successful")
                        .data(authResponse)
                        .build()
        );
    }

    @PostMapping("/token")
    public ResponseEntity<?> token(@Valid @RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok().body(authService.login(authRequest.getUsername(), authRequest.getPassword()).getToken());
    }

    /** GET /api/v1/auth/me — return current authenticated user profile */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getMe() {
        User currentUser = SecurityUtils.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.<UserDTO>builder()
                .success(true)
                .message("Success")
                .data(UserDTO.fromUser(currentUser))
                .build());
    }

    /** GET /api/v1/auth/profile — alias for /me used by the frontend AuthContext */
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile() {
        return getMe();
    }
}
