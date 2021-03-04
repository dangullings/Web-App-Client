package com.example.polls.repository;

import org.springframework.data.repository.CrudRepository;

import com.example.polls.model.ConfirmationToken;

public interface ConfirmationTokenRepository extends CrudRepository<ConfirmationToken, String> {
    ConfirmationToken findByConfirmationToken(String confirmationToken);
}