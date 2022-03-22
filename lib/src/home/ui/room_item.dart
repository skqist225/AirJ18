import 'package:book_hotel/app_theme.dart';
import 'package:book_hotel/model/room_model.dart';
import 'package:book_hotel/src/detail/ui/hotel_detail_page.dart';
import 'package:book_hotel/widgets/hotel_price_text.dart';
import 'package:book_hotel/widgets/ticket_rent.dart';
import 'package:flutter/material.dart';

class RoomItem extends StatelessWidget {
  const RoomItem({Key? key, required this.room}) : super(key: key);

  final RoomModel room;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.push<dynamic>(
        context,
        MaterialPageRoute<dynamic>(
          builder: (_) => HotelDetailPage(
            id: room.id.toString(),
          ),
        ),
      ),
      child: Stack(
        children: <Widget>[
          Hero(
            tag: Key('https://airj18.skqist225.xyz${room.images![0]}'),
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  "https://airj18.skqist225.xyz" + room.images![0],
                  fit: BoxFit.fill,
                  width: double.infinity,
                  height: 240,
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(40),
            child: Card(
              elevation: 8,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
              margin: const EdgeInsets.only(top: 200),
              child: Column(
                children: <Widget>[
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[
                      const Padding(
                        padding: EdgeInsets.all(8),
                        child: TicketRent(
                          color: AppTheme.darkText,
                          title: 'FOR RENT',
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(8),
                        child: HotelPriceText(price: room.price!, currencySymbol: room.currencySymbol!),
                      ),
                    ],
                  ),
                  ListTile(
                    title: Text(
                      room.name!,
                      style: titleTextStyle,
                    ),
                    subtitle: Row(
                      children: [
                        const Icon(Icons.star, color: Colors.yellow,),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 8),
                          child: Text(room.likedByUsers!.length.toString(), style: AppTheme.caption),
                        ),
                      ],
                    ),
                    trailing: Container(
                      decoration: const BoxDecoration(
                          color: Color(0xfffd8c00), shape: BoxShape.circle),
                      child: Transform.rotate(
                        angle: 25 * 3.1416 / 180,
                        child: IconButton(
                          icon: const Icon(Icons.navigation),
                          onPressed: () {},
                          color: Colors.white,
                        ),
                      ),
                    ),
                  )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

TextStyle titleTextStyle = const TextStyle(
  color: Colors.black,
  fontSize: 16,
  fontWeight: FontWeight.w500,
);
