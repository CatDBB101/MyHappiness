import { loadHappiness, rawHappiness } from "@/services/diarySave";
import { useIsFocused } from "expo-router";
import moment from "moment";
import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const DAYS = ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"];

export default function Diary() {
    const isFocused = useIsFocused();

    // happiness state
    const [happiness, setHappiness] = useState<rawHappiness[]>([]);

    // calendar state
    const [day, setDay] = useState<number>(0);
    const [month, setMonth] = useState<number>(0);
    const [year, setYear] = useState<number>(0);

    useEffect(() => {
        async function init() {
            const _happiness = await loadHappiness();
            setHappiness(_happiness);

            const presentDay = moment().date();
            setDay(presentDay);

            const presentMonth = moment().month();
            setMonth(presentMonth);

            const presentYear = moment().year();
            setYear(presentYear);
        }

        init();
    }, [isFocused]);

    function increaseMonth(): void {
        const newMonth = month + 1;
        if (newMonth > 11) {
            setMonth(0);
            setYear((prev) => prev + 1);
        } else {
            setMonth(newMonth);
        }
    }

    function decreaseMonth(): void {
        const newMonth = month - 1;
        if (newMonth < 0) {
            setMonth(11);
            setYear((prev) => prev - 1);
        } else {
            setMonth(newMonth);
        }
    }

    function calendarGap(): number {
        return (
            moment({ year: year, month: month }).startOf("month").isoWeekday() -
            1
        );
    }

    function getTotalDays(): number {
        return moment({ year: year, month: month }).daysInMonth();
    }

    function getTotalWeeks(): number {
        return Math.ceil((getTotalDays() + calendarGap()) / 7);
    }

    function isPresent(): boolean {
        return moment({
            year: year,
            month: month,
            date: day,
        }).isSame(moment(), "month");
    }

    function thisDateHaveNote(
        date: number,
        month: number,
        year: number,
    ): boolean {
        return happiness.some((happiness) => {
            return moment(happiness.timestamp).isSame(
                moment({
                    date,
                    month,
                    year,
                }),
                "date",
            );
        });
    }

    // re-render tricker
    if (!isFocused) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.calendarContainer}>
                <Text style={styles.streakText}>เธอเขียนมา - วันแล้วนะ</Text>
                <View style={styles.calendar}>
                    {/* month header */}
                    <View style={styles.monthBar}>
                        <TouchableOpacity onPress={decreaseMonth}>
                            <CaretLeftIcon />
                        </TouchableOpacity>
                        <Text style={styles.monthDisplay}>
                            {isPresent() ? "ปัจจุบัน" : "อดีตที่ผ่านไปแล้ว"}
                        </Text>
                        <TouchableOpacity
                            onPress={increaseMonth}
                            style={{
                                display: isPresent() ? "none" : "flex",
                            }}
                        >
                            <CaretRightIcon />
                        </TouchableOpacity>
                    </View>

                    {/* day header */}
                    <View style={styles.calendarCol}>
                        {DAYS.map((day, index) => (
                            <View
                                style={{
                                    ...styles.dayCell,
                                    backgroundColor: "black",
                                }}
                                key={index}
                            >
                                <Text
                                    style={{
                                        ...styles.dayCellText,
                                        color: "white",
                                    }}
                                >
                                    {day}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* calendar columns */}
                    {[...Array(getTotalWeeks()).keys()].map((_, __) => (
                        <View style={styles.calendarCol} key={__}>
                            {[1, 2, 3, 4, 5, 6, 7].map((_, index) => {
                                const cellIndex = __ * 7 + index;

                                const dayNumber = cellIndex - calendarGap() + 1;

                                const isValidDay =
                                    dayNumber > 0 &&
                                    dayNumber <= getTotalDays();

                                if (!isValidDay)
                                    return (
                                        <View
                                            style={{
                                                ...styles.dayCell,
                                                opacity: 0,
                                            }}
                                            key={index}
                                        ></View>
                                    );

                                return (
                                    <TouchableOpacity
                                        style={{
                                            ...styles.dayCell,
                                            backgroundColor:
                                                dayNumber == day
                                                    ? "black"
                                                    : thisDateHaveNote(
                                                            dayNumber,
                                                            month,
                                                            year,
                                                        )
                                                      ? "#7f7f7f"
                                                      : "white",
                                        }}
                                        onPress={() => {
                                            setDay(dayNumber);
                                        }}
                                        key={index}
                                    >
                                        <Text
                                            style={{
                                                ...styles.dayCellText,
                                                color:
                                                    dayNumber == day ||
                                                    thisDateHaveNote(
                                                        dayNumber,
                                                        month,
                                                        year,
                                                    )
                                                        ? "white"
                                                        : "black",
                                            }}
                                        >
                                            {dayNumber}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </View>
            </View>

            {/* Note list */}
            <ScrollView style={styles.happinessContainer}>
                {happiness
                    // filter just today happiness
                    .filter((happy) =>
                        moment(happy.timestamp).isSame(
                            moment({
                                date: day,
                                month,
                                year,
                            }),
                            "date",
                        ),
                    )
                    // display
                    .map((happy, index) => {
                        return (
                            <View style={styles.happinessBox} key={index}>
                                <Text
                                    style={styles.happinessBoxText}
                                >{`${index + 1}.${happy.happy}`}</Text>
                            </View>
                        );
                    })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "red",
    },
    calendarContainer: {
        flex: 1.7,
        padding: 10,
        backgroundColor: "#c8c8c8",
        // backgroundColor: "red",
    },
    streakText: {
        fontSize: 20,
    },
    calendar: {
        flex: 1,
        gap: 5,
    },
    monthBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        backgroundColor: "#fff",
    },
    monthDisplay: {
        flex: 1,
        textAlign: "center",
        fontSize: 20,
    },
    calendarCol: {
        height: "11%",

        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,

        // backgroundColor: "green",
    },
    dayCell: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

        borderRadius: 10,

        backgroundColor: "#fff",
    },
    dayCellText: {
        flex: 1,

        textAlign: "center",
        textAlignVertical: "center",

        fontSize: 15,
    },
    happinessContainer: {
        flex: 1,
        // height: "5%",

        padding: 15,
    },
    // happiness box
    happinessBox: {
        height: 90,
        paddingHorizontal: 20,
        alignItems: "center",

        flexDirection: "row",
        marginBottom: 15,

        backgroundColor: "#c8c8c8",
    },
    happinessBoxText: {
        flex: 1,
        fontSize: 25,
        // backgroundColor: "red",
    },
});
