package com.example.polls.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.polls.model.Item;
import com.example.polls.model.ItemImage;
import com.example.polls.service.ItemService;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    
    @Autowired
	private ItemService itemService;
    
    @GetMapping("/search/{search}")
	public ResponseEntity<Page<Item>> findAll(Pageable pageable, @PathVariable String search) {
		System.out.println("findAll items controller search"+search);
		return new ResponseEntity<>(itemService.findAll(pageable, search), HttpStatus.OK);
	}

    @GetMapping
	public ResponseEntity<Page<Item>> findAll(Pageable pageable) {
		System.out.println("findAll controller"+pageable.getPageNumber()+" "+pageable.getPageSize());
		return new ResponseEntity<>(itemService.findAll(pageable), HttpStatus.OK);
	}

    @GetMapping("/active")
	public ResponseEntity<Page<Item>> findAllByActive(Pageable pageable) {
		return new ResponseEntity<>(itemService.findAllItemsByActive(pageable), HttpStatus.OK);
	}
    
    @GetMapping("{id}")
	public ResponseEntity<Item> findById(@PathVariable Long id) {
		return new ResponseEntity<>(itemService.findById(id), HttpStatus.OK);
	}
    
    @GetMapping("/image/{id}")
   	public ResponseEntity<ItemImage> findImageById(@PathVariable Long id) {
   		return new ResponseEntity<>(itemService.findImageById(id), HttpStatus.OK);
   	}
    
    @PostMapping("/saveItemImage")
	public ResponseEntity<ItemImage> save(@RequestParam("file") MultipartFile uploadFile) {
		return new ResponseEntity<>(itemService.saveOrUpdateImage(uploadFile), HttpStatus.CREATED);
	}

	@PostMapping("/saveItem")
	public ResponseEntity<Item> save(@RequestBody Item item) {
		return new ResponseEntity<>(itemService.saveOrUpdate(item), HttpStatus.CREATED);
	}

	@PutMapping()
	public ResponseEntity<Item> update(Item item) {
		return new ResponseEntity<>(itemService.saveOrUpdate(item), HttpStatus.OK);
	}

	@DeleteMapping("{id}")
	public ResponseEntity<String> deleteById(@PathVariable Long id) {
		return new ResponseEntity<>(itemService.deleteById(id), HttpStatus.OK);
	}
	
	@DeleteMapping("/image/{id}")
	public ResponseEntity<String> deleteItemImageById(@PathVariable Long id) {
		return new ResponseEntity<>(itemService.deleteItemImageById(id), HttpStatus.OK);
	}
}