import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers';
import { RootState } from '../../store';
import $ from 'jquery';
import './css/group_main_content.css';

interface IPropertyGroupMainContentProps {}

const PropertyGroupMainContent: FC<IPropertyGroupMainContentProps> = () => {
    const { roomGroups } = useSelector((state: RootState) => state.room);

    useEffect(() => {
        const roomGroupsBox = $('.room-group__box');
        console.log(roomGroupsBox);

        if (localStorage.getItem('room')) {
            const { roomGroup } = JSON.parse(localStorage.getItem('room')!);
            roomGroupsBox.each(function () {
                if ($(this).data('group-id') === roomGroup) {
                    $(this).addClass('active');
                }
            });
        }

        roomGroupsBox.each(function () {
            $(this).on('click', function () {
                roomGroupsBox.each(function () {
                    $(this).removeClass('active');
                });
                $(this).addClass('active');
            });
        });
    }, [roomGroups]);

    return (
        <>
            <Div className='col-flex-center'>
                {roomGroups.map(group => (
                    <div
                        className='room-group__box flex-space'
                        key={group.id}
                        data-group-id={group.id}
                        data-group-name={group.name}
                    >
                        <div className='content__box--name'>{group.name}</div>
                        <div>
                            <Image src={getImage(`/room_types/${group.image}`)} size='56px' />
                        </div>
                    </div>
                ))}
            </Div>
        </>
    );
};

export default PropertyGroupMainContent;
