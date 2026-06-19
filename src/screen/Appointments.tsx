import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
  Dimensions,
  RefreshControl,
  Platform,
  ScrollView,
} from 'react-native'

import AppointmentView from '../components/AppointmentView'
import useBooking from '../hook/useBooking'
import AppointmentSkeletonLoader from '../common/AppointmentSkeletonLoader'
import EmptyState from '../common/EmptyState'
import { useLogin } from '../context/LoginProvider'
import useUser from '../hook/useUser'

import Feather from 'react-native-vector-icons/Feather'
import LinearGradient from 'react-native-linear-gradient'

const { width } = Dimensions.get('window')

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
}

const Appointments = () => {
  const { getBookingByDoctorId } = useBooking()
  const { getUserProfile } = useUser()
  const { user } = useLogin()

  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [refreshing, setRefreshing] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [loadingMore, setLoadingMore] = useState<boolean>(false)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [profile, setProfile] = useState<any>(null)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const translateAnim = useRef(new Animated.Value(30)).current

  const skeletonArray = Array(4).fill(null)

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile()
      setProfile(data)
    } catch (e) {
      console.log('Profile fetch error:', e)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const doctorId = profile?.doctorId?._id

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
    ]).start()
  }, [])

  useEffect(() => {
    if (doctorId) {
      getAppointments(1, false)
    }
  }, [doctorId])

  const getAppointments = useCallback(async (
    newPage = 1,
    isRefreshing = false,
  ) => {
    if (newPage > totalPages && !isRefreshing) return

    if (newPage === 1) setLoading(true)
    else setLoadingMore(true)

    try {
      const response = await getBookingByDoctorId(newPage, 10, doctorId)

      if (response) {
        const result = response?.result || response?.data || response

        if (isRefreshing) {
          setAppointments(Array.isArray(result) ? result : [])
        } else {
          setAppointments(prev => [
            ...prev,
            ...(Array.isArray(result) ? result : []),
          ])
        }

        setTotalPages(response?.totalPages || 1)
        setPage(newPage)
      }
    } catch (error) {
      console.log('Appointments Error:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
      setRefreshing(false)
    }
  }, [getBookingByDoctorId, doctorId, totalPages])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setAppointments([])
    setPage(1)
    getAppointments(1, true)
  }, [getAppointments])

  const loadMoreAppointments = () => {
    if (!loadingMore && page < totalPages) {
      getAppointments(page + 1)
    }
  }

  const filters = [
    { id: 'all', label: 'All', icon: 'calendar' },
    { id: 'upcoming', label: 'Upcoming', icon: 'clock' },
    { id: 'completed', label: 'Completed', icon: 'check-circle' },
    { id: 'cancelled', label: 'Cancelled', icon: 'x-circle' },
  ]

  const getFilteredAppointments = () => {
    if (selectedFilter === 'all') return appointments
    if (selectedFilter === 'upcoming') {
      return appointments.filter(
        apt => apt.status === 'upcoming' || apt.status === 'confirmed',
      )
    }
    if (selectedFilter === 'completed') {
      return appointments.filter(
        apt => apt.status === 'completed' || apt.status === 'done',
      )
    }
    if (selectedFilter === 'cancelled') {
      return appointments.filter(apt => apt.status === 'cancelled')
    }
    return appointments
  }

  const filteredAppointments = getFilteredAppointments()

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
        
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>
              Appointments
            </Text>

            <Text style={styles.headerSubtitle}>
              {filteredAppointments.length}{' '}
              {filteredAppointments.length === 1
                ? 'Appointment'
                : 'Appointments'}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.filterBtn}>
            
            <Feather
              name="filter"
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            style={styles.statsCard}>
            
            <Text style={styles.statsNumber}>
              {appointments.length}
            </Text>

            <Text style={styles.statsLabel}>
              Total
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={['#06B6D4', '#0891B2']}
            style={styles.statsCard}>
            
            <Text style={styles.statsNumber}>
              {
                appointments.filter(
                  item =>
                    item.status === 'confirmed' ||
                    item.status === 'upcoming',
                ).length
              }
            </Text>

            <Text style={styles.statsLabel}>
              Upcoming
            </Text>
          </LinearGradient>
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}>
          
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              activeOpacity={0.8}
              onPress={() =>
                setSelectedFilter(filter.id)
              }
              style={[
                styles.filterChip,
                selectedFilter === filter.id &&
                  styles.activeFilterChip,
              ]}>
              
              <Feather
                name={filter.icon}
                size={15}
                color={
                  selectedFilter === filter.id
                    ? '#fff'
                    : '#CBD5E1'
                }
              />

              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id &&
                    styles.activeFilterText,
                ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </LinearGradient>
  )

  const FooterComponent = () => {
    if (!loadingMore) return null

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator
          size="small"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading more...
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={COLORS.background}
        barStyle="light-content"
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={
          loading
            ? skeletonArray
            : filteredAppointments
        }
        keyExtractor={(item, index) =>
          String(item?._id || index)
        }
        renderItem={({ item }) => (
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: translateAnim },
              ],
            }}>
            
            {loading ? (
              <View style={styles.skeletonWrapper}>
                <AppointmentSkeletonLoader
                  isLoading={loading}
                />
              </View>
            ) : (
              <View style={styles.cardWrapper}>
                <AppointmentView item={item} />
              </View>
            )}
          </Animated.View>
        )}
        ListHeaderComponent={<HeaderComponent />}
        ListFooterComponent={<FooterComponent />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyWrapper}>
              <EmptyState
                title={'No appointments found!'}
                refreshing={refreshing}
                handleRefresh={onRefresh}
              />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
        onEndReached={loadMoreAppointments}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

export default Appointments

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
    marginBottom: 24,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
  },

  headerSubtitle: {
    color: '#B6C2D1',
    fontSize: 14,
    marginTop: 6,
    fontWeight: '500',
  },

  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  statsCard: {
    width: (width - 52) / 2,
    borderRadius: 24,
    paddingVertical: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  statsNumber: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },

  statsLabel: {
    color: 'rgba(255,255,255,0.82)',
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
  },

  filtersContainer: {
    paddingBottom: 4,
  },

  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  activeFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  filterText: {
    color: '#CBD5E1',
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
  },

  activeFilterText: {
    color: '#fff',
  },

  listContent: {
    paddingBottom: 30,
  },

  cardWrapper: {
    marginHorizontal: 18,
    marginTop: 18,
  },

  skeletonWrapper: {
    marginHorizontal: 18,
    marginTop: 18,
  },

  loaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },

  loadingText: {
    color: COLORS.subText,
    marginLeft: 10,
    fontSize: 13,
    fontWeight: '500',
  },

  emptyWrapper: {
    marginTop: 50,
  },
})
