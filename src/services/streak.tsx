import moment from "moment";
import { loadHappiness, rawHappiness } from "./diarySave";

export default async function getStreak(): Promise<number> {
    const happiness: rawHappiness[] = (await loadHappiness()).toReversed();

    let streak: number = 0;

    for (let happy of happiness) {
        if (moment(happy.timestamp).isSameOrBefore(moment())) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}
