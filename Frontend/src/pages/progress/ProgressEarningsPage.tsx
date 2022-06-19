import { FC, useEffect, useState } from "react";
import Header from "../../components/Header";

import { useDispatch, useSelector } from "react-redux";
import { earningState, fetchEarnings } from "../../features/progress/earningSlice";
import { useLocation } from "react-router-dom";
import { seperateNumber, useURLParams } from "../../helpers";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import $ from "jquery";
import "../css/progress_earnings_page.css";
import { Div } from "../../globalStyle";

interface IProgressEarningsPageProps {}

const getIntroOfPage = (label: string) => {
    if (label === "Page A") {
        return "Page A is about men's clothing";
    }
    if (label === "Page B") {
        return "Page B is about women's dress";
    }
    if (label === "Page C") {
        return "Page C is about women's bag";
    }
    if (label === "Page D") {
        return "Page D is about household goods";
    }
    if (label === "Page E") {
        return "Page E is about food";
    }
    if (label === "Page F") {
        return "Page F is about baby food";
    }
    return "";
};

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: any;
    label?: string;
}) => {
    if (active && payload && payload.length) {
        return (
            <div className='custom-tooltip'>
                <p className='label'>{`${label} : ${payload[0].value}`}</p>
                <p className='intro'>{getIntroOfPage(label!)}</p>
                <p className='desc'>Anything you want can be displayed here.</p>
            </div>
        );
    }

    return null;
};

