import NumberFormat from 'react-number-format';

export interface IMoneyForMat {
    price: number;
    currency: string;
    stayType?: string;
    fontSize?: string;
    isPrefix?: boolean;
    isSuffix?: boolean;
    color?: string;
}

export default function MyNumberForMat({
    price,
    currency,
    stayType,
    fontSize,
    isPrefix,
    isSuffix,
    color,
}: IMoneyForMat) {
    return (
        <>
            {' '}
            {isPrefix ? (
                <NumberFormat
                    value={price}
                    prefix={currency}
                    thousandSeparator={true}
                    displayType={'text'}
                    renderText={(formattedValue: any) => (
                        <div>
                            {fontSize !== null ? (
                                <>
                                    <span style={{ fontSize, color }}>{formattedValue} </span>
                                    <span style={{ fontSize, color }}>{stayType}</span>
                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue} </span>
                                    <span className='fs-16'>{stayType}</span>
                                </>
                            )}
                        </div>
                    )}
                />
            ) : isSuffix ? (
                <NumberFormat
                    value={price}
                    suffix={currency}
                    thousandSeparator={true}
                    displayType={'text'}
                    renderText={(formattedValue: any) => (
                        <div>
                            {fontSize !== null ? (
                                <>
                                    <span style={{ fontSize, color }}>{formattedValue} </span>
                                    <span style={{ fontSize, color }}>{stayType}</span>
                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue} </span>
                                    <span className='fs-16'>{stayType}</span>
                                </>
                            )}
                        </div>
                    )}
                />
            ) : (
                <NumberFormat
                    value={price}
                    thousandSeparator={true}
                    displayType={'text'}
                    renderText={(formattedValue: any) => (
                        <div>
                            {fontSize !== null ? (
                                <>
                                    <span style={{ fontSize, color }}>{formattedValue} </span>
                                    <span style={{ fontSize, color }}>{stayType}</span>
                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue} </span>
                                    <span className='fs-16'>{stayType}</span>
                                </>
                            )}
                        </div>
                    )}
                />
            )}
        </>
    );
}
