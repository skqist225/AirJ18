import { FC } from 'react';
import { useSelector } from 'react-redux';
import { userState } from '../../../features/user/userSlice';
import { IRoomListings } from '../../../types/room/type_RoomListings';
import { ColumnHeader } from '../../utils';
import { ColumnSettings, RoomDataRow } from './components';

interface ITableContentProps {
    commonNameCb: boolean;
    bedroomCb: boolean;
    bedCb: boolean;
    bathroomCb: boolean;
    lastModifiedCb: boolean;
    rooms: IRoomListings[];
}

const TableContent: FC<ITableContentProps> = ({
    commonNameCb,
    bedroomCb,
    bedCb,
    bathroomCb,
    lastModifiedCb,
    rooms,
}) => {
    const { user, loading } = useSelector(userState);

    return (
        <div className='f1'>
            <table id='table'>
                <thead>
                    <tr>
                        <th>
                            <ColumnHeader columnName='mã phòng' sortField='id' />
                        </th>
                        <th>
                            <ColumnHeader columnName='nhà/phòng cho thuê' sortField='name' />
                        </th>
                        <th>
                            <ColumnHeader columnName='trạng thái' sortField='status' />
                        </th>
                        <th>
                            <ColumnHeader columnName='giá phòng mỗi đêm' sortField='price' />
                        </th>
                        <th>
                            <ColumnHeader columnName='loại phòng' sortField='category-name' />
                        </th>
                        <th data-column='BEDROOM'>
                            <ColumnHeader columnName='phòng ngủ' sortField='bedroomCount' />
                        </th>
                        <th data-column='BED'>
                            <ColumnHeader columnName='giường' sortField='bedCount' />
                        </th>
                        <th data-column='BATHROOM'>
                            <ColumnHeader columnName='phòng tắm' sortField='bathroomCount' />
                        </th>
                        <th style={{ width: '400px' }}>
                            <ColumnHeader columnName='vị trí' sortField='location' />
                        </th>
                        <th data-column='LASTMODIFIED'>
                            <ColumnHeader columnName='sửa đổi lần cuối' sortField='lastModified' />
                        </th>
                        <th>
                            <ColumnSettings
                                commonNameCb={commonNameCb}
                                bedCb={bedCb}
                                bedroomCb={bedroomCb}
                                bathroomCb={bathroomCb}
                                lastModifiedCb={lastModifiedCb}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map(room => (
                        <RoomDataRow room={room} key={room.id} email={user!.email} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableContent;
