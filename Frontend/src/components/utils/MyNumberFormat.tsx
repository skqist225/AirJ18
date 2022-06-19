import NumberFormat from "react-number-format";

export interface IMoneyForMat {
    price: number;
    currency: string;
    stayType?: string;
    stayTypeFontSize?: string;
    priceFontSize?: string;
    priceFontWeight?: string;
    isPrefix?: boolean;
    isSuffix?: boolean;
    color?: string;
    removeStayType?: boolean;
    removeSplash?: boolean;
}

export default function MyNumberForMat({
    price,
    currency,
    stayType,
    stayTypeFontSize,
    priceFontSize,
    priceFontWeight,
    isPrefix,
    isSuffix,
    color,
    removeSplash = false,
    removeStayType = false,
}: IMoneyForMat) {
    return (
        <>
            {" "}
            {isPrefix ? (
                <NumberFormat
                    value={Math.floor(price)}
                    prefix={currency}
                    thousandSeparator={true}
                    displayType={"text"}
                    renderText={(formattedValue: any) => (
                        <div>
                            {priceFontSize !== null ? (
                                <>
                                    <span
                                        style={{
                                            fontSize: priceFontSize,
                                            color,
                                            fontWeight: priceFontWeight,
                                        }}
                                    >
                                        {formattedValue}{" "}
                                    </span>
                                    {!removeStayType && (
                                        <span style={{ fontSize: stayTypeFontSize, color }}>
                                            / {stayType}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue}</span>
                                    {!removeStayType && <span className='fs-16'>{stayType}</span>}
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
                    displayType={"text"}
                    renderText={(formattedValue: any) => (
                        <div>
                            {priceFontSize !== null ? (
                                <>
                                    <span
                                        style={{
                                            fontSize: priceFontSize,
                                            color,
                                            fontWeight: priceFontWeight,
                                        }}
                                    >
                                        {formattedValue}{" "}
                                    </span>
                                    {!removeStayType && (
                                        <span style={{ fontSize: stayTypeFontSize, color }}>
                                            / {stayType}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue} </span>
                                    {!removeStayType && <span className='fs-16'>{stayType}</span>}
                                </>
                            )}
                        </div>
                    )}
                />
            ) : (
                <NumberFormat
                    value={price}
                    thousandSeparator={true}
                    displayType={"text"}
                    renderText={(formattedValue: any) => (
                        <div>
                            {priceFontSize !== null ? (
                                <>
                                    <span
                                        style={{
                                            fontSize: priceFontSize,
                                            color,
                                            fontWeight: priceFontWeight,
                                        }}
                                    >
                                        {formattedValue}{" "}
                                    </span>
                                    {!removeStayType && (
                                        <span style={{ fontSize: stayTypeFontSize, color }}>
                                            / {stayType}
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <span className='rdt__price'>{formattedValue} </span>
                                    {!removeStayType && <span className='fs-16'>{stayType}</span>}
                                </>
                            )}
                        </div>
                    )}
                />
            )}
        </>
    );
}
