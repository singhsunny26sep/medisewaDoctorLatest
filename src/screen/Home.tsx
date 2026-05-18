import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  Platform,
  Animated,
  RefreshControl,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BestOFFers from '../components/BestOFFers';
import AboutUs from '../components/AboutUs';
import Community from '../components/Community';

import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';

const { width, height } = Dimensions.get('window');

const COLORS = {
  background: '#0F172A',
  card: '#111827',
  card2: '#1E293B',
  white: '#FFFFFF',
  text: '#F8FAFC',
  subText: '#94A3B8',
  primary: '#7C3AED',
  secondary: '#A855F7',
  cyan: '#06B6D4',
  green: '#10B981',
  orange: '#F59E0B',
  pink: '#EC4899',
  red: '#EF4444',
  border: 'rgba(255,255,255,0.08)',
};

const Home = (): React.JSX.Element => {
  const navigation =
    useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.spring(translateAnim, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const dashboardCards = [
    {
      id: 1,
      title: 'Appointments',
      total: '20',
      icon: 'calendar-check',
      colors: ['#7C3AED', '#A855F7'],
      screen: 'AllAppoinment',
    },
    {
      id: 2,
      title: 'Patients',
      total: '23',
      icon: 'account-group',
      colors: ['#06B6D4', '#0891B2'],
      screen: 'AllPatients',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'Appointment',
      icon: 'calendar-plus',
      color: COLORS.primary,
      bg: 'rgba(124,58,237,0.15)',
      screen: 'AllAppoinment',
    },
    {
      id: 2,
      title: 'Prescription',
      icon: 'file-document',
      color: COLORS.green,
      bg: 'rgba(16,185,129,0.15)',
      screen: 'UploadPrecription',
    },
    {
      id: 3,
      title: 'Patients',
      icon: 'account-group',
      color: COLORS.orange,
      bg: 'rgba(245,158,11,0.15)',
      screen: 'AllPatients',
    },
    {
      id: 4,
      title: 'Profile',
      icon: 'account-cog',
      color: COLORS.pink,
      bg: 'rgba(236,72,153,0.15)',
      screen: 'ProfileUpdate',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.background}
        barStyle="light-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }>
        
        {/* HEADER */}
        <LinearGradient
          colors={['#111827', '#0F172A', '#1E1B4B']}
          style={styles.header}>
          
          {/* Background Glow */}
          <View style={styles.glow1} />
          <View style={styles.glow2} />

          <View style={styles.headerTop}>
            <TouchableOpacity style={styles.menuBtn}>
              <Feather name="menu" size={22} color="#fff" />
            </TouchableOpacity>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#fff"
                />

                <View style={styles.notificationDot} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.profileWrapper}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400',
                  }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: translateAnim },
                { scale: scaleAnim },
              ],
            }}>
            
            <Text style={styles.welcome}>Welcome Back 👋</Text>

            <Text style={styles.subtitle}>
              Your healthcare dashboard overview
            </Text>

            {/* Search */}
            <TouchableOpacity activeOpacity={0.8} style={styles.searchBar}>
              <Feather name="search" size={18} color="#94A3B8" />

              <Text style={styles.searchText}>
                Search appointments, doctors...
              </Text>

              <Ionicons
                name="options-outline"
                size={18}
                color="#94A3B8"
              />
            </TouchableOpacity>

            {/* Stats */}
            <View style={styles.topStats}>
              <View style={styles.topStatsCard}>
                <Text style={styles.topStatsNumber}>124</Text>
                <Text style={styles.topStatsLabel}>Appointments</Text>
              </View>

              <View style={styles.topDivider} />

              <View style={styles.topStatsCard}>
                <Text style={styles.topStatsNumber}>89</Text>
                <Text style={styles.topStatsLabel}>Patients</Text>
              </View>

              <View style={styles.topDivider} />

              <View style={styles.topStatsCard}>
                <Text style={styles.topStatsNumber}>4.9</Text>
                <Text style={styles.topStatsLabel}>Ratings</Text>
              </View>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* MAIN */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateAnim }],
            },
          ]}>
          
          {/* Dashboard Cards */}
          <View style={styles.dashboardRow}>
            {dashboardCards.map(item => (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.9}
                onPress={() => navigation.navigate(item.screen)}>
                
                <LinearGradient
                  colors={item.colors}
                  style={styles.dashboardCard}>
                  
                  <View style={styles.dashboardTop}>
                    <View style={styles.dashboardIcon}>
                      <FontAwesome5
                        name={item.icon}
                        size={22}
                        color="#fff"
                      />
                    </View>

                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color="#fff"
                    />
                  </View>

                  <Text style={styles.dashboardNumber}>
                    {item.total}
                  </Text>

                  <Text style={styles.dashboardLabel}>
                    Total {item.title}
                  </Text>

                  <View style={styles.cardBottom}>
                    <Text style={styles.cardBottomText}>
                      View Analytics
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>

            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.quickGrid}>
            {quickActions.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(item.screen)}>
                
                <View
                  style={[
                    styles.quickIcon,
                    { backgroundColor: item.bg },
                  ]}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={24}
                    color={item.color}
                  />
                </View>

                <Text style={styles.quickText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Upcoming Appointment */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Upcoming Appointments
            </Text>

            <TouchableOpacity>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.appointmentCard}>
            <View style={styles.appointmentLeft}>
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>10:30</Text>
              </View>

              <View>
                <Text style={styles.doctorName}>
                  Dr. Sarah Johnson
                </Text>

                <Text style={styles.doctorType}>
                  Cardiology Specialist
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.joinBtn}>
              <Text style={styles.joinText}>Join</Text>
            </TouchableOpacity>
          </View>

          {/* Performance Card */}
          <LinearGradient
            colors={['#1E293B', '#111827']}
            style={styles.performanceCard}>
            
            <View style={styles.performanceTop}>
              <View>
                <Text style={styles.performanceTitle}>
                  Monthly Performance
                </Text>

                <Text style={styles.performanceSub}>
                  +18% from last month
                </Text>
              </View>

              <View style={styles.performanceIcon}>
                <Feather
                  name="trending-up"
                  size={20}
                  color="#10B981"
                />
              </View>
            </View>

            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>

            <View style={styles.progressBottom}>
              <Text style={styles.progressText}>78% Completed</Text>

              <Text style={styles.progressText}>Target 100%</Text>
            </View>
          </LinearGradient>

          {/* Existing Components */}
          <BestOFFers />

          <Community />

          <AboutUs />

          <View style={{ height: 30 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Home;
// REPLACE THESE STYLES ONLY

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingTop: Platform.OS === 'ios' ? 58 : 28,
    paddingHorizontal: 20,
    paddingBottom: 34,
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
    overflow: 'hidden',
  },

  glow1: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 220,
    height: 220,
    borderRadius: 120,
    backgroundColor: 'rgba(124,58,237,0.25)',
  },

  glow2: {
    position: 'absolute',
    bottom: -60,
    left: -30,
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: 'rgba(6,182,212,0.15)',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  menuBtn: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 12,
    right: 12,
  },

  profileWrapper: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 2,
  },

  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 18,
  },

  welcome: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
    lineHeight: 38,
  },

  subtitle: {
    color: '#B6C2D1',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 20,
  },

  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    height: 58,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 28,
  },

  searchText: {
    flex: 1,
    marginLeft: 12,
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },

  topStats: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },

  topStatsCard: {
    flex: 1,
    alignItems: 'center',
  },

  topStatsNumber: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },

  topStatsLabel: {
    color: '#AAB7C7',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },

  topDivider: {
    width: 1,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 30,
  },

  /* DASHBOARD CARDS */

  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  dashboardCard: {
    width: (width - 50) / 2,
    borderRadius: 10,
    padding: 20,
    height:220,
    marginBottom: 10,
    borderWidth: 1,
    borderColor:"white"
  },

  dashboardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  dashboardIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dashboardNumber: {
    fontSize: 38,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 44,
  },

  dashboardLabel: {
    color: 'rgba(255,255,255,0.82)',
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },

  cardBottom: {
    marginTop: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 16,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardBottomText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.2,
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  seeAll: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 13,
  },

  /* QUICK ACTIONS */

  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  quickCard: {
    width: (width - 60) / 4,
    backgroundColor: COLORS.card,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  quickIcon: {
    width: 58,
    height: 58,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  quickText: {
    color: COLORS.white,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '700',
    lineHeight: 15,
    paddingHorizontal: 4,
  },

  /* APPOINTMENT */

  appointmentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 26,
    padding: 18,
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  appointmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  timeBadge: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'rgba(124,58,237,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  timeText: {
    color: COLORS.secondary,
    fontWeight: '800',
    fontSize: 14,
  },

  doctorName: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },

  doctorType: {
    color: '#9CA3AF',
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },

  joinBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  joinText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  /* PERFORMANCE */

  performanceCard: {
    borderRadius: 28,
    padding: 22,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  performanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  performanceTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
  },

  performanceSub: {
    color: COLORS.green,
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },

  performanceIcon: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: 'rgba(16,185,129,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 30,
    overflow: 'hidden',
  },

  progressFill: {
    width: '78%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#10B981',
  },

  progressBottom: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
});