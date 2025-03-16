package com.mobicomm.app.service;

import com.mobicomm.app.model.Admin;
import com.mobicomm.app.model.Role;
import com.mobicomm.app.repository.AdminRepository;
import com.mobicomm.app.security.CustomAdminDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // ✅ Load admin for authentication
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with email: " + email));

        return new CustomAdminDetails(admin); // ✅ Wrap admin in UserDetails
    }
    private String generateAdminId() {
        Optional<Admin> lastPlan = adminRepository.findTopByOrderByAdminIdDesc();

        if (lastPlan.isPresent()) {
            String lastId = lastPlan.get().getAdminId();
            int lastNumber = Integer.parseInt(lastId.substring(6)); // Extract numeric part after "mc_pl_"
            int newNumber = lastNumber + 1;
            return String.format("mc_ad_%04d", newNumber); // Pad with leading zeros to 4 digits
        } else {
            return "mc_ad_0001"; // Initial ID with 4-digit padding
        }
    }

    // ✅ Get admin by email
    public Optional<Admin> getAdminByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    // ✅ Get admin by ID
    public Optional<Admin> getAdminById(String adminId) {
        return adminRepository.findById(adminId);
    }

    // ✅ Save admin (used for registration)
    public Admin saveAdmin(Admin admin) {
        admin.setAdminId(generateAdminId());
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        if (admin.getRole() == null) {
            admin.setRole(Role.ADMIN);
        }
        return adminRepository.save(admin);
    }
    
}
