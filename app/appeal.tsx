import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView, Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet, Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {router} from "expo-router";

export default function Appeal() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        // Валидация
        if (!title.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, добавьте заголовок');
            return;
        }

        if (!description.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, опишите детали проблемы');
            return;
        }

        if (!phone.trim()) {
            Alert.alert('Ошибка', 'Пожалуйста, укажите номер телефона для связи');
            return;
        }

        setLoading(true);

        try {
            // Имитация отправки
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert(
                'Успешно!',
                'Ваше обращение отправлено. Мы свяжемся с вами в ближайшее время.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Очищаем форму
                            setTitle('');
                            setDescription('');
                            setPhone('');
                            // Возвращаемся на главную
                            router.back();
                        }
                    }
                ]
            );

        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось отправить обращение. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Feather name="arrow-left" size={24} color="#6DB4F4" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Оставьте обращение</Text>
                        <View style={styles.placeholder} />
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        <View style={styles.formCard}>

                            {/* Title Input - ИСПРАВЛЕНО */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Заголовок</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Добавить заголовок"
                                    placeholderTextColor="#999999"
                                    value={title}
                                    onChangeText={setTitle}
                                    maxLength={100}
                                    // Ключевые настройки для русского текста
                                    autoCapitalize="sentences"
                                    autoCorrect={true}
                                    spellCheck={true}
                                    keyboardType="default"
                                    textContentType="none"
                                    // Принудительно устанавливаем локаль
                                    importantForAutofill="no"
                                />
                            </View>

                            {/* Description Input - ИСПРАВЛЕНО */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Описание проблемы</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Опишите детали проблемы"
                                    placeholderTextColor="#999999"
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline={true}
                                    numberOfLines={6}
                                    textAlignVertical="top"
                                    maxLength={500}
                                    // Ключевые настройки для русского текста
                                    autoCapitalize="sentences"
                                    autoCorrect={true}
                                    spellCheck={true}
                                    keyboardType="default"
                                    textContentType="none"
                                    importantForAutofill="no"
                                    // Дополнительно для многострочного поля
                                    scrollEnabled={false}
                                />
                            </View>

                            {/* Phone Input - ИСПРАВЛЕНО */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Телефон для связи</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="+7 (999) 123-45-67"
                                    placeholderTextColor="#999999"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                    maxLength={20}
                                    // Настройки для номера телефона
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    textContentType="telephoneNumber"
                                />
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity
                                style={[
                                    styles.submitButton,
                                    loading && styles.submitButtonDisabled
                                ]}
                                onPress={handleSubmit}
                                disabled={loading}
                            >
                                <Text style={styles.submitButtonText}>
                                    {loading ? 'Отправляем...' : 'Отправить'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Info Text */}
                        <Text style={styles.infoText}>
                            Мы рассмотрим ваше обращение в течение 24 часов и свяжемся с вами по указанному номеру телефона.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8E8E8',
        marginTop: 55,
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 120,
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 10,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        textAlign: 'center',
    },
    placeholder: {
        width: 34,
    },
    formContainer: {
        padding: 20,
        flex: 1,
    },
    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputContainer: {
        marginBottom: 20,
    },
    // Добавляем подписи к полям
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        color: '#333333',
        borderWidth: 1,
        borderColor: '#E9ECEF',
        // Важные стили для корректного отображения русского текста
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
        includeFontPadding: false, // Android
        textAlignVertical: 'center', // Android
    },
    textArea: {
        height: 120,
        paddingTop: 14,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#6DB4F4',
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonDisabled: {
        backgroundColor: '#B0BEC5',
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    infoText: {
        fontSize: 13,
        color: '#666666',
        textAlign: 'center',
        marginTop: 15,
        lineHeight: 18,
        paddingHorizontal: 10,
    },
});