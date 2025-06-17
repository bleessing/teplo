import React from 'react';
import {Animated, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ScrollView = Animated.ScrollView;
import {router} from "expo-router";

export default function Home() {
    const navigateToContacts = () => {
        router.push('/contact');
    }
    const askQuestion = () => {
        router.push('/appeal')
    }
    const navigateToPay = () => {
        router.push('/')
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.companyName}>АО Бугульминское ПТС</Text>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.headerButton} onPress={() => navigateToPay()}>

                            <Text style={styles.headerButtonText}>Передать показания</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton} onPress={askQuestion}>
                            <Text style={styles.headerButtonText}>Задать вопрос</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton} onPress={navigateToContacts}>
                            <Text style={styles.headerButtonText}>Контакты</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.announcementSection}>
                    <Text style={styles.announcementTitle}>Объявление</Text>

                    <View style={styles.announcementCard}>
                        <Text style={styles.announcementHeader}>Уважаемые потребители!</Text>

                        <Text style={styles.announcementText}>
                            В связи с проведением аварийных работ
                            на `Бойлерной 4А` с 25.05.2025 и до окончания работ произведено отключение горячего водоснабжения:
                        </Text>

                        <Text style={styles.addressList}>
                            ул Джержинского д.1,3{'\n'}
                            ул Н.Назиха д. 19, 24, 30, 30{'\n'}
                            ул Советская д.4,6,7,9,11,12{'\n'}
                            ул Комсомольская д.11{'\n'}
                            ул Ленина д. 3, 5, 6,7{'\n'}
                            ул Веллавода д. 22, 40, 44, 46{'\n'}
                            ул Чернышевского д.2{'\n'}
                            ул Первомайская д. 1, 3,2{'\n'}
                            ул Энтузиастов д. 31, 33{'\n'}
                            ул Хлебникова д.10
                        </Text>

                        <Text style={styles.apologiesText}>
                            Приносим извинения за доставленные неудобства!{'\n'}
                            По вопросам можно обратиться в диспетчерскую службу предприятия т.4-72-35
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8E8E8',
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
        paddingBottom: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    companyName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 15,
        textAlign: 'center',
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 8,
    },
    headerButton: {
        flex: 1,
        backgroundColor: '#6DB4F4',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        alignSelf: 'auto',
    },
    headerButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
    },
    announcementSection: {
        padding: 20,
    },
    announcementTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 15,
        textAlign: 'center',
    },
    announcementCard: {
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
    announcementHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E74C3C',
        marginBottom: 15,
        textAlign: 'center',
    },
    announcementText: {
        fontSize: 16,
        color: '#333333',
        lineHeight: 20,
        marginBottom: 15,
        textAlign: 'justify',
    },
    addressList: {
        fontSize: 16,
        color: '#333333',
        lineHeight: 18,
        marginBottom: 20,
        paddingLeft: 10,
    },
    apologiesText: {
        fontSize: 16,
        color: '#333333',
        lineHeight: 20,
        textAlign: 'justify',
        fontWeight: '500',
    },
    bottomSpacing: {
        height: 100, // Space for bottom navigation
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
});

