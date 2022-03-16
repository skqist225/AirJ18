import { FC, useEffect, useState } from 'react';
import {
    LeftPageContent,
    PropertyDescriptionMainContent,
    RightPageContent,
} from '../../components/become_a_host';
import $ from 'jquery';
import { Div } from '../../globalStyle';

interface IPropertyTitlePageProps {}

const PropertyTitlePage: FC<IPropertyTitlePageProps> = () => {
    const [dscrpts, setDescriptions] = useState<string[]>([]);
    useEffect(() => {
        if (localStorage.getItem('room')) {
            const { descriptions } = JSON.parse(localStorage.getItem('room')!);
            if (descriptions) setDescriptions(descriptions);
        }
    }, []);

    useEffect(() => {
        if (dscrpts.length === 2) {
            $('.description__title-container').each(function () {
                if (dscrpts.includes($(this).children().last().text())) {
                    $(this).addClass('choosen');
                }
            });
        }

        $('.description__title-container').each(function () {
            $(this)
                .off('click')
                .on('click', function () {
                    const desc = $(this).children().last().text();

                    if ($(this).hasClass('choosen')) {
                        $(this).removeClass('choosen');
                        setDescriptions(dscrpts.filter(description => description !== desc));
                    } else {
                        if (dscrpts.length === 2) {
                            $('.description__title-container').each(function () {
                                if (desc === dscrpts[0]) {
                                    $(this).removeClass('choosen');
                                }
                            });

                            $(this).addClass('choosen');
                            setDescriptions([dscrpts[1], desc]);
                        } else {
                            $(this).addClass('choosen');
                            setDescriptions([...dscrpts, desc]);
                        }
                    }
                });
        });
    }, [dscrpts]);

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
                    descriptions={dscrpts}
                />
            </Div>
        </Div>
    );
};

export default PropertyTitlePage;
