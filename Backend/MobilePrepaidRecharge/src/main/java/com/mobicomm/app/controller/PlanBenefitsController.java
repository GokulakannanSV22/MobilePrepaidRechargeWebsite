package com.mobicomm.app.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mobicomm.app.model.PlanBenefits;
import com.mobicomm.app.model.Status;
import com.mobicomm.app.service.PlanBenefitsService;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/plan-benefits")
public class PlanBenefitsController {

	@Autowired
	private PlanBenefitsService planBenefitService;
	@PostMapping
	public ResponseEntity<PlanBenefits> addPlanBenefit(@RequestBody PlanBenefits benefit) {
		//TODO: process POST request
		return new ResponseEntity<PlanBenefits>( planBenefitService.addPlanBenefit(benefit),HttpStatus.CREATED);
	}
	@GetMapping
	public ResponseEntity<List<PlanBenefits>> getAllPlanBenefits() {
		List<PlanBenefits> allPlanBenefits =  planBenefitService.getAllPlanBenefits();
		if(allPlanBenefits.isEmpty())
		{
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		else
		{
			return new ResponseEntity<List<PlanBenefits>>(allPlanBenefits,HttpStatus.OK);
		}
	}
	
	@GetMapping("/{benefitId}")
	public ResponseEntity<PlanBenefits> getPlanBenefitById(@PathVariable String benefitId)
	{
		Optional<PlanBenefits> benefit = planBenefitService.getPlanBenefitById(benefitId);
		if(benefit.isPresent())
		{
			return new ResponseEntity<PlanBenefits>(benefit.get(),HttpStatus.OK);
		}
		else
		{
			return new ResponseEntity<PlanBenefits>(HttpStatus.NOT_FOUND);
		}
	}
	@PutMapping("/{planBenefitId}")
	public ResponseEntity<PlanBenefits> editPlanBenefitbyId(@PathVariable String planBenefitId, @RequestBody PlanBenefits benefit) {
		//TODO: process PUT request
		
		PlanBenefits updateExistingbenefit  = planBenefitService.editPlanBenefitById(planBenefitId, benefit);
		if(updateExistingbenefit != null)
		{
			return new ResponseEntity<PlanBenefits>(updateExistingbenefit,HttpStatus.OK);
		}
		else
		{
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping("/{planBenefitId}")
	public ResponseEntity<PlanBenefits> deletePlanById(@PathVariable String planBenefitId)
	{
		Optional<PlanBenefits> deletePlanBenefit = planBenefitService.deletePlanBenefitById(planBenefitId);
		if(deletePlanBenefit.isPresent())
		{
			return new ResponseEntity<PlanBenefits>(deletePlanBenefit.get(),HttpStatus.OK);
		}
		else
		{
			return new ResponseEntity<PlanBenefits>(HttpStatus.NOT_FOUND);
		}
	}
	@PutMapping("/{planBenefitId}/toggle-status")
    public ResponseEntity<PlanBenefits> togglePlanBenefitStatus(@PathVariable String planBenefitId, @RequestBody Status newStatus) {
      
        PlanBenefits updatedBenefit = planBenefitService.togglePlanBenefitStatus(planBenefitId, newStatus);
        if (updatedBenefit != null) {
            return new ResponseEntity<PlanBenefits>(updatedBenefit, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
	
}
