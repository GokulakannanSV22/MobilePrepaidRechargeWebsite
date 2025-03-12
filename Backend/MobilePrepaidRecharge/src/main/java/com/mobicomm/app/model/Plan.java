package com.mobicomm.app.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Plan {

	@Id
	private String planId;
	private String planName;
	private int validity;
	private String data;
	private String voice;
	private int sms;
	private double price;
	private String badge;
	private String badgeColor;
	@Enumerated(EnumType.STRING)
	private Status planStatus;
	
	@ManyToOne
	@JoinColumn(name = "categoryId",nullable = false)
	private Category category;
	
	@ManyToMany
	@JoinTable(
			name = "PlanAndBenefits",
			joinColumns = @JoinColumn(name = "planId"),
			inverseJoinColumns = @JoinColumn(name = "benefitId"))
	private Set<PlanBenefits> planBenefits = new HashSet<PlanBenefits>();
	
	
}
