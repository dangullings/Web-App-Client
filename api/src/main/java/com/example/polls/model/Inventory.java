package com.example.polls.model;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "inventory")
public class Inventory {

	@OneToOne
	private Item item;
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
    private int produced;
    private int sold;
    private BigDecimal salesCost;
    private BigDecimal producedCost;
    private int quantity;

    public Inventory (){
        
    }

    public int getProduced() {
        return produced;
    }

    public void setProduced(int produced) {
        this.produced = produced;
    }

    public int getSold() {
        return sold;
    }

    public void setSold(int sold) {
        this.sold = sold;
    }

    public BigDecimal getSalesCost() {
        return salesCost;
    }

    public void setSalesCost(BigDecimal salesCost) {
        this.salesCost = salesCost;
    }

    public BigDecimal getProducedCost() {
        return producedCost;
    }

    public void setProducedCost(BigDecimal producedCost) {
        this.producedCost = producedCost;
    }

    public void sellItem(int qty, BigDecimal saleCost){
        

        sold += qty;
        salesCost = salesCost.add(new BigDecimal(saleCost.toString()));
    }

    public void addItem(Item item, int qty){
        setProduced(qty);
        setQuantity(qty);
        setSold(0);
        //setProducedCost(item.getProduceCost().multiply(BigDecimal.valueOf(qty)));
        setSalesCost(BigDecimal.ZERO);
    }

    public void updateItem(Item item, int oldQty, int newQty){
        int updatedQty = 0;

        updatedQty = (newQty - oldQty);

        setProduced(getProduced() + updatedQty);
        setQuantity(newQty);

        //salePrice = salePrice.add(new BigDecimal(lineItem.getPrice().toString()));

        //producedCost = producedCost.add(new BigDecimal(item.getProduceCost().multiply(BigDecimal.valueOf(newQty)).toString()));
        //setProducedCost(newProduceCost.add(item.getProduceCost().multiply(BigDecimal.valueOf(newQty))));
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

	public Item getItem() {
		return item;
	}

	public void setItem(Item item) {
		this.item = item;
	}

}