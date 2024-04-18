import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (key, value) => {
    try {
        if (value === null) {
            throw new Error('Null when setting Async Storage variable');
        }
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.log(e);
    }
};

export const getItem = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (e) {
        console.log(e);
    }
};

export const getInt = async (key) => {
    const value = await getItem(key);

    if (value == null) {
        return 0;
    }

    return parseInt(value);
}