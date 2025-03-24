package com.mobicomm.app.controller;

import org.springframework.web.bind.annotation.RestController;

import com.mobicomm.app.model.Plan;
import com.mobicomm.app.service.PlanService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;





@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/plans")
public class PlanController {

	@Autowired
	private PlanService planService;
	@GetMapping
	public ResponseEntity<List<Plan>> getAllPlans() {
		List<Plan> plans = planService.getAllPlans();
		
		if(plans.isEmpty())
		{
			return new ResponseEntity<List<Plan>>(HttpStatus.NO_CONTENT);
		}
		else
		{
			return new ResponseEntity<List<Plan>>(plans,HttpStatus.OK);
		}
	}
	@PostMapping
	public ResponseEntity<Plan> addPlan(@RequestBody Plan plan) {
		//TODO: process POST request
		Plan newPlan =  planService.addPlan(plan);
		return new ResponseEntity<Plan>(newPlan,HttpStatus.CREATED);
	}
	
	@PutMapping("/{planId}")
	public ResponseEntity<Plan> updatePlanById(@PathVariable String planId, @RequestBody Plan plan) {
		
		Plan updatedPlan = planService.updatePlanById(planId, plan);
		if(updatedPlan != null)
		{
			return new ResponseEntity<Plan>(updatedPlan,HttpStatus.OK);
		}
		else
		{
			return new ResponseEntity<Plan>(HttpStatus.NO_CONTENT);
		}
	}
	
	@PutMapping("/{planId}/deactivate")
	public ResponseEntity<Plan> deactivatePlanById(@PathVariable String planId) {
		//TODO: process PUT request
		Plan deactivatePlan = planService.deactivatePlanById(planId);
		if(deactivatePlan != null)
		{
			return new ResponseEntity<Plan>(deactivatePlan,HttpStatus.OK);
		}
		else
		{
			return new ResponseEntity<Plan>(HttpStatus.NO_CONTENT);
		}
	}
	
	@PutMapping("/{planId}/activate")
	public ResponseEntity<Plan> activatePlanById(@PathVariable String planId) {
		//TODO: process PUT request
		Plan activatePlan = planService.activatePlanById(planId);
		if(activatePlan != null)
		{
			return new ResponseEntity<Plan>(activatePlan,HttpStatus.OK);
		}
		else
		{
			return new ResponseEntity<Plan>(HttpStatus.NO_CONTENT);
		}
	}
	
	@GetMapping("/{planId}")
	public ResponseEntity<Plan> getPlanById(@PathVariable String planId) {
		Optional<Plan> plan = planService.getPlanById(planId);
		if(plan.isPresent())
		{
			return new ResponseEntity<Plan>(plan.get(),HttpStatus.OK);
		}
		else
		{
			return new ResponseEntity<Plan>(HttpStatus.NOT_FOUND);
		}
		
	}
	
	
}
