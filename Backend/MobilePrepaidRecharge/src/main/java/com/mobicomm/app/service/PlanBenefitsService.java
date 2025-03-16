package com.mobicomm.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobicomm.app.model.Admin;
import com.mobicomm.app.model.Category;
import com.mobicomm.app.model.PlanBenefits;
import com.mobicomm.app.model.Status;
import com.mobicomm.app.repository.PlanBenefitsRepository;

@Service
public class PlanBenefitsService {

	@Autowired
	private PlanBenefitsRepository planBenefitRepo;
	
	private String generatePlanBenefitId() {
		Optional<PlanBenefits> lastPlanBenefit = planBenefitRepo.findTopByOrderByBenefitIdDesc();

        if (lastPlanBenefit.isPresent()) {
            String lastId = lastPlanBenefit.get().getBenefitId();
            int lastNumber = Integer.parseInt(lastId.substring(6)); // Extract numeric part after "mc_pl_"
            int newNumber = lastNumber + 1;
            return String.format("mc_pb_%04d", newNumber); // Pad with leading zeros to 4 digits
        } else {
            return "mc_pb_0001"; // Initial ID with 4-digit padding
        }
	}
	
	public PlanBenefits addPlanBenefit(PlanBenefits benefit)
	{
		benefit.setBenefitId(generatePlanBenefitId());
		return planBenefitRepo.save(benefit);
	}
	public List<PlanBenefits> getAllPlanBenefits()
	{
		return planBenefitRepo.findAll();
	}
	public Optional<PlanBenefits> getPlanBenefitById(String benefitId)
	{
		Optional<PlanBenefits> benefit =  planBenefitRepo.findById(benefitId);
		if(benefit.isPresent())
		{
			return benefit;
		}
		else
		{
			throw new RuntimeException("Plan Benefit with Benefit Id : "+benefitId+"Not Found");
		}
	}
	public PlanBenefits editPlanBenefitById(String benefitId,PlanBenefits benefit)
	{
		Optional<PlanBenefits> existingBenefit = planBenefitRepo.findById(benefitId);
		if(existingBenefit.isPresent())
		{
			PlanBenefits updatePlanBenefit = existingBenefit.get();
			updatePlanBenefit.setBenefitName(benefit.getBenefitName());
			updatePlanBenefit.setIcon(benefit.getIcon());
			updatePlanBenefit.setPlanBenefitStatus(benefit.getPlanBenefitStatus());
			updatePlanBenefit.setPlan(benefit.getPlan());
			return planBenefitRepo.save(updatePlanBenefit);
		}
		else
		{
			throw new RuntimeException("Plan Benefit with Benefit Id : "+benefitId+ "Not Found");
		}
	}
	public Optional<PlanBenefits> deletePlanBenefitById(String benefitId)
	{
		Optional<PlanBenefits> benefit = planBenefitRepo.findById(benefitId);
		if(benefit.isPresent())
		{
			return benefit;
		}
		else
		{
			throw new RuntimeException("Plan Benefit with Benefit Id : "+benefitId+ "Not Found");
		}
	}
	// New method for toggling status
    public PlanBenefits togglePlanBenefitStatus(String benefitId, Status newStatus) {
        Optional<PlanBenefits> existingBenefit = planBenefitRepo.findById(benefitId);
        if (existingBenefit.isPresent()) {
            PlanBenefits updatePlanBenefit = existingBenefit.get();
            updatePlanBenefit.setPlanBenefitStatus(newStatus); // Only update status
            return planBenefitRepo.save(updatePlanBenefit);
        } else {
            throw new RuntimeException("Plan Benefit with Benefit Id : " + benefitId + " Not Found");
        }
    }

	
}
