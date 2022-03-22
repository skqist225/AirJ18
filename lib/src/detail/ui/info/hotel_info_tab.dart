import 'package:book_hotel/model/room_detail.dart';
import 'package:book_hotel/src/detail/ui/info/amenitie_item.dart';
import 'package:book_hotel/widgets/hotel_price_text.dart';
import 'package:book_hotel/widgets/ticket_rent.dart';
import 'package:flutter/material.dart';

class HotelInformationTab extends StatefulWidget {
  const HotelInformationTab({
    Key? key,
    required this.roomDetail,
  }) : super(key: key);

  final RoomDetail roomDetail;

  @override
  _HotelInformationTabState createState() => _HotelInformationTabState();
}

class _HotelInformationTabState extends State<HotelInformationTab> {
  bool selected = false;

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const TicketRent(
              title: 'FOR RENT',
              color: Color(0xff6732c1),
            ),
            HotelPriceText(price: widget.roomDetail.price!.toDouble(), currencySymbol: widget.roomDetail.currencySymbol.toString(),)
          ],
        ),
        const SizedBox(height: 8),
        Text(
          widget.roomDetail.name!,
          style: const TextStyle(
            color: Colors.black,
            fontSize: 24,
            fontFamily: 'Avenir',
            fontWeight: FontWeight.w700,
          ),
        ),
        const Divider(height: 2, color: Colors.grey),
        const SizedBox(height: 14),
        AnimatedContainer(
          width: 200,
          height: selected ? 250.0 : 100.0,
          alignment:
              selected ? Alignment.center : AlignmentDirectional.topCenter,
          duration: const Duration(seconds: 2),
          curve: Curves.fastOutSlowIn,
          child: Text(widget.roomDetail.description!),
        ),
        TextButton(
          onPressed: () {
            setState(() {
              selected = !selected;
            });
          },
          child: Text(
            selected ? 'Less information' : 'More information',
            style: const TextStyle(color: Color(0xff6732c1)),
          ),
        ),
        Text('Amenities', style: Theme.of(context).textTheme.headline6),
        ConstrainedBox(
          constraints: const BoxConstraints(maxHeight: 90),
          child: ListView.builder(
            shrinkWrap: true,
            scrollDirection: Axis.horizontal,
            itemCount: widget.roomDetail.amenities!.length,
            itemBuilder: (_, index) =>
                AmenitieItem(amenitie: widget.roomDetail.amenities![index]),
          ),
        ),
      ],
    );
  }
}
