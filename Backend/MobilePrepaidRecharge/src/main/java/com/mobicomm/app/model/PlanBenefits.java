package com.mobicomm.app.model;

import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
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
	
	@ManyToMany(mappedBy = "planBenefits",cascade = CascadeType.PERSIST)
	@JsonIgnore
	private List<Plan> plan;
	
}
