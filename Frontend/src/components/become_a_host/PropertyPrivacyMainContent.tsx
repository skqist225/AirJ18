import { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Div } from '../../globalStyle';
import { RootState } from '../../store';
import $ from 'jquery';
import './css/privacy_main_content.css';

interface IPropertyPrivacyMainContentProps {}

const PropertyPrivacyMainContent: FC<IPropertyPrivacyMainContentProps> = () => {
    const { roomPrivacies } = useSelector((state: RootState) => state.room);

    useEffect(() => {
        const privacyTypeBox = $('.privacy-type__box');

        if (localStorage.getItem('room')) {
            const { privacyType } = JSON.parse(localStorage.getItem('room')!);

            privacyTypeBox.each(function () {
                if ($(this).data('privacy-id') === privacyType) {
                    $(this).addClass('active');
                    return false;
                }
            });
        }

        privacyTypeBox.each(function () {
            $(this).on('click', function () {
                privacyTypeBox.each(function () {
                    $(this).removeClass('active');
                });

                $(this).addClass('active');
            });
        });
    }, [roomPrivacies]);

    return (
        <Div className='col-flex-center'>
            {roomPrivacies.map(privacy => (
                <div className='privacy-type__box' key={privacy.id} data-privacy-id={privacy.id}>
                    <div className='content__box--name'>{privacy.name}</div>
                </div>
            ))}
        </Div>
    );
};

export default PropertyPrivacyMainContent;
