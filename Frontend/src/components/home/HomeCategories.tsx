import React, { FC, ReactElement, ReactNode } from 'react';
import { Category } from './Category';

export interface ICategory {
    name: string;
    icon: string;
    id: number;
}

interface IHomeCategoriesProps {
    categories: Array<ICategory>;
}

export const HomeCategories: FC<IHomeCategoriesProps> = ({ categories }) => {
    return (
        <div className='flex'>
            {categories.length > 0 &&
                categories.map((category: ICategory, index: number) => {
                    return (
                        <Category
                            category={category}
                            index={index}
                            key={category.name + '-' + category.id}
                        />
                    );
                })}
        </div>
    );
};
