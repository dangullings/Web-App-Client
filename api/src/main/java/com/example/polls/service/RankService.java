package com.example.polls.service;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.polls.model.Rank;
import com.example.polls.repository.RankRepo;

@Service
public class RankService {

    @Autowired
    private RankRepo rankRepo;
	
	public Page<Rank> findAll(Pageable pageable) {
		System.out.println("get all ranks");
		return rankRepo.findAll(pageable);
	}

	public Rank findById(Long id) {
		return rankRepo.findById(id).get();
	}

	public Rank saveOrUpdate(Rank rank) {
		return rankRepo.save(rank);
	}

	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			rankRepo.deleteById(id);
			jsonObject.put("message", "Book deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}
	
}