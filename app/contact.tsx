import React from 'react';
import {
    Alert,
    Animated,
    KeyboardAvoidingView,
    Linking,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ScrollView = Animated.ScrollView;
import {router} from "expo-router";
import Feather from "@expo/vector-icons/Feather";

export default function Contact() {
    const handlePhoneCall = (phoneNumber: string) => {
        const phoneUrl = `tel:${phoneNumber}`;
        Linking.canOpenURL(phoneUrl)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(phoneUrl);
                } else {
                    Alert.alert('Ошибка', 'Невозможно совершить звонок');
                }
            })
            .catch((err) => console.error('Ошибка при звонке:', err));
    };

    const handleEmailPress = (email: string) => {
        const emailUrl = `mailto:${email}`;
        Linking.canOpenURL(emailUrl)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(emailUrl);
                } else {
                    Alert.alert('Ошибка', 'Невозможно открыть почтовый клиент');
                }
            })
            .catch((err) => console.error('Ошибка при открытии email:', err));
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
                >
                <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Feather name="arrow-left" size={24} color="#6DB4F4" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Свяжитесь с нами</Text>
                <View style={styles.placeholder} />
            </View>
                {/* Header */}


                {/* Contact Information */}
                <View style={styles.contactsContainer}>
                    <View style={styles.contactCard}>

                        {/* Phone Numbers */}
                        <View style={styles.contactSection}>
                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>Приемная:</Text>
                                <TouchableOpacity onPress={() => handlePhoneCall('3-30-13')}>
                                    <Text style={styles.contactValue}>3-30-13</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>Диспетчерская служба:</Text>
                                <TouchableOpacity onPress={() => handlePhoneCall('4-52-29')}>
                                    <Text style={styles.contactValue}>4-52-29</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>Отдел тепловой инспекции:</Text>
                                <View style={styles.contactValueContainer}>
                                    <TouchableOpacity onPress={() => handlePhoneCall('3-30-13')}>
                                        <Text style={styles.contactValue}>3-30-13</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.contactValue}> (доб. 123)</Text>
                                </View>
                            </View>

                            <View style={styles.contactItem}>
                                <Text style={styles.contactLabel}>Отдел сбыта:</Text>
                                <TouchableOpacity onPress={() => handlePhoneCall('4-32-57')}>
                                    <Text style={styles.contactValue}>4-32-57</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Email Addresses */}
                        <View style={styles.emailSection}>
                            <View style={styles.emailItem}>
                                <Text style={styles.emailLabel}>Юридическая группа</Text>
                                <TouchableOpacity onPress={() => handleEmailPress('yurist@bugulmaapts.ru')}>
                                    <Text style={styles.emailValue}>yurist@bugulmaapts.ru</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.emailItem}>
                                <Text style={styles.emailLabel}>Производственно-технический отдел</Text>
                                <TouchableOpacity onPress={() => handleEmailPress('pto@bugulmaapts.ru')}>
                                    <Text style={styles.emailValue}>pto@bugulmaapts.ru</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.emailItem}>
                                <Text style={styles.emailLabel}>Отдел тепловой инспекции</Text>
                                <TouchableOpacity onPress={() => handleEmailPress('metrologia@bugulmaapts.ru')}>
                                    <Text style={styles.emailValue}>metrologia@bugulmaapts.ru</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.emailItem}>
                                <Text style={styles.emailLabel}>Планово-экономический отдел</Text>
                                <TouchableOpacity onPress={() => handleEmailPress('peo@bugulmaapts.ru')}>
                                    <Text style={styles.emailValue}>peo@bugulmaapts.ru</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.emailItem}>
                                <Text style={styles.emailLabel}>Отдел сбыта</Text>
                                <View style={styles.emailValueContainer}>
                                    <TouchableOpacity onPress={() => handleEmailPress('osbt@bugulmaapts.ru')}>
                                        <Text style={styles.emailValue}>osbt@bugulmaapts.ru</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleEmailPress('dop_hpf@rambler.ru')}>
                                        <Text style={styles.emailValue}>dop_hpf@rambler.ru</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.emailItem}>
                                <Text style={styles.emailLabel}>Отдел кадров</Text>
                                <TouchableOpacity onPress={() => handleEmailPress('ok@bugulmaapts.ru')}>
                                    <Text style={styles.emailValue}>ok@bugulmaapts.ru</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
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
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 55,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 5,
        textAlign: 'center',
    },
    companyName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#666666',
        textAlign: 'center',
    },
    contactsContainer: {
        padding: 20,
    },
    contactCard: {
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
    contactSection: {
        marginBottom: 25,
    },
    contactItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingVertical: 2,
    },
    contactLabel: {
        fontSize: 14,
        color: '#333333',
        flex: 1,
        marginRight: 10,
        lineHeight: 20,
    },
    contactValue: {
        fontSize: 14,
        color: '#6DB4F4',
        fontWeight: '500',
        textAlign: 'right',
    },
    contactValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emailSection: {
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 20,
    },
    emailItem: {
        marginBottom: 15,
    },
    emailLabel: {
        fontSize: 14,
        color: '#333333',
        marginBottom: 4,
        fontWeight: '500',
    },
    emailValue: {
        fontSize: 14,
        color: '#6DB4F4',
        lineHeight: 18,
    },
    emailValueContainer: {
        gap: 4,
    },
    bottomSpacing: {
        height: 100,
    },
    bottomNavigation: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
        paddingHorizontal: 50,
    },
    navButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    backButton: {
        padding: 5,
    },
    placeholder: {
        width: 34, // Same width as back button for centering
    },
    keyboardContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 120, // Space for bottom navigation
    },
})



