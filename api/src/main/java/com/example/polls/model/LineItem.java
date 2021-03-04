package com.example.polls.model;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "line_items")
public class LineItem {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
	
	@OneToOne
    private Order order;
    
	@OneToOne
    private Item item;
    
    private String itemName;
    private BigDecimal price;
    private int quantity;

    public LineItem(){

    }

    public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public Item getItem() {
		return item;
	}

	public void setItem(Item item) {
		this.item = item;
	}

	public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setItemInfo(){
        //ItemDAOImpl idi = new ItemDAOImpl();

        //Item item = idi.selectById(getItemId());

        //setItemName(item.getName());
    }

    public long getId() { return id; }

    public void setId(long id) { this.id = id; }

    public boolean isOrderComplete(){

        return order.isComplete();
    }
}