package com.sonnguyen.base.payload.response;

import com.sonnguyen.base.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String gender;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserDTO fromUser(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .gender(user.getGender() != null ? user.getGender().toString() : null)
                .roles(user.getRoles() != null ? 
                    user.getRoles().stream()
                        .map(role -> role.getId())
                        .collect(Collectors.toSet())
                    : Set.of())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
