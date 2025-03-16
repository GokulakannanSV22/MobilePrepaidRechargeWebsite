package com.mobicomm.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mobicomm.app.model.RechargeHistory;

@Repository
public interface RechargeHistoryRepository extends JpaRepository<RechargeHistory, Long> {
    List<RechargeHistory> findByUserId(String userId);
    List<RechargeHistory> findByMobileNumber(Long mobileNumber);
}

