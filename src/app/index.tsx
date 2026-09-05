import {
    loadHappiness,
    rawHappiness,
    saveHappiness,
} from "@/services/diarySave";
import moment from "moment";
import { LeafIcon, SmileyIcon } from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function Today() {
    const [happy, setHappy] = useState<string>("");
    const [happiness, setHappiness] = useState<rawHappiness[]>([]);

    useEffect(() => {
        async function init() {
            const _happiness = await loadHappiness();
            // console.log("_happiness: ", _happiness);
            setHappiness(_happiness);
        }

        init();
    }, []);

    useEffect(() => {
        saveHappiness(happiness);
    }, [happiness]);

    function handleLeaveHappiness(index: number) {
        setHappiness((prevHappiness) => {
            let newHappiness = [...prevHappiness];
            newHappiness.splice(index, 1);

            return newHappiness;
        });
    }

    function handleSaveHappy() {
        setHappiness((prevHappiness) => {
            let newHappiness = [...prevHappiness];
            newHappiness.push({
                happy,
                timestamp: Number(Date.now()),
            });
            return newHappiness;
        });

        setHappy("");
    }

    return (
        <View style={styles.container}>
            <View style={styles.happinessInputContainer}>
                <TextInput
                    style={styles.happinessInput}
                    placeholder="วันนี้มีความสุขอะไรบ้าง เล่าให้ฟังหน่อยสิ"
                    value={happy}
                    onChangeText={(text) => {
                        setHappy(text);
                    }}
                />
                <TouchableOpacity
                    style={styles.happinessSaveButton}
                    onPress={() => {
                        handleSaveHappy();
                    }}
                    disabled={happy.length == 0}
                >
                    <SmileyIcon />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.happinessContainer}>
                {happiness
                    // filter just today happiness
                    .filter((happy) =>
                        moment(happy.timestamp).isSame(moment(), "date"),
                    )
                    // display
                    .map((happy, index) => {
                        return (
                            <View style={styles.happinessBox} key={index}>
                                <Text
                                    style={styles.happinessBoxText}
                                >{`${index + 1}.${happy.happy}`}</Text>
                                <TouchableOpacity
                                    style={styles.happinessLeave}
                                    onPress={() => {
                                        handleLeaveHappiness(index);
                                    }}
                                >
                                    <LeafIcon
                                        size={32}
                                        style={{
                                            opacity: 0.5,
                                        }}
                                    />
                                </TouchableOpacity>
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
    },
    // happiness input
    happinessInputContainer: {
        alignItems: "center",

        flexDirection: "row",
        padding: 15,
        gap: 10,

        backgroundColor: "white",
    },
    happinessInput: { flex: 1, paddingLeft: 10, backgroundColor: "#c8c8c8" },
    happinessSaveButton: {
        flex: 0.1,
        justifyContent: "center",
        alignItems: "center",

        // backgroundColor: "red",
    },
    // happiness container
    happinessContainer: {
        flex: 1,

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
    happinessLeave: {
        // backgroundColor: "green",
    },
});
