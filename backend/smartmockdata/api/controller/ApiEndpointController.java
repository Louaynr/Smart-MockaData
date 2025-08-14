package com.smartmockdata.api.controller;

import com.smartmockdata.api.model.ApiEndpoint;
import com.smartmockdata.api.repository.ApiEndpointRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/apis")
public class ApiEndpointController {
    
    @Autowired
    private ApiEndpointRepository apiEndpointRepository;
    
    @GetMapping
    public ResponseEntity<List<ApiEndpoint>> getAllApiEndpoints() {
        List<ApiEndpoint> endpoints = apiEndpointRepository.findAll();
        return ResponseEntity.ok(endpoints);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiEndpoint> getApiEndpointById(@PathVariable Long id) {
        return apiEndpointRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<ApiEndpoint> createApiEndpoint(@RequestBody ApiEndpoint apiEndpoint) {
        ApiEndpoint savedEndpoint = apiEndpointRepository.save(apiEndpoint);
        return ResponseEntity.ok(savedEndpoint);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiEndpoint> updateApiEndpoint(@PathVariable Long id, @RequestBody ApiEndpoint apiEndpoint) {
        if (!apiEndpointRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        apiEndpoint.setId(id);
        ApiEndpoint updatedEndpoint = apiEndpointRepository.save(apiEndpoint);
        return ResponseEntity.ok(updatedEndpoint);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApiEndpoint(@PathVariable Long id) {
        if (!apiEndpointRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        apiEndpointRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/active")
    public ResponseEntity<List<ApiEndpoint>> getActiveApiEndpoints() {
        List<ApiEndpoint> activeEndpoints = apiEndpointRepository.findByIsActiveTrue();
        return ResponseEntity.ok(activeEndpoints);
    }
    
    @GetMapping("/method/{method}")
    public ResponseEntity<List<ApiEndpoint>> getApiEndpointsByMethod(@PathVariable String method) {
        List<ApiEndpoint> endpoints = apiEndpointRepository.findByMethodIgnoreCase(method);
        return ResponseEntity.ok(endpoints);
    }
}
