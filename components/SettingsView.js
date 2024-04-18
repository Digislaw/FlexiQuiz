import { Button, Input, Layout } from "@ui-kitten/components";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { getItem, setItem } from '../utils/AsyncStorageHelpers';

export default function SettingsView({navigation}) {

    const [apiKey, setApiKey] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const renderIcon = (name) => (
        <>
            <Ionicons name={name} size={16} />
        </>
    );

    const addCategory = async () => {
        let ctg = await getItem('Categories');
        ctg = JSON.parse(ctg);

        if (ctg.includes(newCategory)) {
            alert(`Category ${newCategory} already exists`);
        } else {
            const newCategories = [...ctg, newCategory];
            await setItem('Categories', newCategories);
            alert(`Added "${newCategory}" category`);
            setNewCategory('');
        }
    }

    const save = async () => {
        await setItem('ApiKey', apiKey);

        navigation.navigate('Main Menu');
    }

    const fetch = async () => {
        const key = await getItem('ApiKey');
        if (key !== null) {
            setApiKey(key);
        }
    }

    useEffect(() => {
        fetch();
    }, []);

    return (
        <Layout style={styles.container}>
            <Input
                style={styles.input}
                value={apiKey}
                label='API Key'
                placeholder='Enter your API key'
                accessoryLeft={renderIcon('key')}
                onChangeText={val => setApiKey(val)}
            />

            <Layout style={styles.row}>
                <Input
                    style={{width: 250, marginBottom: 24}}
                    value={newCategory}
                    label='Add new category'
                    placeholder='Enter new category'
                    accessoryLeft={renderIcon('add')}
                    onChangeText={val => setNewCategory(val)}
                />
                <Button style={{width:50, height:50}} onPress={() => addCategory()}>+</Button>
            </Layout>

            <Button onPress={save}>
                <Ionicons name="save" size={16} /> Save
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
    input: {
        width: 300,
        marginBottom: 24
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});