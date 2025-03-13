package com.mobicomm.app.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobicomm.app.model.Plan;
import com.mobicomm.app.model.PlanBenefits;
import com.mobicomm.app.model.Status;
import com.mobicomm.app.repository.PlanBenefitsRepository;
import com.mobicomm.app.repository.PlanRepository;

@Service
public class PlanService {

	@Autowired
	private PlanRepository planRepo;
	
	@Autowired
	private PlanBenefitsRepository planBenefitRepo;
	
	private String generatePlanId() {
	    Optional<Plan> lastPlan = planRepo.findTopByOrderByPlanIdDesc();

	    if (lastPlan.isPresent())
	    {
	        String lastId = lastPlan.get().getPlanId();
	        int lastNumber = Integer.parseInt(lastId.substring(6)); // Extract numeric part
	        return "mc_pl_" + (lastNumber + 1);
	    }
	    else
	    {
	        return "mc_pl_1"; 
	    }
	}
	
	public List<Plan> getAllPlans()
	{
		return planRepo.findAll();
	}
	
	public Plan addPlan(Plan plan)
	{
		plan.setPlanId(generatePlanId());
	  	return planRepo.save(plan);
	}
	public Plan updatePlanById(String planId,Plan plan)
	{
		Optional<Plan> existingPlan = planRepo.findById(planId);
		if(existingPlan.isPresent())
		{
			Plan updatedPlan = existingPlan.get();
			updatedPlan.setPlanName(plan.getPlanName());
			updatedPlan.setValidity(plan.getValidity());
			updatedPlan.setData(plan.getData());
			updatedPlan.setVoice(plan.getVoice());
			updatedPlan.setSms(plan.getSms());
			updatedPlan.setPrice(plan.getPrice());
			updatedPlan.setBadge(plan.getBadge());
			updatedPlan.setBadgeColor(plan.getBadgeColor());
			updatedPlan.setPlanStatus(plan.getPlanStatus());
			updatedPlan.setCategory(plan.getCategory());
			updatedPlan.setPlanBenefits(plan.getPlanBenefits());
			return planRepo.save(updatedPlan);
			
		}
		else
		{
			throw new RuntimeException("Plan with plan id : "+planId+"  Not Found");
		}
	}
	public Plan deactivatePlanById(String planId)
	{
		Optional<Plan> activePlan = planRepo.findById(planId);
		if(activePlan.isPresent())
		{
			if(activePlan.get().getPlanStatus() == Status.STATUS_INACTIVE)
			{
				throw new RuntimeException("Plan with plan id : "+ planId + " is already INACTIVE");
			}
			else
			{
				Plan deactivatePlan = activePlan.get();
				deactivatePlan.setPlanStatus(Status.STATUS_INACTIVE);
				return planRepo.save(deactivatePlan);
			}
		}
		else
		{
			throw new RuntimeException("Plan with plan id : "+ planId + "  Not found");
		}
	}
	public Plan activatePlanById(String planId)
	{
		Optional<Plan> inactivePlan = planRepo.findById(planId);
		if(inactivePlan.isPresent())
		{
		if(inactivePlan.get().getPlanStatus() == Status.STATUS_ACTIVE)
		{
			throw new RuntimeException("Plan with plan id : " + planId +"is already ACTIVE");
		}
		else
		{
			Plan activatePlan = inactivePlan.get();
			activatePlan.setPlanStatus(Status.STATUS_ACTIVE);
			return planRepo.save(activatePlan);
		}
		}
		else
		{
			throw new RuntimeException("Plan with plan id : "+ planId + "  Not found");
		}
	}
}
