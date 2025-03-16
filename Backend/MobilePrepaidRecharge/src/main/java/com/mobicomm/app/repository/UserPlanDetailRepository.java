package com.mobicomm.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mobicomm.app.model.UserPlanDetail;

@Repository
public interface UserPlanDetailRepository extends JpaRepository<UserPlanDetail, Long> {
    List<UserPlanDetail> findByUserId(String userId);
}
