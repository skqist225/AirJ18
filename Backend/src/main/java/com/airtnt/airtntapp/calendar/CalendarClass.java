package com.airtnt.airtntapp.calendar;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

public class CalendarClass {
    public static List<String> getDaysInMonth(int selectedMonth, int selectedYear) {
        List<String> daysArray = new ArrayList<>();
        Calendar cal = new GregorianCalendar();
        int currentDay = cal.get(Calendar.DATE);
        int currentMonth = cal.get(Calendar.MONTH);
        int currentYear = cal.get(Calendar.YEAR);

        GregorianCalendar gCal = new GregorianCalendar(selectedYear, selectedMonth, 1);
        int days = gCal.getActualMaximum(Calendar.DATE); // total days in month
        int startInWeek = gCal.get(Calendar.DAY_OF_WEEK); // ngày thứ mấy trong tuần đó

        gCal = new GregorianCalendar(selectedYear, selectedMonth, 1);
        int totalWeeks = gCal.getActualMaximum(Calendar.WEEK_OF_MONTH);
        // System.out.println("totalWeeks" + totalWeeks);
        // System.out.println("totalDays:" + days);
        // System.out.println("startInWeek" + startInWeek);
        // System.out.println("selectedMonth: " + selectedMonth);
        // System.out.println("selectedYear" + selectedYear);
        // System.out.println("cDay" + currentDay);

        int count = 1; // Count the days
        for (int i = 1; i <= totalWeeks; i++) {
            System.out.println();
            for (int j = 1; j <= 7; j++) {
                if (count < startInWeek || (count - startInWeek + 1) > days) {
                    daysArray.add("_");
                } else {
                    if ((count - startInWeek + 1) == currentDay && currentYear == selectedYear
                            && currentMonth == selectedMonth) {
                        daysArray.add(String.valueOf(currentDay));
                    } else {
                        daysArray.add(String.valueOf(count - startInWeek + 1));
                    }
                }
                count++;
            }
            daysArray.add("*");
        }

        return daysArray;

    }
}
