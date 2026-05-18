import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  RefreshControl,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import AppointmentSkeletonLoader from '../common/AppointmentSkeletonLoader';
import useUser from '../hook/useUser';
import PatientAppointmentView from '../components/PatientAppointmentView';

import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

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

const MyPatient = (): React.JSX.Element => {
  const { getAllPatients } = useUser();

  const [patients, setPatients] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(40)).current;

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
    ]).start();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await getAllPatients();

      setPatients(Array.isArray(res) ? res : []);
    } catch (error) {
      console.log('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await fetchPatients();

    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(
    (patient: any) =>
      patient?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      patient?.contactNumber?.includes(searchQuery) ||
      patient?.email
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const totalPatients = patients.length;

  const activePatients = patients.filter(
    (p: any) => p.status === 'active' || p.isActive,
  ).length;

  const HeaderComponent = () => (
    <LinearGradient
      colors={['#111827', '#0F172A', '#1E1B4B']}
      style={styles.header}>
      
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: translateAnim }],
        }}>
        
        {/* TOP */}
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>My Patients</Text>

            <Text style={styles.headerSubtitle}>
              Manage your patient records
            </Text>
          </View>

          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={onRefresh}>
            
            <Feather
              name="refresh-cw"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Feather
            name="search"
            size={18}
            color={COLORS.subText}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}>
              
              <Feather
                name="x-circle"
                size={18}
                color={COLORS.subText}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          
          {/* TOTAL */}
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            style={styles.statCard}>
            
            <View style={styles.statTop}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="account-group"
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

            <Text style={styles.statValue}>
              {totalPatients}
            </Text>

            <Text style={styles.statLabel}>
              Total Patients
            </Text>
          </LinearGradient>

          {/* ACTIVE */}
          <LinearGradient
            colors={['#06B6D4', '#0891B2']}
            style={styles.statCard}>
            
            <View style={styles.statTop}>
              <View style={styles.iconWrapper}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={22}
                  color="#fff"
                />
              </View>

              <Ionicons
                name="pulse"
                size={18}
                color="#fff"
              />
            </View>

            <Text style={styles.statValue}>
              {activePatients}
            </Text>

            <Text style={styles.statLabel}>
              Active Patients
            </Text>
          </LinearGradient>
        </View>
      </Animated.View>
    </LinearGradient>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <FontAwesome5
          name="users"
          size={34}
          color={COLORS.primary}
        />
      </View>

      <Text style={styles.emptyTitle}>
        {searchQuery
          ? 'No matching patients found'
          : 'No patients yet'}
      </Text>

      <Text style={styles.emptyText}>
        {searchQuery
          ? 'Try searching with another keyword'
          : 'Patients will appear here once they book appointments'}
      </Text>

      {!searchQuery && (
        <TouchableOpacity
          style={styles.emptyBtn}
          onPress={onRefresh}>
          
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            style={styles.emptyGradient}>
            
            <Text style={styles.emptyBtnText}>
              Refresh
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );

  const skeletonArray = Array(3).fill(null);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.background}
        barStyle="light-content"
      />

      <FlatList
        data={loading ? skeletonArray : filteredPatients}
        keyExtractor={(item, index) =>
          String(item?._id || index)
        }
        renderItem={({ item }) =>
          loading ? (
            <AppointmentSkeletonLoader
              isLoading={loading}
            />
          ) : (
            <PatientAppointmentView item={item} />
          )
        }
        ListHeaderComponent={<HeaderComponent />}
        ListEmptyComponent={
          !loading ? <EmptyState /> : null
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MyPatient;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingTop: Platform.OS === 'ios' ? 58 : 28,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    marginBottom: 26,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
  },

  headerSubtitle: {
    color: '#B6C2D1',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
  },

  refreshBtn: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchContainer: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    height: 58,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },

  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statCard: {
    width: (width - 52) / 2,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  statTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  iconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statValue: {
    fontSize: 34,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 42,
  },

  statLabel: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },

  listContent: {
    paddingBottom: 30,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 80,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
  },

  emptyText: {
    color: COLORS.subText,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },

  emptyBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },

  emptyGradient: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 20,
  },

  emptyBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});