const ProgressEarningsPage: FC<IProgressEarningsPageProps> = () => {
    const dispatch = useDispatch();
    const { search } = useLocation();
    const year = useURLParams(search).get("year");
    const currentYear = year !== undefined ? parseInt(year) : new Date().getFullYear();
    let dataSetTotalEarningsInMonth: number[] = [];
    let dataSetAvgEarningsInMonth: number[] = [];

    const { bookings, totalFee, feesInMonth, numberOfBookingsInMonth, loading } =
        useSelector(earningState);

    useEffect(() => {
        dispatch(fetchEarnings({ year: currentYear }));
    }, [currentYear]);

    useEffect(() => {
        $("#earnings__prev-year").text(currentYear - 1);
        $("#earnings__current-year").text(currentYear);
        $("#earnings__next-year").text(currentYear + 1);
        $("#yearHeaderTitle").text(currentYear);
    }, []);

    useEffect(() => {
        if (feesInMonth && numberOfBookingsInMonth) {
            $("#numberOfBookingsInCurrentMonth").text(
                numberOfBookingsInMonth[date.getMonth() + 1] || 0
            );
            $("#earningsInCurrentMonth").text(
                "đ" + seperateNumber(feesInMonth[date.getMonth() + 1] || 0)
            );
        }
    }, [feesInMonth, numberOfBookingsInMonth]);

    for (let i = 0; i <= 12; i++) {
        dataSetTotalEarningsInMonth.push(feesInMonth[i] ? feesInMonth[i] : 0);
        dataSetAvgEarningsInMonth.push(
            numberOfBookingsInMonth[i] ? feesInMonth[i] / numberOfBookingsInMonth[i] : 0
        );

        // numberOfBookingsInMonth[i] = 0;
    }

    const data = [];
    for (let i = 0; i <= 12; i++) {
        data.push({
            label: `Tháng ${i}`,
            "Thu nhập trung bình": dataSetAvgEarningsInMonth[i],
            "Tổng thu nhập": dataSetTotalEarningsInMonth[i],
            "Số lượng đặt phòng": numberOfBookingsInMonth[i] || 0,
        });
    }
    console.log(data);

    const date = new Date();

    // let myChart;
    // const source = new EventSource('http://localhost:8080/airtnt/bookings');
    // source.addEventListener('booking-added', function (e) {
    //     const addedBookings = JSON.parse(e.data);
    //     addedBookings.forEach(({ id, bookingDate, totalFee, currencySymbol }) => {
    //         const month = bookingDate.toString().split('-')[1] * 1;
    //         if (currencySymbol === '$') totalFee *= 22_705;

    //         dataForDatasets[month] = dataForDatasets[month] + totalFee;
    //         dataForDatasets2[month] = dataForDatasets[month] / (numberOfBookingsInMonth[month] + 1);

    //         numberOfBookingsInMonth[month] += 1;
    //     });

    //     if (addedBookings.length > 0 && myChart) {
    //         const totalMoney = dataForDatasets.reduce((acc, v) => acc + v, 0);
    //         $('.earnings__total-earnings-in-year')
    //             .first()
    //             .text('đ' + seperateNumber(totalMoney));
    //         myChart.destroy();
    //         lineChart(dataForDatasets, dataForDatasets2);
    //     }
    // });

    function getPreviousYearStats() {
        window.location.href = `${window.location.origin}/progress/earnings?year=${
            currentYear - 1
        }`;
    }

    function getNextYearStats() {
        window.location.href = `${window.location.origin}/progress/earnings?year=${
            currentYear + 1
        }`;
    }

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />

            {!loading && (
                <div id='main'>
                    <div id='earnings__header' className='normal-flex jc-center'>
                        <div className='mr-10'>
                            <div
                                className='card text-white mb-3 bg-danger'
                                style={{ minWidth: "20rem" }}
                            >
                                <div className='card-header text-center'>
                                    Thu nhập đặt phòng trong năm <span id='yearHeaderTitle'></span>
                                </div>
                                <div className='card-body'>
                                    <h5
                                        className='card-title text-center'
                                        style={{ color: "white" }}
                                    >
                                        <span>đ</span>
                                        {seperateNumber(totalFee)}
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className='mr-10'>
                            <div
                                className='card text-white mb-3 bg-primary'
                                style={{ minWidth: "20rem" }}
                            >
                                <div className='card-header text-center'>
                                    Doanh thu tháng hiện tại
                                </div>
                                <div className='card-body'>
                                    <h5
                                        className='card-title text-center'
                                        id='earningsInCurrentMonth'
                                        style={{ color: "white" }}
                                    ></h5>
                                </div>
                            </div>
                        </div>
                        <div className='mr-5'>
                            <div
                                className='card text-white bg-success mb-3'
                                style={{ minWidth: "20rem" }}
                            >
                                <div className='card-header text-center'>
                                    Tổng đặt phòng trong tháng
                                </div>
                                <div className='card-body'>
                                    <h5
                                        className='card-title text-center'
                                        id='numberOfBookingsInCurrentMonth'
                                        style={{ color: "white" }}
                                    ></h5>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Div id='earnings__body' height='500px'>
                        <ResponsiveContainer width='100%' height='100%'>
                            <LineChart
                                width={500}
                                height={300}
                                data={data}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='label' />
                                <YAxis type='number' />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type='monotone'
                                    dataKey='Thu nhập trung bình'
                                    stroke='#8884d8'
                                    activeDot={{ r: 8 }}
                                />
                                <Line type='monotone' dataKey='Tổng thu nhập' stroke='#82ca9d' />
                                <Line
                                    type='natural'
                                    dataKey='Số lượng đặt phòng'
                                    stroke='#82ca9d'
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Div>

                    <div id='earnings__footer' className='normal-flex'>
                        <div
                            className='normal-flex'
                            style={{ cursor: "pointer" }}
                            onClick={getPreviousYearStats}
                        >
                            <div>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    viewBox='0 0 18 18'
                                    role='presentation'
                                    aria-hidden='true'
                                    focusable='false'
                                    style={{
                                        display: "block",
                                        fill: " #222",
                                        height: "16px",
                                        width: "16px",
                                    }}
                                >
                                    <path
                                        d='m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z'
                                        fillRule='evenodd'
                                    ></path>
                                </svg>
                            </div>
                            <div className='earnings__year' id='earnings__prev-year'>
                                2020
                            </div>
                        </div>
                        <div className='flex-1'></div>
                        <div id='earnings__current-year' className='earnings__year fs-600'>
                            2021
                        </div>
                        <div className='flex-1'></div>
                        <div
                            className='normal-flex'
                            style={{ cursor: "pointer" }}
                            onClick={getNextYearStats}
                        >
                            <div className='earnings__year' id='earnings__next-year'>
                                2022
                            </div>
                            <div>
                                <svg
                                    viewBox='0 0 32 32'
                                    xmlns='http://www.w3.org/2000/svg'
                                    aria-hidden='true'
                                    role='presentation'
                                    focusable='false'
                                    style={{
                                        display: "block",
                                        fill: "none",
                                        height: "16px",
                                        width: "16px",
                                        stroke: "currentcolor",
                                        strokeWidth: "5.33333",
                                        overflow: "visible",
                                    }}
                                >
                                    <g fill='none'>
                                        <path d='m12 4 11.2928932 11.2928932c.3905243.3905243.3905243 1.0236893 0 1.4142136l-11.2928932 11.2928932'></path>
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProgressEarningsPage;
