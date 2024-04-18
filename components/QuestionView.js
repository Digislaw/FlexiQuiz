import { Button, Layout, Radio, RadioGroup, Text } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { getInt, getItem, setItem } from "../utils/AsyncStorageHelpers";
import axios from 'axios';

export default function QuestionView({route, navigation}) {

    const {category} = route.params;

    [apiKey, setApiKey] = useState('');
    const endpoint = 'https://api.openai.com/v1/chat/completions'
    const maxTokens = 200;

    const systemPrompt = 'You are a quiz generator. Create questions from the given category, one at a time. Be Do not use prefix. Provide 4 options in separate lines, with one being correct. On the last line give the index of correct answer - a digit between 0 and 3. After the user answers the question, generate another one. Avoid similar questions and do not repeat the questions';
    const userPrompt = `Category: ${category}`;

    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [correctIndex, setCorrectIndex] = useState(0);

    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [isNextAvailable, setIsNextAvailable] = useState(false);
    const [points, setPoints] = useState(0);

    const [messages, setMessages] = useState([
        {role: 'system', content: systemPrompt},
        {role: 'user', content: userPrompt}]);


    const splitAnswers = (response) => {
        console.log(response);

        lines = response.split('\n');
        lines = lines.filter(line => line.trim() !== ''); // usunięcie pustych linii

        // Pytanie
        setQuestion(lines[0]);
        lines.shift();

        // Poprawna Odpowiedź
        setCorrectIndex(lines.pop().match(/\d+/)[0]);

        // Odpowiedzi
        setAnswers(lines);
    }

    const sendRequest = () => {
        axios.post(endpoint, {
            max_tokens: maxTokens,
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 1.5
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        }).then((response) => {
            splitAnswers(response.data.choices[0].message.content);
            reset();
        }).catch(error => { 
            console.log(error.response.data); 
            alert(error.response.data.error.message);
        });
    }

    const checkAnswer = async (index) => {
        const isAnswerCorrect = index == correctIndex ? true : false;

        if (isAnswerCorrect) {
            setFeedbackMessage('Correct answer');
            setPoints(points + 1);

            const totalPts = await getInt('TotalPoints') + 1; 
            setItem('TotalPoints', totalPts.toString());

            const correctAnswers = await getInt('CorrectAnswers') + 1;
            setItem('CorrectAnswers', correctAnswers.toString());
        } else {
            setFeedbackMessage('Wrong answer');
            
            const correctAnswers = await getInt('WrongAnswers') + 1;
            setItem('WrongAnswers', correctAnswers.toString());
        }
    }

    const selectAnswer = (index) => {
        setSelectedIndex(index);

        const userAnswer = {role: 'user', content: index.toString()};
        const newMessages = [...messages.slice(-19), userAnswer];

        console.log(`Answer: ${answers[index]}`)
        setMessages(newMessages);

        checkAnswer(index);
        setIsNextAvailable(true);
    }

    const reset = () => {
        setSelectedIndex(0);
        setFeedbackMessage('');
        setIsNextAvailable(false);
    }

    const nextQuestion = () => {
        sendRequest();
    }

    const fetch = async () => {
        // Klucz API
        const key = await getItem('ApiKey');
        setApiKey(key);

        sendRequest();
    }

    useEffect(() => {
        navigation.setOptions({
            headerTitle: category
        });
        fetch();
    }, [navigation]);

    return(
        <Layout style={styles.container}>
            <Text style={{marginBottom: 16}}>Points: {points}</Text>
            <Text style={styles.text} category="h5">{question}</Text>
            <RadioGroup 
                selectedIndex={selectedIndex} 
                onChange={index => selectAnswer(index)}>
                    {
                        answers.map((answer, index) =>
                            (<Radio key={index} disabled={isNextAvailable}>{answer}</Radio>)
                        )
                    }
            </RadioGroup>
            <Text style={styles.text}>{feedbackMessage}</Text>
            {
                isNextAvailable && <Button onPress={() => nextQuestion()}>Next</Button>
            }
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
    text: {
        maxWidth: 300, 
        marginBottom: 16
    },
    topRow: {
        alignContent: 'center', 
        alignItems: 'center',
        paddingTop: 32
    }
});