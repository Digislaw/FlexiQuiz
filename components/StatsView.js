import { Button, Layout, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { setItem, getInt } from '../utils/AsyncStorageHelpers';

export default function StatsView({navigation}) {

    const [totalPoints, setTotalPoints] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);

    const fetch = async () => {
        const pts = await getInt('TotalPoints');
        setTotalPoints(pts);

        const correct = await getInt('CorrectAnswers');
        setCorrectAnswers(correct);

        const wrong = await getInt('WrongAnswers');
        setWrongAnswers(wrong);
    }

    const resetStats = async () => {
        setTotalPoints(0);
        setCorrectAnswers(0);
        setWrongAnswers(0);

        await setItem('TotalPoints', '0');
        await setItem('CorrectAnswers', '0');
        await setItem('WrongAnswers', '0');
    }

    useEffect(() => {
        fetch();
    }, []);

    return (
        <Layout style={styles.container}>
            <Text style={styles.label}>Total Points: {totalPoints}</Text>
            <Text style={styles.label}>Correct answers: {correctAnswers}</Text>
            <Text style={styles.label}>Wrong answers: {wrongAnswers}</Text>
            {
                correctAnswers > 0 && wrongAnswers > 0 &&
                <Text style={styles.label}>Correct/Wrong answers ratio: {(correctAnswers / wrongAnswers).toFixed(2)}</Text>
            }
            <Button style={{marginTop: 8}} onPress={resetStats} status="danger">
                <Ionicons name="trash" size={16} /> Reset
            </Button>
        </Layout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        marginBottom: 8
    }
});