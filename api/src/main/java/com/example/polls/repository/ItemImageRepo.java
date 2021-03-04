package com.example.polls.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import com.example.polls.model.ItemImage;

@Repository
public interface ItemImageRepo extends PagingAndSortingRepository<ItemImage, Long> {

	MultipartFile save(MultipartFile file);

}
