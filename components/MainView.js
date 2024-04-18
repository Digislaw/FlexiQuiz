import { Button, Divider, Layout, Text } from "@ui-kitten/components";
import { ScrollView, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { getItem, setItem } from "../utils/AsyncStorageHelpers";
import { useIsFocused } from "@react-navigation/native";

export default function CategoriesView({navigation}) {

    const defaultCategories = ["Animals", "Cars", "Food"];

    const [gptAvailable, setGptAvailable] = useState(false);
    const [categories, setCategories] = useState(defaultCategories);

    const isFocused = useIsFocused();

    const selectCategory = (category) => {
        navigation.navigate('Question', {category: category});
    }

    const deleteCategory = (category) => {
        const newArray = categories.filter(ctg => ctg !== category);
        setCategories(newArray);
        setItem('Categories', newArray);
    }

    const fetch = async () => {

        // Klucz API
        const key = await getItem('ApiKey');
        setGptAvailable(key !== null && key !== '');

        // Kategorie
        let ctg = await getItem('Categories');
        ctg = JSON.parse(ctg);

        if (ctg === null) {
            await setItem('Categories', defaultCategories);
        } else {
            setCategories(ctg);
        }
    }

    useEffect( () => {
        fetch();
    }, [isFocused]);

    return (
        <>
            <Layout style={styles.container}>
                <Text category="h4">Select a category</Text>
                <Divider style={styles.divider} />
                <ScrollView style={{width: 300}}>
                {
                    categories.map((category, index) =>
                        (<Layout key={index} style={styles.row}>
                            <Button  style={styles.btnCategory} disabled={!gptAvailable} onPress={() => selectCategory(category)}>{category}</Button>
                            <Button style={styles.btnDelete} status="danger" onPress={() => deleteCategory(category)}> - </Button>
                        </Layout>
                        ))
                }
                </ScrollView>
                
            </Layout>
            <Layout style={styles.footer}>
                {
                    !gptAvailable && 
                    <Text style={{marginBottom: 16}}>Enter your ChatGPT API key to play the game</Text>
                }
                <Layout style={styles.row}>
                    <Button onPress={() => navigation.navigate('Settings')} status="info"
                    style={{marginRight: 16}}>
                        <Ionicons style={styles.icon} name="settings" color="white" /> Settings
                    </Button>
                    <Button onPress={() => navigation.navigate('Stats')} status="info">
                        <Ionicons style={styles.icon} name="stats-chart" color="white" /> Stats
                    </Button>
                </Layout>

            </Layout>
        </>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        margin: 8
    },
    btnCategory: {
        margin: 8,
        minWidth: 160,
        minHeight: 60
    },
    btnDelete: {
        width: 60,
        height: 60
    },
    icon: {
        fontSize: 16,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#E4E7ED',
        borderTopWidth: 3
    }
});