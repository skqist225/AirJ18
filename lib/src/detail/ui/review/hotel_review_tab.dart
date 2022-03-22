import 'package:book_hotel/app_theme.dart';
import 'package:book_hotel/model/review_model.dart';
import 'package:book_hotel/src/detail/ui/review/review_item.dart';
import 'package:flutter/material.dart';

class HotelReviewTab extends StatelessWidget {
  const HotelReviewTab({
    Key? key,
    this.reviews,
  }) : super(key: key);

  final List<Reviews>? reviews;

  @override
  Widget build(BuildContext context) {
    if (reviews!.isEmpty) {
      return Center(
        child: Text(
          "No review 😶",
          style: AppTheme.headline.copyWith(color: Colors.grey),
        ),
      );
    } else {
      return Padding(
        padding: const EdgeInsets.all(16),
        child: ListView.builder(
          itemCount: reviews!.length,
          itemBuilder: (context, index) => ReviewItem(review: reviews![index]),
        ),
      );
    }
  }
}
