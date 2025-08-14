package com.smartmockdata.api.repository;

import com.smartmockdata.api.model.ApiEndpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApiEndpointRepository extends JpaRepository<ApiEndpoint, Long> {
    
    List<ApiEndpoint> findByIsActiveTrue();
    
    List<ApiEndpoint> findByMethodIgnoreCase(String method);
    
    List<ApiEndpoint> findByRequiresAuth(boolean requiresAuth);
    
    List<ApiEndpoint> findByNameContainingIgnoreCase(String name);
}
