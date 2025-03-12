package com.mobicomm.app.model;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PlanBenefits {

	@Id
	private String benefitId;
	private String benefitName;
	private String icon;
	
	@ManyToMany(mappedBy = "planBenefits")
	private Set<Plan> plan;
	
}
