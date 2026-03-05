import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, setLoading, updateTask } from '../redux/taskSlice';
import { showToast } from '../redux/toastSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeft, Save } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';
import Button from '../components/ui/Button';
import bg from '../images/bg.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedBackground from '../components/ThemeBackground';
import useTheme from '../hooks/useTheme';
const AddEditTaskScreen = ({ navigation, route }) => {
    const task = route?.params?.task;
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const { loading,setItem } = useSelector(state => state.tasks);
    const {darkMode} = useSelector(state => state.theme);

    const dispatch = useDispatch();
    const theme = useTheme();
    

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
        }
    }, [task]);

    const handleSave = async () => {
        if (!title.trim()) {
            dispatch(showToast({ message: 'Please enter a task title', type: 'error' }));
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            completed: false,
            source: 'local'
        };

        try {
            dispatch(setLoading(true));

            await new Promise(resolve => setTimeout(resolve, 1500));

            const localData = await AsyncStorage.getItem('local_tasks');
            const localTasks = localData ? JSON.parse(localData) : [];
            const updatedTasks = [newTask, ...localTasks];
            await AsyncStorage.setItem('local_tasks', JSON.stringify(updatedTasks));

            dispatch(addTask(newTask));

            dispatch(showToast({ message: 'Task Added successfully', type: 'success' }));

            navigation.goBack();
        } catch (error) {
            console.error(error);
            dispatch(showToast({ message: 'Failed to save task', type: 'error' }));
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleUpdate = async () => {
        if (!title.trim()) {
            dispatch(showToast({ message: 'Please enter a task title', type: 'error' }));
            return;
        }

        const updatedTask = {
            ...task,
            title,
            description
        };

        try {
            dispatch(setLoading(true));

            await new Promise(resolve => setTimeout(resolve, 1500));

            const localData = await AsyncStorage.getItem('local_tasks');
            const localTasks = localData ? JSON.parse(localData) : [];
            const updatedTasks = localTasks.map(t => (t.id === task.id ? updatedTask : t));
            await AsyncStorage.setItem('local_tasks', JSON.stringify(updatedTasks));

            dispatch(updateTask(updatedTask));

            dispatch(showToast({ message: 'Task Updated successfully', type: 'success' }));

            
            navigation.goBack();
        } catch (error) {
            console.error(error);
            dispatch(showToast({ message: 'Failed to update task', type: 'error' }));
        } finally {
            dispatch(setLoading(false));
        }
    };

    if (loading) {
        return (
            <View className="bg-[#1a1a1a] items-center justify-center" style={styles.container}>
                <ActivityIndicator size="large" color="#f49b33" />
            </View>
        );
    }

    return (
        <ThemedBackground darkMode={darkMode}>
            <SafeAreaView className="flex-1 py-5">
                <View className="flex-1">
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ChevronLeft size={28} color={theme.taskTitle} />
                        </TouchableOpacity>
                        <Text style={[styles.headerTitle, { color: theme.taskTitle }]}>{task ? 'Update Task' : 'Add Task'}</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    <View style={styles.form}>
                        <Text style={[styles.label, { color: theme.taskTitle }]}>Title</Text>
                        <View style={{ backgroundColor: theme.inputBg, borderColor: theme.inputBorder}} className="flex-row items-center rounded-2xl border px-4 py-1 backdrop-blur-lg ">
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="What needs to be done?"
                                value={title}
                                onChangeText={setTitle}
                                className="flex-1 px-3 py-3"
                                placeholderTextColor={theme.muted}
                            />

                        </View>

                        <Text className="mt-4" style={[styles.label, { color: theme.taskTitle }]}>Description</Text>
                        <View style={{ backgroundColor: theme.inputBg, borderColor: theme.inputBorder }} className="flex-row items-center rounded-2xl border px-4 py-1 backdrop-blur-lg ">
                            <TextInput
                                style={[ styles.textArea, { color: theme.text }]}
                                placeholder="Add more details..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={4}
                                className="flex-1 px-3 py-3 "
                                placeholderTextColor={theme.muted}
                            />
                        </View>
                    </View>
                    <View className="px-4 mt-5">
                        <Button onPress={task ? handleUpdate : handleSave} loading={loading}>
                            <Text style={{ color: theme.textIcon }}>
                                {task ? 'Update Task' : 'Save Task'}
                            </Text>
                        </Button>
                    </View>
                    {/* <TouchableOpacity style={styles.saveButton} onPress={task ? handleUpdate : handleSave}>
                        <Save size={24} color="#fff" />
                        <Text style={styles.buttonText}>{task ? 'Update Task' : 'Save Task'}</Text>
                    </TouchableOpacity> */}
                </View>
            </SafeAreaView>
        </ThemedBackground>
    );
};

const styles = StyleSheet.create({

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4f23ba',
    },
    form: {
        paddingHorizontal: 20,
        // flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4f23ba',
        marginBottom: 8,
    },
    // input: {
    //     backgroundColor: '#F2F2F7',
    //     padding: 16,
    //     borderRadius: 12,
    //     fontSize: 17,
    //     color: '#1C1C1E',
    //     marginBottom: 24,
    // },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    saveButton: {
        flexDirection: 'row',
        backgroundColor: '#f49b33',
        margin: 20,
        padding: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default AddEditTaskScreen;
