import React, { useState } from "react";
import {
    Text,
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    Modal,
    ScrollView,
    SafeAreaView,
    Image,
    Alert, Platform
} from "react-native";

import DateTimePicker from '@react-native-community/datetimepicker';
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from 'expo-image-picker';

export default function HomeScreen() {
    const [contractNumber, setContractNumber] = useState("");
    const [volume, setVolume] = useState("");

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
        setVolume("");
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

    // Запрос разрешений
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

    // Сделать фото камерой
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

    // Выбрать фото из галереи
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

    // Удалить фото
    const removePhoto = (photoId) => {
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

    // Показать модальное окно выбора способа загрузки
    const showPhotoOptions = () => {
        setShowPhotoModal(true);
    };

    // Валидация формы
    const validateForm = () => {
        if (!contractNumber.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, укажите номер договора');
            return false;
        }

        if (!volume.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, укажите объем потребления');
            return false;
        }

        // Проверка, что объем является числом
        const volumeValue = parseFloat(volume);

        if (isNaN(volumeValue)) {
            Alert.alert('Ошибка', 'Объем должен быть числом');
            return false;
        }

        if (volumeValue < 0) {
            Alert.alert('Ошибка', 'Объем не может быть отрицательным');
            return false;
        }

        if (volumeValue > 999) {
            Alert.alert('Ошибка', 'Объем слишком большой. Проверьте правильность ввода');
            return false;
        }

        return true;
    };

    // Обновленная функция отправки с валидацией и очисткой формы
    const handleSubmit = () => {
        // Валидация формы
        if (!validateForm()) {
            return;
        }

        const submissionData = {
            contractNumber,
            period: getDateRangeString(),
            startDate: startDate.toLocaleDateString("ru-RU"),
            endDate: endDate.toLocaleDateString("ru-RU"),
            volume: parseFloat(volume).toFixed(2) + " Гкал",
            photos: photos.map(photo => ({ id: photo.id, uri: photo.uri }))
        };

        // Показываем подтверждение отправки
        Alert.alert(
            'Данные отправлены!',
            `Показания отопления успешно переданы.\n\nДоговор: ${contractNumber}\nПериод: ${submissionData.period}\nОбъем: ${submissionData.volume}\nФото: ${photos.length} шт.`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Очищаем форму после успешной отправки
                        clearForm();
                    }
                }
            ]
        );

        // В реальном приложении здесь будет API вызов
        console.log("Данные отопления:", submissionData);
    };

    // Функция для ручной очистки формы (кнопка "Очистить")
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
                    <Text style={styles.title}>Отопление</Text>
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
                            {/* Кнопка загрузки фото */}
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
                            <Text style={styles.label}>Гкал</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Объем"
                                keyboardType="numeric"
                                value={volume}
                                onChangeText={setVolume}
                            />
                        </View>
                    </View>

                    {/* Кнопки отправки и очистки */}
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

                {/* Список загруженных фотографий */}
                {photos.length > 0 && (
                    <View style={styles.photosContainer}>
                        <Text style={styles.photosTitle}>Загруженные фото ({photos.length})</Text>
                        <View style={styles.photosGrid}>
                            {photos.map((photo) => (
                                <View key={photo.id} style={styles.photoItem}>
                                    <Image source={{ uri: photo.uri }} style={styles.photoImage} />
                                    <TouchableOpacity
                                        style={styles.removePhotoButton}
                                        onPress={() => removePhoto(photo.id)}
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

            {/* Modal для выбора способа загрузки фото */}
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

                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={takePhoto}
                            >
                                <Feather name="camera" size={24} color="#509bf8" />
                                <Text style={styles.modalButtonText}>Сделать фото</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={pickPhoto}
                            >
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
    // Новый стиль для отображения диапазона
    dateRangeDisplay: {
        backgroundColor: "#e8f4ff",
        borderRadius: 6,
        width: 160,
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: "#b3d9ff",
    },
    dateRangeText: {
        color: "#0066cc",
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    // Контейнер для кнопок
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
    // Кнопка очистки
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
