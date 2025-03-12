package com.mobicomm.app.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mobicomm.app.model.PlanBenefits;
import com.mobicomm.app.service.PlanBenefitsService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/plan-benefits")
public class PlanBenefitsController {

	@Autowired
	private PlanBenefitsService planBenefitService;
	@PostMapping
	public PlanBenefits addPlanBenefit(@RequestBody PlanBenefits benefit) {
		//TODO: process POST request
		return planBenefitService.addPlanBenefit(benefit);
	}
	@GetMapping
	public List<PlanBenefits> getAllPlanBenefits() {
		return planBenefitService.getAllPlanBenefits();
	}
	
	
}
