package com.sonnguyen.base.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotEmpty(message = "username cannot be empty")
    private String username;

    @NotEmpty(message = "password cannot be empty")
    private String password;

    @Email(message = "email should be valid")
    @NotEmpty(message = "email cannot be empty")
    private String email;

    private String fullName;
    private String phone;
    private String gender;
}
