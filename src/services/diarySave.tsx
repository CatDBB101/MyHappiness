import AsyncStorage from "@react-native-async-storage/async-storage";

export interface rawHappiness {
    happy: string;
    timestamp: number;
}

const STORAGE_KEY = "@my_happiness";

export const saveHappiness = async (happiness: rawHappiness[]) => {
    try {
        const jsonString = JSON.stringify(happiness);
        // console.log(jsonString);
        await AsyncStorage.setItem(STORAGE_KEY, jsonString);
        console.log("Happiness saved successfully.");
    } catch (error) {
        console.error("Error saving happiness:", error);
    }
};

export const loadHappiness = async (): Promise<rawHappiness[]> => {
    try {
        const jsonString = await AsyncStorage.getItem(STORAGE_KEY);
        // console.log(jsonString);
        return jsonString != null ? JSON.parse(jsonString) : [];
    } catch (error) {
        console.error("Error loading happiness:", error);
        return [];
    }
};
