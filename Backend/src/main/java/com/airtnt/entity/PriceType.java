package com.airtnt.entity;

public enum PriceType {
	PER_NIGHT("PER_NIGHT"), PER_WEEK("PER_WEEK");

	private String priceType;

	private PriceType(String priceType) {
		this.priceType = priceType;
	}

	@Override
	public String toString() {
		return priceType;
	}
}
