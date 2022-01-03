import React, { FC, ReactElement, ReactNode, useEffect } from 'react';
import { Category } from './Category';
import { Room } from './Room';

export interface IRoom {
    id: number;
    thumbnail: string;
    images: string[];
    likedByUsers: number[];
    price: number;
    name: string;
    currency: string;
    stay_type: string;
}

interface IRoomsProps {
    rooms: Array<IRoom>;
}

export const Rooms: FC<IRoomsProps> = ({ rooms }) => {
    return (
        <section className='room__section'>
            <div id='rooms__container'>
                {rooms.length > 0 &&
                    rooms.map((room: IRoom, index: number) => {
                        return (
                            <div id='rooms__container' key={room.name + '-' + room.id}>
                                <Room room={room} index={index} />
                            </div>
                        );
                    })}
            </div>
        </section>
    );
};
