
  package com.example.polls.model;
  
  import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PostLoad;
import javax.persistence.Table;
  
  @Entity
  @Table(name = "items") public class Item {
	  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) private long id; 
  private String name; 
  private BigDecimal saleCost;
  private String type;
  private String description; 
  private boolean active;
  private String sizes;
  private String colors;
  
  private int imageId;
  
  public Item(){
  
  }

public long getId() {
	return id;
}

public void setId(long id) {
	this.id = id;
}

public String getName() {
	return name;
}

public void setName(String name) {
	this.name = name;
}

public BigDecimal getSaleCost() {
	return saleCost;
}

public void setSaleCost(BigDecimal saleCost) {
	this.saleCost = saleCost;
}

public String getDescription() {
	return description;
}

public void setDescription(String description) {
	this.description = description;
}

public boolean isActive() {
	return active;
}

public void setActive(boolean active) {
	this.active = active;
}

public int getImageId() {
	return imageId;
}

public void setImageId(int imageId) {
	this.imageId = imageId;
}

public String getType() {
	return type;
}

public void setType(String type) {
	this.type = type;
}

public String getSizes() {
	return sizes;
}

public void setSizes(String sizes) {
	this.sizes = sizes;
}

public String getColors() {
	return colors;
}

public void setColors(String colors) {
	this.colors = colors;
}

@PostLoad
private void postLoadFunction(){
    System.out.println("loaded item "+this.name);
}

  }
 
