import 'package:book_hotel/model/amenitie_model.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

class AmenitieItem extends StatelessWidget {
  const AmenitieItem({Key? key, this.amenitie}) : super(key: key);

  final Amenities? amenitie;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8),
      child: Column(
        children: [
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(45),
            ),
            child: SvgPicture.network(
              // Constants.BASE_URL + amenitie!.icon!,
              "https://airj18.skqist225.xyz/amentity_images/stove.svg",
              height: 40,
              width: 40,
            ),
          ),
          Text(amenitie!.name!),
        ],
      ),
    );
  }
}
