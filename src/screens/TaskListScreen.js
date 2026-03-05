import { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, toggleComplete } from '../redux/taskSlice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus, CheckCircle, Settings, PencilIcon, PlusCircleIcon } from 'lucide-react-native';
import Button from '../components/ui/Button';
import { showToast } from '../redux/toastSlice';
import bg from '../images/bg.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThemedBackground from '../components/ThemeBackground';
import useTheme from '../hooks/useTheme';


const TaskListScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector(state => state.tasks);
    const [refreshing, setRefreshing] = useState(false);
    const { darkMode } = useSelector(state => state.theme);
    const theme = useTheme();

    const fetchTasks = useCallback(async () => {
        try {
            setRefreshing(true);
            const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=3');

            const apiTasks = response.data.map(task => ({
                id: task.id.toString(),
                title: task.title,
                completed: task.completed,
                description: 'Fetched from API',
                source: 'api'
            }));

            const localData = await AsyncStorage.getItem('local_tasks');

            const localTasks = localData ? JSON.parse(localData) : [];

            const mergedTasks = [...localTasks, ...apiTasks.filter(at => !localTasks.find(lt => lt.id === at.id))];

            dispatch(setTasks(mergedTasks));
        } catch (err) {
            console.error(err);
            const localData = await AsyncStorage.getItem('local_tasks');
            if (localData) dispatch(setTasks(JSON.parse(localData)));
        } finally {
            setRefreshing(false);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const onRefresh = () => {
        fetchTasks();
    };


    const handleToggle = async (id) => {
        const task = items.find(item => item.id === id);
        const isCompleted = !task.completed;

        dispatch(toggleComplete(id));

        // Persist to AsyncStorage if it's a local task
        if (task.source === 'local') {
            try {
                const localData = await AsyncStorage.getItem('local_tasks');
                if (localData) {
                    const localTasks = JSON.parse(localData);
                    const updatedTasks = localTasks.map(t =>
                        t.id === id ? { ...t, completed: isCompleted } : t
                    );
                    await AsyncStorage.setItem('local_tasks', JSON.stringify(updatedTasks));
                }
            } catch (error) {
                console.error('Failed to update task in storage:', error);
            }
        }

        if (isCompleted) {
            dispatch(showToast({ message: 'Task Completed', type: 'success' }));
        } else {
            dispatch(showToast({ message: 'Task Incomplete', type: 'warning' }));
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('TaskDetail', { task: item })}
            style={{ backgroundColor: item.completed ? theme.bgMuted : theme.inputBg, borderColor: item.completed ? theme.inputBg : theme.bgMuted }}
            className={`mb-4 flex-row items-center gap-3 rounded-2xl border p-4 backdrop-blur-md `}
        >
            <TouchableOpacity onPress={() => handleToggle(item.id)}>
                {item.completed ? (
                    <View style={{ backgroundColor: theme.primary }} className="h-7 w-7 items-center justify-center rounded-full">
                        <CheckCircle size={18} color="#fff" />
                    </View>
                ) : (
                    <View className="h-7 w-7 rounded-full border-2 border-[#4f23ab]" />
                )}
            </TouchableOpacity>

            <View className="flex-1 pr-3">
                <Text
                    className={`text-lg font-semibold ${item.completed ? 'line-through' : ''
                        }`}
                    style={{
                        color: item?.completed ? '#9b9797' : theme.primary,
                    }}
                    numberOfLines={1}
                >
                    {item.title}
                </Text>
                <View className="mt-1 flex-row items-center">
                    <Text className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                        {item.source === 'api' ? 'Remote API' : 'Local Storage'}
                    </Text>
                </View>
            </View>
            <View className="flex-row items-center gap-2 -mt-1">
                <TouchableOpacity style={{ backgroundColor: item?.completed ? theme.bgMuted : theme.primarySoft, borderColor: theme.bgMuted }} className={` rounded-lg w-11 h-11 items-center justify-center`}
                    onPress={item?.completed ? null : () => navigation.navigate('AddEditTask', { task: item })}>
                    <PencilIcon size={18} color={`${item.completed ? theme.secondaryText : theme.textIcon}`} />
                </TouchableOpacity>

                {/* <ArrowRight size={22} color={`${item.completed ? '#555' : '#f49b33'}`} /> */}
            </View>
        </TouchableOpacity>
    );

    return (
        <ThemedBackground darkMode={darkMode}>
            <SafeAreaView className="flex-1 pt-5">
                <View className="flex-1">
                    <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />

                    {/* Header Section */}
                    <View className="mb-6 flex-row items-center justify-between border-b border-[#4f23ab] mx-6 pb-2">
                        <View>
                            <Text style={{ color: theme.secondaryText }} className="text-sm font-bold uppercase tracking-widest">
                                Your Daily
                            </Text>
                            <Text style={{ color: theme.primary }} className="text-4xl font-extrabold">Tasks</Text>
                        </View>
                        <TouchableOpacity style={{ backgroundColor: theme.primaryBgMuted }} onPress={() => navigation.navigate('Settings')} className="h-12 w-12 items-center justify-center rounded-2xl border border-[#333]">
                            <Settings size={22} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* List Section */}
                    <FlatList
                        data={items}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f23ab" />
                        }
                        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
                        ListEmptyComponent={
                            !loading && (
                                <View className="mt-20 items-center">
                                    <Text className="text-lg text-gray-500">No tasks found. Pull to refresh!</Text>
                                </View>
                            )
                        }
                    />

                    {/* Bottom Add Button Container */}
                    <View className="absolute bottom-5 left-0 right-0 px-10">
                        <Button
                            onPress={() => navigation.navigate('AddEditTask')}
                            icon={Plus}
                            variant='primary'

                        >   
                            <PlusCircleIcon size={22} color={theme.textIcon} />
                            <Text style={{ color: theme.textIcon }}>New Task</Text>
                        </Button>
                    </View>
                </View>
            </SafeAreaView>
        </ThemedBackground>
    );
};

export default TaskListScreen;


