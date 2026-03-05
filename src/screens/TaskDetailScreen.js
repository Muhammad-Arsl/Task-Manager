import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ImageBackground, useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, setLoading, toggleComplete } from '../redux/taskSlice';
import { showToast } from '../redux/toastSlice';
import { showNotification } from '../services/NotificationService';
import { ChevronLeft, Trash2, CheckCircle, Circle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { SafeAreaView } from 'react-native-safe-area-context';
import useTheme from '../hooks/useTheme';
import ThemedBackground from '../components/ThemeBackground';
import Button from '../components/ui/Button';

const TaskDetailScreen = ({ route, navigation }) => {
    const { task } = route.params;
    const { loading } = useSelector(state => state.tasks);
    const { darkMode } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    const theme = useTheme();
    
    const handleDelete = () => {
        Alert.alert(
            'Delete Task',
            'Are you sure you want to delete this task?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            dispatch(setLoading(true));
                            await new Promise(resolve => setTimeout(resolve, 1500));
                            const localData = await AsyncStorage.getItem('local_tasks');
                            if (localData) {
                                const localTasks = JSON.parse(localData);
                                const updatedTasks = localTasks.filter(t => t.id !== task.id);
                                await AsyncStorage.setItem('local_tasks', JSON.stringify(updatedTasks));
                            }

                            dispatch(deleteTask(task.id));
                            dispatch(showToast({ message: 'Task Deleted successfully', type: 'success' }));
                            navigation.goBack();
                        } catch (error) {
                            console.error('Failed to delete task from storage:', error);
                            dispatch(showToast({ message: 'Failed to delete task', type: 'error' }));
                        } finally {
                            dispatch(setLoading(false));
                        }
                    }
                },
            ]
        );
    };

    const handleToggle = async () => {
        const isCompleted = !task.completed;
        dispatch(toggleComplete(task.id));

        // Persist to AsyncStorage if it's a local task
        if (task.source === 'local') {
            try {
                const localData = await AsyncStorage.getItem('local_tasks');
                if (localData) {
                    const localTasks = JSON.parse(localData);
                    const updatedTasks = localTasks.map(t =>
                        t.id === task.id ? { ...t, completed: isCompleted } : t
                    );
                    await AsyncStorage.setItem('local_tasks', JSON.stringify(updatedTasks));
                }
            } catch (error) {
                console.error('Failed to update task in storage:', error);
            }
        }

        const status = isCompleted ? 'Completed' : 'Incomplete';
        showNotification('Task Updated', `"${task.title}" marked as ${status}.`);
        navigation.goBack();
    };

    if (loading) {
        return (
            <View className="bg-[#1a1a1a] flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <ThemedBackground darkMode={darkMode}>
            <SafeAreaView className="flex-1 mt-5">
                <View  style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <ChevronLeft size={28} color={theme.taskTitle} />
                        </TouchableOpacity>
                        <Text style={{ color: theme.taskTitle }} className="text-xl font-semibold capitalize flex-1">{task.title}</Text>
                       
                    </View>

                    <View  style={styles.content}>
                        {/* <Text className="capitalize" style={styles.title}>{task.title}</Text> */}
                        <Text style={[styles.source, { color: theme.secondaryText}]}>Source: {task.source === 'api' ? 'Remote API' : 'Local Storage'}</Text>
                        <View style={[styles.divider, { backgroundColor: theme.primary}]} />
                        <Text style={{ color: theme.text}} className="text-xl font-semibold">Description:</Text>
                        <Text style={[styles.description, { color: theme.muted}]}>{task.description || 'No additional description provided.'}</Text>
                    </View>
                    <View className="flex-row items-center justify-center gap-3">

                        <Button className='gap-1 px-10' variant='danger' onPress={handleDelete}>
                            <Trash2 size={20} color="#fff" />
                            <Text className="tracking-widest" style={styles.buttonText}>Delete</Text>
                        </Button>

                        <Button
                         style={[styles.completeButton, task.completed && styles.completedButton]}
                         onPress={handleToggle}
                         className='gap-3 px-10'
                        >
                            {task.completed ? (
                                <Circle size={24} color="#fff" />
                            ) : (
                                <CheckCircle size={24} color="#fff" />
                            )}
                            <Text className="tracking-widest" style={styles.buttonText}>
                                {task.completed ? 'Incomplete' : 'Complete'}
                            </Text>

                        </Button>
                    </View>

                </View>
            </SafeAreaView>
        </ThemedBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 10
    },
    content: {
        paddingHorizontal: 20,
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4f23ba',
        marginBottom: 8,
    },
    source: {
        fontSize: 14,
        marginBottom: 10,
        marginTop: 15
    },
    divider: {
        height: 1,
        marginBottom: 20,
    },
    description: {
        fontSize: 13,
        lineHeight: 20,
        marginTop: 5,
    },
    completeButton: {
        flexDirection: 'row',
        backgroundColor: '#34C759',
        margin: 20,
        padding: 16,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedButton: {
        backgroundColor: '#4f23ba',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TaskDetailScreen;
