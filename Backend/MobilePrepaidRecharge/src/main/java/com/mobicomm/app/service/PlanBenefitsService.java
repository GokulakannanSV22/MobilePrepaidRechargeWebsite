package com.mobicomm.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobicomm.app.model.Category;
import com.mobicomm.app.model.PlanBenefits;
import com.mobicomm.app.repository.PlanBenefitsRepository;

@Service
public class PlanBenefitsService {

	@Autowired
	private PlanBenefitsRepository planBenefitRepo;
	
	private String generatePlanBenefitId() {
	    Optional<PlanBenefits> lastCategory = planBenefitRepo.findTopByOrderByBenefitIdDesc();

	    if (lastCategory.isPresent())
	    {
	        String lastId = lastCategory.get().getBenefitId();
	        int lastNumber = Integer.parseInt(lastId.substring(7)); // Extract numeric part
	        return "mc_ben_" + (lastNumber + 1);
	    }
	    else
	    {
	        return "mc_ben_1"; 
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
	
}
