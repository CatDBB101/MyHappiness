import { Tabs } from "expo-router";
import { NotebookIcon, Smiley } from "phosphor-react-native";

export default function RootLayout() {
    return (
        <Tabs screenOptions={{}}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Today Happiness",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Smiley
                            color={color.toString()}
                            size={size}
                            weight={focused ? "fill" : "regular"}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="diary"
                options={{
                    title: "My Happiness Diary",
                    tabBarIcon: ({ color, size, focused }) => (
                        <NotebookIcon
                            color={color.toString()}
                            size={size}
                            weight={focused ? "fill" : "regular"}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
