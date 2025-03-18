package com.mobicomm.app.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobicomm.app.model.RechargeHistory;
import com.mobicomm.app.repository.RechargeHistoryRepository;

@Service
public class RechargeHistoryService {

	@Autowired
    private  RechargeHistoryRepository rechargeHistoryRepository;

    public RechargeHistory saveRechargeHistory(RechargeHistory rechargeHistory) {
        
    	return rechargeHistoryRepository.save(rechargeHistory);

    }

    public List<RechargeHistory> getAllRecharges() {
        return rechargeHistoryRepository.findAll();
    }

    public List<RechargeHistory> getRechargesByUserId(String userId) {
        return rechargeHistoryRepository.findByUserId(userId);
    }

    public List<RechargeHistory> getRechargesByMobileNumber(Long mobileNumber) {
        return rechargeHistoryRepository.findByMobileNumber(mobileNumber);
    }
}
