/* eslint-disable react-hooks/exhaustive-deps */
import { filter, find, map } from "lodash";
import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BiReset } from "react-icons/bi";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import hijriCalendar from "../lib/datetime/calendar";
import HijriDate from "../lib/datetime/hijri_date";
import ArabicNumerals from "../lib/datetime/arabic_numerals";
import network from "../lib/network/index";

import moment from "moment";

export const weekLetters = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ dark, setDark }) => {
  const checkKeyPress = (e) => {
    if (e.key === "ArrowRight") {
      setCalendar(calendar.previousMonth);
    }
    if (e.key === "ArrowLeft") {
      setCalendar(calendar.nextMonth);
    }
    if (e.key === "Backspace") {
      setCalendar(hCal);
    }
  };

  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    setShowHelper(true);
  }, []);

  useEffect(() => {
    document.addEventListener("keyup", checkKeyPress);

    return () => {
      document.removeEventListener("keyup", checkKeyPress);
    };
  });

  const momentDate = moment();
  const [showHijri, setShowHijri] = useState(false);
  const [miqaats, setMiqaats] = useState([]);

  const getMiqaats = async () => {
    const data = await network.post("data");
    setMiqaats(filter(data.miqaatDayList, { month: calendar.month }));
  };
  useEffect(() => {
    getMiqaats();
  }, []);

  const hDate = HijriDate.fromGregorian(momentDate.toDate());

  const hCal = hijriCalendar(hDate.year, hDate.month, false);

  const [calendar, setCalendar] = useState(hCal);

  const [selectedData, setSelectedData] = useState(null);

  const todayHijri = HijriDate.fromGregorian(momentDate.toDate());

  const weeks = calendar.weeks();

  const modifyData = (day) => {
    const { date, title, month } = day;
    setSelectedData({ date, title, month });
  };

  return (
    <div>
      <div className="Calendar-card">
        <div className="header">
          <div className="header-left">
            <h1 aria-label="current month">
              {HijriDate.getMonthName(calendar.month)} {calendar.year}
            </h1>
          </div>
          <div className="header-right">
            <button
              tabIndex="1"
              title="Previous Month"
              onClick={() => setCalendar(calendar.previousMonth)}
              className="btn icon-left"
            >
              <FiChevronLeft />
            </button>
            <button
              tabIndex="2"
              title="Next Month"
              onClick={() => setCalendar(calendar.nextMonth)}
              className="btn icon-right"
            >
              <FiChevronRight />
            </button>
            <button
              tabIndex="3"
              title="Reset"
              onClick={() => {
                setCalendar(hCal);
                setSelectedData(null);
              }}
              className="btn icon-reset"
            >
              <BiReset />
            </button>
          </div>
        </div>
        <div className="weekLetters">
          {map(weekLetters, (w, i) => (
            <div key={i}>
              <p>{w}</p>
            </div>
          ))}
        </div>
        <div className="dates">
          {map(weeks, (week, index) => (
            <div
              key={index}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              {map(week, (day, i) => {
                const today =
                  day.hijri.date === todayHijri.day &&
                  day.hijri.month === todayHijri.month &&
                  day.hijri.year === todayHijri.year &&
                  !day.filler;

                const hasMiqaat = find(miqaats, { date: day.hijri.date });
                return (
                  <button
                    aria-label={day.hijri.date}
                    title={day.hijri.date}
                    key={i}
                    onClick={() => {
                      if (hasMiqaat && !day.filler) {
                        modifyData(hasMiqaat);
                      }
                      return;
                    }}
                    className={`date ${day.filler ? "filler" : undefined} ${
                      today ? "today" : undefined
                    }`}
                  >
                    <p>
                      {showHijri
                        ? ArabicNumerals.fromInteger(day.hijri.date)
                        : day.hijri.date}
                    </p>
                    {hasMiqaat && !day.filler && <div className="miqaat" />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="footer">
          <button
            className="btn btn-lang"
            onClick={() => setShowHijri(!showHijri)}
          >
            <img
              alt="change date"
              src={require("../assets/icons/calendar.png").default}
              height="15"
              width="15"
              style={{ resizeMode: "cover" }}
            />
            Show {showHijri ? "English" : "Hijri"} Date
          </button>
          <button className="btn btn-theme" onClick={() => setDark(!dark)}>
            <img
              alt="change theme"
              src={require("../assets/icons/theme.png").default}
              height="15"
              width="15"
              style={{ resizeMode: "cover" }}
            />
            Change Theme
          </button>
        </div>
      </div>
      <div className="miqaatDetails">
        {selectedData !== null ? (
          <div>
            <p>
              {selectedData.date} {HijriDate.getMonthName(selectedData?.month)}{" "}
              • {selectedData.title}
            </p>
          </div>
        ) : (
          <p>Click on date to see miqaat details</p>
        )}
      </div>
      <div className={`helper ${showHelper ? "show" : "hide"}`}>
        <p>use key arrows to change months</p>
        <button onClick={() => setShowHelper(false)}>close</button>
      </div>
    </div>
  );
};

export default Calendar;
