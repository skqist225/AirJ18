import 'package:book_hotel/constants/api_path.dart';
import 'package:book_hotel/widgets/image_view.dart';
import 'package:flutter/material.dart';

class RoomItem extends StatelessWidget {
  const RoomItem({Key? key, required this.image}) : super(key: key);

  final String image;

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        GestureDetector(
          onTap: () => Navigator.of(context).push(
            PageRouteBuilder(
              opaque: false,
              pageBuilder: (_, __, ___) => ImageView(imageUrl: image),
            ),
          ),
          child: Hero(
            tag: image,
            child: Card(
              clipBehavior: Clip.antiAliasWithSaveLayer,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              elevation: 5,
              margin: const EdgeInsets.all(8),
              child: Image.network(
                Constants.BASE_URL + image,
                fit: BoxFit.fitWidth,
                height: 160,
                width: 400,
              ),
            ),
          ),
        ),
        // Center(
        //   child: BorderedText(
        //     strokeWidth: 2,
        //     strokeColor: Colors.black,
        //     child: Text(
        //       room.name!,
        //       style: const TextStyle(
        //         color: Colors.white,
        //         fontSize: 21,
        //         fontWeight: FontWeight.bold,
        //       ),
        //     ),
        //   ),
        // ),
      ],
    );
  }
}
