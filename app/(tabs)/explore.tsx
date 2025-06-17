import React, {useState} from "react";
import {
    Text,
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,

    Modal,
    Image,
    ScrollView,
    SafeAreaView,
    Alert, Platform
} from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from 'expo-image-picker';

export default function HotWaterScreen() {
    const [contractNumber, setContractNumber] = useState("");
    const [previousReading, setPreviousReading] = useState("");
    const [currentReading, setCurrentReading] = useState("");
    const [total, setTotal] = useState("");

    // Состояния для диапазона дат - инициализируем корректными датами
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Состояния для фотографий
    const [photos, setPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);

    // Функция очистки всех полей формы
    const clearForm = () => {
        setContractNumber("");
        setPreviousReading("");
        setCurrentReading("");
        setTotal("");
        setStartDate(new Date());
        setEndDate(new Date());
        setPhotos([]);
        setShowStartDatePicker(false);
        setShowEndDatePicker(false);
        setShowPhotoModal(false);
    };

    // Обработчики для дат - исправленные
    const onStartDateChange = (event, selectedDate) => {
        setShowStartDatePicker(false); // Всегда скрываем пикер после выбора

        if (selectedDate) {
            setStartDate(selectedDate);

            // Если выбранная начальная дата больше конечной, устанавливаем конечную равной начальной
            if (selectedDate > endDate) {
                setEndDate(selectedDate);
            }
        }
    };

    const onEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false); // Всегда скрываем пикер после выбора

        if (selectedDate) {
            // Проверяем, что конечная дата не раньше начальной
            if (selectedDate >= startDate) {
                setEndDate(selectedDate);
            } else {
                Alert.alert('Ошибка', 'Конечная дата не может быть раньше начальной');
            }
        }
    };

    const handleStartDatePress = () => {
        setShowStartDatePicker(true);
    };

    const handleEndDatePress = () => {
        setShowEndDatePicker(true);
    };

    // Функция для форматирования диапазона дат
    const getDateRangeString = () => {
        const startStr = startDate.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const endStr = endDate.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        return `${startStr} - ${endStr}`;
    };

    // Остальные функции остаются теми же...
    const requestPermissions = async () => {
        const {status: cameraStatus} = await ImagePicker.requestCameraPermissionsAsync();
        const {status: mediaStatus} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
            Alert.alert(
                'Разрешения',
                'Для загрузки фото необходимо разрешение на использование камеры и галереи'
            );
            return false;
        }
        return true;
    };

    const takePhoto = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        setUploading(true);
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
            });

            if (!result.canceled) {
                const newPhoto = {
                    id: Date.now().toString(),
                    uri: result.assets[0].uri,
                    type: 'camera'
                };
                setPhotos(prev => [...prev, newPhoto]);
                setShowPhotoModal(false);
            }
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось сделать фото');
        } finally {
            setUploading(false);
        }
    };

    const pickPhoto = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        setUploading(true);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
                allowsMultipleSelection: true,
            });

            if (!result.canceled) {
                const newPhotos = result.assets.map(asset => ({
                    id: Date.now().toString() + Math.random(),
                    uri: asset.uri,
                    type: 'gallery'
                }));
                setPhotos(prev => [...prev, ...newPhotos]);
                setShowPhotoModal(false);
            }
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось выбрать фото');
        } finally {
            setUploading(false);
        }
    };

    const removePhoto = ({photoId}: { photoId: any }) => {
        Alert.alert(
            'Удалить фото',
            'Вы уверены, что хотите удалить это фото?',
            [
                {text: 'Отмена', style: 'cancel'},
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: () => setPhotos(prev => prev.filter(photo => photo.id !== photoId))
                }
            ]
        );
    };

    const showPhotoOptions = () => {
        setShowPhotoModal(true);
    };

    const validateForm = () => {
        if (!contractNumber.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, укажите номер договора');
            return false;
        }

        if (!previousReading.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, укажите предыдущие показания');
            return false;
        }

        if (!currentReading.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, укажите текущие показания');
            return false;
        }

        const prev = parseFloat(previousReading);
        const current = parseFloat(currentReading);

        if (isNaN(prev) || isNaN(current)) {
            Alert.alert('Ошибка', 'Показания должны быть числами');
            return false;
        }

        if (current < prev) {
            Alert.alert('Ошибка', 'Текущие показания не могут быть меньше предыдущих');
            return false;
        }

        return true;
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const totalValue = (parseFloat(currentReading) - parseFloat(previousReading)).toFixed(2);
        setTotal(totalValue || "0.00");

        const submissionData = {
            contractNumber,
            period: getDateRangeString(),
            startDate: startDate.toLocaleDateString("ru-RU"),
            endDate: endDate.toLocaleDateString("ru-RU"),
            previousReading,
            currentReading,
            total: totalValue || "0.00",
            photos: photos.map(photo => ({id: photo.id, uri: photo.uri}))
        };

        Alert.alert(
            'Данные отправлены!',
            `Показания ГВС успешно переданы.\n\nДоговор: ${contractNumber}\nПериод: ${submissionData.period}\nРасход: ${totalValue} м³\nФото: ${photos.length} шт.`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        clearForm();
                    }
                }
            ]
        );

        console.log("Данные ГВС:", submissionData);
    };

    const handleClearForm = () => {
        Alert.alert(
            'Очистить форму',
            'Вы уверены, что хотите очистить все поля? Все данные будут потеряны.',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Очистить',
                    style: 'destructive',
                    onPress: clearForm
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.section}>
                    <Text style={styles.title}>ГВС</Text>
                    <View style={styles.form}>
                        <View style={styles.inputRow}>
                            <Text style={styles.label}>№ договора</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Номер договора"
                                value={contractNumber}
                                onChangeText={setContractNumber}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <Text style={styles.label}>Период с</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={handleStartDatePress}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.dateText}>
                                    {startDate.toLocaleDateString("ru-RU", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </Text>
                                <Feather name="calendar" size={16} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputRow}>
                            <Text style={styles.label}>Период до</Text>
                            <TouchableOpacity
                                style={styles.dateInput}
                                onPress={handleEndDatePress}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.dateText}>
                                    {endDate.toLocaleDateString("ru-RU", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                    })}
                                </Text>
                                <Feather name="calendar" size={16} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.inputRow}>
                            <Text style={styles.label}>Предыдущий/м³</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Предыдущий"
                                keyboardType="numeric"
                                value={previousReading}
                                onChangeText={setPreviousReading}
                            />
                        </View>
                        <View style={styles.inputRow}>
                            <Text style={styles.label}>Текущий/м³</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Текущий"
                                keyboardType="numeric"
                                value={currentReading}
                                onChangeText={setCurrentReading}
                            />
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                            <Text style={styles.buttonText}>Отправить</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.clearButton} onPress={handleClearForm}>
                            <Feather name="refresh-cw" size={16} color="#509bf8" style={{ marginRight: 5 }} />
                            <Text style={styles.clearButtonText}>Очистить</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
                    onPress={showPhotoOptions}
                    disabled={uploading}
                >
                    <Feather name="camera" size={20} color="#fffffc" style={{ marginRight: 8 }} />
                    <Text style={styles.buttonText}>
                        {uploading ? 'Загрузка...' : 'Загрузить фото'}
                    </Text>
                </TouchableOpacity>

                {photos.length > 0 && (
                    <View style={styles.photosContainer}>
                        <Text style={styles.photosTitle}>Загруженные фото ({photos.length})</Text>
                        <View style={styles.photosGrid}>
                            {photos.map((photo) => (
                                <View key={photo.id} style={styles.photoItem}>
                                    <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                                    <TouchableOpacity
                                        style={styles.removePhotoButton}
                                        onPress={() => removePhoto({photoId: photo.id})}
                                    >
                                        <Feather name="x" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* DateTimePicker для начальной даты - ИСПРАВЛЕННЫЙ */}
            {showStartDatePicker && (
                <DateTimePicker
                    testID="startDateTimePicker"
                    value={startDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onStartDateChange}
                    locale="ru-RU"
                    // Убираем ограничения по датам - можно выбрать любую дату
                />
            )}

            {/* DateTimePicker для конечной даты - ИСПРАВЛЕННЫЙ */}
            {showEndDatePicker && (
                <DateTimePicker
                    testID="endDateTimePicker"
                    value={endDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onEndDateChange}
                    locale="ru-RU"
                    minimumDate={startDate} // Минимальная дата = начальная дата
                />
            )}

            {/* Modal для фото */}
            {showPhotoModal && (
                <Modal
                    visible={showPhotoModal}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowPhotoModal(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Добавить фото</Text>

                            <TouchableOpacity style={styles.modalButton} onPress={takePhoto}>
                                <Feather name="camera" size={24} color="#509bf8" />
                                <Text style={styles.modalButtonText}>Сделать фото</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalButton} onPress={pickPhoto}>
                                <Feather name="image" size={24} color="#509bf8" />
                                <Text style={styles.modalButtonText}>Выбрать из галереи</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setShowPhotoModal(false)}
                            >
                                <Text style={styles.modalCancelText}>Отмена</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
    },
    scrollContent: {
        padding: 20,
        paddingTop: 55,
        alignItems: "center",
        minHeight: '100%',
        justifyContent: "center",
    },
    section: {
        backgroundColor: "#509bf8",
        borderRadius: 15,
        padding: 20,
        width: "100%",
        maxWidth: 350,
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fffffc",
        textAlign: "center",
        marginBottom: 20,
    },
    form: {
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
        width: "100%",
    },
    label: {
        color: "#fffffc",
        fontSize: 16,
        minWidth: 120,
    },
    input: {
        backgroundColor: "#fffffc",
        borderWidth: 0,
        borderRadius: 6,
        width: 160,
        height: 40,
        paddingHorizontal: 10,
        fontSize: 14,
    },
    dateInput: {
        backgroundColor: "#fffffc",
        borderRadius: 6,
        width: 160,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    dateText: {
        color: "#000",
        fontSize: 14,
        flex: 1,
    },
    buttonContainer: {
        width: "100%",
        gap: 10,
    },
    submitButton: {
        backgroundColor: "#509bf8",
        borderWidth: 1,
        borderColor: "#fffffc",
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    clearButton: {
        flexDirection: "row",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fffffc",
        fontSize: 16,
        fontWeight: "500",
    },
    clearButtonText: {
        color: "#509bf8",
        fontSize: 14,
        fontWeight: "500",
    },
    uploadButton: {
        flexDirection: "row",
        backgroundColor: "#509bf8",
        borderWidth: 1,
        borderColor: "#fffffc",
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: "center",
        marginTop: 20,
        justifyContent: "center",
    },
    uploadButtonDisabled: {
        backgroundColor: "#7db3f7",
        opacity: 0.7,
    },
    photosContainer: {
        marginTop: 20,
        width: "100%",
        maxWidth: 350,
    },
    photosTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        textAlign: "center",
    },
    photosGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        justifyContent: "center",
    },
    photoItem: {
        position: "relative",
        width: 80,
        height: 80,
    },
    photoImage: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    removePhotoButton: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "#ff4444",
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        width: "80%",
        maxWidth: 300,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 20,
    },
    modalButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        width: "100%",
    },
    modalButtonText: {
        fontSize: 16,
        color: "#509bf8",
        marginLeft: 10,
        fontWeight: "500",
    },
    modalCancelButton: {
        marginTop: 10,
        padding: 10,
    },
    modalCancelText: {
        fontSize: 16,
        color: "#666",
    },
});

const customDateStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        margin: 20,
        maxHeight: '80%',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    dateContainer: {
        flexDirection: 'row',
        gap: 20,
    },
    pickerContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 10,
        color: '#333',
    },
    picker: {
        maxHeight: 200,
    },
    pickerItem: {
        padding: 10,
        borderRadius: 6,
        marginBottom: 5,
    },
    selectedItem: {
        backgroundColor: '#509bf8',
    },
    pickerText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    selectedText: {
        color: '#fff',
        fontWeight: '500',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 15,
    },
    cancelButton: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        backgroundColor: '#f0f0f0',
    },
    confirmButton: {
        flex: 1,
        padding: 12,
        borderRadius: 6,
        backgroundColor: '#509bf8',
    },
    cancelText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },
    confirmText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});
