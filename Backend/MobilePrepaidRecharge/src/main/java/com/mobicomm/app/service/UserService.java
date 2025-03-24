package com.mobicomm.app.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mobicomm.app.model.User;
import com.mobicomm.app.repository.UserRepository;

@Service
public class UserService {

	@Autowired
    private  UserRepository userRepository;
	
	private String generateUserId() {
		Optional<User> lastUser = userRepository.findTopByOrderByUserIdDesc();

        if (lastUser.isPresent()) {
            String lastId = lastUser.get().getUserId();
            int lastNumber = Integer.parseInt(lastId.substring(8)); 
            int newNumber = lastNumber + 1;
            return String.format("mc_user_%04d", newNumber); 
        } else {
            return "mc_user_0001";
        }
	}

    public User createUser(User user) {
    	user.setUserId(generateUserId());
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByPhoneNumber(Long phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(String userId, User updatedUser) {
        User existingUser = getUserById(userId);
        existingUser.setUserName(updatedUser.getUserName());
        existingUser.setUserEmail(updatedUser.getUserEmail());
        existingUser.setPhoneNumber(updatedUser.getPhoneNumber());

        return userRepository.save(existingUser);
    }

    public void deleteUser(String userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
    }

}
