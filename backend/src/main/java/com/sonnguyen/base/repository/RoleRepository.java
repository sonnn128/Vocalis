package com.sonnguyen.base.repository;

import com.sonnguyen.base.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, String> {
}
