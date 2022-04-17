import { addDays } from 'date-fns';
import { useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import moment from 'moment';
import './DatePicker.css';

/** 
 * Component of date selection 
 * props
 * 'isRangeSelectorActive': To activate or deactivate range selection 
 * */
function DatePicker({ isRangeSelectorActive }) {
    const initialRange = [
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    ];
    const [dateRange, setDateRange] = useState(initialRange);

    const [losRuleDates, setLosRulesDate] = useState();
    const [unAvailable, setUnAvailable] = useState([]);

    const [minDate, setMinDate] = useState(new Date());
    const [maxDate, setMaxDate] = useState();
    const [currentStartDate, setCurrentStartDate] = useState(new Date());

    const getLOSRecords = () => {
        fetch("/los")
            .then((res) => res.json())
            .then((data) => setLosRulesDate(data));
    }

    const getUnAvailbleDates = () => {
        fetch("/unAvailableDates")
            .then((res) => res.json())
            .then((res) => res.map(item => new Date(item)))
            .then((data) => setUnAvailable(data));
    }

    useEffect(() => {
        console.log("isRangeSelectorActive", isRangeSelectorActive)
        isRangeSelectorActive && getLOSRecords();
        isRangeSelectorActive && getUnAvailbleDates();
    }, []);

    /** Search for next disabled date */
    const getNextDisabledDate = (date) => {
        return unAvailable && unAvailable.find(unAvailableDate => moment(date)
            .isBefore(unAvailableDate, 'day'))
    }

    /** Reset suggested range */
    const resetMinMaxDate = (date) => {
        if (date.selection.startDate !== currentStartDate) {
            setMinDate(new Date());
            setMaxDate();
        }
    }

    const onDateChange = (date) => {
        setCurrentStartDate(date.selection.startDate);
        setDateRange([date.selection]);

        // condition for range functionality 
        isRangeSelectorActive && resetMinMaxDate(date);
        isRangeSelectorActive && setFutureRangeByLOS(date);
    }

    /** Finds future disabled date and sets it to max date so that user will be restricted to max date */
    const setFutureRangeByLOS = (date) => {
        const losRuleDate = losRuleDates.find(ruleDate => moment(date.selection.startDate).format('YYYY-MM-DD') === ruleDate?.day);

        if (losRuleDate) {
            // Add number of days to force selction (LOS)
            const minDate = losRuleDate && addDays(new Date(losRuleDate?.day), losRuleDate?.LOS);
            setMinDate(new Date(minDate));

            // Find next disabled date and restrict to the same date.
            const nextUnVailableDate = getNextDisabledDate(date.selection.startDate);
            nextUnVailableDate && setMaxDate(nextUnVailableDate);
        }
    }

    const resetDatePicker = () => {
        setDateRange(initialRange);
        setMinDate(new Date());
        setMaxDate();
        setCurrentStartDate(new Date());
    }

    return (
        <div className="date-container">
            <DateRange
                onChange={onDateChange}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={2}
                ranges={dateRange}
                disabledDates={unAvailable}
                direction="horizontal"
                minDate={minDate}
                maxDate={maxDate}
                preview={{ startDate: currentStartDate, endDate: minDate }}
            />
            <div className="reset">
                <button onClick={resetDatePicker}>Reset</button>
            </div>
        </div>
    );
}

export default DatePicker;
