import 'package:book_hotel/app_theme.dart';
import 'package:book_hotel/blocs/category_bloc/category_bloc.dart';
import 'package:book_hotel/model/category_model.dart';
import 'package:book_hotel/widgets/room_by_category.dart';
import 'package:flutter/material.dart';

class CategoryList extends StatefulWidget {
  final List<CategoryModel> categories;
  const CategoryList({Key? key, required this.categories}) : super(key: key);
  @override
  _CategoryListState createState() => _CategoryListState(categories);
}

class _CategoryListState extends State<CategoryList>
    with SingleTickerProviderStateMixin {
  _CategoryListState(this.categories);
  final List<CategoryModel> categories;
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(vsync: this, length: categories.length);
   
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: categories.length,
      child: Scaffold(
        backgroundColor: AppTheme.nearlyWhite,
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(40.0),
          child: AppBar(
            backgroundColor: AppTheme.white,
            bottom: TabBar(
              controller: _tabController,
              indicatorColor: AppTheme.grey,
              indicatorSize: TabBarIndicatorSize.label,
              indicatorWeight: 1.0,
              unselectedLabelColor: AppTheme.grey,
              labelColor: Colors.black,
              isScrollable: true,
              tabs: categories.map((CategoryModel categoryModel) {
                return Container(
                    padding: const EdgeInsets.only(bottom: 8.0, top: 10.0),
                    child: Text(
                      categoryModel.name!,
                      style: AppTheme.caption,
                    ));
              }).toList(),
            ),
          ),
        ),
        body: TabBarView(
          controller: _tabController,
          physics: const NeverScrollableScrollPhysics(),
          children: categories.map((CategoryModel categoryModel) {
            return CategoryRooms(categoryId: categoryModel.id.toString());
          }).toList(),
        ),
      ),
    );
  }
}
