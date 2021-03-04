package com.example.polls.service;

import java.io.IOException;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.polls.model.Item;
import com.example.polls.model.ItemImage;
import com.example.polls.repository.ItemImageRepo;
import com.example.polls.repository.ItemRepository;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;
    @Autowired
    private ItemImageRepo itemImageRepository;
    
    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);

	public Page<Item> findAll(Pageable pageable, String searchText) {
    	System.out.println("findAll items service"+searchText);
		return itemRepository.findAll(pageable, searchText);
	}
    
	public Page<Item> findAll(Pageable pageable) {
		return itemRepository.findAll(pageable);
	}

	public Item findById(Long id) {
		return itemRepository.findById(id).get();
	}

	public ItemImage findImageById(Long id) {
		return itemImageRepository.findById(id).get();
	}
	
	public Item saveOrUpdate(Item student) {
		return itemRepository.save(student);
	}

	public String deleteById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			itemRepository.deleteById(id);
			jsonObject.put("message", "Item deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}

	public String deleteItemImageById(Long id) {
		JSONObject jsonObject = new JSONObject();
		try {
			itemImageRepository.deleteById(id);
			jsonObject.put("message", "Image deleted successfully");
		} catch (JSONException e) {
			e.printStackTrace();
		}
		return jsonObject.toString();
	}
	
	public Page<Item> findAllItemsByActive(Pageable pageable) {
		System.out.println("findallbyActive");
		return itemRepository.findAllItemsByActive(pageable);
	}

	public ItemImage saveOrUpdateImage(MultipartFile file) {
		ItemImage item = new ItemImage();
		item.setName(file.getOriginalFilename());
		try {
			item.setPhoto(file.getBytes());
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return itemImageRepository.save(item);
	}
}