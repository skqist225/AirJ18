import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class HotelPriceText extends StatelessWidget {
  const HotelPriceText({Key? key, this.price = 0.0, this.currencySymbol=""}) : super(key: key);

  final double price;
  final String currencySymbol;

  @override
  Widget build(BuildContext context) {
    final formatCurrency = NumberFormat.simpleCurrency();
    return Text(
      '${formatCurrency.format(price)} $currencySymbol',
      style: const TextStyle(
        color: Colors.black,
        fontSize: 24,
        fontWeight: FontWeight.bold,
      ),
    );
  }
}
