import NumberFormat from 'react-number-format';

export interface IMoneyForMat {
    price: number;
    currency: string;
    stayType?: string;
}

export default function MyNumberForMat({ price, currency, stayType }: IMoneyForMat) {
    return (
        <NumberFormat
            value={price}
            prefix={currency}
            thousandSeparator={true}
            displayType={'text'}
            renderText={(formattedValue: any) => (
                <div>
                    <span className='rdt__price'>{formattedValue} </span>
                    <span style={{ fontSize: '1.6rem' }}>{stayType}</span>
                </div>
            )}
        />
    );
}
