package com.mobicomm.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mobicomm.app.model.Plan;
import com.mobicomm.app.model.PlanBenefits;

@Repository
public interface PlanBenefitsRepository extends JpaRepository<PlanBenefits, String> {

	Optional<PlanBenefits> findTopByOrderByBenefitIdDesc();
}
