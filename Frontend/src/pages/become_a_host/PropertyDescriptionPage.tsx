import { FC, useEffect } from 'react';
import {
    LeftPageContent,
    PropertyDescriptionMainContent,
    RightPageContent,
} from '../../components/become_a_host';
import $ from 'jquery';
import { Div } from '../../globalStyle';

interface IPropertyTitlePageProps {}

const PropertyTitlePage: FC<IPropertyTitlePageProps> = () => {
    let descriptions: string[] = [];
    useEffect(() => {
        if (localStorage.getItem('room')) {
            const { descriptions: lsDescriptions } = JSON.parse(localStorage.getItem('room')!);
            if (lsDescriptions) {
                descriptions = lsDescriptions;

                if (descriptions.length === 2) {
                    jQuery('.description__title-container').each(function () {
                        if (descriptions.includes($(this).children().last().text())) {
                            $(this).addClass('choosen');
                        }
                    });
                }
            }
        }

        $('.description__title-container').each(function () {
            $(this).on('click', function () {
                if ($(this).hasClass('choosen')) {
                    $(this).removeClass('choosen');
                    descriptions = descriptions.filter(
                        description => description !== $(this).children().last().text()
                    );
                } else {
                    if (descriptions.length === 2) {
                        jQuery('.description__title-container').each(function () {
                            if ($(this).children().last().text() === descriptions[0]) {
                                $(this).removeClass('choosen');
                            }
                        });

                        $(this).addClass('choosen');
                        descriptions[0] = descriptions[1];
                        descriptions[1] = $(this).children().last().text();
                    } else {
                        $(this).addClass('choosen');
                        descriptions.push($(this).children().last().text());
                    }
                }
            });
        });
    }, []);

    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background=''
                    title='Bây giờ, hãy mô tả chỗ ở của bạn'
                    gradientBackground={`    
                    background: #fc5c7d;
                    background: -webkit-linear-gradient(
                        to right,
                        #6a82fb,
                        #fc5c7d
                    );
                    background: linear-gradient(
                        to right,
                        #6a82fb,
                        #fc5c7d
                    );`}
                />
                <RightPageContent
                    nextPage='price'
                    prevPage='title'
                    MainContent={<PropertyDescriptionMainContent />}
                    stepNumber={9}
                    descriptions={descriptions}
                />
            </Div>
        </Div>
    );
};

export default PropertyTitlePage;
