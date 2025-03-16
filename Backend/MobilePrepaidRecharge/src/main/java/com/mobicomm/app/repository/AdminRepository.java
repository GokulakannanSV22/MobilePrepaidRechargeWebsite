package com.mobicomm.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mobicomm.app.model.Admin;
import com.mobicomm.app.model.Plan;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
	Optional<Admin> findByEmail(String email);
	Optional<Admin> findTopByOrderByAdminIdDesc();
}
