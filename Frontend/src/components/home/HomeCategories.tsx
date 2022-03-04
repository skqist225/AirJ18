import { FC } from 'react';
import { Div } from '../../globalStyle';
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
        <Div className='flex' margin='0 0 25px 0'>
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
        </Div>
    );
};
