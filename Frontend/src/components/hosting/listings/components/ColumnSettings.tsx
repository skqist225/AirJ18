import { Checkbox } from 'antd';
import { FC } from 'react';
import { Image } from '../../../../globalStyle';
import { getImage } from '../../../../helpers';

interface IColumnSettingsProps {
    commonNameCb: boolean;
    bedroomCb: boolean;
    bedCb: boolean;
    bathroomCb: boolean;
    lastModifiedCb: boolean;
}

const ColumnSettings: FC<IColumnSettingsProps> = ({
    commonNameCb,
    bedroomCb,
    bedCb,
    bathroomCb,
    lastModifiedCb,
}) => {
    return (
        <div className='p-relative'>
            <div
                className='listings__filter--option'
                data-dropdown='listings__setting-column-display'
            >
                <Image src={getImage('/svg/setting.svg')} size='20px' />
            </div>
            <div id='listings__setting-column-display' className='filter-box'>
                <div className='listings__setting-column-display-header'>Tùy chỉnh cột</div>
                <div style={{ height: '80%' }} className='f1'>
                    <div className='normal-flex listings__setting-column-display-row'>
                        <Checkbox
                            checked={commonNameCb}
                            className='columnDisplay'
                            value='COMMONNAME'
                        />
                        <div className='fs-14' style={{ marginLeft: '10px' }}>
                            TÊN THƯỜNG GỌI
                        </div>
                    </div>
                    <div className='normal-flex listings__setting-column-display-row'>
                        <Checkbox checked={bedroomCb} className='columnDisplay' value='BEDROOM' />
                        <div className='fs-14'>PHÒNG NGỦ</div>
                    </div>
                    <div className='normal-flex listings__setting-column-display-row'>
                        <Checkbox checked={bedCb} className='columnDisplay' value='BED' />
                        <div className='fs-14'>GIƯỜNG</div>
                    </div>
                    <div className='normal-flex listings__setting-column-display-row'>
                        <Checkbox checked={bathroomCb} className='columnDisplay' value='BATHROOM' />
                        <div className='fs-14'>PHÒNG TẮM</div>
                    </div>
                    <div className='normal-flex listings__setting-column-display-row'>
                        <Checkbox
                            checked={lastModifiedCb}
                            className='columnDisplay'
                            value='LASTMODIFIED'
                        />
                        <div className='fs-14'>SỬA ĐỔI LẦN CUỐI</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColumnSettings;
